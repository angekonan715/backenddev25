const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  
  // Handle case where no vehicles are found
  let className = "Unknown"
  if (data && data.length > 0) {
    className = data[0].classification_name
  } else {
    // Get classification name from database even if no vehicles
    try {
      const classificationData = await invModel.getClassifications()
      const classification = classificationData.rows.find(c => c.classification_id == classification_id)
      if (classification) {
        className = classification.classification_name
      }
    } catch (error) {
      console.error("Error getting classification name:", error)
    }
  }
  
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    console.log("Fetching vehicle with ID:", inv_id);
    
    const data = await invModel.getInventoryById(inv_id);
    console.log("Vehicle data:", data);
    
    if (!data) {
      console.log("No vehicle found, redirecting to home");
      return res.redirect("/");
    }
    
    // Get reviews for this vehicle
    let reviews = []
    try {
      reviews = await reviewModel.getReviewsByInventoryId(inv_id);
    } catch (reviewError) {
      console.error("Error fetching reviews:", reviewError);
      // Continue without reviews if there's an error
    }
    
    let nav = await utilities.getNav();
    console.log("Navigation generated:", nav ? "Yes" : "No");
    
    res.render("./inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      vehicle: data,
      reviews: reviews,
      message: req.flash('notice')
    });
  } catch (error) {
    console.error("Error in buildByInventoryId:", error);
    next(error);
  }
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    message: req.flash('notice')
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    message: req.flash('notice')
  })
}

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  // Server-side validation
  if (!classification_name || classification_name.trim() === '') {
    req.flash("notice", "Classification name is required.")
    res.status(400).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      message: req.flash('notice'),
      classification_name: classification_name || ''
    })
    return
  }

  // Check for spaces or special characters
  if (!/^[A-Za-z0-9]+$/.test(classification_name)) {
    req.flash("notice", "Classification name cannot contain spaces or special characters.")
    res.status(400).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      message: req.flash('notice'),
      classification_name: classification_name
    })
    return
  }

  try {
    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash("notice", `The ${classification_name} classification was successfully added.`)
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        message: req.flash('notice')
      })
    } else {
      req.flash("notice", "Sorry, the classification failed to be added.")
      res.status(501).render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
        message: req.flash('notice'),
        classification_name: classification_name
      })
    }
  } catch (error) {
    console.error("Error adding classification:", error)
    req.flash("notice", "Sorry, the classification failed to be added.")
    res.status(500).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      message: req.flash('notice'),
      classification_name: classification_name
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    message: req.flash('notice')
  })
}

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id 
  } = req.body

  try {
    const result = await invModel.addInventory(
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id
    )

    if (result) {
      req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        message: req.flash('notice')
      })
    } else {
      req.flash("notice", "Sorry, the inventory item failed to be added.")
      let classificationList = await utilities.buildClassificationList(classification_id)
      res.status(501).render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: null,
        message: req.flash('notice'),
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
      })
    }
  } catch (error) {
    console.error("Error adding inventory:", error)
    req.flash("notice", "Sorry, the inventory item failed to be added.")
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.status(500).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      message: req.flash('notice'),
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
  }
}

/* ***************************
 *  Get inventory for AJAX request
 * ************************** */
invCont.getInventoryJSON = async function (req, res, next) {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0]?.inv_id) {
    res.status(200).json(invData)
  } else {
    res.status(200).json([])
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.deleteConfirmationView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    req.flash("notice", "The inventory item was successfully deleted.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect(`/inv/delete/${inv_id}`)
  }
}

module.exports = invCont
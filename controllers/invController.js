const invModel = require("../models/inventory-model")
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
  const className = data[0].classification_name
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
    
    let nav = await utilities.getNav();
    console.log("Navigation generated:", nav ? "Yes" : "No");
    
    const detail = await utilities.buildDetailView(data);
    console.log("Detail HTML generated:", detail ? "Yes" : "No");
    
    res.render("./inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      detail
    });
  } catch (error) {
    console.error("Error in buildByInventoryId:", error);
    next(error);
  }
}

module.exports = invCont
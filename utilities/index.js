const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid = ""
    if(data && data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

Util.buildDetailView = function(vehicle) {
  if (!vehicle) return "<p class='notice'>Vehicle not found.</p>";
  return `
    <div class="vehicle-detail">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
      </div>
      <div class="vehicle-info">
        <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
        <p class="price"><strong>Price:</strong> $${Number(vehicle.inv_price).toLocaleString("en-US")}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Miles:</strong> ${Number(vehicle.inv_miles).toLocaleString("en-US")}</p>
      </div>
    </div>
  `;
}

/* ************************
 * Build classification list for select dropdown
 ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList = '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ************************
 * Handle errors
 ************************** */
Util.handleErrors = function(fn) {
  return function(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = async (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   async function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    res.locals.account_firstname = accountData.account_firstname
    res.locals.account_type = accountData.account_type
    
    // Get unread message count
    try {
      const messageModel = require("../models/message-model")
      res.locals.unreadMessageCount = await messageModel.getUnreadMessageCount(accountData.account_id)
    } catch (error) {
      console.error("Error getting unread message count:", error)
      res.locals.unreadMessageCount = 0
    }
    
    next()
   })
 } else {
  res.locals.unreadMessageCount = 0
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Account Type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.account_type === "Employee" || res.locals.account_type === "Admin") {
    next()
  } else {
    req.flash("notice", "Access denied. Employee or Admin privileges required.")
    return res.redirect("/account/login")
  }
}

/* ************************
 *  Check Inventory Data
 * ************************** */
Util.checkInventoryData = async function (req, res, next) {
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

  if (!inv_make || !inv_model || !inv_year || !inv_description || !inv_image || !inv_thumbnail || !inv_price || !inv_miles || !inv_color || !classification_id) {
    req.flash("notice", "Please check your input and try again.")
    res.status(400).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav: await Util.getNav(),
      classificationList: await Util.buildClassificationList(classification_id),
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
    return
  }
  next()
}

/* ************************
 *  Check Update Data
 * ************************** */
Util.checkUpdateData = async function (req, res, next) {
  const { 
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
  } = req.body

  if (!inv_id || !inv_make || !inv_model || !inv_year || !inv_description || !inv_image || !inv_thumbnail || !inv_price || !inv_miles || !inv_color || !classification_id) {
    req.flash("notice", "Please check your input and try again.")
    res.status(400).render("inventory/edit-inventory", {
      title: "Edit Inventory",
      nav: await Util.getNav(),
      classificationSelect: await Util.buildClassificationList(classification_id),
      errors: null,
      message: req.flash('notice'),
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
    return
  }
  next()
}

module.exports = Util 
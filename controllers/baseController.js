const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav})
}

baseController.triggerError = async function(req, res, next) {
  // Intentionally throw an error to test error handling
  // This error will be caught by the error handling middleware
  const error = new Error("Intentional error for testing purposes")
  error.status = 500
  next(error)
}

module.exports = baseController 
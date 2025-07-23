const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

baseController.triggerError = async function(req, res, next) {
  // Intentionally throw an error to test error handling
  throw new Error("Intentional error for testing purposes")
}

module.exports = baseController 
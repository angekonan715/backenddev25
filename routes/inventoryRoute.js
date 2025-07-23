// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities") 

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build inventory management view
router.get("/", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get("/add-classification", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));

// Route to process add classification
router.post("/add-classification", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.addClassification));

// Route to build add inventory view
router.get("/add-inventory", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

// Route to process add inventory
router.post("/add-inventory", utilities.checkLogin, utilities.checkAccountType, utilities.checkInventoryData, utilities.handleErrors(invController.addInventory));

// Route to get inventory for AJAX request
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to build edit inventory view
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView));

// Route to process update inventory
router.post("/update", utilities.checkLogin, utilities.checkAccountType, utilities.checkUpdateData, utilities.handleErrors(invController.updateInventory));

// Route to build delete confirmation view
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.deleteConfirmationView));

// Route to process delete inventory
router.post("/delete", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory));

module.exports = router;
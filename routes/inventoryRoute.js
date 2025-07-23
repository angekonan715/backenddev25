// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities") 

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view
router.get("/detail/:invId", invController.buildByInventoryId);

// Route to build inventory management view
router.get("/", invController.buildManagement);

// Route to build add classification view
router.get("/add-classification", invController.buildAddClassification);

// Route to process add classification
router.post("/add-classification", invController.addClassification);

// Route to build add inventory view
router.get("/add-inventory", invController.buildAddInventory);

// Route to process add inventory
router.post("/add-inventory", utilities.checkInventoryData, invController.addInventory);

// Route to get inventory for AJAX request
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

// Route to build edit inventory view
router.get("/edit/:inv_id", invController.editInventoryView);

// Route to process update inventory
router.post("/update", utilities.checkUpdateData, invController.updateInventory);

// Route to build delete confirmation view
router.get("/delete/:inv_id", invController.deleteConfirmationView);

// Route to process delete inventory
router.post("/delete", invController.deleteInventory);

module.exports = router;
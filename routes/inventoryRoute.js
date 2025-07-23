// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController") 

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
router.post("/add-inventory", invController.addInventory);

module.exports = router;
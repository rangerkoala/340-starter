// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require('../utilities/inv-validation')

// Route for root inventory path - redirect to management
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.getInventoryDetail))

// Route to test error handling (Task 3)
router.get("/error-test", utilities.handleErrors(invController.triggerError))

// Route to build management view
router.get("/management", utilities.handleErrors(invController.buildManagement))

// Routes to add classification
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification))
router.post('/add-classification', invValidate.addClassificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification))

// Routes to add inventory
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory))
router.post('/add-inventory', invValidate.addInventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.addInventory))

// Route to get inventory items by classification_id in JSON format (for AJAX)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to deliver edit-inventory view for a single vehicle
router.get('/edit/:invId', utilities.handleErrors(invController.buildEditInventory))

// Route to handle inventory update form submission
router.post("/update/", invValidate.addInventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))


// Route to deliver delete-inventory view for a single vehicle
router.get('/delete/:invId', utilities.handleErrors(invController.buildDeleteInventory))

// Route to handle inventory delete submission
router.post("/deleted/", utilities.handleErrors(invController.deleteInventory))


module.exports = router;
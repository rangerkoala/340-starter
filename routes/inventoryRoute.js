// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require('../utilities/inv-validation')

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

module.exports = router;
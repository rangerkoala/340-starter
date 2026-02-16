// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount));
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

// Route to deliver update account view
router.get("/update/:accountId", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))

// Process the account update
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process the password change
router.post(
  "/change-password",
  utilities.checkLogin,
  regValidate.changePasswordRules(),
  regValidate.checkChangePasswordData,
  utilities.handleErrors(accountController.changePassword)
)

module.exports = router
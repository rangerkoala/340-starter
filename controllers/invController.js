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

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.getInventoryDetail = async (req, res, next) => {
  const invId = req.params.invId
  const data = await invModel.getVehicleById(invId)
  
  if (!data) {
    return next({status: 404, message: "Vehicle not found"})
  }

  let nav = await utilities.getNav()
  res.render("inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    vehicle: data,
    nav
  })
}

/* ***************************
 *  Intentional Error for Testing (Task 3)
 * ************************** */
invCont.triggerError = async (req, res, next) => {
  throw new Error("Intentional test error triggered - error handling middleware is working!")
}

module.exports = invCont
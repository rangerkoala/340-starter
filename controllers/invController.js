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

/* ***************************
 *  Deliver add-classification view
 * ************************** */
invCont.buildAddClassification = async (req, res, next) => {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: null,
  })
}

/* ***************************
 *  Process add-classification form
 * ************************** */
invCont.addClassification = async (req, res, next) => {
  const { classification_name } = req.body
  try {
    const insertResult = await invModel.insertClassification(classification_name)
    if (insertResult) {
      req.flash('notice', `Success: ${classification_name} added.`)
      let nav = await utilities.getNav()
      return res.render('inventory/management', {
        title: 'Inventory Management',
        nav,
      })
    } else {
      let nav = await utilities.getNav()
      req.flash('notice', 'Sorry, adding classification failed.')
      return res.render('inventory/add-classification', {
        title: 'Add Classification',
        nav,
        errors: null,
        classification_name,
      })
    }
  } catch (error) {
    return next(error)
  }
}


/* ***************************
 *  Deliver add-inventory view
 * ************************** */
invCont.buildAddInventory = async (req, res, next) => {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    inv_make: null,
    inv_model: null,
    inv_year: null,
    inv_description: null,
    inv_image: null,
    inv_thumbnail: null,
    inv_price: null,
    inv_miles: null,
    inv_color: null,
    classification_id: null,
  })
}

/* ***************************
 *  Process add-inventory form
 * ************************** */
invCont.addInventory = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  try {
    const insertResult = await invModel.insertInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    if (insertResult) {
      req.flash('notice', `Success: ${inv_make} ${inv_model} added.`)
      let nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList()
      return res.render('inventory/management', {
        title: 'Inventory Management',
        nav,
        classificationList,
      })
    } else {
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(classification_id)
      req.flash('notice', 'Sorry, adding vehicle failed.')
      return res.render('inventory/add-inventory', {
        title: 'Add Inventory',
        nav,
        classificationList,
        errors: null,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      })
    }
  } catch (error) {
    return next(error)
  }
}

invCont.buildManagement = async (req, res, next) => {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Management",
    nav,
    classificationList,
  })
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async (req, res, next) => {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  let classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


/* ***************************
 *  Process edit-inventory form
 * ************************** */
invCont.updateInventory = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  try {
    const insertResult = await invModel.updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    if (insertResult) {
      req.flash('notice', `Success: ${inv_make} ${inv_model} updated.`)
      let nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList()
      return res.render('inventory/management', {
        title: 'Inventory Management',
        nav,
        classificationList,
      })
    } else {
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(classification_id)
      req.flash('notice', 'Sorry, updating vehicle failed.')
      return res.render('inventory/edit-inventory', {
        title: "Edit " + itemName,
        nav,
        classificationList,
        errors: null,
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
        classification_id,
      })
    }
  } catch (error) {
    return next(error)
  }
}


/* ***************************
 *  Delete edit inventory view
 * ************************** */
invCont.buildDeleteInventory = async (req, res, next) => {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  let classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Process delete-inventory form
 * ************************** */
invCont.deleteInventory = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  try {
    const insertResult = await invModel.deleteInventory(inv_id)
    if (insertResult) {
      req.flash('notice', `Success: ${inv_make} ${inv_model} deleted.`)
      let nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList()
      return res.render('inventory/management', {
        title: 'Inventory Management',
        nav,
        classificationList,
      })
    } else {
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(classification_id)
      req.flash('notice', 'Sorry, deleting vehicle failed.')
      return res.render('inventory/delete-inventory', {
        title: "Delete " + inv_make + " " + inv_model,
        nav,
        classificationList,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
      })
    }
  } catch (error) {
    return next(error)
  }
}





module.exports = invCont
const utilities = require('.')
const invModel = require('../models/inventory-model')
const { body, query, validationResult } = require('express-validator')

const validate = {}

/* **********************************
 *  Add Classification Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
  return [
    body('classification_name')
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a classification name.')
      .isAlphanumeric()
      .withMessage('Classification name must not contain spaces or special characters.'),
  ]
}

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errorsResult = validationResult(req)
  const errorsArr = errorsResult.array()
  if (errorsArr.length > 0) {
    let nav = await utilities.getNav()
    res.render('inventory/add-classification', {
      errors: { array: () => errorsArr, isEmpty: () => errorsArr.length === 0 },
      title: 'Add Classification',
      nav,
      classification_name,
    })
    return
  }
  // check for existing classification
  const existing = await invModel.getClassificationByName(classification_name)
  if (existing) {
    let nav = await utilities.getNav()
    const existsArr = [{ msg: 'Classification already exists.' }]
    res.render('inventory/add-classification', {
      errors: { array: () => existsArr, isEmpty: () => existsArr.length === 0 },
      title: 'Add Classification',
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* **********************************
 *  Add Inventory Validation Rules
 * ********************************* */
validate.addInventoryRules = () => {
  return [
    body('inv_make')
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a vehicle make.'),
    body('inv_model')
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a vehicle model.'),
    body('inv_year')
      .trim()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .isNumeric()
      .withMessage('Please provide a valid 4-digit year.'),
    body('inv_description')
      .trim()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage('Please provide a vehicle description (at least 10 characters).'),
    body('inv_image')
      .trim()
      .notEmpty()
      .withMessage('Please provide an image path.'),
    body('inv_thumbnail')
      .trim()
      .notEmpty()
      .withMessage('Please provide a thumbnail path.'),
    body('inv_price')
      .trim()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage('Please provide a valid price.'),
    body('inv_miles')
      .trim()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage('Please provide a valid mileage.'),
    body('inv_color')
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a vehicle color.'),
    body('classification_id')
      .notEmpty()
      .isInt()
      .withMessage('Please choose a valid classification.'),
  ]
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  const errorsResult = validationResult(req)
  const errorsArr = errorsResult.array()
  if (errorsArr.length > 0) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render('inventory/add-inventory', {
      errors: { array: () => errorsArr, isEmpty: () => errorsArr.length === 0 },
      title: 'Add Inventory',
      nav,
      classificationList,
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
    return
  }
  next()
}

/* ******************************
 * Check inventory data and return errors or continue (Edit View)
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  const errorsResult = validationResult(req)
  const errorsArr = errorsResult.array()
  if (errorsArr.length > 0) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render('inventory/edit-inventory', {
      errors: { array: () => errorsArr, isEmpty: () => errorsArr.length === 0 },
      title: 'Edit ' + inv_make + ' ' + inv_model,
      nav,
      classificationList,
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
    return
  }
  next()
}

/* **********************************
 *  Search Validation Rules
 * ********************************* */
validate.searchRules = () => {
  return [
    query('classification_id')
      .optional({ checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage('Classification must be a valid value.'),
    query('min_price')
      .optional({ checkFalsy: true })
      .isFloat({ min: 0 })
      .withMessage('Minimum price must be 0 or greater.'),
    query('max_price')
      .optional({ checkFalsy: true })
      .isFloat({ min: 0 })
      .withMessage('Maximum price must be 0 or greater.'),
    query('min_year')
      .optional({ checkFalsy: true })
      .isInt({ min: 1886 })
      .withMessage('Minimum year must be valid.'),
    query('max_year')
      .optional({ checkFalsy: true })
      .isInt({ min: 1886 })
      .withMessage('Maximum year must be valid.'),
    query('max_miles')
      .optional({ checkFalsy: true })
      .isInt({ min: 0 })
      .withMessage('Maximum miles must be 0 or greater.'),
    query('q')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 50 })
      .withMessage('Search text must be 50 characters or fewer.'),
  ]
}

/* ******************************
 * Check search data and return errors or continue
 * ***************************** */
validate.checkSearchData = async (req, res, next) => {
  const errorsResult = validationResult(req)
  const errorsArr = errorsResult.array()

  const minPrice = req.query.min_price !== '' && req.query.min_price !== undefined ? Number(req.query.min_price) : null
  const maxPrice = req.query.max_price !== '' && req.query.max_price !== undefined ? Number(req.query.max_price) : null
  const minYear = req.query.min_year !== '' && req.query.min_year !== undefined ? Number(req.query.min_year) : null
  const maxYear = req.query.max_year !== '' && req.query.max_year !== undefined ? Number(req.query.max_year) : null

  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    errorsArr.push({ msg: 'Minimum price cannot be greater than maximum price.' })
  }

  if (minYear !== null && maxYear !== null && minYear > maxYear) {
    errorsArr.push({ msg: 'Minimum year cannot be greater than maximum year.' })
  }

  if (errorsArr.length > 0) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.query.classification_id || null)
    return res.render('inventory/search', {
      title: 'Advanced Inventory Search',
      nav,
      errors: { array: () => errorsArr, isEmpty: () => errorsArr.length === 0 },
      classificationList,
      filters: {
        classification_id: req.query.classification_id || '',
        min_price: req.query.min_price || '',
        max_price: req.query.max_price || '',
        min_year: req.query.min_year || '',
        max_year: req.query.max_year || '',
        max_miles: req.query.max_miles || '',
        q: req.query.q || '',
      },
      grid: '<p class="notice">Fix the validation errors and try again.</p>',
      hasSearched: true,
    })
  }

  next()
}

module.exports = validate


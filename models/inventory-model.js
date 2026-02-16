const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getVehicleById(invId) {
  try {
    const data = await pool.query(
      "SELECT * FROM inventory WHERE inv_id = $1",
      [invId]
    )
    return data.rows[0]
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get classification by name
 * ************************** */
async function getClassificationByName(classification_name) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification WHERE classification_name = $1",
      [classification_name]
    )
    return data.rows[0]
  } catch (error) {
    console.error('getClassificationByName error ' + error)
  }
}

/* ***************************
 *  Insert a new classification
 * ************************** */
async function insertClassification(classification_name) {
  try {
    const result = await pool.query(
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *",
      [classification_name]
    )
    return result.rows[0]
  } catch (error) {
    console.error('insertClassification error ' + error)
    return null
  }
}

/* ***************************
 *  Insert a new inventory item
 * ************************** */
async function insertInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = 'INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *'
    const result = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
    return result.rows[0]
  } catch (error) {
    console.error('insertInventory error ' + error)
    return null
  }
}

/* ***************************
 *  Update inventory item
 * ************************** */
async function updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = 'UPDATE public.inventory SET inv_make=$1, inv_model=$2, inv_year=$3, inv_description=$4, inv_image=$5, inv_thumbnail=$6, inv_price=$7, inv_miles=$8, inv_color=$9, classification_id=$10 WHERE inv_id = $11 RETURNING *'
    const result = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id])
    return result.rows[0]
  } catch (error) {
    console.error('updateInventory error ' + error)
    return null
  }
}

/* ***************************
 *  Delete inventory item
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = 'DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *'
    const result = await pool.query(sql, [inv_id])
    return result.rows[0]
  } catch (error) {
    console.error('deleteInventory error ' + error)
    return null
  }
}

/* ***************************
 *  Search inventory by filters
 * ************************** */
async function searchInventory(filters = {}) {
  try {
    const where = []
    const values = []

    if (filters.classification_id) {
      values.push(filters.classification_id)
      where.push(`i.classification_id = $${values.length}`)
    }

    if (filters.min_price !== undefined && filters.min_price !== null) {
      values.push(filters.min_price)
      where.push(`i.inv_price >= $${values.length}`)
    }

    if (filters.max_price !== undefined && filters.max_price !== null) {
      values.push(filters.max_price)
      where.push(`i.inv_price <= $${values.length}`)
    }

    if (filters.min_year !== undefined && filters.min_year !== null) {
      values.push(filters.min_year)
      where.push(`i.inv_year >= $${values.length}`)
    }

    if (filters.max_year !== undefined && filters.max_year !== null) {
      values.push(filters.max_year)
      where.push(`i.inv_year <= $${values.length}`)
    }

    if (filters.max_miles !== undefined && filters.max_miles !== null) {
      values.push(filters.max_miles)
      where.push(`i.inv_miles <= $${values.length}`)
    }

    if (filters.q) {
      values.push(`%${filters.q}%`)
      where.push(`(i.inv_make ILIKE $${values.length} OR i.inv_model ILIKE $${values.length})`)
    }

    let sql = `SELECT i.*, c.classification_name
      FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id`

    if (where.length > 0) {
      sql += ` WHERE ${where.join(" AND ")}`
    }

    sql += " ORDER BY i.inv_year DESC, i.inv_price ASC LIMIT 50"

    const result = await pool.query(sql, values)
    return result.rows
  } catch (error) {
    console.error('searchInventory error ' + error)
    return []
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, getClassificationByName, insertClassification, insertInventory, updateInventory, deleteInventory, searchInventory};
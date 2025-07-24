const pool = require("../database/")

/* ***************************
 *  Get reviews by inventory ID
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT r.review_id, r.review_text, r.review_date, r.inv_id, r.account_id,
              a.account_firstname, a.account_lastname
       FROM public.review r
       JOIN public.account a ON r.account_id = a.account_id
       WHERE r.inv_id = $1
       ORDER BY r.review_date DESC`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getReviewsByInventoryId error " + error)
    throw error
  }
}

/* ***************************
 *  Get reviews by account ID
 * ************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const data = await pool.query(
      `SELECT r.review_id, r.review_text, r.review_date, r.inv_id, r.account_id,
              i.inv_make, i.inv_model, i.inv_year
       FROM public.review r
       JOIN public.inventory i ON r.inv_id = i.inv_id
       WHERE r.account_id = $1
       ORDER BY r.review_date DESC`,
      [account_id]
    )
    return data.rows
  } catch (error) {
    console.error("getReviewsByAccountId error " + error)
    throw error
  }
}

/* ***************************
 *  Get review by review ID
 * ************************** */
async function getReviewById(review_id) {
  try {
    const data = await pool.query(
      `SELECT r.review_id, r.review_text, r.review_date, r.inv_id, r.account_id,
              a.account_firstname, a.account_lastname,
              i.inv_make, i.inv_model, i.inv_year
       FROM public.review r
       JOIN public.account a ON r.account_id = a.account_id
       JOIN public.inventory i ON r.inv_id = i.inv_id
       WHERE r.review_id = $1`,
      [review_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getReviewById error " + error)
    throw error
  }
}

/* ***************************
 *  Add new review
 * ************************** */
async function addReview(review_text, inv_id, account_id) {
  try {
    const data = await pool.query(
      `INSERT INTO public.review (review_text, inv_id, account_id) 
       VALUES ($1, $2, $3) RETURNING *`,
      [review_text, inv_id, account_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("addReview error " + error)
    throw error
  }
}

/* ***************************
 *  Update review
 * ************************** */
async function updateReview(review_id, review_text, account_id) {
  try {
    const data = await pool.query(
      `UPDATE public.review 
       SET review_text = $1 
       WHERE review_id = $2 AND account_id = $3 
       RETURNING *`,
      [review_text, review_id, account_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("updateReview error " + error)
    throw error
  }
}

/* ***************************
 *  Delete review
 * ************************** */
async function deleteReview(review_id, account_id) {
  try {
    const data = await pool.query(
      `DELETE FROM public.review 
       WHERE review_id = $1 AND account_id = $2 
       RETURNING *`,
      [review_id, account_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("deleteReview error " + error)
    throw error
  }
}

module.exports = {
  getReviewsByInventoryId,
  getReviewsByAccountId,
  getReviewById,
  addReview,
  updateReview,
  deleteReview
} 
const pool = require('../database/')

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password, is_student = false, student_email = null){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type, is_student, student_email, student_verification_date) VALUES ($1, $2, $3, $4, 'Client', $5, $6, $7) RETURNING *"
    const student_verification_date = is_student ? new Date().toISOString().split('T')[0] : null
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password, is_student, student_email, student_verification_date])
    return result
  } catch (error) {
    console.error("Database error:", error.message)
    return null
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password, is_student, student_email, student_verification_date FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account_id
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, is_student, student_email, student_verification_date FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

/* *****************************
* Update account information
* ***************************** */
async function updateAccount (account_id, account_firstname, account_lastname, account_email, is_student = null, student_email = null) {
  try {
    let sql, params
    if (is_student !== null) {
      const student_verification_date = is_student ? new Date().toISOString().split('T')[0] : null
      sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3, is_student = $4, student_email = $5, student_verification_date = $6 WHERE account_id = $7 RETURNING *"
      params = [account_firstname, account_lastname, account_email, is_student, student_email, student_verification_date, account_id]
    } else {
      sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
      params = [account_firstname, account_lastname, account_email, account_id]
    }
    const result = await pool.query(sql, params)
    return result.rows[0]
  } catch (error) {
    console.error("Database error:", error.message)
    return null
  }
}

/* *****************************
* Update account password
* ***************************** */
async function updatePassword (account_id, hashedPassword) {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    const result = await pool.query(sql, [hashedPassword, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("Database error:", error.message)
    return null
  }
}

/* *****************************
* Update student status
* ***************************** */
async function updateStudentStatus (account_id, is_student, student_email) {
  try {
    const student_verification_date = is_student ? new Date().toISOString().split('T')[0] : null
    const sql = "UPDATE account SET is_student = $1, student_email = $2, student_verification_date = $3 WHERE account_id = $4 RETURNING *"
    const result = await pool.query(sql, [is_student, student_email, student_verification_date, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("Database error:", error.message)
    return null
  }
}

/* *****************************
* Check if student email is valid (basic .edu check)
* ***************************** */
function isValidStudentEmail(email) {
  if (!email) return false
  return email.toLowerCase().endsWith('.edu')
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updatePassword, updateStudentStatus, isValidStudentEmail } 
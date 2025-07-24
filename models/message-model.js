const pool = require("../database/")

/* ***************************
 *  Get all messages for a user (inbox)
 * ************************** */
async function getMessagesByRecipient(account_id) {
  try {
    const data = await pool.query(
      `SELECT m.message_id, m.message_subject, m.message_body, m.message_created, 
              m.message_to, m.message_from, m.message_read, m.message_archived,
              sender.account_firstname as sender_firstname, sender.account_lastname as sender_lastname
       FROM public.message m
       JOIN public.account sender ON m.message_from = sender.account_id
       WHERE m.message_to = $1 AND m.message_archived = false
       ORDER BY m.message_created DESC`,
      [account_id]
    )
    return data.rows
  } catch (error) {
    console.error("getMessagesByRecipient error " + error)
    throw error
  }
}

/* ***************************
 *  Get archived messages for a user
 * ************************** */
async function getArchivedMessagesByRecipient(account_id) {
  try {
    const data = await pool.query(
      `SELECT m.message_id, m.message_subject, m.message_body, m.message_created, 
              m.message_to, m.message_from, m.message_read, m.message_archived,
              sender.account_firstname as sender_firstname, sender.account_lastname as sender_lastname
       FROM public.message m
       JOIN public.account sender ON m.message_from = sender.account_id
       WHERE m.message_to = $1 AND m.message_archived = true
       ORDER BY m.message_created DESC`,
      [account_id]
    )
    return data.rows
  } catch (error) {
    console.error("getArchivedMessagesByRecipient error " + error)
    throw error
  }
}

/* ***************************
 *  Get a specific message by ID
 * ************************** */
async function getMessageById(message_id, account_id) {
  try {
    const data = await pool.query(
      `SELECT m.message_id, m.message_subject, m.message_body, m.message_created, 
              m.message_to, m.message_from, m.message_read, m.message_archived,
              sender.account_firstname as sender_firstname, sender.account_lastname as sender_lastname,
              recipient.account_firstname as recipient_firstname, recipient.account_lastname as recipient_lastname
       FROM public.message m
       JOIN public.account sender ON m.message_from = sender.account_id
       JOIN public.account recipient ON m.message_to = recipient.account_id
       WHERE m.message_id = $1 AND m.message_to = $2`,
      [message_id, account_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getMessageById error " + error)
    throw error
  }
}

/* ***************************
 *  Get unread message count for a user
 * ************************** */
async function getUnreadMessageCount(account_id) {
  try {
    const data = await pool.query(
      `SELECT COUNT(*) as count
       FROM public.message
       WHERE message_to = $1 AND message_read = false AND message_archived = false`,
      [account_id]
    )
    return parseInt(data.rows[0].count)
  } catch (error) {
    console.error("getUnreadMessageCount error " + error)
    throw error
  }
}

/* ***************************
 *  Get archived message count for a user
 * ************************** */
async function getArchivedMessageCount(account_id) {
  try {
    const data = await pool.query(
      `SELECT COUNT(*) as count
       FROM public.message
       WHERE message_to = $1 AND message_archived = true`,
      [account_id]
    )
    return parseInt(data.rows[0].count)
  } catch (error) {
    console.error("getArchivedMessageCount error " + error)
    throw error
  }
}

/* ***************************
 *  Add new message
 * ************************** */
async function addMessage(message_subject, message_body, message_to, message_from) {
  try {
    const data = await pool.query(
      `INSERT INTO public.message (message_subject, message_body, message_to, message_from) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [message_subject, message_body, message_to, message_from]
    )
    return data.rows[0]
  } catch (error) {
    console.error("addMessage error " + error)
    throw error
  }
}

/* ***************************
 *  Mark message as read
 * ************************** */
async function markMessageAsRead(message_id, account_id) {
  try {
    const data = await pool.query(
      `UPDATE public.message 
       SET message_read = true 
       WHERE message_id = $1 AND message_to = $2 
       RETURNING *`,
      [message_id, account_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("markMessageAsRead error " + error)
    throw error
  }
}

/* ***************************
 *  Archive message
 * ************************** */
async function archiveMessage(message_id, account_id) {
  try {
    const data = await pool.query(
      `UPDATE public.message 
       SET message_archived = true 
       WHERE message_id = $1 AND message_to = $2 
       RETURNING *`,
      [message_id, account_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("archiveMessage error " + error)
    throw error
  }
}

/* ***************************
 *  Unarchive message
 * ************************** */
async function unarchiveMessage(message_id, account_id) {
  try {
    const data = await pool.query(
      `UPDATE public.message 
       SET message_archived = false 
       WHERE message_id = $1 AND message_to = $2 
       RETURNING *`,
      [message_id, account_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("unarchiveMessage error " + error)
    throw error
  }
}

/* ***************************
 *  Delete message
 * ************************** */
async function deleteMessage(message_id, account_id) {
  try {
    const data = await pool.query(
      `DELETE FROM public.message 
       WHERE message_id = $1 AND message_to = $2 
       RETURNING *`,
      [message_id, account_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("deleteMessage error " + error)
    throw error
  }
}

/* ***************************
 *  Get all accounts for message recipients
 * ************************** */
async function getAllAccounts() {
  try {
    const data = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, account_email, account_type
       FROM public.account
       ORDER BY account_firstname, account_lastname`
    )
    return data.rows
  } catch (error) {
    console.error("getAllAccounts error " + error)
    throw error
  }
}

module.exports = {
  getMessagesByRecipient,
  getArchivedMessagesByRecipient,
  getMessageById,
  getUnreadMessageCount,
  getArchivedMessageCount,
  addMessage,
  markMessageAsRead,
  archiveMessage,
  unarchiveMessage,
  deleteMessage,
  getAllAccounts
} 
const messageModel = require("../models/message-model")
const utilities = require("../utilities/")

const messageCont = {}

/* ***************************
 *  Build inbox view
 * ************************** */
messageCont.buildInbox = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const account_id = res.locals.accountData.account_id
    
    const messages = await messageModel.getMessagesByRecipient(account_id)
    const unreadCount = await messageModel.getUnreadMessageCount(account_id)
    const archivedCount = await messageModel.getArchivedMessageCount(account_id)
    
    res.render("./message/inbox", {
      title: "Inbox",
      nav,
      messages: messages,
      unreadCount: unreadCount,
      archivedCount: archivedCount,
      message: req.flash('notice')
    })
  } catch (error) {
    console.error("Error in buildInbox:", error)
    next(error)
  }
}

/* ***************************
 *  Build archived messages view
 * ************************** */
messageCont.buildArchived = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const account_id = res.locals.accountData.account_id
    
    const messages = await messageModel.getArchivedMessagesByRecipient(account_id)
    const unreadCount = await messageModel.getUnreadMessageCount(account_id)
    const archivedCount = await messageModel.getArchivedMessageCount(account_id)
    
    res.render("./message/archived", {
      title: "Archived Messages",
      nav,
      messages: messages,
      unreadCount: unreadCount,
      archivedCount: archivedCount,
      message: req.flash('notice')
    })
  } catch (error) {
    console.error("Error in buildArchived:", error)
    next(error)
  }
}

/* ***************************
 *  Build new message view
 * ************************** */
messageCont.buildNewMessage = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const accounts = await messageModel.getAllAccounts()
    
    res.render("./message/new-message", {
      title: "New Message",
      nav,
      accounts: accounts,
      errors: null,
      message: req.flash('notice')
    })
  } catch (error) {
    console.error("Error in buildNewMessage:", error)
    next(error)
  }
}

/* ***************************
 *  Build reply message view
 * ************************** */
messageCont.buildReplyMessage = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const message_id = parseInt(req.params.message_id)
    const account_id = res.locals.accountData.account_id
    
    const originalMessage = await messageModel.getMessageById(message_id, account_id)
    if (!originalMessage) {
      req.flash("notice", "Message not found.")
      return res.redirect("/message/")
    }
    
    res.render("./message/reply-message", {
      title: "Reply to Message",
      nav,
      originalMessage: originalMessage,
      errors: null,
      message: req.flash('notice')
    })
  } catch (error) {
    console.error("Error in buildReplyMessage:", error)
    next(error)
  }
}

/* ***************************
 *  Build view message view
 * ************************** */
messageCont.buildViewMessage = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const message_id = parseInt(req.params.message_id)
    const account_id = res.locals.accountData.account_id
    
    const message = await messageModel.getMessageById(message_id, account_id)
    if (!message) {
      req.flash("notice", "Message not found.")
      return res.redirect("/message/")
    }
    
    // Mark message as read if it's not already read
    if (!message.message_read) {
      await messageModel.markMessageAsRead(message_id, account_id)
      message.message_read = true
    }
    
    res.render("./message/view-message", {
      title: "View Message",
      nav,
      message: message,
      message: req.flash('notice')
    })
  } catch (error) {
    console.error("Error in buildViewMessage:", error)
    next(error)
  }
}

/* ***************************
 *  Process new message
 * ************************** */
messageCont.sendMessage = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const { message_to, message_subject, message_body } = req.body
    const message_from = res.locals.accountData.account_id
    
    // Server-side validation
    if (!message_to || !message_subject || !message_body) {
      req.flash("notice", "All fields are required.")
      return res.redirect("/message/new")
    }
    
    if (message_subject.trim().length < 1) {
      req.flash("notice", "Subject is required.")
      return res.redirect("/message/new")
    }
    
    if (message_body.trim().length < 1) {
      req.flash("notice", "Message body is required.")
      return res.redirect("/message/new")
    }
    
    const result = await messageModel.addMessage(message_subject, message_body, message_to, message_from)
    
    if (result) {
      req.flash("notice", "Message sent successfully.")
    } else {
      req.flash("notice", "Failed to send message.")
    }
    
    res.redirect("/message/")
  } catch (error) {
    console.error("Error in sendMessage:", error)
    req.flash("notice", "Failed to send message.")
    res.redirect("/message/new")
  }
}

/* ***************************
 *  Process reply message
 * ************************** */
messageCont.sendReply = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const { message_subject, message_body, original_message_id } = req.body
    const message_from = res.locals.accountData.account_id
    
    // Get original message to get the recipient
    const originalMessage = await messageModel.getMessageById(original_message_id, message_from)
    if (!originalMessage) {
      req.flash("notice", "Original message not found.")
      return res.redirect("/message/")
    }
    
    // Server-side validation
    if (!message_subject || !message_body) {
      req.flash("notice", "Subject and message body are required.")
      return res.redirect(`/message/reply/${original_message_id}`)
    }
    
    if (message_subject.trim().length < 1) {
      req.flash("notice", "Subject is required.")
      return res.redirect(`/message/reply/${original_message_id}`)
    }
    
    if (message_body.trim().length < 1) {
      req.flash("notice", "Message body is required.")
      return res.redirect(`/message/reply/${original_message_id}`)
    }
    
    // Send reply to the original sender
    const result = await messageModel.addMessage(message_subject, message_body, originalMessage.message_from, message_from)
    
    if (result) {
      req.flash("notice", "Reply sent successfully.")
    } else {
      req.flash("notice", "Failed to send reply.")
    }
    
    res.redirect("/message/")
  } catch (error) {
    console.error("Error in sendReply:", error)
    req.flash("notice", "Failed to send reply.")
    res.redirect("/message/")
  }
}

/* ***************************
 *  Archive message
 * ************************** */
messageCont.archiveMessage = async function (req, res, next) {
  try {
    const { message_id } = req.body
    const account_id = res.locals.accountData.account_id
    
    const result = await messageModel.archiveMessage(message_id, account_id)
    
    if (result) {
      req.flash("notice", "Message archived successfully.")
    } else {
      req.flash("notice", "Failed to archive message.")
    }
    
    res.redirect("/message/")
  } catch (error) {
    console.error("Error in archiveMessage:", error)
    req.flash("notice", "Failed to archive message.")
    res.redirect("/message/")
  }
}

/* ***************************
 *  Unarchive message
 * ************************** */
messageCont.unarchiveMessage = async function (req, res, next) {
  try {
    const { message_id } = req.body
    const account_id = res.locals.accountData.account_id
    
    const result = await messageModel.unarchiveMessage(message_id, account_id)
    
    if (result) {
      req.flash("notice", "Message moved to inbox successfully.")
    } else {
      req.flash("notice", "Failed to move message to inbox.")
    }
    
    res.redirect("/message/archived")
  } catch (error) {
    console.error("Error in unarchiveMessage:", error)
    req.flash("notice", "Failed to move message to inbox.")
    res.redirect("/message/archived")
  }
}

/* ***************************
 *  Delete message
 * ************************** */
messageCont.deleteMessage = async function (req, res, next) {
  try {
    const { message_id } = req.body
    const account_id = res.locals.accountData.account_id
    
    const result = await messageModel.deleteMessage(message_id, account_id)
    
    if (result) {
      req.flash("notice", "Message deleted successfully.")
    } else {
      req.flash("notice", "Failed to delete message.")
    }
    
    res.redirect("/message/")
  } catch (error) {
    console.error("Error in deleteMessage:", error)
    req.flash("notice", "Failed to delete message.")
    res.redirect("/message/")
  }
}

module.exports = messageCont 
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const messageController = require("../controllers/messageController")
const utilities = require("../utilities") 

// Route to build inbox view
router.get("/", utilities.checkLogin, utilities.handleErrors(messageController.buildInbox));

// Route to build archived messages view
router.get("/archived", utilities.checkLogin, utilities.handleErrors(messageController.buildArchived));

// Route to build new message view
router.get("/new", utilities.checkLogin, utilities.handleErrors(messageController.buildNewMessage));

// Route to build reply message view
router.get("/reply/:message_id", utilities.checkLogin, utilities.handleErrors(messageController.buildReplyMessage));

// Route to build view message view
router.get("/view/:message_id", utilities.checkLogin, utilities.handleErrors(messageController.buildViewMessage));

// Route to process new message
router.post("/send", utilities.checkLogin, utilities.handleErrors(messageController.sendMessage));

// Route to process reply message
router.post("/reply", utilities.checkLogin, utilities.handleErrors(messageController.sendReply));

// Route to archive message
router.post("/archive", utilities.checkLogin, utilities.handleErrors(messageController.archiveMessage));

// Route to unarchive message
router.post("/unarchive", utilities.checkLogin, utilities.handleErrors(messageController.unarchiveMessage));

// Route to delete message
router.post("/delete", utilities.checkLogin, utilities.handleErrors(messageController.deleteMessage));

module.exports = router 
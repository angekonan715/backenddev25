// Needed Resources 
const express = require("express")
const router = new express.Router() 
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities") 

// Route to process add review
router.post("/add", utilities.checkLogin, utilities.handleErrors(reviewController.addReview));

// Route to build edit review view
router.get("/edit/:review_id", utilities.checkLogin, utilities.handleErrors(reviewController.editReviewView));

// Route to process update review
router.post("/update", utilities.checkLogin, utilities.handleErrors(reviewController.updateReview));

// Route to process delete review
router.post("/delete", utilities.checkLogin, utilities.handleErrors(reviewController.deleteReview));

module.exports = router 
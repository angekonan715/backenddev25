const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ***************************
 *  Add new review
 * ************************** */
reviewCont.addReview = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { review_text, inv_id, account_id } = req.body

  // Server-side validation
  if (!review_text || review_text.trim() === '') {
    req.flash("notice", "Review text is required.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }

  if (review_text.length < 10) {
    req.flash("notice", "Review must be at least 10 characters long.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }

  try {
    const result = await reviewModel.addReview(review_text, inv_id, account_id)

    if (result) {
      req.flash("notice", "Review was successfully added.")
    } else {
      req.flash("notice", "Sorry, the review failed to be added.")
    }
  } catch (error) {
    console.error("Error adding review:", error)
    req.flash("notice", "Sorry, the review failed to be added.")
  }

  res.redirect(`/inv/detail/${inv_id}`)
}

/* ***************************
 *  Build edit review view
 * ************************** */
reviewCont.editReviewView = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  
  try {
    const reviewData = await reviewModel.getReviewById(review_id)
    
    if (!reviewData) {
      req.flash("notice", "Review not found.")
      return res.redirect("/account/")
    }

    // Check if user is the author of the review
    if (reviewData.account_id !== res.locals.accountData.account_id) {
      req.flash("notice", "You can only edit your own reviews.")
      return res.redirect("/account/")
    }

    res.render("./review/edit-review", {
      title: "Edit Review",
      nav,
      errors: null,
      review_id: reviewData.review_id,
      review_text: reviewData.review_text,
      inv_id: reviewData.inv_id,
      inv_make: reviewData.inv_make,
      inv_model: reviewData.inv_model,
      inv_year: reviewData.inv_year,
      message: req.flash('notice')
    })
  } catch (error) {
    console.error("Error in editReviewView:", error)
    req.flash("notice", "Error loading review.")
    res.redirect("/account/")
  }
}

/* ***************************
 *  Update review
 * ************************** */
reviewCont.updateReview = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { review_id, review_text, inv_id } = req.body
  const account_id = res.locals.accountData.account_id

  // Server-side validation
  if (!review_text || review_text.trim() === '') {
    req.flash("notice", "Review text is required.")
    return res.redirect(`/review/edit/${review_id}`)
  }

  if (review_text.length < 10) {
    req.flash("notice", "Review must be at least 10 characters long.")
    return res.redirect(`/review/edit/${review_id}`)
  }

  try {
    const result = await reviewModel.updateReview(review_id, review_text, account_id)

    if (result) {
      req.flash("notice", "Review was successfully updated.")
    } else {
      req.flash("notice", "Sorry, the review failed to be updated.")
    }
  } catch (error) {
    console.error("Error updating review:", error)
    req.flash("notice", "Sorry, the review failed to be updated.")
  }

  res.redirect("/account/")
}

/* ***************************
 *  Delete review
 * ************************** */
reviewCont.deleteReview = async function (req, res, next) {
  const { review_id } = req.body
  const account_id = res.locals.accountData.account_id

  try {
    const result = await reviewModel.deleteReview(review_id, account_id)

    if (result) {
      req.flash("notice", "Review was successfully deleted.")
    } else {
      req.flash("notice", "Sorry, the review failed to be deleted.")
    }
  } catch (error) {
    console.error("Error deleting review:", error)
    req.flash("notice", "Sorry, the review failed to be deleted.")
  }

  res.redirect("/account/")
}

module.exports = reviewCont 
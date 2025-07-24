const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const reviewModel = require("../models/review-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
    return
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      // Set JWT cookie for all environments
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account management view
* ************************************ */
async function buildAccountManagement(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(res.locals.accountData.account_id)
    
    // If user is a manager, redirect to inventory management
    if (accountData.account_type === 'Manager') {
      return res.redirect("/inv/")
    }
    
    // Get user's reviews
    let userReviews = []
    try {
      userReviews = await reviewModel.getReviewsByAccountId(res.locals.accountData.account_id)
    } catch (reviewError) {
      console.error("Error fetching user reviews:", reviewError)
      // Continue without reviews if there's an error
    }
    
    res.render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_type: accountData.account_type,
      account_id: accountData.account_id,
      userReviews: userReviews,
      message: req.flash('notice')
    })
  } catch (error) {
    console.error("Error in buildAccountManagement:", error)
    next(error)
  }
}

/* ****************************************
*  Deliver account update view
* ************************************ */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  
  // Check if user is updating their own account
  if (account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "You can only update your own account.")
    return res.redirect("/account/")
  }
  
  res.render("account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id
  })
}

/* ****************************************
*  Process account update
* ************************************ */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  
  // Check if user is updating their own account
  if (parseInt(account_id) !== res.locals.accountData.account_id) {
    req.flash("notice", "You can only update your own account.")
    return res.redirect("/account/")
  }
  
  // Check if email already exists (if email is being changed)
  const currentAccount = await accountModel.getAccountById(account_id)
  if (currentAccount.account_email !== account_email) {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists > 0) {
      req.flash("notice", "Email address already exists.")
      return res.redirect(`/account/update/${account_id}`)
    }
  }
  
  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
  
  if (updateResult) {
    req.flash("notice", "Account information updated successfully.")
  } else {
    req.flash("notice", "Account update failed.")
  }
  
  res.redirect("/account/")
}

/* ****************************************
*  Process password change
* ************************************ */
async function changePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body
  
  // Check if user is updating their own account
  if (parseInt(account_id) !== res.locals.accountData.account_id) {
    req.flash("notice", "You can only update your own account.")
    return res.redirect("/account/")
  }
  
  // Hash the password
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the password change.")
    return res.redirect(`/account/update/${account_id}`)
  }
  
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword)
  
  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
  } else {
    req.flash("notice", "Password update failed.")
  }
  
  res.redirect("/account/")
}

/* ****************************************
*  Process logout
* ************************************ */
async function logout(req, res, next) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildAccountUpdate, updateAccount, changePassword, logout } 
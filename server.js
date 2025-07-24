/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts") // we tell the application to require express-ejs-layouts, so it can be used.
const env = require("dotenv").config()
// Set default environment variables if not present
if (!process.env.ACCESS_TOKEN_SECRET) {
  process.env.ACCESS_TOKEN_SECRET = "your-super-secret-jwt-key-here"
}
if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = "your-super-secret-session-key-here"
}
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const app = express()
const utilities = require("./utilities/")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const reviewRoute = require("./routes/reviewRoute")
const messageRoute = require("./routes/messageRoute")


/* ***********************
 * Middleware
 *************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser())
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/

app.set("view engine", "ejs") // declare the view engine to be ejs
app.use(expressLayouts) // use express-ejs-layouts
app.set("layout", "layouts/layout") // not at views root :

/* ***********************
 * Routes
 *************************/
app.use(express.static("public"))
// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Error test route (Task 3)
app.get("/error-test", utilities.handleErrors(baseController.triggerError))
// Inventory routes
app.use("/inv", inventoryRoute)
// Account routes
app.use("/account", accountRoute)
// Review routes
app.use("/review", reviewRoute)
// Message routes
app.use("/message", messageRoute)

// 404 handler
app.use(async (req, res, next) => {
  try {
    const utilities = require("./utilities/");
    const nav = await utilities.getNav();
    res.status(404).render("error", { 
      title: "404 Not Found", 
      message: "Page not found.",
      nav 
    });
  } catch (error) {
    res.status(404).render("error", { 
      title: "404 Not Found", 
      message: "Page not found." 
    });
  }
});

// Error handler
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  try {
    const utilities = require("./utilities/");
    const nav = await utilities.getNav();
    res.status(500).render("error", { 
      title: "Server Error", 
      message: "Something went wrong!",
      nav 
    });
  } catch (error) {
    res.status(500).render("error", { 
      title: "Server Error", 
      message: "Something went wrong!" 
    });
  }
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

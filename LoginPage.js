/*  EXPRESS */
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const port = process.env.PORT || 3000;

var userProfile;

/*  Google AUTH  */

var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

GOOGLE_CLIENT_ID =
  "538303767249-5reikd8onop6liqq9mgjdeguilma7l8a.apps.googleusercontent.com";
GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

/* Middleware */

app.set("view engine", "ejs");

app.use(express.static("views"));

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

// Default login page
app.get("/", function (req, res) {
  res.render("pages/auth");
});

// Check if user is logged in
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// Checks to see if the user's email is a manager
function isManager() {
  const result = userProfile.emails[0].value;

  // Returns true if the user profile is a manager, and false otherwise
  const manager = [
    "vuthuynhi@tamu.edu",
    "justin.a@tamu.edu",
    "pablopineda@tamu.edu",
    "raquel.oseguera@tamu.edu",
  ];
  return manager.includes(result);
}

function isServer() {
  const result = userProfile.emails[0].value;

  const server = ["vuthuynhi05@gmail.com", "justin.abraham@saseconnect.org"];

  return server.includes(result);
}

app.listen(port, () => console.log("App listening on port " + port));

app.use(passport.initialize());
app.use(passport.session());

// Authenticate user's google credentials
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// returns callback after authenticating user's google credentials
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/error",
  })
);

/* 
/ After logging in successfully the dashboard page will pop up
/ If the user is a manager, the manager page will pop up instead
*/
app.get("/dashboard", isLoggedIn, (req, res) => {
  if (isManager()) {
    userRole = userRoles[0].role;
    console.log(userRoles[0].role);
    res.render("pages/dashboard", { user: userProfile, userRole });
  } else if (isServer()) {
    res.render("pages/customerdashboard", { user: userProfile, userRoles });
  } else {
    res.render("pages/customerdashboard", { user: userProfile, userRoles });
  }
});

// If failed to login, redirect to error page
app.get("/error", (req, res) => res.send("error logging in"));

// After user had logged out, redirect to login page
app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

/* Roles */
const userRoles = [
  { role: "Manager" },
  { role: "Server" },
  { role: "Customer" },
];

/* Menu */
const entreeItems = [
  { name: "Chicken Sandwich", price: 9.99 },
  { name: "Deluxe Chicken Sandwich", price: 8.99 },
  { name: "Chicken Nuggets", price: 7.99 },
];

const drinkItems = [
  { name: "Coca-Cola", price: 2.5 },
  { name: "Sprite", price: 2.5 },
  { name: "Milkshake", price: 4.39 },
  { name: "Dr. Pepper", price: 2.5 },
  { name: "Frosted Lemonade", price: 3.39 },
  { name: "Frosted Coffee", price: 3.89 },
  { name: "Sweet Tea", price: 2.0 },
  { name: "Unsweet Tea", price: 2.0 },
  { name: "Lemonade", price: 2.5 },
];

const saladItems = [
  { name: "Cobb Salad", price: 8.49 },
  { name: "Spicy Southwest Salad", price: 8.29 },
  { name: "Market Salad", price: 8.19 },
  { name: "Grilled Market Salad", price: 8.19 },
  { name: "Spicy Southwest Salad with Grilled Chicken", price: 8.29 },
  { name: "Grilled Chicken Cool Wrap", price: 7.99 },
];

const sideItems = [
  { name: "Waffle Potato Fries", price: 2.79 },
  { name: "Mac & Cheese", price: 3.89 },
  { name: "Side Salad", price: 3.19 },
  { name: "Fruit Cup", price: 3.19 },
  { name: "Greek Yogurt Parfait", price: 3.09 },
  { name: "Chicken Noodle Soup", price: 3.89 },
];

const treatItems = [
  { name: "Chocolate Chunk Cookie", price: 1.39 },
  { name: "Icedream Cone", price: 1.49 },
  { name: "Chocolate Fudge Brownie", price: 1.89 },
];

// redirect to entrees menu page
app.get("/entrees", (req, res) => {
  res.render("menu/entrees", { entreeItems });
});

// redirect to drinks menu page
app.get("/drinks", (req, res) => {
  res.render("menu/drinks", { drinkItems });
});

// redirect to salads menu page
app.get("/salads", (req, res) => {
  res.render("menu/salads", { saladItems });
});

// redirect to sides menu page
app.get("/sides", (req, res) => {
  res.render("menu/sides", { sideItems });
});

// redirect to treats menu page
app.get("/treats", (req, res) => {
  res.render("menu/treats", { treatItems });
});

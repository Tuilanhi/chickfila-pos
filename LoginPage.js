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
    res.render("pages/dashboard", { user: userProfile, userRole });
  } else if (isServer()) {
    userRole = userRoles[1].role;
    res.render("pages/customerdashboard", { user: userProfile, userRoles });
  } else {
    userRole = userRoles[2].role;
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
  { name: "Chicken Sandwich", price: 4.49 },
  { name: "Deluxe Chicken Sandwich", price: 5.19 },
  { name: "Spicy Chicken Sandwich", price: 4.89 },
  { name: "Spicy Deluxe Chicken Sandwich", price: 5.59 },
  { name: "Chicken Nuggets (8 pieces)", price: 4.55 },
  { name: "Chicken Nuggets (12 pieces)", price: 6.29 },
  { name: "Grilled Nuggets (8 pieces)", price: 5.35 },
  { name: "Grilled Nuggets (12 pieces)", price: 7.69 },
  { name: "Grilled Chicken Sandwich", price: 6.15 },
  { name: "Grilled Chicken Club Sandwich", price: 7.79 },
  { name: "Grilled Chicken Cool Wrap", price: 7.45 },
];

const drinkItems = [
  { name: "Diet Lemonade (medium)", price: 2.39 },
  { name: "Diet Lemonade (large)", price: 2.89 },
  { name: "Regular Lemonade (medium)", price: 2.39 },
  { name: "Regular Lemonade (large)", price: 2.89 },
  { name: "Chick-fil-A Sunjoy (medium)", price: 2.39 },
  { name: "Chick-fil-A Sunjoy (large)", price: 2.89 },
  { name: "Soft Drink (medium)", price: 1.99 },
  { name: "Soft Drink (large)", price: 2.45 },
  { name: "Sweet Tea (medium)", price: 2.09 },
  { name: "Sweet Tea (large)", price: 2.39 },
  { name: "Unsweet Tea (medium)", price: 2.09 },
  { name: "Unsweet Tea (large)", price: 2.39 },
  { name: "Bottled Water", price: 1.95 },
  { name: "Cold Brew Iced Coffee", price: 3.09 },
];

const saladItems = [
  { name: "Market Salad", price: 9.45 },
  { name: "Spicy Southwest Salad", price: 9.45 },
  { name: "Cobb Salad", price: 9.25 },
];

const sideItems = [
  { name: "Side Salad", price: 3.79 },
  { name: "Fruit Cup", price: 3.79 },
  { name: "Waffle Potato Fries (small)", price: 1.89 },
  { name: "Waffle Potato Fries (medium)", price: 2.29 },
  { name: "Waffle Potato Fries (large)", price: 2.69 },
];

const treatItems = [
  { name: "Cookies & Cream Milkshake", price: 4.19 },
  { name: "Chocolate Milkshake", price: 4.19 },
  { name: "Strawberry Milkshake", price: 4.19 },
  { name: "Vanilla Milkshake", price: 4.19 },
  { name: "Frosted Lemonade", price: 4.09 },
  { name: "Frosted Coffee", price: 4.09 },
  { name: "Icecream Cone", price: 1.65 },
  { name: "Chocolate Chunk Cookie", price: 1.49 },
  { name: "Chocolate Fudge Brownie", price: 2.09 },
];

// redirect to entrees menu page
app.get("/entrees", (req, res) => {
  res.render("menu/entrees", { user: userProfile, entreeItems });
});

// redirect to drinks menu page
app.get("/drinks", (req, res) => {
  res.render("menu/drinks", { user: userProfile, drinkItems });
});

// redirect to salads menu page
app.get("/salads", (req, res) => {
  res.render("menu/salads", { user: userProfile, saladItems });
});

// redirect to sides menu page
app.get("/sides", (req, res) => {
  res.render("menu/sides", { user: userProfile, sideItems });
});

// redirect to treats menu page
app.get("/treats", (req, res) => {
  res.render("menu/treats", { user: userProfile, treatItems });
});

/*  EXPRESS */
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const Database = require("./Database");
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

async function storeAuth() {
  db = new Database();
  await db.connect();
  const sql =
    "INSERT INTO googleusers(email) SELECT ('" +
    String(userProfile.emails[0].value) +
    "') WHERE NOT EXISTS (SELECT 1 FROM googleusers WHERE email = '" +
    String(userProfile.emails[0].value) +
    "');";
  await db.query(sql);
  await db.disconnect();
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

// After logging in successfully the dashboard page will pop up
app.get("/dashboard", isLoggedIn, (req, res) => {
  res.render("pages/dashboard", { user: userProfile });
  storeAuth();
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

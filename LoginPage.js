/* MODULES */
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { RestockReport } from "./RestockReport.js";

import fetch from "node-fetch";
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const port = 3000;
const bodyParser = require("body-parser");
require("dotenv").config();

var userProfile;
var userRole = "";

/* STATIC HASHMAPS */

/* Roles Section */
const userRoles = [
  { role: "Manager" },
  { role: "Server" },
  { role: "Customer" },
];

/* Menu Section */
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

/*  Google AUTH  */
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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

/* MIDDLEWARE */

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("views"));

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.listen(port, () => console.log("App listening on port " + port));

/* Login Page Default*/
app.get("/", function (req, res) {
  res.render("pages/auth");
});

// Check if user is logged in
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// Checks to see if the user profile is a manager
function isManager() {
  const result = userProfile.emails[0].value;

  userRole = userRoles[0].role;

  // Returns true if the user profile is a manager, and false otherwise
  const manager = [
    "vuthuynhi@tamu.edu",
    "justin.a@tamu.edu",
    "pablopineda@tamu.edu",
    "raquel.oseguera@tamu.edu",
  ];
  return manager.includes(result);
}

// Checks to see if the user profile is a server
function isServer() {
  const result = userProfile.emails[0].value;

  userRole = userRoles[1].role;

  const server = ["vuthuynhi05@gmail.com", "justin.abraham@saseconnect.org"];

  return server.includes(result);
}

// Authenticate user's google credentials for customers
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

app.use(passport.initialize());
app.use(passport.session());

/* GOOGLE USERS SECTION */
app.get("/dashboard", isLoggedIn, (req, res) => {
  if (isManager()) {
    res.render("manager/dashboard", {
      userProfile,
      userRole,
      weather: null,
      error: null,
    });
  } else if (isServer()) {
    res.render("server/customerdashboard", {
      userProfile,
      userRole,
      weather: null,
      error: null,
    });
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

// Redirect to Menu Board page
app.get("/menuboard", function (req, res) {
  res.render("pages/menuboard");
});

// redirect to entrees menu page
app.get("/serverEntrees", (req, res) => {
  res.render("server/entrees", {
    userProfile,
    userRole,
    entreeItems,
    weather: null,
    error: null,
  });
});

// redirect to drinks menu page
app.get("/serverDrinks", (req, res) => {
  res.render("server/drinks", {
    userProfile,
    userRole,
    drinkItems,
    weather: null,
    error: null,
  });
});

// redirect to salads menu page
app.get("/serverSalads", (req, res) => {
  res.render("server/salads", {
    userProfile,
    userRole,
    saladItems,
    weather: null,
    error: null,
  });
});

// redirect to sides menu page
app.get("/serverSides", (req, res) => {
  res.render("server/sides", {
    userProfile,
    userRole,
    sideItems,
    weather: null,
    error: null,
  });
});

// redirect to treats menu page
app.get("/serverTreats", (req, res) => {
  res.render("server/treats", {
    userProfile,
    userRole,
    treatItems,
    weather: null,
    error: null,
  });
});

/* Weather API Section*/

const apiKey = `${process.env.WEATHER_API_KEY}`;

app.use(bodyParser.urlencoded({ extended: true }));

// This function takes in a page to render and output the weather upon request using openWeatherAPI
function renderWeather(req, res, page) {
  // Get city name passed in the form
  let city = req.body.city;

  // Use that city name to fetch data
  // Use the API_KEY in the '.env' file
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((weather) => {
      if (weather.main == undefined) {
        res.render(page, {
          userProfile,
          userRole,
          treatItems,
          entreeItems,
          drinkItems,
          sideItems,
          saladItems,
          weather: null,
          error: "Error, please try again",
        });
      } else {
        let place = `${weather.name}, ${weather.sys.country}`,
          weatherTimezone = `${new Date(
            weather.dt * 1000 - weather.timezone * 1000
          )}`;
        let weatherTemp = `${weather.main.temp}`,
          weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
          main = `${weather.weather[0].main}`,
          weatherFahrenheit;
        weatherFahrenheit = (weatherTemp * 9) / 5 + 32;

        function roundToTwo(num) {
          return +(Math.round(num + "e+2") + "e-2");
        }
        weatherFahrenheit = roundToTwo(weatherFahrenheit);

        if (isManager()) {
          userRole = userRoles[0].role;
        } else if (isServer()) {
          userRole = userRoles[1].role;
        }

        res.render(page, {
          userProfile,
          userRole,
          weather: weather,
          place: place,
          temp: weatherTemp,
          icon: weatherIcon,
          timezone: weatherTimezone,
          fahrenheit: weatherFahrenheit,
          main: main,
          error: null,
          treatItems,
          entreeItems,
          drinkItems,
          sideItems,
          saladItems,
        });
      }
    })
    .catch((err) => {
      res.render(page, {
        userProfile,
        userRole,
        treatItems,
        entreeItems,
        drinkItems,
        sideItems,
        saladItems,
        weather: null,
        error: "Error, please try again",
      });
    });
}

// On a post request, the app shall data from OpenWeatherMap using the given arguments

// render customer's dashboard to display weather
app.post("/dashboard", function (req, res) {
  if (isManager()) {
    renderWeather(req, res, "manager/dashboard");
  } else {
    renderWeather(req, res, "server/customerdashboard");
  }
});

// render entrees page to display weather
app.post("/serverEntrees", function (req, res) {
  renderWeather(req, res, "server/entrees");
});

// render drinks page to display weather
app.post("/serverDrinks", function (req, res) {
  renderWeather(req, res, "server/drinks");
});

// render salads page to display weather
app.post("/serverSalads", function (req, res) {
  renderWeather(req, res, "server/salads");
});

// render sides page to display weather
app.post("/serverSides", function (req, res) {
  renderWeather(req, res, "server/sides");
});

// render treats page to display weather
app.post("/serverTreats", function (req, res) {
  renderWeather(req, res, "server/treats");
});

/* GUEST CHECKOUT SECTION */
// Render the weather api for guest checkout
function guestRenderWeather(req, res, page) {
  // Get city name passed in the form
  let city = req.body.city;

  // Use that city name to fetch data
  // Use the API_KEY in the '.env' file
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((weather) => {
      if (weather.main == undefined) {
        res.render(page, {
          userRole,
          treatItems,
          entreeItems,
          drinkItems,
          sideItems,
          saladItems,
          weather: null,
          error: "Error, please try again",
        });
      } else {
        let place = `${weather.name}, ${weather.sys.country}`,
          weatherTimezone = `${new Date(
            weather.dt * 1000 - weather.timezone * 1000
          )}`;
        let weatherTemp = `${weather.main.temp}`,
          weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
          main = `${weather.weather[0].main}`,
          weatherFahrenheit;
        weatherFahrenheit = (weatherTemp * 9) / 5 + 32;

        function roundToTwo(num) {
          return +(Math.round(num + "e+2") + "e-2");
        }
        weatherFahrenheit = roundToTwo(weatherFahrenheit);

        userRole = userRoles[2].role;

        res.render(page, {
          userRole,
          weather: weather,
          place: place,
          temp: weatherTemp,
          icon: weatherIcon,
          timezone: weatherTimezone,
          fahrenheit: weatherFahrenheit,
          main: main,
          error: null,
          treatItems,
          entreeItems,
          drinkItems,
          sideItems,
          saladItems,
        });
      }
    })
    .catch((err) => {
      res.render(page, {
        userRole,
        treatItems,
        entreeItems,
        drinkItems,
        sideItems,
        saladItems,
        weather: null,
        error: "Error, please try again",
      });
    });
}

// Redirect to login page after signout
app.get("/customer", function (req, res) {
  userRole = userRoles[2].role;
  res.render("guest/customerdashboard", {
    userRole,
    drinkItems,
    weather: null,
    error: null,
  });
});

// redirect to entrees menu page
app.get("/entrees", (req, res) => {
  res.render("guest/entrees", {
    userRole,
    entreeItems,
    weather: null,
    error: null,
  });
});

// redirect to drinks menu page
app.get("/drinks", (req, res) => {
  res.render("guest/drinks", {
    userRole,
    drinkItems,
    weather: null,
    error: null,
  });
});

// redirect to salads menu page
app.get("/salads", (req, res) => {
  res.render("guest/salads", {
    userRole,
    saladItems,
    weather: null,
    error: null,
  });
});

// redirect to sides menu page
app.get("/sides", (req, res) => {
  res.render("guest/sides", {
    userRole,
    sideItems,
    weather: null,
    error: null,
  });
});

// redirect to treats menu page
app.get("/treats", (req, res) => {
  res.render("guest/treats", {
    userRole,
    treatItems,
    weather: null,
    error: null,
  });
});

// render customer's dashboard to display weather
app.post("/customer", function (req, res) {
  guestRenderWeather(req, res, "guest/customerdashboard");
});

// render entrees page to display weather
app.post("/entrees", function (req, res) {
  guestRenderWeather(req, res, "guest/entrees");
});

// render drinks page to display weather
app.post("/drinks", function (req, res) {
  guestRenderWeather(req, res, "guest/drinks");
});

// render salads page to display weather
app.post("/salads", function (req, res) {
  guestRenderWeather(req, res, "guest/salads");
});

// render sides page to display weather
app.post("/sides", function (req, res) {
  guestRenderWeather(req, res, "guest/sides");
});

// render treats page to display weather
app.post("/treats", function (req, res) {
  guestRenderWeather(req, res, "guest/treats");
});

/*MANAGER PAGE SECTION*/
app.get("/inventory", (req, res) => {
  res.render("manager/inventory", {
    userProfile,
    userRole,
    weather: null,
    error: null,
  });
});

app.get("/salesReport", (req, res) => {
  res.render("manager/salesReport", {
    userProfile,
    userRole,
    weather: null,
    error: null,
  });
});

app.get("/XReport", (req, res) => {
  res.render("manager/XReport", {
    userProfile,
    userRole,
    weather: null,
    error: null,
  });
});

app.get("/ZReport", (req, res) => {
  res.render("manager/ZReport", {
    userProfile,
    userRole,
    weather: null,
    error: null,
  });
});

app.get("/restockReport", (req, res) => {
  const restockReport = new RestockReport();

  restockReport
    .restock()
    .then((results) => {
      res.render("manager/restockReport", {
        results,
        userProfile,
        userRole,
        weather: null,
        error: null,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error fetching restock report");
    });
});

app.get("/excessReport", (req, res) => {
  res.render("manager/excessReport", {
    userProfile,
    userRole,
    weather: null,
    error: null,
  });
});

// render sales's dashboard to display weather
app.post("/salesReport", function (req, res) {
  renderWeather(req, res, "manager/salesReport");
});

app.post("/ZReport", function (req, res) {
  renderWeather(req, res, "manager/ZReport");
});

app.post("/XReport", function (req, res) {
  renderWeather(req, res, "manager/XReport");
});

app.post("/restockReport", function (req, res) {
  renderWeather(req, res, "manager/restockReport");
});

app.post("/excessReport", function (req, res) {
  renderWeather(req, res, "manager/excessReport");
});

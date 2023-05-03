/* MODULES */
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { RestockReport } from "./RestockReport.js";
import { Menu } from "./Menu.js";
import { Ingredients } from "./Ingredients.js";
import { NewMenuItem } from "./NewMenuItem.js";
import { XReport } from "./XReport.js";
import { ZReport } from "./ZReport.js";
import { SalesReport } from "./SalesReport.js";
import { ExcessReport } from "./ExcessReport.js";

import fetch from "node-fetch";
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const port = 10000;
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

/*  Google AUTH  */
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://csce315-project3-test.onrender.com/auth/google/callback",
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

app.use(express.static("views"));

app.set("view engine", "ejs");

app.set("trust proxy", 1);

app.use(
  session({
    cookie: {
      secure: true,
      maxAge: 60000,
    },
    store: new RedisStore(),
    secret: "secret",
    saveUninitialized: true,
    resave: false,
  })
);

app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error("Oh no")); //handle error
  }
  next(); //otherwise continue
});

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
app.use(bodyParser.urlencoded({ extended: true }));

// Redirect to Menu Board page
app.get("/menuboard", function (req, res) {
  res.render("pages/menuboard");
});

// If failed to login, redirect to error page
app.get("/error", (req, res) => res.render("pages/error"));

// After user had logged out, redirect to login page
app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

/* GOOGLE USERS SECTION */
app.get("/dashboard", isLoggedIn, async (req, res) => {
  if (isManager()) {
    const menu = new Menu();
    const inventory = new Ingredients();

    try {
      const [menuItems, inventoryItems] = await Promise.all([
        menu.displayMenu(),
        inventory.displayIngredients(),
      ]);

      res.render("manager/dashboard", {
        menuItems,
        inventoryItems,
        userProfile,
        userRole,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching data");
    }
  } else if (isServer()) {
    res.render("server/customerdashboard", {
      userProfile,
      userRole,
    });
  } else {
    res.render("pages/error");
  }
});

// On a post request, the app shall data from OpenWeatherMap using the given arguments
app.post("/dashboard", isLoggedIn, async (req, res) => {
  if (isManager()) {
    const menu = new Menu();
    const ingredients = new Ingredients();

    try {
      const itemName = req.body.itemName;
      const itemCategory = req.body.itemCategory;
      const itemPrice = req.body.itemPrice;

      await menu.setItem(itemName, itemPrice, itemCategory);

      await menu.removeItem(itemName);

      const ingredient = req.body.ingredient;
      const quantity = req.body.quantity;
      const type = req.body.type;
      const unit = req.body.unit;

      await ingredients.setItem(ingredient, quantity, type, unit);

      await ingredients.removeItem(ingredient);

      await res.send("Success");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating item");
    }
  }
});

/*SERVER SECTION*/

// redirect to entrees menu page
app.get("/serverEntrees", async (req, res) => {
  const entree = new Menu();

  try {
    const entreeItems = await entree.displayEntrees();

    res.render("server/entrees", {
      userRole,
      userProfile,
      entreeItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

// redirect to drinks menu page
app.get("/serverDrinks", async (req, res) => {
  const drink = new Menu();

  try {
    const drinkItems = await drink.displayDrinks();

    res.render("server/drinks", {
      userRole,
      userProfile,
      drinkItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

// redirect to salads menu page
app.get("/serverSalads", async (req, res) => {
  const salad = new Menu();

  try {
    const saladItems = await salad.displaySalads();

    res.render("server/salads", {
      userRole,
      userProfile,
      saladItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

// redirect to sides menu page
app.get("/serverSides", async (req, res) => {
  const side = new Menu();

  try {
    const sideItems = await side.displaySides();

    res.render("server/sides", {
      userRole,
      userProfile,
      sideItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

// redirect to treats menu page
app.get("/serverTreats", async (req, res) => {
  const treat = new Menu();

  try {
    const treatItems = await treat.displayTreats();

    res.render("server/treats", {
      userRole,
      userProfile,
      treatItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

/* GUEST CHECKOUT SECTION */

const apiKey = `${process.env.WEATHER_API_KEY}`;
// Render the weather api for guest checkout
function guestRenderWeather(req, res, page) {
  // Get city name passed in the form
  let city = req.body.city;

  // Use that city name to fetch data
  // Use the API_KEY in the '.env' file
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then(async (weather) => {
      const entree = new Menu();
      const drink = new Menu();
      const salad = new Menu();
      const side = new Menu();
      const treat = new Menu();

      const entreeItems = await entree.displayEntrees();
      const drinkItems = await drink.displayDrinks();
      const saladItems = await salad.displaySalads();
      const sideItems = await side.displaySides();
      const treatItems = await treat.displayTreats();
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
    weather: null,
    error: null,
  });
});

// redirect to entrees menu page
app.get("/entrees", async (req, res) => {
  const entree = new Menu();

  try {
    const entreeItems = await entree.displayEntrees();

    res.render("guest/entrees", {
      userRole,
      entreeItems: entreeItems,
      weather: null,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

// redirect to drinks menu page
app.get("/drinks", async (req, res) => {
  const drink = new Menu();

  try {
    const drinkItems = await drink.displayDrinks();

    res.render("guest/drinks", {
      userRole,
      drinkItems: drinkItems,
      weather: null,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

// redirect to salads menu page
app.get("/salads", async (req, res) => {
  const salad = new Menu();

  try {
    const saladItems = await salad.displaySalads();

    res.render("guest/salads", {
      userRole,
      saladItems: saladItems,
      weather: null,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

// redirect to sides menu page
app.get("/sides", async (req, res) => {
  const side = new Menu();

  try {
    const sideItems = await side.displaySides();

    res.render("guest/sides", {
      userRole,
      sideItems: sideItems,
      weather: null,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

// redirect to treats menu page
app.get("/treats", async (req, res) => {
  const treat = new Menu();

  try {
    const treatItems = await treat.displayTreats();

    res.render("guest/treats", {
      userRole,
      treatItems: treatItems,
      weather: null,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
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

/*MANAGER SECTION*/

app.get("/newMenuItem", async (req, res) => {
  const Item = new NewMenuItem();

  try {
    const items = await Item.displayItem();

    res.render("manager/newMenuItem", {
      items, // pass the items array to the view
      userProfile,
      userRole,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

app.post("/newMenuItem", async (req, res) => {
  const Item = new NewMenuItem();

  try {
    const itemName = req.body.itemName;
    const ingredient = req.body.ingredient;

    await Item.addNewItem(itemName, ingredient);

    res.send("Success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating table");
  }
});

app.get("/salesReport", async (req, res) => {
  const salesReport = new SalesReport();
  const startDate = "2022-01-01";
  const endDate = "2022-12-30";

  //call the itemSales method and pass the start and end dates as arguments
  const itemList = await salesReport.itemSales(startDate, endDate);

  res.render("manager/salesReport", {
    userProfile,
    userRole,
    itemList, //pass the itemList to the template
    startDate,
    endDate,
  });
});

app.post("/salesReport", async (req, res) => {
  const salesReport = new SalesReport();
  const { startDate, endDate } = req.body;
  const itemList = await salesReport.itemSales(startDate, endDate);

  res.render("manager/salesReport", {
    userProfile,
    userRole,
    itemList, //pass the itemList to the template
    startDate,
    endDate,
  });
});

app.get("/XReport", async (req, res) => {
  const xReport = new XReport();

  const results = await xReport.displayReport();

  res.render("manager/XReport", {
    userProfile,
    userRole,
    results,
  });
});

app.get("/ZReport", async (req, res) => {
  const zReport = new ZReport();

  const results = await zReport.displayReport();

  res.render("manager/ZReport", {
    userProfile,
    userRole,
    results,
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
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error fetching restock report");
    });
});

app.get("/excessReport", async (req, res) => {
  const excessReport = new ExcessReport();
  const startDate = "2022-01-01";
  const endDate = "2022-12-30";

  //call the itemSales method and pass the start and end dates as arguments
  const itemList = await excessReport.excessReport(startDate, endDate);

  res.render("manager/excessReport", {
    userProfile,
    userRole,
    itemList, //pass the itemList to the template
    startDate,
    endDate,
  });
});

app.post("/excessReport", async (req, res) => {
  const excessReport = new ExcessReport();
  const { startDate, endDate } = req.body;
  const itemList = await excessReport.excessReport(startDate, endDate);

  res.render("manager/excessReport", {
    userProfile,
    userRole,
    itemList, //pass the itemList to the template
    startDate,
    endDate,
  });
});

//Cart

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.post("/excessReport", function (req, res) {
  renderWeather(req, res, "manager/excessReport");
});

//Cart

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

var currentCart = [
  {
    name: "Chicken Sandwich",
    price: 5.99,
  },
  {
    name: "Waffle Fries",
    price: 2.49,
  },
  {
    name: "Lemonade",
    price: 1.99,
  },
];

//render the cart
app.get("/cart", (req, res) => {
  res.render("pages/cart", {
    user: userProfile,
    weather: null,
    error: null,
    items: null,
  });
});

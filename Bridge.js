import {createRequire } from "module";
const require = createRequire(import.meta.url);
const Database = require("./Database");

class Bridge {
    constructor(order) {
        this.db = new Database();
        this.parseCart(order);
        console.log('Opened database');
    }
  
    static connection() {
      // Building the connection with your credentials
      let conn = null;
      const teamNumber = "team_1";
      const dbName = "csce315331_" + teamNumber;
      const dbConnectionString = "jdbc:postgresql://csce-315-db.engr.tamu.edu/" + dbName;
      const user = "csce315331_team_1_master";
      const pswd = "TEAM_1";
  
      // Connecting to the database
      try {
        conn = new java.sql.DriverManager.getConnection(dbConnectionString, user, pswd);
      } catch (e) {
        console.error(e);
        process.exit(0);
      }
  
      console.log("Opened database successfully");
  
      return conn;
    }
  
     async parseCart(order) {
      this.connection();
      // console.log(order[0]);
      try {
        // if item name doesn't exist add new Item
        const stmt = this.connection().createStatement();
        // get names of existing items
        for (let i = 0; i < order.length; i++) {
          // console.log(order[i]);
          const sqlStatement = "select ingredients FROM bridge WHERE item ='" + order[i] + "'";
          const result = stmt.executeQuery(sqlStatement);
          result.next();
          const a = result.getArray("ingredients");
          const ing = a.getArray();
          // console.log(ing[0]);
          const ingredients = Array.from(ing);
          // console.log(ingredients);
          for (let j = 0; j < ingredients.length; j++) {
            this.decrementInventory(ingredients[j], stmt);
          }
        }
      } catch (e) {
        console.error(e);
        process.exit(0);
      }
  
      // close connection
      // closing the connection
      try {
        this.connection().close();
        console.log("Connection Closed.");
      } catch (e) {
        console.log("Connection NOT Closed.");
      }
    }
  
    decrementInventory(ingredient, stmt) {
      console.log(ingredient);
      const sqlStatement = "update ingredients set quantity = quantity - 1 where ingredient = '" + ingredient + "'";
      stmt.executeUpdate(sqlStatement);
    }

  }
  

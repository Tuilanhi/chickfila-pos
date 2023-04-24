import {createRequire } from "module";
const require = createRequire(import.meta.url);
const Database = require("./Database");

/**
 * It takes in an Array of Strings and calls the parseCart method.
 */
class RestockReport {
  constructor() {
    this.db = new Database();
    this.restock();
    console.log('Opened database');
  }

  /**
   * It connects to the database and returns a client object.
   *
   * @return A client object to the database.
   */


  async restock() {
    let result = null;
    try {
      //Inserting new Item into Bridge in database
      this.db.connect();
      console.log('Opened database successfully');
      const minimum = 150;
      const sqlStatement = `SELECT * FROM ingredients WHERE quantity <= ${minimum};`;
      result = await this.db.query(sqlStatement);

      result.forEach((row) => {
        console.log(`${row.ingredient} ${row.quantity} ${row.unit} ${row.type}`);
      });
    } catch (e) {
      console.error(e);
      process.exit(0);
    }
    await this.db.disconnect();
    return result;
  }
}

const report = new RestockReport();
module.exports = Database;

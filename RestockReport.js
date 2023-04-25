import { Database } from "./Database.js";

/**
 * It takes in an Array of Strings and calls the parseCart method.
 */
class RestockReport {
  constructor() {
    this.db = new Database();
    console.log("Opened database");
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
      console.log("Opened database successfully");
      const minimum = 150;
      const sqlStatement = `SELECT * FROM ingredients WHERE quantity <= ${minimum};`;
      result = await this.db.query(sqlStatement);

      for (let i = 0; i < result.length; i++) {
        console.log(
          `${result[i].ingredient} ${result[i].quantity} ${result[i].unit} ${result[i].type}`
        );
      }
    } catch (e) {
      console.error(e);
      process.exit(0);
    }
    await this.db.disconnect();
    return result;
  }
}

export { RestockReport };

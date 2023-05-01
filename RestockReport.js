import { Database } from "./Database.js";

/**
 * It takes in an Array of Strings and calls the parseCart method.
 */
class RestockReport {
  constructor() {
    this.db = new Database();
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
      await this.db.connect();
      const minimum = 150;
      const sqlStatement = `SELECT * FROM ingredients WHERE quantity <= ${minimum};`;
      result = await this.db.query(sqlStatement);
    } catch (e) {
      console.error(e);
      process.exit(0);
    }
    await this.db.disconnect();
    return result;
  }
}

export { RestockReport };

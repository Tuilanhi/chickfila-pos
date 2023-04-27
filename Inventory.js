import { Database } from "./Database.js";

class Inventory {
  constructor() {
    this.db = new Database();
  }

  async displayInventory() {
    let result = null;
    try {
      //Inserting new Item into Bridge in database
      this.db.connect();
      const sqlStatement = `SELECT * FROM ingredients;`;
      result = await this.db.query(sqlStatement);

      result.forEach((row) => {
        console.log(
          `${row.ingredient} ${row.quantity} ${row.unit} ${row.type}`
        );
      });
    } catch (e) {
      console.error(e);
      process.exit(0);
    }
    await this.db.disconnect();
    return result;
  }
}

export { Inventory };

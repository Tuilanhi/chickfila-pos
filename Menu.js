import { Database } from "./Database.js";

class Menu {
  constructor() {
    this.db = new Database();
  }

  async displayMenu() {
    await this.db.connect();
    let result = null;
    try {
      //Inserting new Item into Bridge in database
      const sqlStatement = `SELECT * FROM menu;`;
      result = await this.db.query(sqlStatement);
      console.log(result);
    } catch (e) {
      console.error(e);
      process.exit(0);
    }

    await this.db.disconnect();
    return result;
  }

  async setItem(Item, price, category) {
    try {
      await this.db.connect();
      // if item name doesn't exist add new Item
      // get names of existing items
      let sqlStatement = `SELECT COUNT(*) FROM menu WHERE item ='${Item}'`;
      let result = await this.db.query(sqlStatement);
      console.log(sqlStatement);
      console.log(result);
      console.log(result[0]["count"]);
      const count = result[0]["count"];
      // add item if it doesn't exists
      if (count === "0") {
        sqlStatement = `INSERT INTO menu (item, price, category) VALUES ('${Item}', ${price}, '${category}')`;
        let result_1 = await this.db.insert(sqlStatement);
      } else {
        // update item price if it exists
        console.log("WENT INTO ELSE STATEMENT");
        sqlStatement = `DELETE FROM menu WHERE item IN('${Item}')`;
        let result_1 = await this.db.delete(sqlStatement);
        sqlStatement = `INSERT INTO menu (item, price, category) VALUES ('${Item}', ${price}, '${category}')`;
        result_1 = await this.db.insert(sqlStatement);
      }

      sqlStatement = `SELECT * FROM menu;`;
      result = await this.db.query(sqlStatement);
      console.log(result);
      await this.db.disconnect();
    } catch (e) {
      console.error(e);
    }
  }

  async removeItem(Item) {
    let result = null;
    try {
      this.db.connect();
      let sqlStatement = `DELETE FROM menu WHERE item IN('${Item}')`;
      let result = await this.db.delete(sqlStatement);
      console.log("deleted item from menu");

      sqlStatement = `DELETE FROM bridge WHERE item IN('${Item}')`;
      result = await this.db.delete(sqlStatement);
      console.log("deleted item from bridge");
    } catch (e) {
      console.error(e);
    }
    await this.db.disconnect();
    return result;
  }
}

export { Menu };

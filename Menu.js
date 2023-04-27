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
      const count = result[0]["count"];
      // add item if it doesn't exists
      if (count === "0") {
        sqlStatement = `INSERT INTO menu (item, price, category) VALUES ('${Item}', ${price}, '${category}')`;
        await this.db.insert(sqlStatement);
      } else {
        // update item price if it exists
        console.log("WENT INTO ELSE STATEMENT");
        sqlStatement = `DELETE FROM menu WHERE item IN('${Item}')`;
        await this.db.delete(sqlStatement);
        sqlStatement = `INSERT INTO menu (item, price, category) VALUES ('${Item}', ${price}, '${category}')`;
        await this.db.insert(sqlStatement);
      }

      sqlStatement = `SELECT * FROM menu;`;
      await this.db.query(sqlStatement);
      await this.db.disconnect();
    } catch (e) {
      console.error(e);
    }
  }

  async removeItem(Item) {
    try {
      this.db.connect();
      let sqlStatement = `DELETE FROM menu WHERE item IN('${Item}')`;
      await this.db.delete(sqlStatement);

      sqlStatement = `DELETE FROM bridge WHERE item IN('${Item}')`;
      await this.db.delete(sqlStatement);
    } catch (e) {
      console.error(e);
    }
    await this.db.disconnect();
  }
}

export { Menu };

import { Database } from "./Database.js";

class Menu {
    constructor(Item, price, category) {
      this.setItem(Item, price, category);
    }
  
    constructor(Item) {
      this.removeItem(Item);
    }
  
    async setItem(Item, price, category) {
      try {
        // if item name doesn't exist add new Item
        // get names of existing items
        let sqlStatement = `SELECT COUNT(*) FROM menu WHERE item ='${Item}'`;
        const result = await this.db.query(sqlStatement);
        console.log(sqlStatement);
        console.log(result);
        console.log(result[0]['count']);
        const count = result[0]['count'];
        // add item if it doesn't exists
        if (count === '0') {
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
      } catch (e) {
        console.error(e);
      } 
    }
  
    async removeItem(Item) {
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
    }
  }
  

  // const Item = 'Chicken Feet';
  // const Price = 8.99;
  // const Category = 'Entrees'

  // const ChickenFeet = new Menu(Item);

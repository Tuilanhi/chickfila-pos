const Database = require("./Database");

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
        const sqlStatement = `SELECT COUNT(*) FROM menu WHERE item ='${Item}'`;
        const result = await this.db.query(sqlStatement);
        console.log(sqlStatement);
        console.log(result.getRow());
        result.next();
        const count = result.getInt("count");
        // add item if it doesn't exists
        if (count === 0) {
          sqlStatement = `INSERT INTO menu (item, price, category) VALUES ('${Item}', ${price}, '${category}')`;
          const result_1 = await this.db.insert(sqlStatement);
        } else {
          // update item price if it exists
          console.log("WENT INTO ELSE STATEMENT");
          sqlStatement = `DELETE FROM menu WHERE id IN('${Item}')`;
          let result_1 = await this.db.delete(sqlStatement);
          const sqlStatement = `INSERT INTO menu (item, price, category) VALUES ('${Item}', ${price}, '${category}')`;
          result_1 = await this.db.insert(sqlStatement);
        }
      } catch (e) {
        console.error(e);
      } 
    }
  
    async removeItem(Item) {
      try {
        const stmt = conn.createStatement();
        const sqlStatement = `DELETE FROM menu WHERE item IN('${Item}')`;
        let result = await this.db.delete(sqlStatement);
        console.log("deleted item from menu");
  
        sqlStatement = `DELETE FROM bridge WHERE item IN('${Item}')`;
        result = await this.db.delete(sqlStatement);
        console.log("deleted item from bridge");
      } catch (e) {
        console.error(e);
      } 
    }
  }
  
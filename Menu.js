import { Database } from "./Database.js";

class Menu {
    constructor(Item, price=0, category=0) {
      this.db = new Database();
      this.Item = Item;
      this.price = price;
      this.category = category;
      if(price == 0 & category == 0){
        this.removeItem(Item);
      }
      else {
        this.setItem(Item, price, category);
      }
    }
  
    async setItem(Item, price, category) {
      try {
        this.db.connect();
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
      await this.db.disconnect();
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
  

  const Item = 'Chicken Feet';
  const Price = 8.99;
  const Category = 'Entrees'

  const ChickenFeet = new Menu(Item, Price, Category);

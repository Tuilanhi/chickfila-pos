import {createRequire } from "module";
import {Database} from "./Database.js";
const require = createRequire(import.meta.url);

class Bridge {
    constructor(order) {
        this.db = new Database();
        console.log('Opened database');
        this.order = order;
        this.parseCart(order);
    
    }
  
   

  
     async parseCart(order) {
        let result = null;
      try {
        // if item name doesn't exist add new Item
        //const stmt = this.db.connect().createStatement();
        this.db.connect();
        console.log('Opened database successfully');
        // get names of existing items
        let i = 0;
        while (i < order.length) {
            console.log(order.length);
            console.log(order[i]);
          const sqlStatement = `SELECT ingredients FROM bridge WHERE item = '${order[i]}'`;
          result = await this.db.query(sqlStatement);
          //const NewResult = result.toString();

          //NewResult = NewResult.replace(/[\[\]']+/g,'');

          //console.log(NewResult);
          //result.next();
         // const a = result.getArray("ingredients");
          //const ing = a.getArray();
          //console.log(ing[0]);
          const ingredient = Array.from(result[0].ingredients);
          console.log(ingredient);
          for (let j = 0; j < ingredient.length; j++) {
            this.decrementInventory(ingredient[j], this.db);
          }
          i++;
        }
      } catch (e) {
        console.error(e);
        process.exit(0);
      }
     // close connection
      // closing the connection
      try {
        this.db.disconnect();
        console.log("Connection Closed.");
      } catch (e) {
        console.log("Connection NOT Closed.");
      }
      
    }
  
    decrementInventory(ingredient, stmt) {
      const sqlStatement = `update ingredients set quantity = quantity - 1 where ingredient = '${ingredient}'`;
      this.db.query(sqlStatement);
    }

    

  }

  const order = ["Chicken Sandwich","Fruit Cup"];
  const run = new Bridge(order);
  export {Bridge};


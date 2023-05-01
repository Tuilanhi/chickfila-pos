import {createRequire } from "module";
import {Database} from "./Database.js";
import {Bridge} from "./Bridge.js";
const require = createRequire(import.meta.url);


class ExcessReport {
    constructor(date1, date2) {
      this.db = new Database;
      this.date1 = date1;
      this.date2 = date2;
      this.excessReport(date1, date2);
    }


    async excessReport(date1, date2) {
      this.db.connect();
      console.log('Opened database successfully');
    

    const itemList = [
      ['Chicken Sandwich', 0], ['Deluxe Chicken Sandwich', 0], ['Spicy Chicken Sandwich', 0],
       ['Spicy Deluxe Chicken Sandwich', 0], ['Chicken Nuggets (8 pieces)', 0], ['Chicken Nuggets (12 pieces)', 0],
      ['Grilled Nuggets (8 pieces)',0], ['Grilled Nuggets (12 pieces)',0], ['Grilled Chicken Sandwich', 0],
       ['Grilled Chicken Club Sandwich',0], ['Grilled Chicken Cool Wrap', 0], ['Market Salad', 0],
       ['Spicy Southwest Salad',0], ['Cobb Salad', 0], ['Side Salad', 0], ['Fruit Cup',0],
       ['Waffle Potato Fries (small)', 0], ['Waffle Potato Fries (medium)',0],
       ['Waffle Potato Fries (large)', 0], ['Cookies & Cream Milkshake', 0],
       ['Chocolate Milkshake', 0], ['Strawberry Milkshake', 0], ['Vanilla Milkshake', 0], 
       ['Frosted Lemonade', 0], ['Frosted Coffee', 0], ['Icecream Cone', 0], ['Chocolate Chunk Cookie', 0],
       ['Chocolate Fudge Brownie', 0], ['Diet Lemonade (medium)', 0], ['Diet Lemonade (large)', 0],
       ['Regular Lemonade (medium)', 0], ['Regular Lemonade (large)', 0], ['Chick-fil-A Sunjoy (medium)', 0], 
       ['Chick-fil-A Sunjoy (large)', 0], ['Soft Drink (medium)', 0], ['Soft Drink (large)', 0],
       ['Sweet Tea (medium)', 0], ['Sweet Tea (large)', 0], ['Unsweet Tea (medium)', 0], ['Unsweet Tea (large)', 0],
       ['Bottled Water', 0], ['Cold Brew Iced Coffee', 0]]


  //Creating query for time range 
  const sqlStatement = `SELECT * FROM chickfila_sales WHERE days BETWEEN '${date1}' AND '${date2}'`;
  let result = await this.db.query(sqlStatement);

  const ingredientQuantity = []
  const ingredientOrdered = []

  const sqlStatement2 = `SELECT * FROM ingredients`;
    const result2 = await this.db.query(sqlStatement2);

  //filling in double array with quantity
  for (let i = 0; i < result2.length; i++) {
    const name = result2[i].ingredient;
    //console.log(name);
    const quantity = result2[i].quantity;
    const add = [name, quantity];
    ingredientOrdered.push([name,0]);
    ingredientQuantity.push(add);
  }
  //console.log(ingredientQuantity);


  //going through all orders within the date range
  for (let i = 0; i < result.length; i++) {
      //getting an array of all items in an order
      const itemsOrdered = Array.from(result[i].item);
      
      //const inv = new Bridge(result[i]);
      for (let j = 0; j < itemsOrdered.length; j++) {
          const itemName = itemsOrdered[j];
          const item = itemName.replace(/'/g, "");
          //console.log(item);
          for (let k = 0; k < itemList.length; k++) {
              if (itemList[k][0] == item) {
                  //adding it to the count in double array
                  itemList[k][1] = itemList[k][1] + 1;
                  //console.log(itemList[k][1]);
              }
          }
          //console.log(itemName)
      }
    }

    //console.log(itemList);

    for(let i = 0; i < itemList.length; i++) {
      //console.log(itemList[i]);
      const sqlStatement3 = `SELECT ingredients FROM bridge WHERE item = '${itemList[i][0]}'`;
      const result3 = await this.db.query(sqlStatement3);
      const ingrList = result3[0].ingredients;
      //console.log(ingrList);
      for (let j = 0; j < ingrList.length; j++) {
        for (let k = 0; k < ingredientOrdered.length; k++) {
          if (ingrList[j] == ingredientOrdered[k][0]) {
            ingredientOrdered[k][1]=1*itemList[i][1];
          }
        }
      }
    }

    //console.log(result3)

    //console.log(ingredientOrdered);

    //checking which items have sold less than 10%
    let undersoldItems = [];
    for (let i = 0; i < ingredientOrdered.length; i++) {
      const sold = ingredientOrdered[i][1];
      const inv = ingredientQuantity[i][1];

      const div = parseFloat(sold/inv);
      const percent = parseFloat(div*100);
      //console.log(percent);

      if (percent < 10) {
        undersoldItems.push(ingredientOrdered[i][0]);
      }
    }
   
    console.log(undersoldItems);

    // Close the connection and the statement
    this.db.disconnect();
  }

}


//const date1 = "2022-10-03";
//const date2 = "2022-10-07";

//const run = new ExcessReport(date1, date2);
export {ExcessReport};
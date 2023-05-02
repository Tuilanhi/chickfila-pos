import { Database } from "./Database.js";

class ExcessReport {
  constructor() {
    this.db = new Database();
  }

  async excessReport(date1, date2) {
    try {
      await this.db.connect();

      const itemList = [
        ["Chicken Sandwich", 0],
        ["Deluxe Chicken Sandwich", 0],
        ["Spicy Chicken Sandwich", 0],
        ["Spicy Deluxe Chicken Sandwich", 0],
        ["Chicken Nuggets (8 pieces)", 0],
        ["Chicken Nuggets (12 pieces)", 0],
        ["Grilled Nuggets (8 pieces)", 0],
        ["Grilled Nuggets (12 pieces)", 0],
        ["Grilled Chicken Sandwich", 0],
        ["Grilled Chicken Club Sandwich", 0],
        ["Grilled Chicken Cool Wrap", 0],
        ["Market Salad", 0],
        ["Spicy Southwest Salad", 0],
        ["Cobb Salad", 0],
        ["Side Salad", 0],
        ["Fruit Cup", 0],
        ["Waffle Potato Fries (small)", 0],
        ["Waffle Potato Fries (medium)", 0],
        ["Waffle Potato Fries (large)", 0],
        ["Cookies & Cream Milkshake", 0],
        ["Chocolate Milkshake", 0],
        ["Strawberry Milkshake", 0],
        ["Vanilla Milkshake", 0],
        ["Frosted Lemonade", 0],
        ["Frosted Coffee", 0],
        ["Icecream Cone", 0],
        ["Chocolate Chunk Cookie", 0],
        ["Chocolate Fudge Brownie", 0],
        ["Diet Lemonade (medium)", 0],
        ["Diet Lemonade (large)", 0],
        ["Regular Lemonade (medium)", 0],
        ["Regular Lemonade (large)", 0],
        ["Chick-fil-A Sunjoy (medium)", 0],
        ["Chick-fil-A Sunjoy (large)", 0],
        ["Soft Drink (medium)", 0],
        ["Soft Drink (large)", 0],
        ["Sweet Tea (medium)", 0],
        ["Sweet Tea (large)", 0],
        ["Unsweet Tea (medium)", 0],
        ["Unsweet Tea (large)", 0],
        ["Bottled Water", 0],
        ["Cold Brew Iced Coffee", 0],
      ];

      //Creating query for time range
      const sqlStatement = `SELECT * FROM chickfila_sales WHERE days BETWEEN '${date1}' AND '${date2}'`;
      let result = await this.db.query(sqlStatement);

      const ingredientQuantity = [];
      const ingredientOrdered = [];

      const sqlStatement2 = `SELECT * FROM ingredients`;
      const result2 = await this.db.query(sqlStatement2);

      //filling in double array with quantity
      for (let i = 0; i < result2.length; i++) {
        const name = result2[i].ingredient;
        const quantity = result2[i].quantity;
        const add = [name, quantity];
        ingredientOrdered.push([name, 0]);
        ingredientQuantity.push(add);
      }

      //going through all orders within the date range
      for (let i = 0; i < result.length; i++) {
        //getting an array of all items in an order
        const itemsOrdered = Array.from(result[i].item);

        for (let j = 0; j < itemsOrdered.length; j++) {
          const itemName = itemsOrdered[j];
          const item = itemName.replace(/'/g, "");
          for (let k = 0; k < itemList.length; k++) {
            if (itemList[k][0] == item) {
              //adding it to the count in double array
              itemList[k][1] = itemList[k][1] + 1;
            }
          }
        }
      }

      for (let i = 0; i < itemList.length; i++) {
        const sqlStatement3 = `SELECT ingredients FROM bridge WHERE item = '${itemList[i][0]}'`;
        const result3 = await this.db.query(sqlStatement3);
        const ingrList = result3[0].ingredients;

        for (let j = 0; j < ingrList.length; j++) {
          for (let k = 0; k < ingredientOrdered.length; k++) {
            if (ingrList[j] == ingredientOrdered[k][0]) {
              ingredientOrdered[k][1] = 1 * itemList[i][1];
            }
          }
        }
      }

      //checking which items have sold less than 10%
      //list of undersold items
      let undersoldItems = [];
      for (let i = 0; i < ingredientOrdered.length; i++) {
        const sold = ingredientOrdered[i][1];
        const inv = ingredientQuantity[i][1];

        const div = parseFloat(sold / inv);
        const percent = parseFloat(div * 100);
        console.log(percent);

        if (percent < 10) {
          undersoldItems.push([ingredientOrdered[i][0], percent]);
        }
      }

      console.log(undersoldItems);

      // Close the connection and the statement
      await this.db.disconnect();
      return undersoldItems;
    } catch (err) {
      console.error(err);
    }
  }
}

export { ExcessReport };

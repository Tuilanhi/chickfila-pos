import { Database } from "./Database.js";

class SalesReport {
  constructor() {
    this.db = new Database();
  }

  async itemSales(date1, date2) {
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

      //going through all orders within the date range
      for (let i = 0; i < result.length; i++) {
        //getting an array of all items in an order
        const itemsOrdered = Array.from(result[i].item);
        for (let j = 0; j < itemsOrdered.length; j++) {
          const itemName = itemsOrdered[j];
          const item = itemName.replace(/'/g, "");
          //console.log(item);
          for (let k = 0; k < itemList.length; k++) {
            if (itemList[k][0] == item) {
              //adding it to the count in double array
              itemList[k][1] = itemList[k][1] + 1;
            }
          }
        }
      }
      // Close the connection and the statement
      await this.db.disconnect();

      //return the itemList
      return itemList;
    } catch (err) {
      console.error(err);
    }
  }
}

export { SalesReport };

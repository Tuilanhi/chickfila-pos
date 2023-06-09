import { Database } from "./Database.js";
import { RestockReport } from "./RestockReport.js";
import { Menu } from "./Menu.js";
import { Ingredients } from "./Ingredients.js";
import { NewMenuItem } from "./NewMenuItem.js";
import { XReport } from "./XReport.js";
import { SalesReport } from "./SalesReport.js";
import { ExcessReport } from "./ExcessReport.js";
import { Checkout } from "./Checkout.js";
class testDatabase {
  constructor() {
    this.db = new Database();
  }

  async getFirstFiveItems(command) {
    await this.db.connect();

    const sql = command;
    const items = await this.db.query(sql);

    await this.db.disconnect();

    return items;
  }
}

async function main() {
  // const ingredient = new Ingredients();
  // ingredient.removeIngredient("Beef Slice");
  // const menu = new Menu();
  // menu.removeItem("Beef Sandwich");
  // const report = new ExcessReport();
  // const x = report.excessReport("2022-01-01", "2022-01-04");

  const order = new Checkout();
  order.toSales([
    { name: "Spicy Chicken Sandwich", price: "4.99" },
    { name: "Chicken Sandwich", price: "4.99" },
  ]);
}

main();

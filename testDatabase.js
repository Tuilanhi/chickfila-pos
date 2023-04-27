import { Database } from "./Database.js";
import { RestockReport } from "./RestockReport.js";
import { Menu } from "./Menu.js";
import { Inventory } from "./Inventory.js";

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
  // const menu = new testDatabase();
  // const items = await menu.getFirstFiveItems("SELECT * FROM menu LIMIT 5;");
  // console.log(items);

  // const result = new Inventory();
  // const rows = result.displayInventory();
  // console.log(rows);

  const result_1 = new Menu();
  console.log(result_1.setItem("Chicken Feet", 13.99, "Entrees"));
  const test = result_1.displayMenu();
  console.log(test);
}

main();

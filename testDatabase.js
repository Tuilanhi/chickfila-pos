import { Database } from "./Database.js";
import { RestockReport } from "./RestockReport.js";
import { Menu } from "./Menu.js";
import { Inventory } from "./Inventory.js";
import { NewMenuItem } from "./NewMenuItem.js";

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
  const bridge = new NewMenuItem();

  const newItem = "Chicken Spicy Strip Sandwich";
  const Ingr =
    "Sesame Buns-pieces-food,Chicken Strip-pieces-food,Chicken Strip-pieces-food,Lettuce-pieces-food,Tomatoes-pieces-food,Cheese-pieces-food,Pickles-pieces-food,Pickles-pieces-food";

  bridge.addNewItem(newItem, Ingr);
}

main();

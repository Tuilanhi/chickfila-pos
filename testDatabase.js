import { Database } from "./Database.js";
import { RestockReport } from "./RestockReport.js";
import { Menu } from "./Menu.js";
import { Ingredients } from "./Ingredients.js";
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
  const ingredient = new Ingredients();
  ingredient.removeIngredient("Beef Slice");
}

main();

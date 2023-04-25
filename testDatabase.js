import { Database } from "./Database.js";
import { RestockReport } from "./RestockReport.js";

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
  const menu = new testDatabase();
  const items = await menu.getFirstFiveItems("SELECT * FROM menu LIMIT 5;");
  console.log(items);

  const result = new RestockReport();
  const rows = result.restock();
}

main();

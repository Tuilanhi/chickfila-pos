const { del } = require("request");
const Database = require("./Database");

class testDatabase {
  constructor() {
    this.db = new Database();
  }

  async getFirstFiveItems(command) {
    const sql = command;
    const items = await this.db.query(sql);

    return items;
  }

}

async function main() {
  const menu = new testDatabase();
  menu.db.connect();
  
  const items = await menu.getFirstFiveItems("SELECT * FROM ingredients;");

  const del_sql = "DELETE FROM ingredients WHERE ingredient IN('Salt');";
  const ins_sql = "INSERT INTO ingredients (ingredient, quantity, unit, type) VALUES ('Salt', 200, 'gallons', 'food');";
  menu.db.delete(del_sql);

  
  await menu.db.disconnect();
  console.log(items);
}

main();

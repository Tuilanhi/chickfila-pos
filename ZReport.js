import { Database } from "./Database.js";

class ZReport {
  constructor() {
    this.db = new Database();
  }

  async displayReport() {
    try {
      await this.db.connect();
      // if item name doesn't exist add new Item
      // get names of existing items
      let sqlStatement =
        "SELECT days, SUM(totalsales) as totalsales FROM chickfila_sales GROUP BY days Order BY days";
      const result = await this.db.query(sqlStatement);

      await this.db.disconnect();
      return result;
    } catch (e) {
      console.error(e);
    }
  }
}

export { ZReport };

import { Database } from "./Database.js";

class XReport {
  constructor() {
    this.db = new Database();
  }

  async displayReport() {
    let result = null;
    try {
      await this.db.connect();
      const sqlStatement = `SELECT * FROM chickfila_sales;`;
      result = await this.db.query(sqlStatement);

      await this.db.disconnect();
      return result;
    } catch (err) {
      console.error(err);
    }
  }
}

export { XReport };

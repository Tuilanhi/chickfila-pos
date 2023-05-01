import { Database } from "./Database.js";

class Ingredients {
  constructor() {
    this.db = new Database();
  }

  async displayIngredients() {
    await this.db.connect();
    let result = null;
    try {
      //Inserting new Item into Bridge in database
      const sqlStatement = `SELECT * FROM ingredients;`;
      result = await this.db.query(sqlStatement);
    } catch (e) {
      console.error(e);
      process.exit(0);
    }

    await this.db.disconnect();
    return result;
  }

  async setItem(ingredient, quantity, unit, type) {
    try {
      await this.db.connect();
      let sqlStatement = `SELECT COUNT(*) FROM ingredients WHERE ingredient ='${ingredient}'`;
      let result = await this.db.query(sqlStatement);
      const count = result[0]["count"];
      // add item if it doesn't exist
      if (count === "0") {
        sqlStatement = `INSERT INTO ingredients (ingredient, quantity, unit, type) VALUES ('${ingredient}', '${quantity}', '${unit}', '${type}')`;
        await this.db.insert(sqlStatement);
      } else {
        sqlStatement = `DELETE FROM ingredients WHERE ingredient IN('${ingredient}')`;
        await this.db.delete(sqlStatement);
        sqlStatement = `INSERT INTO ingredients (ingredient, quantity, unit, type) VALUES ('${ingredient}', '${quantity}', '${unit}', '${type}')`;
        await this.db.insert(sqlStatement);
      }
    } catch (err) {
      console.error(err);
    }
    await this.db.disconnect();
  }

  async removeItem(ingredient) {
    try {
      await this.db.connect();
      let sqlStatement = `DELETE FROM ingredients WHERE ingredient IN('${ingredient}')`;
      await this.db.delete(sqlStatement);
    } catch (err) {
      console.error(err);
    }
    await this.db.disconnect();
  }
}

// const ingredient = new Ingredients('carrot', 10, 'lbs', 'vegetable');
// ingredient.setItem();
// ingredient.removeItem();

export { Ingredients };

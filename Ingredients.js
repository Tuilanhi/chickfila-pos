import { Database } from "./Database.js";

class Ingredients {
  constructor() {
    this.db = new Database();
  }

  async setItem(ingredient, quantity, unit, type) {
    try {
      await this.db.connect();
      let sqlStatement = ('SELECT COUNT(*) FROM ingredients WHERE ingredient=$1', [ingredient]);
      let result = await this.db.query(sqlStatement);
      console.log(sqlStatement);
      console.log(result);
      console.log(result[0]["count"]);
      const count = result[0]["count"];
      // add item if it doesn't exist
      if (count === "0") {
        sqlStatement = ('INSERT INTO ingredients (ingredient, quantity, unit, type) VALUES ($1, $2, $3, $4)', [ingredient, quantity, unit, type]);
        let result_1 = await this.db.insert(sqlStatement);
        console.log('added');
      } else {
        sqlStatement = ('DELETE FROM ingredients WHERE igredient IN($1)', [ingredient]);
        let result_1 = await this.db.delete(sqlStatement);
        sqlStatement = ('INSERT INTO ingredients (ingredient, quantity, unit, type) VALUES ($1, $2, $3, $4)', [ingredient, quantity, unit, type]);
        result_1 = await this.db.insert(sqlStatement);
        console.log('updated');
      }
    } catch (err) {
      console.error(err);
    }
    await this.db.disconnect();
  }

  async removeItem(ingredient) {
    try {
      await this.db.connect();
      let sqlStatement = ('DELETE FROM ingredients WHERE igredient IN($1)', [ingredient]);
      let result = await this.db.delete(sqlStatement);
      console.log('deleted');
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
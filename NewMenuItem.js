import { createRequire } from "module";
import { Database } from "./Database.js";
const require = createRequire(import.meta.url);

/**
 * It takes in an array of strings and calls the addNewItem method
 */
class NewMenuItem {
  constructor() {
    this.db = new Database();
  }

  async displayItem() {
    await this.db.connect();
    let result = null;
    try {
      const sqlStatement = `SELECT * FROM bridge;`;
      result = await this.db.query(sqlStatement);
    } catch (e) {
      console.error(e);
      process.exit(0);
    }
    await this.db.disconnect();
    return result; // return the rows from the result object
  }

  async addNewItem(itemName, ingredients) {
    let seperatedIngredients = new Array(3);
    let newIngredientsArray_2 = ingredients.split(",");
    let Ingredients = "";
    let size = 0;

    for (let c of newIngredientsArray_2) {
      size++;
    }

    let newIngredientsArray = new Array(size).fill(0).map(() => new Array(3));

    for (let i = 0; i < size; i++) {
      seperatedIngredients = newIngredientsArray_2[i].split("-");
      newIngredientsArray[i] = seperatedIngredients;
    }

    for (let c of newIngredientsArray) {
      const item = c[0];
      Ingredients += c[0] + ", ";
    }
    // String of all Items
    Ingredients = Ingredients.substring(0, Ingredients.length - 2);

    try {
      // Inserting new Item into Bridge in database
      this.db.connect();
      console.log("Opened database successfully");
      let sqlStatement =
        "INSERT INTO Bridge (item, ingredients) VALUES ('" +
        itemName +
        "', '{" +
        Ingredients +
        "}')";
      const res = await this.db.query(sqlStatement);
      console.log("Added New Item to Bridge");
      console.log(Ingredients);

      // Check if all items are in ingredients table in database
      for (const c of newIngredientsArray) {
        const Ingredient = c[0];
        const Unit = c[1];
        const Type = c[2];
        sqlStatement = `SELECT COUNT(*) FROM ingredients WHERE ingredient ='${Ingredient}'`;

        // call methods that might throw SQLException
        const result_1 = await this.db.query(sqlStatement);
        const count = result_1[0].count;
        // add item if it doesn't exists

        if (count == 0) {
          sqlStatement = `INSERT INTO ingredients (Ingredient, Quantity, Unit, Type) VALUES ('${Ingredient}', 500, '${Unit}', '${Type}')`;
          await this.db.query(sqlStatement);
          console.log("added");
        }
      }
      sqlStatement = `SELECT * FROM bridge;`;
      await this.db.query(sqlStatement);
      await this.db.disconnect();
    } catch (e) {
      console.log(e);
    }
  }
}

export { NewMenuItem };

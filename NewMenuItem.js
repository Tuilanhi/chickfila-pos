const Database = require("./Database");

/**
 * It takes in an array of strings and calls the addNewItem method
 */
class NewMenuItem {
  constructor(newItem, newIngredients) {
    this.db = new Database();
    this.newItem = newItem;
    this.newIngredients = newIngredients;
    this.newIngredientsArray = [];
    this.addNewItem(newItem, newIngredients);
  }

  

  async addNewItem(itemName, ingredients) {
    const newIngredientsArray = ingredients.split(',');
    const items = [];
    for (let i = 0; i < newIngredientsArray.length; i++) {
      const splitted = newIngredientsArray[i].split('-');
      const item = {
        ingredient: splitted[0],
        quantity: 500,
        unit: splitted[1],
        type: splitted[2],
      };
      items.push(item);
    }

    try {
      console.log('Opened database successfully');

      // Inserting new Item into Bridge in database
      const sqlStatement = `INSERT INTO Bridge (item, ingredients) VALUES ('${itemName}', '{${ingredients}}')`;
      const res = await this.db.query(sqlStatement);
      console.log('Added New Item to Bridge');
      console.log(ingredients);

      // Check if all items are in ingredients table in database
      for (const c of newIngredientsArray) {
        const Ingredient = c[0];
        const Unit = c[1];
        const Type = c[2];
        const sqlStatement = `SELECT COUNT(*) FROM ingredients WHERE ingredient ='${Ingredient}'`;

        // call methods that might throw SQLException
        const result_1 = await this.db.query(sqlStatement);
        const count = result_1[0].count;
        // add item if it doesn't exists
        if (count === 0) {
          const sqlStatement = `INSERT INTO ingredients (Ingredient, Quantity, Unit, Type) VALUES ('${Ingredient}', 500, '${Unit}', '${Type}')`;
          const result_2 = await this.db.query(sqlStatement);
          console.log('added');
        }
    }


    } catch (e) {
      console.error('Error while adding new item:', e);
      throw e;
    }
  }
}

const newItem = 'Chicken Strip Sandwich';
const Ingr =
  'Bun-pieces-food,Chicken Strip-pieces-food,Chicken Strip-pieces-food,Lettuce-pieces-food,Tomatoes-pieces-food,Cheese-pieces-food,Pickles-pieces-food,Pickles-pieces-food';

const chickenStripSammy = new NewMenuItem(newItem, Ingr);
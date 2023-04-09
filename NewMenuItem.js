const { Client } = require('pg');

/**
 * It takes in an array of strings and calls the addNewItem method
 */
class NewMenuItem {
  constructor(newItem, newIngredients) {
    this.newItem = newItem;
    this.newIngredients = newIngredients;
    this.newIngredientsArray = [];
    this.addNewItem(newItem, newIngredients);
  }

  /*
   * It connects to the database and returns a client object
   *
   * @return A client object to the database.
   */
  async connect() {
    // Building the connection with your credentials
    const client = new Client({
      user: 'csce315331_team_1_master',
      host: 'csce-315-db.engr.tamu.edu',
      database: 'csce315331_team_1',
      password: 'TEAM_1',
      port: 5432,
    });

    // Connecting to the database
    try {
      await client.connect();
    } catch (e) {
      console.error('Error connecting to the database:', e);
      throw e;
    }

    console.log('Database connection successful');

    return client;
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
      const client = await this.connect();
      // Inserting new Item into Bridge in database
      const sqlStatement = `INSERT INTO Bridge (item, ingredients) VALUES ('${itemName}', '{${ingredients}}')`;
      const res = await client.query(sqlStatement);
      console.log('Added New Item to Bridge');
      console.log(ingredients);

      // Check if all items are in ingredients table in database
      for (const c of newIngredientsArray) {
        const Ingredient = c[0];
        const Unit = c[1];
        const Type = c[2];
        const sqlStatement = `SELECT COUNT(*) FROM ingredients WHERE ingredient ='${Ingredient}'`;

        // call methods that might throw SQLException
        const result_1 = await client.query(sqlStatement);
        const count = result_1.rows[0].count;
        // add item if it doesn't exists
        if (count === 0) {
          const sqlStatement = `INSERT INTO ingredients (Ingredient, Quantity, Unit, Type) VALUES ('${Ingredient}', 500, '${Unit}', '${Type}')`;
          const result_2 = await client.query(sqlStatement);
          console.log('added');
        }
      }
      await client.end();
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
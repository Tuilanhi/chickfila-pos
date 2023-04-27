import { Database } from "./Database.js";

class Ingredients {
  constructor(ingredient, quantity, unit, type) {
    this.ingredient = ingredient;
    this.quantity = quantity;
    this.unit = unit;
    this.type = type;

    this.client.connect();
  }

  async setItem() {
    try {
      const res = await this.client.query(
        'SELECT COUNT(*) FROM ingredients WHERE ingredient=$1',
        [this.ingredient]
      );
      const count = res.rows[0].count;

      if (count === 0) {
        await this.client.query(
          'INSERT INTO ingredients (ingredient, quantity, unit, type) VALUES ($1, $2, $3, $4)',
          [this.ingredient, this.quantity, this.unit, this.type]
        );
        console.log('added');
      } else {
        await this.client.query(
          'UPDATE ingredients SET quantity=$1, unit=$2, type=$3 WHERE ingredient=$4',
          [this.quantity, this.unit, this.type, this.ingredient]
        );
        console.log('updated');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async removeItem() {
    try {
      await this.client.query(
        'DELETE FROM ingredients WHERE ingredient=$1',
        [this.ingredient]
      );
      console.log('deleted');
    } catch (err) {
      console.error(err);
    }
  }
}

const ingredient = new Ingredients('carrot', 10, 'lbs', 'vegetable');
ingredient.setItem();
ingredient.removeItem();

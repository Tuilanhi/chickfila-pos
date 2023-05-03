import { Database } from "./Database.js";
import moment from "moment";

class Checkout {
  constructor() {
    this.db = new Database();
  }
  async toSales(cart) {
    try {
      console.log(cart);
      await this.db.connect();

      let gameDay = "False";
      let totalsales = 0;
      let order = [];

      for (let i = 0; i < cart.length; i++) {
        let item = cart[i].name;
        let price = cart[i].price;

        // add item's price to total sales
        totalsales += parseFloat(price);
        // push item into order
        order.push(item);
      }

      // get todays date
      let days = moment().format("YYYY-MM-DD");

      // get order ID
      const dayStatement =
        "select orderid from orderlist ORDER BY orderid DESC limit 1";
      let result = await this.db.query(dayStatement);
      const orderNum = parseInt(result[0]["orderid"]) + 1;
      let orderID = orderNum.toString();

      // check for gameday
      if (days === "2023-04-13") {
        gameDay = "True";
      }

      console.log(order);
      console.log(totalsales);
      console.log(orderID);
      let sqlStatement = `INSERT INTO chickfila_sales (days, gamedays, orderid, item, totalsales) VALUES ('${days}', '${gameDay}', '${orderID}', '{''${order}''}', '${totalsales}')`;
      console.log(sqlStatement);
      await this.db.insert(sqlStatement);
      sqlStatement = `INSERT INTO orderlist (orderid, item, totalsales) VALUES ('${orderID}', '{''${order}''}', '${totalsales}');`;
      await this.db.insert(sqlStatement);

      sqlStatement =
        "select orderid from orderlist ORDER BY orderid DESC limit 1";
      result = await this.db.query(sqlStatement);

      await this.db.disconnect();
      return result;
    } catch (e) {
      console.error(e);
    }
  }
}

export { Checkout };

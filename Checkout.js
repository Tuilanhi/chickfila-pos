import { Database } from "./Database.js";
import moment from 'moment';

class Checkout{
    constructor() {
        this.db = new Database();
    }
    async toSales(cart){
        try {
            await this.db.connect();
            
            let gameDay = "False";
            let totalsales = 0;
            let order = [];
            
            
            cart.forEach(function (i) {
                let item = i.name;
                let price = i.price;
        
                // add item's price to total sales
                totalsales += parseFloat(price);
                // push item into order
                order.push(item);
              });

            // get todays date
            let days = moment().format('YYYY-MM-DD');

            // get order ID
            const dayStatement = 'select orderid from chickfila_sales ORDER BY days DESC limit 1';
            const result = await this.db.query(dayStatement);
            const orderNum = parseInt(result[0]['orderid']) + 1;
            let orderID = orderNum.toString();


            // check for gameday
            if (days === "2023-04-13"){ gameDay = "True"; }

            console.log(order);
            console.log(totalsales);
            console.log(orderID);
            const sqlStatement = `INSERT INTO chickfila_sales (days, gamedays, orderid, item, totalsales) VALUES ('${days}', '${gameDay}', '${orderID}', '{''${order}''}', '${totalsales}')`;
            console.log(sqlStatement);
            const result3 = await this.db.insert(sqlStatement);

      
            await this.db.disconnect();
            return result;
          } catch (e) {
            console.error(e);
          }
    }
}

const order = new Checkout();
order.toSales([{"name":"Chicken Sandwich","price":"4.99"},{"name":"Chicken Sandwich","price":"4.99"}]);

export { Checkout };
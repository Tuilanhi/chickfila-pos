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
            
            
            for(item in cart){
                let item = i.name;
                let price = i.price;

                // add item's price to total sales
                this.toSales += price;
                // push item into order
                order.push(item);
            }

            // get todays date
            let days = moment().format('YYYY-MM-DD');

            // get order ID
            const dayStatement = 'select orderid from chickfila_sales ORDER BY orderid DESC LIMIT 1';
            const result = await this.db.query(dayStatement);
            let orderID = result[0]["orderid"];
            const orderArr = orderID.split('-');
            const orderNum = parseInt(orderArr[1]) + 1;
            orderID = orderArr[0] + '-' + orderNum.toString();


            // check for gameday
            if (days === "2023-04-13"){ gameDay = "True"; }

            const sqlStatement = `INSERT INTO chickfila_sales (days, gamedays, orderid, item, totalsales) VALUES ('${days}', '${gameDay}', '${orderID}', '${order}', '${totalsales}')`;
            const result3 = await this.db.insert(sqlStatement);

      
            await this.db.disconnect();
            return result;
          } catch (e) {
            console.error(e);
          }
    }
}

const order = new Checkout([{"name":"Chicken Sandwich","price":"4.99"},{"name":"Chicken Sandwich","price":"4.99"}]);
order.toSales();

export { Checkout };
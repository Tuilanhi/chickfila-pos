import {createRequire } from "module";
import {Database} from "./Database.js";
const require = createRequire(import.meta.url);

class XReport{
    constructor(date) {
        this.db = new Database();
        this.date = date;
        this.loadData(date);
        //console.log('Opened database');
    }

        async loadData(date) {
            
            this.db.connect();
            console.log('Opened database successfully');
            let totalDaySales = 0;
            
            // Create the SQL query to get all the data from the chickfila_sales table
            const sqlStatement = `SELECT totalsales FROM chickfila_sales WHERE days = '${date}'`;
            let result = await this.db.query(sqlStatement);

            //console.log(result[0].totalsales);
            for (let i = 0; i < result.length; i++ ) {
                 const orderTotal = parseFloat(result[i].totalsales);
                 //console.log(orderTotal);
                 totalDaySales = parseFloat(totalDaySales) + orderTotal;
               
            }
            totalDaySales = totalDaySales.toFixed(2)
            console.log("Total Sales for " + date + ": $" + totalDaySales);
            





            // Filter the data by date if a date is selected
            /*if ( != null) {
            const selectedDate = selectedDateProperty.getValue();
            query += " WHERE days = '" + selectedDate + "'";
            }
            
            // Execute the SQL query and get the result set
            const stmt = conn.prepareStatement(query);
            const rs = stmt.executeQuery();
            
            // Add the data to the ObservableList
            let eodsales = 0;
            while (rs.next()) {
            const days = rs.getString("days");
            const gamedays = rs.getString("gamedays");
            const orderid = rs.getString("orderid");
            const item = rs.getString("item");
            const totalSales = rs.getFloat("totalsales");
            eodsales += totalSales;
            const sale = new ChickfilaSale(days, gamedays, orderid, item, totalSales);
            data.add(sale);
            }
            
            const labelText = "EoD Sales: " + eodsales;
            eodSales.setText(labelText);*/
            
            // Close the connection and the statement
            this.db.disconnect();
        
        }
}



const date = "2022-10-03";
const run = new XReport(date);

export {XReport};

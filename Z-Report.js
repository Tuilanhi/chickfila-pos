import { Database } from "./Database.js";

class ZReport{
    constructor(){
        this.db = new Database();
    }
    async zrep(date1, date2){
        try {
            await this.db.connect();
            // if item name doesn't exist add new Item
            // get names of existing items
            let sqlStatement = "SELECT days, SUM(totalsales) as totalsales FROM chickfila_sales GROUP BY days";
            let result = await this.db.query(sqlStatement);
            const count = result[0]["count"];
            
      
            await this.db.disconnect();
          } catch (e) {
            console.error(e);
          }
    }
}

export { ZReport };
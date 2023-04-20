const { Client } = require('pg');

/**
 * It takes in an ArrayList of Strings and calls the parseCart method
 */
class ExcessReport {
  constructor(date1, date2) {
    this.date1 = date1;
    this.date2 = date2;
  }

  /*
   * It connects to the database and returns a connection object
   *
   * @return A connection to the database.
   */
  static async connection() {
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
      console.log('Connected to the database successfully');
    } catch (err) {
      console.error('Error connecting to the database:', err);
      process.exit(1);
    }

    return client;
  }

  async excess() {
    try {
      const client = await ExcessReport.connection();

      const sqlStatement = `SELECT * FROM chickfila_sales WHERE days BETWEEN '${this.date1}' AND '${this.date2}'`;
      const result = await client.query(sqlStatement);

      //Getting the count of items on menu
      const result_1 = await client.query('SELECT COUNT(*) FROM menu');
      const count = result_1.rows[0].count;

      //Array of all menu Items
      const Items = new Array(count);

      //putting all items in string
      const result_2 = await client.query('SELECT item FROM menu');
      for (let i = 0; i < count; i++) {
        Items[i] = result_2.rows[i].item;
      }

      //Getting the count of
      const result_3 = await client.query(`SELECT COUNT(*) FROM chickfila_sales WHERE days BETWEEN '${this.date1}' AND '${this.date2}'`);
      const countSales = result_3.rows[0].count;

      //2D array: [["chickfila sandwich", "2"]]
      const item_count = new Array(count);
      for (let i = 0; i < count; i++) {
        item_count[i] = [Items[i], '0'];
      }

      //putting all items ordered in the timestamp in string
      const result_4 = await client.query(`SELECT item FROM chickfila_sales WHERE days BETWEEN '${this.date1}' AND '${this.date2}'`);
      for (let i = 0; i < countSales; i++) {
        const { item } = result_4.rows[i];
        // takes the array per transaction as a string
        let Transaction = item.substring(1, item.length - 1);
        // use split to make it into an array
        const transactionArray = Transaction.split(',');

        for (let j = 0; j < transactionArray.length; j++) {
          const c = transactionArray[j].substring(2, transactionArray[j].length - 2);

          for (let m = 0; m < count; m++) {
            if (c === item_count[m][0]) {
              let num = parseInt(item_count[m][1], 10);
              num++;
              const number = num.toString();
              item_count[m][1] = number;
            }
          }
        }
      }
    }
  }
}
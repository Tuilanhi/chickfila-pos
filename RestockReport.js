const { Client } = require('pg');

/**
 * It takes in an Array of Strings and calls the parseCart method.
 */
class RestockReport {
  constructor() {
    this.restock();
  }

  /**
   * It connects to the database and returns a client object.
   *
   * @return A client object to the database.
   */
  static connection() {
    // Building the connection with your credentials
    const teamNumber = 'team_1';
    const dbName = `csce315331_${teamNumber}`;
    const dbConnectionString = `postgresql://csce315331_team_1_master:TEAM_1@csce-315-db.engr.tamu.edu/${dbName}`;

    // Connecting to the database
    const client = new Client({
      connectionString: dbConnectionString,
    });
    client.connect();
    console.log('Opened database successfully');

    return client;
  }

  async restock() {
    let result = null;
    try {
      //Inserting new Item into Bridge in database
      const client = RestockReport.connection();
      const minimum = 150;
      const sqlStatement = `SELECT * FROM ingredients WHERE quantity <= ${minimum};`;
      result = await client.query(sqlStatement);

      result.rows.forEach((row) => {
        console.log(`${row.ingredient} ${row.quantity} ${row.unit} ${row.type}`);
      });
      client.end();
    } catch (e) {
      console.error(e);
      process.exit(0);
    }
    return result;
  }
}

const report = new RestockReport();

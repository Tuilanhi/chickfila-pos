const { Client } = require("pg");

class Database {
  constructor() {
    this.client = new Client({
      user: "csce315331_team_1_master",
      host: "csce-315-db.engr.tamu.edu",
      database: "csce315331_team_1",
      password: "TEAM_1",
      port: 5432,
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Connected to database successfully");
    } catch (err) {
      console.error("Connection error", err.stack);
    }
  }

  async query(sql, params) {
    try {
      const result = await this.client.query(sql, params);
      return result.rows;
    } catch (err) {
      console.error("Error executing query", err.stack);
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log("Disconnected from database");
    } catch (err) {
      console.error("Error disconnecting from database", err.stack);
    }
  }
}

module.exports = Database;

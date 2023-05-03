import { createRequire } from "module";
const require = createRequire(import.meta.url);
import pkg from "pg";
const { Client } = pkg;
require("dotenv").config();

class Database {
  constructor() {
    this.client = new Client({
      user: "csce315331_team_1_master",
      host: "csce-315-db.engr.tamu.edu",
      database: "csce315331_team_1",
      password: "TEAM_1",
      port: 5432,
    });
    this.connected = false;
  }

  async connect() {
    try {
      if (!this.connected) {
        await this.client.connect();
        this.connected = true;
        console.log("Connected to database successfully");
      }
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

  async insert(sql, params) {
    try {
      await this.client.query(sql, params);
    } catch (err) {
      console.error("Error executing insert", err.stack);
    }
  }

  async delete(sql, params) {
    try {
      await this.client.query(sql, params);
    } catch (err) {
      console.error("Error executing delete", err.stack);
    }
  }

  async disconnect() {
    try {
      if (this.connected) {
        await this.client.end();
        this.connected = false;
        console.log("Disconnected from database");
      }
    } catch (err) {
      console.error("Error disconnecting from database", err.stack);
    }
  }
}

export { Database };

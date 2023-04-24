import { createRequire } from "module";
const require = createRequire(import.meta.url);
import pkg from "pg";
const { Client } = pkg;
require("dotenv").config();

class Database {
  constructor() {
    this.client = new Client({
      user: process.env.USER_CLIENT,
      host: process.env.HOST,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
      port: process.env.PORT,
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
      await this.client.end();
      console.log("Disconnected from database");
    } catch (err) {
      console.error("Error disconnecting from database", err.stack);
    }
  }
}

module.exports = Database;

import { Pool, PoolClient } from "pg";
import Configuration from "./env.js";

class Database {
  private pool: Pool;
  private static instance: Database;

  private constructor() {
    this.pool = new Pool({
      host: Configuration.database.host,
      user: Configuration.database.user,
      password: Configuration.database.password,
      database: Configuration.database.name,
      port: Configuration.database.port,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on("connect", () => {
      console.log("New PostgreSQL client connected");
    });

    this.pool.on("error", (err) => {
      console.log("Unexpected error on idle PostgreSQL client", err);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  public async query(text: string, params?: any[]) {
    try {
      const result = await this.pool.query(text, params);

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.query("SELECT NOW()");

      return true;
    } catch (error) {
      
      return false;
    }
  }

  public async close(): Promise<void> {
    return await this.pool.end();
  }
}

export default Database.getInstance();

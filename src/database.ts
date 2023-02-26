import mongoose from "mongoose";

export class Database {
  private static _instance: Database;
  private _dbUrl: string;
  private _connection: mongoose.Connection;

  private constructor() {
    const { DB_HOST, DB_PORT, DB_NAME } = process.env;
    this._dbUrl = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  }

  public static getInstance(): Database {
    if (!Database._instance) {
      Database._instance = new Database();
    }
    return Database._instance;
  }

  public async connect(): Promise<void> {
    try {
      const { DB_USER, DB_PASS } = process.env;
      console.log(this._dbUrl)
      this._connection = await mongoose.createConnection(this._dbUrl, {
        user: DB_USER,
        pass: DB_PASS,
        // autoIndex: true
      });
      console.log("Database connection successful");
    } catch (error) {
      console.error("Database connection error:", error);
      throw error;
    }
  }

  public get connection(): mongoose.Connection {
    return this._connection;
  }
}
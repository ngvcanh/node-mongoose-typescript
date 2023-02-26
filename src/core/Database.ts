import mongoose from "mongoose";

export default class Database {
  private static _instance: Database;
  
  private _dbUrl: string;
  private _connection: typeof mongoose;

  private constructor() {
    const { DB_HOST, DB_PORT, DB_NAME } = process.env;
    this._dbUrl = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  }

  public static getInstance(): Database {
    if (!this._instance) {
      this._instance = new Database();
    }
    return this._instance;
  }

  public async connect() {
    const { DB_USER, DB_PASS } = process.env;

    return mongoose.connect(this._dbUrl, { user: DB_USER, pass: DB_PASS })
      .then(connect => this._connection = connect)
      .catch(Promise.reject);
  }

  public get connection(): typeof mongoose {
    return this._connection;
  }
}
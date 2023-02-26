import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import express from "express";

import Database from "./Database";

const ENV = global.ENV;

export default class Server {

  private readonly port: number;
  private readonly sslPort: number;
  private readonly app: express.Express;
  private readonly db: Database;

  private httpServer: http.Server;
  private httpsServer: https.Server;

  constructor(db: Database) {
    this.port = ENV.HTTP_PORT ?? 4000;
    this.sslPort = ENV.HTTPS_PORT ?? 443;

    this.db = db;
    this.app = express();

    this.configure();
  }

  private configure() {
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware() {
    const {
      HEADER_MIDDLEWARE,
      IS_PROD,
      ROOT_MIDDLEWARE,
      APP_MIDDLEWARE,
    } = ENV;

    HEADER_MIDDLEWARE.forEach(name => {
      const ext = IS_PROD ? '.js' : '.ts';

      const fileRoot = path.resolve(ROOT_MIDDLEWARE, name + ext);
      const fileApp = path.resolve(APP_MIDDLEWARE, name + ext);

      if (fs.existsSync(fileRoot)) {
        const handle = require(fileRoot).default();
        this.app.use(handle);
      }

      if (fs.existsSync(fileApp)) {
        const handle = require(fileRoot).default();
        this.app.use(handle);
      }
    });
  }

  private configureRoutes() {
    const { APP_DIR_CURRENT, APP_PATH } = ENV;

    const routerPath = path.resolve(APP_DIR_CURRENT, 'router');
    const router = require(routerPath).default(this.db);

    if (APP_PATH) {
      this.app.use(APP_PATH, router);
    }
    else {
      this.app.use(router);
    }
  }

  public async start(): Promise<void> {
    try {
      await this.db.connect();
      console.log("[ SERVER ] Connected to database");

      this.startHttp();
      this.startHttps();
    }
    catch (error) {
      console.error("[ SERVER ] Error starting server:", error);
      throw error;
    }
  }

  private startHttp() {
    if (!ENV.HTTP_ENABLE) {
      return;
    }

    this.httpServer = http.createServer(this.app);

    this.httpServer.listen(this.port, () => {
      console.log(`[ SERVER ] HTTP server listening on port`, this.port);
    });
  }

  private startHttps() {
    const { HTTPS_ENABLE, HTTPS_SSL_KEY, HTTPS_SSL_CERT } = ENV;

    if (!HTTPS_ENABLE) {
      return;
    }

    const keyPath = path.resolve(process.cwd(), HTTPS_SSL_KEY);
    const certPath = path.resolve(process.cwd(), HTTPS_SSL_CERT);

    const key = fs.existsSync(keyPath) ? fs.readFileSync(keyPath, "utf8") : '';
    const cert = fs.existsSync(certPath) ? fs.readFileSync(certPath, "utf8") : '';

    this.httpsServer = https.createServer({ key, cert }, this.app);

    this.httpsServer.listen(this.sslPort, () => {
      console.log("[ SERVER ] HTTPS server listening on port", this.sslPort);
    });
  }

  public stop(): void {
    this.httpServer?.close();
    this.httpsServer?.close();
    console.log("[ SERVER ] Server stopped");
  }
}
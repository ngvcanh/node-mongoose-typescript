import express, { Express } from "express";
import fs from "fs";
import cors from 'cors';
import http from "http";
import https from "https";
import helmet from "helmet";
import { Database } from "./database";
import { configureRoutes } from "./routes";

export interface ServerSSLConfiguration {
  key: string;
  cert: string;
}

export class Server {

  private readonly port: number;
  private readonly sslPort: number;
  private readonly app: Express;
  private readonly db: Database;

  private httpServer: http.Server;
  private httpsServer: https.Server | undefined;

  constructor(db: Database) {
    const { PORT, SSL_PORT } = process.env;
    this.port = parseInt(PORT || '4000');
    this.sslPort = parseInt(SSL_PORT || '443');

    this.db = db;
    this.app = express();
    this.httpServer = http.createServer(this.app);

    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(helmet());
  }

  private configureRoutes() {
    const router = configureRoutes(this.db);
    this.app.use('/api', router);
  }

  public async start(sslConfig?: ServerSSLConfiguration): Promise<void> {
    try {
      await this.db.connect();
      console.log("[ SERVER ] Connected to database");

      this.httpServer.listen(this.port, () => {
        console.log(`[ SERVER ] HTTP server listening on port`, this.port);
      });

      if (sslConfig) {
        const { key, cert } = sslConfig;
        const httpsOptions = {
          key: fs.readFileSync(key, "utf8"),
          cert: fs.readFileSync(cert, "utf8"),
        };
        this.httpsServer = https.createServer(httpsOptions, this.app);
        this.httpsServer.listen(this.sslPort, () => {
          console.log("[ SERVER ] HTTPS server listening on port", this.sslPort);
        });
      }
    } catch (error) {
      console.error("[ SERVER ] Error starting server:", error);
      throw error;
    }
  }

  public stop(): void {
    this.httpServer.close();
    this.httpsServer?.close();
    console.log("[ SERVER ] Server stopped");
  }
}
import './core/Env';
import { Server } from '@serv-ts/express';
import Database from './core/Database';
import routes from './apps/v1/router';
// import Server from './core/Server';

// Create database instance
const db = Database.getInstance();


// // Create server instance
const server = new Server({ db, routes });

// // Start the server
server.start();

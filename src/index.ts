import './core/Env';
import Database from './core/Database';
import Server from './core/Server';

// Create database instance
const db = Database.getInstance();

// Create server instance
const server = new Server(db);

// Start the server
server.start();

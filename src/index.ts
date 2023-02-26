import dotenv from 'dotenv';
import { Server } from './server';
import { Database } from './database';

// Load environment variables from .env file
dotenv.config();

// Create database instance
const db = Database.getInstance();

// Create server instance
const server = new Server(db);

// Start the server
server.start();
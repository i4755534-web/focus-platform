import { db as mockDb } from './mock';
import * as postgresDb from '../postgres';

// Determine which database to use
const USE_POSTGRES = process.env.DATABASE_URL && process.env.DATABASE_URL !== 'your-database-url-here';

// Export the appropriate database interface
export const db = USE_POSTGRES ? {
  // User methods
  getUser: postgresDb.getUserById,
  getUserByEmail: postgresDb.getUserByEmail,
  createUser: postgresDb.createUser,
  getAllUsers: postgresDb.getAllUsers,

  // Channel methods
  getChannels: postgresDb.getChannels,
  getChannel: postgresDb.getChannelById,
  createChannel: postgresDb.createChannel,

  // Message methods
  getMessages: postgresDb.getMessagesByChannel,
  createMessage: postgresDb.createMessage,
} : mockDb;

// Initialize database connection if using PostgreSQL
if (USE_POSTGRES) {
  postgresDb.testConnection().then(success => {
    if (success) {
      postgresDb.initializeTables().catch(console.error);
    }
  });
}
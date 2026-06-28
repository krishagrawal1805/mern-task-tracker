import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
let isMongoDBConnected = false;
let dbErrorMessage: string | null = null;

export async function connectDB() {
  if (MONGODB_URI) {
    console.log('Connecting to MongoDB...');
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Successfully connected to MongoDB.');
      isMongoDBConnected = true;
      dbErrorMessage = null;
    } catch (err: any) {
      dbErrorMessage = err.message || 'Unknown database connection error';
      console.error('Error connecting to MongoDB:', dbErrorMessage);
      console.log('Falling back to local server-side in-memory store.');
    }
  } else {
    dbErrorMessage = 'MONGODB_URI is not configured in environment variables.';
    console.warn('WARNING: MONGODB_URI environment variable is not defined.');
    console.log('Running TaskTracker with server-side in-memory fallback. (Real REST API is active)');
  }
}

export function getDBStatusInfo() {
  return {
    connected: isMongoDBConnected && mongoose.connection.readyState === 1,
    type: isMongoDBConnected ? 'MongoDB Cloud' : 'In-Memory Server-Side Fallback',
    uriDefined: !!MONGODB_URI,
    errorMessage: dbErrorMessage
  };
}

export function getIsConnected() {
  return isMongoDBConnected && mongoose.connection.readyState === 1;
}

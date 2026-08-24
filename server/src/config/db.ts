import mongoose from 'mongoose';
import { config } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]:`, error);
    // Don't exit process in test environment
    if (config.nodeEnv !== 'test') {
      process.exit(1);
    }
  }
};

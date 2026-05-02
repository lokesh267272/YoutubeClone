import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    // Use the Mongo connection string from the environment.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    // Stop the server early if the database is unavailable.
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
}

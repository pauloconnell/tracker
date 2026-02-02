import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your environment variables");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

// Persist cache back to global -for hot reloads/serverless environments
(global as any).mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // TypeScript now knows this is a string 
    const uri = MONGODB_URI as string;
    cached.promise = mongoose.connect(uri);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

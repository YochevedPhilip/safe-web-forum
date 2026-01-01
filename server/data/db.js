import mongoose from "mongoose";

let cached = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in environment");

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      autoIndex: true,      // נוח להאקתון
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

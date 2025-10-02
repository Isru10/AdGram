// lib/db.ts - The professional way.

import mongoose from 'mongoose';
/* eslint-disable @typescript-eslint/no-explicit-any */

// Type assertion for the global mongoose object
declare global {
  var mongoose: any; 
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() { // Renamed to match your function name
  if (cached.conn) {
    console.log("=> using existing database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    
    if (!process.env.MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      console.log("=> created new database connection");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export { connectDB }; // Exporting it like this
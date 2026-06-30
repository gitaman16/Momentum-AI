import mongoose from "mongoose";

// Connect once at startup. Mongoose buffers queries until the connection opens.
export async function connectDB(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}

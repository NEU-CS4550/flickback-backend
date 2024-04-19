import mongoose from "mongoose";

let cached = null;

export default async function connect() {
  if (cached == null) {
    cached = mongoose
      .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .then(() => mongoose);

    await cached;
  }

  return cached;
}

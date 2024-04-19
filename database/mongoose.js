import mongoose from "mongoose";

const connection = {};
async function db() {
  if (connection.isConnected) {
    return;
  }
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  });
  connection.isConnected = db.connections[0].readyState;
}
export default db;

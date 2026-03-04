import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const DB = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: { require: true, rejectUnauthorized: false },
});

const connectDB = async () => {
  let client = null;
  try {
    client = await DB.connect();
    console.log(`Connection Success!`);
  } catch (err) {
    if (err.name === "AggregateError") {
      console.error("AggregateError details:");
      err.errors.forEach((e, i) => console.error(`Error ${i}:`, e));
    } else {
      console.error("Connection error:", err);
    }
    process.exit(1);
  } finally {
    client.release();
  }
};

const disconnectDB = async () => {
  console.log("Disconnecting");
  await DB.end();
  console.log("Disconnected");
};

export { DB, connectDB, disconnectDB };

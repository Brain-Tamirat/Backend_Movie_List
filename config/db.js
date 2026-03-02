import { config } from "dotenv";
import { Pool } from "pg";

config();
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGSSLMODE } = process.env;

const DB = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: { require: true },
});

const connectDB = async () => {
  try {
    await DB.connect();
    console.log(`Connection Success!`);
  } catch (e) {
    console.error(`Error on Connecting DB : ${e.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await DB.end();
};

export { DB, connectDB, disconnectDB };

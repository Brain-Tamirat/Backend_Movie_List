import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { connectDB, disconnectDB } from "../config/db.js";
import auth_router from "../routes/auth_routes.js";
import movie_router from "../routes/movies_routes.js";

config();
const app = express();
const port = process.env.PORT || 9005;

//Using CORS for cross origin resource sharing
app.use(cors());
//Changing incoming data to json format and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Checking For Connection
await connectDB();
// await disconnectDB();

//Auth Route
app.use("/api/auth", auth_router);

// Movie Route
app.use("/api/movies", movie_router);

//Listening Here
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// UnhandledRejection handled e.g. DB-Connection Errors
process.on("unhandledRejection", async (err) => {
  console.log("UnhandledRejection : " + err);
  server.close(async () => {
    console.log("Disconnecting");
    await disconnectDB();
    console.log("Disconnected");
    process.exit(1);
  });
});

//UncaughtException handled
process.on("uncaughtException", async (err) => {
  console.log("UncaughtException : " + err);
  server.close(async () => {
    console.log("Disconnecting");
    await disconnectDB();
    console.log("Disconnected");
    process.exit(1);
  });
});

//Grace FUll Shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM initaited Shutting Down Gracefully!");
  server.close(async () => {
    console.log("Disconnecting");
    await disconnectDB();
    console.log("Disconnected");
    process.exit(1);
  });
});

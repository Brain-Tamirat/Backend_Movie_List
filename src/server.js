import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { connectDB, disconnectDB } from "../config/db.js";
import movie_router from "../routes/movies.js";

config();
const app = express();
const port = process.env.PORT || 9005;

app.use(cors());
app.use(express.json());

app.use("/api/movies", movie_router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

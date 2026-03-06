import express from "express";
import {
  addToWatchList,
  removeFromWatchList,
} from "../controllers/watch_list_controller.js";
import { authmiddleware } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.use(authmiddleware);

router.post("/", addToWatchList);

router.delete("/:id", removeFromWatchList);

export default router;

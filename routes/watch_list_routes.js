import express from "express";
import { addToWatchList } from "../controllers/watch_list_controller.js";

const router = express.Router();

router.post("/", addToWatchList);
// router.post("/login", login);
// router.post("/logout", logout);

export default router;

import express from "express";
import { getUsersForBoard } from "../controllers/getUsersForBoardController.js";

const router = express.Router();

router.get("/board/:userKey/users", getUsersForBoard);

export default router;

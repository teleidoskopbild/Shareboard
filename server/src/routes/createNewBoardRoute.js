import express from "express";
import { createNewBoard } from "../controllers/createNewBoardController.js";

const router = express.Router();

// Route für das Erstellen eines neuen Shareboards
router.post("/create-new-board", createNewBoard);

export default router;

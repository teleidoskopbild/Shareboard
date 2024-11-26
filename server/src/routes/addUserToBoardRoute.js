import express from "express";
import { addUserToBoard } from "../controllers/addUserToBoardController.js";

const router = express.Router();

// Füge einen neuen Nutzer hinzu
router.post("/settings/:shareboardId/:ownerKey/users", addUserToBoard);

export default router;

// routes/settings.js
import express from "express";
import { deleteBoard } from "../controllers/deleteShareboardController.js";

const router = express.Router();

// Route zum Löschen eines Boards
router.delete("/settings/:shareboardId/:ownerKey", deleteBoard);

export default router;

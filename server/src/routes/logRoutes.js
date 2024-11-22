import express from "express";
import {
  createLog,
  getLogsByShareboard,
} from "../controllers/logControllers.js";

const router = express.Router();

// Route für das Erstellen eines neuen Logs
router.post("/logs", createLog);

// Route für das Abrufen der Logs eines Shareboards
router.get("/logs/:shareboard_fk", getLogsByShareboard);

export default router;

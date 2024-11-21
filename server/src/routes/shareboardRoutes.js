import express from "express";
import {
  getAllShareboards,
  createShareboard,
} from "../controllers/shareboardControllers.js";

const router = express.Router();

// Route für alle Shareboards
router.get("/shareboards", getAllShareboards);

// Weitere Routen folgen später, für jetzt die POST-Route für das Erstellen
router.post("/shareboard", createShareboard);

export default router;

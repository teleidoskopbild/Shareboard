import express from "express";
import {
  getAllShareboards,
  createShareboard,
  updateShareboard,
  deleteShareboard,
} from "../controllers/shareboardControllers.js";

const router = express.Router();

// Route für alle Shareboards
router.get("/shareboards", getAllShareboards);

// Weitere Routen folgen später, für jetzt die POST-Route für das Erstellen
router.post("/shareboard", createShareboard);

// PATCH-Route für das Aktualisieren eines Shareboards
router.patch("/shareboard/:id", updateShareboard);

// DELETE-Route für das Löschen eines Shareboards
router.delete("/shareboard/:id", deleteShareboard);

export default router;

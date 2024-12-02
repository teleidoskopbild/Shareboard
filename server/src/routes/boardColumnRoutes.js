import express from "express";
import {
  getAllColumns,
  createColumn,
  updateColumn,
  deleteColumn,
  getAllColumnsByUserKey,
} from "../controllers/boardColumnControllers.js";

const router = express.Router();

// Routen für Board Columns
router.get("/columns/:shareboardId", getAllColumns); // Alle Spalten eines Shareboards abrufen
router.get("/columns/user/:userKey", getAllColumnsByUserKey);
router.post("/columns", createColumn); // Neue Spalte erstellen
router.patch("/columns/:id", updateColumn); // Spaltennamen oder Position aktualisieren
router.delete("/columns/:id", deleteColumn); // Spalte löschen

export default router;

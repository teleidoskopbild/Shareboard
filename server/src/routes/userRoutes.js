import express from "express";
import { createUser, getAllUsers } from "../controllers/userControllers.js";

const router = express.Router();

// Route für das Erstellen eines Nutzers
router.post("/users", createUser);

// Route für das Abrufen aller Nutzer (optional, nur zum Testen)
router.get("/users", getAllUsers);

export default router;

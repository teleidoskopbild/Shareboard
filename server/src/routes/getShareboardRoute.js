import express from "express";
import { getShareboard } from "../controllers/getShareboardController.js";

const router = express.Router();

// Route für das Abrufen des Boards basierend auf userKey
router.get("/board/:userKey", getShareboard);

export default router;

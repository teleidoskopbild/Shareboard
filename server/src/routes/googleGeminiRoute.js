import express from "express";
import { generateDescription } from "../controllers/googleGeminiController.js";

const router = express.Router();

// POST-Route für die Google Gemini API
router.post("/generate-description", generateDescription);

export default router;

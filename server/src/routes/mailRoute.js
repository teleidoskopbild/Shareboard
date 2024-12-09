import express from "express";
import { sendMail } from "../controllers/mailController.js";

const router = express.Router();

// Route für das Versenden von E-Mails
router.post("/mail", sendMail);

export default router;

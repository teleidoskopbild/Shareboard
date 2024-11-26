import express from "express";
import { getBoardSettings } from "../controllers/getBoardSettingsController.js";

const router = express.Router();

router.get("/settings/:shareboardId/:ownerKey", getBoardSettings);

export default router;

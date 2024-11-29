import express from "express";
import { editNoteColumn } from "../controllers/editNoteColumnController.js";

const router = express.Router();

router.patch("/editNoteColumn/:noteId", editNoteColumn);

export default router;

import express from "express";
import { editUser } from "../controllers/editUserController.js";

const router = express.Router();

// Route für das Erstellen eines neuen Shareboards
router.patch("/settings/:shareboardId/:ownerKey/users/:id", editUser);

export default router;

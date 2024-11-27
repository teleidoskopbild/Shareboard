// routes/settings.js
import express from "express";
import { deleteUser } from "../controllers/deleteUserController.js";

const router = express.Router();

router.delete("/settings/:shareboardId/:ownerKey/users/:userId", deleteUser);

export default router;

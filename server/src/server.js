import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import shareboardRoutes from "./routes/shareboardRoutes.js";
import boardColumnRoutes from "./routes/boardColumnRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import createNewBoardRoute from "./routes/createNewBoardRoute.js";
import getBoardSettingsRoute from "./routes/getBoardSettingsRoute.js";
import addUserToBoardRoute from "./routes/addUserToBoardRoute.js";
import editUserRoute from "./routes/editUserRoute.js";
import deleteUserRoute from "./routes/deleteUserRoute.js";
import deleteShareboardRoute from "./routes/deleteShareboardRoute.js";
import getShareboardRoute from "./routes/getShareboardRoute.js";
import editNoteColumnRoute from "./routes/editNoteColumnRoute.js";
import getUsersForBoardRoute from "./routes/getUsersForBoardRoute.js";
import mailRoute from "./routes/mailRoute.js";
import googleGeminiRoute from "./routes/googleGeminiRoute.js";

const router = express.Router();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2222;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api", shareboardRoutes);
app.use("/api", boardColumnRoutes);
app.use("/api", noteRoutes);
app.use("/api", userRoutes);
app.use("/api", logRoutes);
app.use("/api", createNewBoardRoute);
app.use("/api", getBoardSettingsRoute);
app.use("/api", addUserToBoardRoute);
app.use("/api/", editUserRoute);
app.use("/api", deleteUserRoute);
app.use("/api", deleteShareboardRoute);
app.use("/api", getShareboardRoute);
app.use("/api", editNoteColumnRoute);
app.use("/api", getUsersForBoardRoute);
app.use("/api", mailRoute);
app.use("/api", googleGeminiRoute);

// Test-Route
app.get("/", (req, res) => {
  res.send("Shareboard Server is running!");
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

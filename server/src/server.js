import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import shareboardRoutes from "./routes/shareboardRoutes.js";
import boardColumnRoutes from "./routes/boardColumnRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import createNewBoardRoute from "./routes/createNewBoardRoute.js";

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

// Test-Route
app.get("/", (req, res) => {
  res.send("Shareboard Server is running!");
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

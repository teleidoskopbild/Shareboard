import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import shareboardRoutes from "./routes/shareboardRoutes.js";

const router = express.Router();

// router.get("/shareboards", getAllShareboards);

// router.post("/shareboard", createShareboard);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2222;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api", shareboardRoutes);

// Test-Route
app.get("/", (req, res) => {
  res.send("Shareboard Server is running!");
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

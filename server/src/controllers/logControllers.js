import db from "../util/db-connect.js";

// Erstellen eines neuen Log-Eintrags
export const createLog = async (req, res) => {
  const { shareboard_fk, message } = req.body; // Log-Nachricht und Shareboard ID

  try {
    const [newLog] = await db("shareboard_logs")
      .insert({ shareboard_fk, message })
      .returning("*");

    res.status(201).json(newLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Erstellen des Log-Eintrags" });
  }
};

// Abrufen der Logs eines bestimmten Shareboards
export const getLogsByShareboard = async (req, res) => {
  const { shareboard_fk } = req.params; // Jetzt holen wir den shareboard_fk aus den URL-Parametern

  try {
    const logs = await db("shareboard_logs")
      .where("shareboard_fk", shareboard_fk)
      .orderBy("timestamp", "desc"); // Logs nach Zeitstempel sortieren

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Abrufen der Logs" });
  }
};

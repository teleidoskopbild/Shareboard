import db from "../util/db-connect.js";

export const createNewBoard = async (req, res) => {
  const { boardName, ownerName, ownerEmail, layout } = req.body; // Layout wird übergeben
  console.log(req.body);

  try {
    // 1. Shareboard erstellen
    const [newShareboard] = await db("shareboard_shareboards")
      .insert({ name: boardName })
      .returning("*");

    // 2. Owner erstellen
    const shareboardKey = generateShareboardKey(); // Generieren des Keys für den Owner
    const [owner] = await db("shareboard_users")
      .insert({
        name: ownerName,
        email: ownerEmail,
        rights: true, // Owner hat Rechte
        shareboard_fk: newShareboard.id,
        shareboard_key: shareboardKey,
      })
      .returning("*");

    // 3. Spalten erstellen (wenn Layout vorhanden ist)
    const columnPromises = layout.columns.map((column, index) => {
      return db("shareboard_board_columns").insert({
        shareboard_fk: newShareboard.id,
        name: column.name,
        position: column.position, // Position basierend auf Index
      });
    });

    // Warten, bis alle Spalten erstellt sind
    await Promise.all(columnPromises);

    // Rückgabe des neu erstellten Shareboards, Owners und der Spalten
    res.status(201).json({
      newShareboard,
      owner,
      message: "Board und Spalten erfolgreich erstellt",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Fehler beim Erstellen des Shareboards und der Spalten",
    });
  }
};

// Hilfsfunktion für das Generieren eines Shareboard Keys
const generateShareboardKey = () => {
  return Math.random().toString(36).slice(2, 11); // Verwende slice() statt substr()
};

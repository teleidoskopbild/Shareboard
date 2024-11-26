import db from "../util/db-connect.js"; // Hiermit verbindest du dich zur DB

export const getBoardSettings = async (req, res) => {
  const { shareboardId, ownerKey } = req.params; // Hole Board-ID und Owner-Key aus der URL

  try {
    // 1. Finde den Owner anhand des Owner-Keys und der Board-ID
    const owner = await db("shareboard_users")
      .where({
        shareboard_key: ownerKey,
        shareboard_fk: shareboardId,
        rights: true,
      }) // Owner muss Rechte haben
      .first();

    if (!owner) {
      // Wenn der Owner nicht existiert oder nicht berechtigt ist, gebe einen Fehler zurück
      return res
        .status(403)
        .json({ message: "Zugriff verweigert: Ungültiger Owner-Key." });
    }

    // 2. Hole die Board-Daten
    const board = await db("shareboard_shareboards")
      .where({ id: shareboardId })
      .first();

    if (!board) {
      return res.status(404).json({ message: "Board nicht gefunden." });
    }

    // 3. Hole alle Benutzer des Boards
    const users = await db("shareboard_users").where({
      shareboard_fk: shareboardId,
    });

    // 4. Sende die Daten zurück (Board-Name, Benutzer)
    res.status(200).json({
      boardName: board.name,
      ownerName: owner.name, // Hier muss der Owner-Name aus dem DB zurückgegeben werden
      ownerKey: owner.shareboard_key, // Gleicher Key wie in der DB
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        shareboardKey: user.shareboard_key,
      })),
    });
  } catch (error) {
    console.error("Fehler bei der Abrufung der Board-Daten:", error);
    res
      .status(500)
      .json({ message: "Fehler beim Abrufen der Board-Einstellungen." });
  }
};

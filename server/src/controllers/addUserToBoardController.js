import db from "../util/db-connect.js";

// Endpoint für das Hinzufügen eines Nutzers
export const addUserToBoard = async (req, res) => {
  const { shareboardId, ownerKey } = req.params; // Hole Board-ID und Owner-Key aus der URL
  const { name, email } = req.body; // Hole Name und Email aus dem Request Body

  try {
    // 1. Finde den Owner anhand des Owner-Keys und der Board-ID
    const owner = await db("shareboard_users")
      .where({
        shareboard_key: ownerKey,
        shareboard_fk: shareboardId,
        rights: true, // Nur der Owner hat Rechte
      })
      .first();

    if (!owner) {
      // Wenn der Owner nicht existiert oder keine Rechte hat
      return res
        .status(403)
        .json({ message: "Zugriff verweigert: Ungültiger Owner-Key." });
    }

    // 2. Füge den neuen Nutzer zur Datenbank hinzu
    const newUser = await db("shareboard_users").insert({
      shareboard_fk: shareboardId, // Board-ID
      name: name,
      email: email || null, // E-Mail ist optional
      shareboard_key: generateShareboardKey(), // Generiere einen eindeutigen Schlüssel
      rights: false, // Standardmäßig keine Rechte, bis er vom Owner freigegeben wird
    });

    // 3. Hole die aktualisierte Liste der Nutzer für das Board
    const users = await db("shareboard_users").where({
      shareboard_fk: shareboardId,
    });

    // 4. Sende die neuen Board-Daten zurück
    res.status(201).json({
      message: "Benutzer erfolgreich hinzugefügt.",
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        shareboardKey: user.shareboard_key,
        rights: user.rights,
      })),
    });
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Benutzers:", error);
    res.status(500).json({ message: "Fehler beim Hinzufügen des Benutzers." });
  }
};

// Funktion zum Erzeugen eines eindeutigen Shareboard-Keys
const generateShareboardKey = () => {
  return Math.random().toString(36).slice(2, 11); // Verwende slice() statt substr()
};

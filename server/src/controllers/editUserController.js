import db from "../util/db-connect.js";

export const editUser = async (req, res) => {
  const { shareboardId, ownerKey, id } = req.params;
  const { name, email } = req.body; // Hier holen wir die geänderten Nutzerdaten aus dem Body

  try {
    // Überprüfen, ob der Benutzer mit der gegebenen ID existiert
    const user = await db("shareboard_users")
      .where({ id, shareboard_fk: shareboardId }) // Korrektur: 'shareboard_fk' ist die richtige Spalte
      .first();

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden!" });
    }

    // Aktualisieren des Nutzers in der DB
    const updatedUser = await db("shareboard_users")
      .where({ id })
      .update({ name, email })
      .returning("*"); // Rückgabe der aktualisierten Daten (optional)

    // Wenn erfolgreich, gib den aktualisierten Nutzer zurück
    res.status(200).json(updatedUser[0]); // Das zurückgegebene Array hat nur ein Element (der aktualisierte Nutzer)
  } catch (error) {
    console.error("Fehler beim Bearbeiten des Benutzers:", error.message);
    res.status(500).json({ message: "Fehler beim Bearbeiten des Benutzers." });
  }
};

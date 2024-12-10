import db from "../util/db-connect.js"; // Dein Knex-Setup
import pusher from "../util/pusher.js";

export const editNoteColumn = async (req, res) => {
  const { noteId } = req.params; // Die ID der Notiz aus den URL-Parametern
  const { newColumnId } = req.body; // Die ID der neuen Spalte aus dem Request-Body

  // Sicherstellen, dass die newColumnId im Request-Body vorhanden ist
  if (!newColumnId) {
    return res.status(400).json({ error: "Neue Spalte (newColumnId) fehlt." });
  }

  try {
    // Prüfen, ob die Notiz existiert, bevor wir sie aktualisieren
    const noteExists = await db("shareboard_notes")
      .where({ id: noteId })
      .first();
    if (!noteExists) {
      return res.status(404).json({ error: "Notiz nicht gefunden." });
    }

    // Update der Notiz, um die Spalte zu wechseln
    const updatedNote = await db("shareboard_notes")
      .where({ id: noteId })
      .update({ board_column_fk: newColumnId })
      .returning("*"); // Gibt das aktualisierte Objekt zurück
    pusher.trigger("notes", "reload", {
      message: "Eine Notiz wurde gelöscht!",
    });

    // Falls kein Update durchgeführt wurde (z.B. keine Änderung)
    if (!updatedNote.length) {
      return res
        .status(500)
        .json({ error: "Fehler beim Aktualisieren der Notiz." });
    }

    res.json({
      message: "Spalte erfolgreich aktualisiert.",
      note: updatedNote[0], // Das aktualisierte Notizobjekt
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Notiz:", error);
    res.status(500).json({ error: "Interner Serverfehler." });
  }
};

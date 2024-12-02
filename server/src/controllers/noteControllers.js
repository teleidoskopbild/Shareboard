import db from "../util/db-connect.js";

// Alle Notizen abrufen
export const getAllNotes = async (req, res) => {
  try {
    const notes = await db("shareboard_notes").select("*");
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Abrufen der Notizen" });
  }
};

// Eine neue Notiz erstellen
export const createNote = async (req, res) => {
  const {
    shareboard_fk,
    board_column_fk,
    title,
    description,
    user_fk,
    priority,
  } = req.body;

  try {
    const [newNote] = await db("shareboard_notes")
      .insert({
        shareboard_fk,
        board_column_fk,
        title,
        description,
        user_fk,
        priority,
      })
      .returning("*");

    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Erstellen der Notiz" });
  }
};

// Eine Notiz aktualisieren
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, columnId } = req.body;

  try {
    const [updatedNote] = await db("shareboard_notes")
      .where("id", id)
      .update({
        title,
        description,
        priority,
        board_column_fk: columnId,
        updated_at: db.fn.now(),
      })
      .returning("*");

    res.json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Aktualisieren der Notiz" });
  }
};

// Eine Notiz löschen
export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    await db("shareboard_notes").where("id", id).del();
    res.status(200).json({ message: "Notiz erfolgreich gelöscht" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Löschen der Notiz" });
  }
};

// Funktion für das Abrufen einer Note

export const getNoteById = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await db("shareboard_notes").where("id", id).first();

    if (!note) {
      return res.status(404).json({ message: "Note nicht gefunden" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Abrufen der Notes" });
  }
};

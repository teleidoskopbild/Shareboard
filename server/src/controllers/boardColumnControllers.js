import db from "../util/db-connect.js";

// Alle Spalten eines Shareboards abrufen
export const getAllColumns = async (req, res) => {
  const { shareboardId } = req.params;
  try {
    const columns = await db("shareboard_board_columns")
      .where("shareboard_fk", shareboardId)
      .select("*");
    res.json(columns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Abrufen der Spalten" });
  }
};

// Neue Spalte erstellen
export const createColumn = async (req, res) => {
  const { name, shareboard_fk, position } = req.body;

  try {
    const [newColumn] = await db("shareboard_board_columns")
      .insert({ name, shareboard_fk, position })
      .returning("*");
    res.status(201).json(newColumn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Erstellen der Spalte" });
  }
};

// Spaltennamen oder Position aktualisieren
export const updateColumn = async (req, res) => {
  const { id } = req.params;
  const { name, position } = req.body;

  try {
    const [updatedColumn] = await db("shareboard_board_columns")
      .where("id", id)
      .update({ name, position })
      .returning("*");
    res.json(updatedColumn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Aktualisieren der Spalte" });
  }
};

// Spalte löschen
export const deleteColumn = async (req, res) => {
  const { id } = req.params;

  try {
    await db("shareboard_board_columns").where("id", id).del();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Löschen der Spalte" });
  }
};

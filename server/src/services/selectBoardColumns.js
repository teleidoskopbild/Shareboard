import db from "../util/db-connect.js";

export async function selectAllColumnsByUserKey(userKey) {
  try {
    // shareboardId basierend auf dem userKey ermitteln
    const user = await db("shareboard_users")
      .where("shareboard_key", userKey)
      .select("shareboard_fk")
      .first();

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    const shareboardId = user.shareboard_fk;

    // Spalten des Shareboards abrufen
    const columns = await db("shareboard_board_columns")
      .where("shareboard_fk", shareboardId)
      .select("*");

    return columns;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Abrufen der Spalten" });
  }
}

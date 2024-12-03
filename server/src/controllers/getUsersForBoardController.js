import db from "../util/db-connect.js";

// Funktion, um Benutzer für ein Board zu holen
export const getUsersForBoard = async (req, res) => {
  try {
    const { userKey } = req.params;

    // Hole die Shareboard-ID, die mit dem userKey verknüpft ist
    const board = await db("shareboard_shareboards")
      .join(
        "shareboard_users",
        "shareboard_shareboards.id",
        "=",
        "shareboard_users.shareboard_fk"
      )
      .where("shareboard_users.shareboard_key", userKey)
      .select("shareboard_shareboards.id as boardId")
      .first();

    if (!board) {
      return res
        .status(404)
        .json({ error: "Board not found for the provided userKey." });
    }

    const boardId = board.boardId;

    // Hole die Benutzer, die mit diesem Board verbunden sind
    const users = await db("shareboard_users")
      .where("shareboard_users.shareboard_fk", boardId)
      .select("shareboard_users.id", "shareboard_users.name");

    return res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users for the board." });
  }
};

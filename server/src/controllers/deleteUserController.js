import db from "../util/db-connect.js";

export const deleteUser = async (req, res) => {
  const { shareboardId, ownerKey, userId } = req.params;

  try {
    // Überprüfen, ob der Benutzer der Owner ist
    const owner = await db("shareboard_users")
      .where({ shareboard_fk: shareboardId, shareboard_key: ownerKey })
      .first();

    if (!owner || !owner.rights) {
      return res
        .status(403)
        .json({ message: "Nur der Owner kann Benutzer löschen." });
    }

    // Löschen des Benutzers
    const deletedUser = await db("shareboard_users")
      .where({ id: userId, shareboard_fk: shareboardId })
      .del()
      .returning("*");

    if (deletedUser.length === 0) {
      return res.status(404).json({ message: "Benutzer nicht gefunden." });
    }

    res.status(200).json({ message: "Benutzer erfolgreich gelöscht." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Löschen des Benutzers." });
  }
};

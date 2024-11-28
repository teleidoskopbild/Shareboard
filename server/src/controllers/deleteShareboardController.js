import db from "../util/db-connect.js";

export const deleteBoard = async (req, res) => {
  const { shareboardId, ownerKey } = req.params;

  try {
    // Überprüfen, ob der Benutzer der Owner ist
    const owner = await db("shareboard_users")
      .where({ shareboard_fk: shareboardId, shareboard_key: ownerKey })
      .first();

    if (!owner || !owner.rights) {
      return res
        .status(403)
        .json({ message: "Nur der Owner kann das Board löschen." });
    }

    // Löschen der Notizen, Spalten, Logs und Benutzer, die zum Board gehören, Reihenfolge wichtig!!!
    await db.transaction(async (trx) => {
      await trx("shareboard_notes")
        .where({ shareboard_fk: shareboardId })
        .del();
      await trx("shareboard_board_columns")
        .where({ shareboard_fk: shareboardId })
        .del();
      await trx("shareboard_users")
        .where({ shareboard_fk: shareboardId })
        .del();
      await trx("shareboard_logs").where({ shareboard_fk: shareboardId }).del();

      await trx("shareboard_shareboards").where({ id: shareboardId }).del();
    });

    res.status(200).json({
      message: "Board und alle zugehörigen Daten erfolgreich gelöscht.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Löschen des Boards." });
  }
};

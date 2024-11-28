import db from "../util/db-connect.js";

export const getShareboard = async (req, res) => {
  const { userKey } = req.params;

  try {
    // Starte eine Transaktion
    const result = await db.transaction(async (trx) => {
      // Überprüfe, ob ein Benutzer mit diesem Key existiert
      const user = await trx("shareboard_users")
        .where("shareboard_key", userKey)
        .first();

      if (!user) {
        throw new Error("Ungültiger Key. Zugriff verweigert.");
      }

      // Lade das zugehörige Shareboard
      const shareboard = await trx("shareboard_shareboards")
        .where("id", user.shareboard_fk)
        .first();

      if (!shareboard) {
        throw new Error("Board nicht gefunden.");
      }

      // Lade Spalten und Notizen des Boards
      const columns = await trx("shareboard_board_columns")
        .where("shareboard_fk", shareboard.id)
        .orderBy("position", "asc");

      const notes = await trx("shareboard_notes").where(
        "shareboard_fk",
        shareboard.id
      );

      // Lade alle User des Boards
      const users = await trx("shareboard_users").where(
        "shareboard_fk",
        shareboard.id
      );

      //   // Logge den Zugriff
      //   await trx("shareboard_logs").insert({
      //     shareboard_fk: shareboard.id,
      //     message: `Zugriff durch ${user.name} (${userKey})`,
      //   });

      // Lade alle Logs des Boards
      const logs = await trx("shareboard_logs")
        .where("shareboard_fk", shareboard.id)
        .orderBy("timestamp", "desc");

      // Gib die Daten zurück
      return {
        board: shareboard,
        columns,
        notes,
        users,
        isOwner: user.rights,
        logs,
      };
    });

    // Wenn erfolgreich, sende das Ergebnis zurück
    return res.status(200).json(result);
  } catch (error) {
    console.error("Fehler beim Abrufen des Boards:", error.message);

    // Behandle Transaktionsfehler
    return res.status(500).json({
      message: error.message || "Serverfehler beim Abrufen des Boards.",
    });
  }
};

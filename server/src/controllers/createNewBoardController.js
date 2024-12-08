import db from "../util/db-connect.js";
import mg from "../util/mailgun.js";

export const createNewBoard = async (req, res) => {
  const { boardName, ownerName, ownerEmail, layout } = req.body; // Layout wird übergeben
  console.log(req.body);

  try {
    // 1. Shareboard erstellen
    const [newShareboard] = await db("shareboard_shareboards")
      .insert({ name: boardName })
      .returning("*");

    // 2. Owner erstellen
    const shareboardKey = generateShareboardKey(); // Generieren des Keys für den Owner
    const [owner] = await db("shareboard_users")
      .insert({
        name: ownerName,
        email: ownerEmail,
        rights: true, // Owner hat Rechte
        shareboard_fk: newShareboard.id,
        shareboard_key: shareboardKey,
      })
      .returning("*");

    // 3. Spalten erstellen (wenn Layout vorhanden ist)
    const columnPromises = layout.columns.map((column, index) => {
      return db("shareboard_board_columns").insert({
        shareboard_fk: newShareboard.id,
        name: column.name,
        position: column.position, // Position basierend auf Index
      });
    });

    // Warten, bis alle Spalten erstellt sind
    await Promise.all(columnPromises);

    // 4. E-Mail senden, wenn eine E-Mail-Adresse vorhanden ist
    if (ownerEmail) {
      const messageData = {
        from: `Shareboard <noreply@${process.env.MAILGUN_DOMAIN}>`,
        to: ownerEmail,
        subject: `Your new Shareboard: ${boardName}`,
        html: `
     <html>
<head>
  <meta charset="UTF-8">
  <title>Shareboard Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #2c3e50;">
        <h1 style="margin: 0; color: #ffffff;">Shareboard</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <h2 style="text-align: center; margin: 0 0 15px; color: #2c3e50;">Hello ${ownerName},</h2>
        <p style="text-align: center; margin: 0 0 15px; color: #333;">You successfully created a shareboard: <strong>${boardName}</strong>.</p>
        <p style="text-align: center; margin: 0 0 15px; color: #333;">Your owner key is: <code>${shareboardKey}</code>.</p>
        <a href="http://localhost:5173/board/${shareboardKey}" style="text-align:center; display: block; margin-top: 20px; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 4px;">Visit your board</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #ecf0f1;">
        <p style="margin: 0; color: #333;">Best regards,</p>
        <p style="margin: 0; color: #333;">Your Shareboard Team</p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      };
      console.log("Versende E-Mail mit Daten:", messageData);
      console.log("Mailgun API Key:", process.env.MAILGUN_API_KEY);
      console.log("Mailgun Domain:", process.env.MAILGUN_DOMAIN);
      console.log("Message Data:", messageData);
      try {
        await mg.messages.create(process.env.MAILGUN_DOMAIN, messageData);
        console.log("E-Mail erfolgreich gesendet");
      } catch (emailError) {
        console.error("Fehler beim Senden der E-Mail:", emailError);
      }
    }
    // Rückgabe des neu erstellten Shareboards, Owners und der Spalten
    res.status(201).json({
      newShareboard,
      owner,
      message: "Board und Spalten erfolgreich erstellt",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Fehler beim Erstellen des Shareboards und der Spalten",
    });
  }
};

// Hilfsfunktion für das Generieren eines Shareboard Keys
const generateShareboardKey = () => {
  return Math.random().toString(36).slice(2, 11); // Verwende slice() statt substr()
};

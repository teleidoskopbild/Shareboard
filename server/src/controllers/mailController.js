import mg from "../util/mailgun.js";

export const sendMail = async (req, res) => {
  const { boardName, userName, shareboardKey, userMail } = req.body;
  if (userMail) {
    const messageData = {
      from: `Shareboard <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: userMail,
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
          <h2 style="text-align: center; margin: 0 0 15px; color: #2c3e50;">Hello ${userName},</h2>
          <p style="text-align: center; margin: 0 0 15px; color: #333;">You have been invited to a shareboard: <strong>${boardName}</strong>.</p>
          <p style="text-align: center; margin: 0 0 15px; color: #333;">Your login key is: <code>${shareboardKey}</code>.</p>
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
};

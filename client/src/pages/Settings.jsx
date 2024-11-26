import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Settings() {
  const { shareboardId, ownerKey } = useParams(); // Hole shareboardId und ownerKey aus der URL
  const [boardData, setBoardData] = useState(null);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  useEffect(() => {
    const fetchBoardSettings = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/settings/${shareboardId}/${ownerKey}`
        );

        if (!response.ok) {
          throw new Error("Fehler beim Abrufen der Board-Daten.");
        }

        const data = await response.json();
        setBoardData(data);
      } catch (error) {
        console.log(error.message); // Fehler wird nur in der Konsole geloggt, nicht auf der Seite angezeigt
      }
    };

    fetchBoardSettings();
  }, [shareboardId, ownerKey]); // nur neu laden, wenn sich shareboardId oder ownerKey ändern

  const handleAddUser = async (e) => {
    e.preventDefault();
    const newUser = {
      name: newUserName,
      email: newUserEmail,
    };

    try {
      const response = await fetch(
        `${backendUrl}/api/settings/${shareboardId}/${ownerKey}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBoardData(data); // Board-Daten neu laden
        setNewUserName(""); // Formular zurücksetzen
        setNewUserEmail(""); // Formular zurücksetzen
      } else {
        setNewUserName("");
        setNewUserEmail("");
        console.log("Fehler beim Hinzufügen des Benutzers.");
      }
    } catch (error) {
      console.log("Fehler beim Hinzufügen des Benutzers:", error.message);
    }
  };

  if (!boardData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Boardname: {boardData.boardName}</h1>
      <p>Boardowner: {boardData.ownerName}</p>
      <p>Your personal Owner Key: {boardData.ownerKey}</p>

      <h2>Benutzer Hinzufügen</h2>
      <form onSubmit={handleAddUser}>
        <div>
          <label>Name des neuen Benutzers:</label>
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>E-Mail des neuen Benutzers (optional):</label>
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
        </div>
        <button type="submit">Benutzer hinzufügen</button>
      </form>

      <h2>Benutzer des Boards</h2>
      <h2>Benutzer des Boards</h2>
      <ul>
        {boardData.users.map((user) => (
          <li key={user.id}>
            {user.name} {user.email ? `(${user.email})` : "(Keine E-Mail)"}
            <br />
            Schlüssel: {user.shareboardKey}
          </li>
        ))}
      </ul>
    </div>
  );
}

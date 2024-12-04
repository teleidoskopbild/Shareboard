import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Settings() {
  const { shareboardId, ownerKey } = useParams(); // Hole shareboardId und ownerKey aus der URL
  const [boardData, setBoardData] = useState(null);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  const [editUserId, setEditUserId] = useState(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");

  // const { state } = useLocation();
  const navigate = useNavigate();
  // console.log("state: ", state);
  // console.log(shareboardId, ownerKey);
  useEffect(() => {
    console.log("useEffect", shareboardId, ownerKey);
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

  const handleNavigateToBoard = () => {
    navigate(`/board/${boardData.ownerKey}`);
  };

  const handleEditUser = (user) => {
    setEditUserId(user.id);
    setEditUserName(user.name);
    setEditUserEmail(user.email || "");
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();

    const updatedUser = { name: editUserName, email: editUserEmail };
    const oldUserName = boardData.users.find(
      (user) => user.id === editUserId
    )?.name; // Den alten Namen herausfinden

    try {
      const response = await fetch(
        `${backendUrl}/api/settings/${shareboardId}/${ownerKey}/users/${editUserId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBoardData((prevData) => ({
          ...prevData,
          users: prevData.users.map((user) =>
            user.id === editUserId
              ? { ...user, ...data } // Vorhandene Daten mit neuen Daten kombinieren
              : user
          ),
        }));

        const logMessage = `User ${oldUserName} renamed to ${editUserName}`;
        const logResponse = await fetch(`${backendUrl}/api/logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shareboard_fk: shareboardId,
            message: logMessage,
          }),
        });

        if (!logResponse.ok) {
          throw new Error("Fehler beim Erstellen des Logs");
        }

        console.log("Log erfolgreich erstellt");

        setEditUserId(null); // Bearbeitung zurücksetzen
        setEditUserName(""); // Eingabefeld zurücksetzen
        setEditUserEmail(""); // Eingabefeld zurücksetzen
      } else {
        console.log("Fehler beim Speichern der Änderungen.");
      }
    } catch (error) {
      console.log("Fehler beim Speichern der Änderungen:", error.message);
    }
  };

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
        setBoardData((prevData) => {
          return { ...prevData, users: data.users };
        }); // Board-Daten neu laden
        setNewUserName(""); // Formular zurücksetzen
        setNewUserEmail(""); // Formular zurücksetzen

        const logMessage = `User - ${newUserName} was created`;
        const logResponse = await fetch(`${backendUrl}/api/logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shareboard_fk: shareboardId,
            message: logMessage,
          }),
        });

        if (!logResponse.ok) {
          throw new Error("Fehler beim Erstellen des Logs");
        }

        console.log("Log erfolgreich erstellt");
      } else {
        setNewUserName("");
        setNewUserEmail("");
        console.log("Fehler beim Hinzufügen des Benutzers.");
      }
    } catch (error) {
      console.log("Fehler beim Hinzufügen des Benutzers:", error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    const userToDelete = boardData.users.find((user) => user.id === userId); // Benutzer anhand der ID finden
    const userName = userToDelete ? userToDelete.name : "Unbekannt"; // Falls der Benutzer gefunden wird, den Namen verwenden
    try {
      const response = await fetch(
        `${backendUrl}/api/settings/${shareboardId}/${ownerKey}/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Benutzer erfolgreich gelöscht, jetzt Board-Daten neu laden
        setBoardData((prevData) => ({
          ...prevData,
          users: prevData.users.filter((user) => user.id !== userId),
        }));
        const logMessage = `User - ${userName} was deleted`;
        const logResponse = await fetch(`${backendUrl}/api/logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shareboard_fk: shareboardId,
            message: logMessage,
          }),
        });

        if (!logResponse.ok) {
          throw new Error("Fehler beim Erstellen des Logs");
        }

        console.log("Log erfolgreich erstellt");
      } else {
        const errorData = await response.json();
        console.log(errorData.message); // Fehler anzeigen
      }
    } catch (error) {
      console.log("Fehler beim Löschen des Benutzers:", error.message);
    }
  };

  const handleDeleteBoard = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/settings/${shareboardId}/${ownerKey}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Redirect nach erfolgreichem Löschen oder eine Erfolgsnachricht anzeigen
        alert("Board wurde erfolgreich gelöscht!");
        // Weiterleitung zu einer anderen Seite (z.B. zur Übersicht)
        window.location.href = "/"; // Beispiel: Zur Startseite
      } else {
        const errorData = await response.json();
        console.log(errorData.message); // Fehler anzeigen
      }
    } catch (error) {
      console.log("Fehler beim Löschen des Boards:", error.message);
    }
  };

  if (!boardData) {
    return <div>Loading...</div>;
  }
  console.log(boardData.users);
  console.log("Empfangene Daten in Settings:", boardData);

  return (
    <div>
      <h1>Boardname: {boardData.boardName}</h1>
      <p>Boardowner: {boardData.ownerName}</p>
      <p>Your personal Owner Key: {boardData.ownerKey}</p>
      <h2>Add a User</h2>
      <form onSubmit={handleAddUser}>
        <div>
          <label>Name of the new User:</label>
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>E-Mail of the new User (optional):</label>
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
        </div>
        <button type="submit">Add User</button>
      </form>
      <h2>Board Users</h2>
      <ul>
        {boardData.users
          .filter((user) => {
            return user.rights === false;
          })

          .map((user) => (
            <li key={user.id}>
              {user.name} {user.email ? `(${user.email})` : "(Keine E-Mail)"}
              <br />
              Key: {user.shareboardKey}
              {/* Bearbeitungsformular nur anzeigen, wenn der Benutzer bearbeitet wird */}
              {editUserId === user.id ? (
                <form onSubmit={handleSaveUser}>
                  <div>
                    <label>New Name:</label>
                    <input
                      type="text"
                      value={editUserName}
                      onChange={(e) => setEditUserName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label>New E-Mail:</label>
                    <input
                      type="email"
                      value={editUserEmail}
                      onChange={(e) => setEditUserEmail(e.target.value)}
                    />
                  </div>
                  <button type="submit">Save</button>
                  <button onClick={() => setEditUserId(null)}>Cancel</button>
                </form>
              ) : (
                <div>
                  <button onClick={() => handleEditUser(user)}>Edit</button>
                  <button onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
      </ul>{" "}
      <div>
        <button onClick={handleNavigateToBoard}>Go to Board</button>
      </div>
      {boardData.ownerKey === ownerKey && (
        <div>
          <h2>Delete Board</h2>
          <p>
            Are you sure you want to delete the entire board, including all
            users and data?
          </p>
          <button onClick={handleDeleteBoard}>Delete Board</button>
        </div>
      )}
    </div>
  );
}

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

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // const { state } = useLocation();
  const navigate = useNavigate();

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

  const handleSendEmail = async (user) => {
    try {
      const response = await fetch(`${backendUrl}/api/mail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: user.name,
          shareboardKey: user.shareboardKey,
          boardName: boardData.boardName,
          userMail: user.email,
        }),
      });

      if (response.ok) {
        console.log("E-Mail erfolgreich versendet.");
        // Hier kann man eventuell ein Feedback anzeigen, dass die E-Mail gesendet wurde
      } else {
        console.error("Fehler beim Versenden der E-Mail:", response.statusText);
      }
    } catch (error) {
      console.error("Fehler beim Versenden der E-Mail:", error.message);
    }
  };

  if (!boardData) {
    return <div>Loading...</div>;
  }
  console.log(boardData.users);
  console.log("Empfangene Daten in Settings:", boardData);

  return (
    <div className="p-4 md:p-8 max-w-screen-lg mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-4">
          Boardname: {boardData.boardName}
        </h1>
        <p className="text-lg mb-4">Boardowner: {boardData.ownerName}</p>
        <p className="text-lg mb-6">
          Your personal Owner Key: {boardData.ownerKey}
        </p>

        <div className="mt-8 mb-8">
          <button
            onClick={handleNavigateToBoard}
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Go to Board
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Add a User</h2>
      <form onSubmit={handleAddUser} className="mb-6">
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Name of the new User:
          </label>
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            E-Mail of the new User (optional):
          </label>
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Add User
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Board Users</h2>
      <ul className="space-y-4">
        {boardData.users
          .filter((user) => !user.rights)
          .map((user) => (
            <li key={user.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <div>
                <span className="font-semibold">{user.name}</span>
                {user.email ? ` (${user.email})` : " (Keine E-Mail)"}
              </div>
              <div>Key: {user.shareboardKey}</div>

              {editUserId === user.id ? (
                <form onSubmit={handleSaveUser} className="mt-4">
                  <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">
                      New Name:
                    </label>
                    <input
                      type="text"
                      value={editUserName}
                      onChange={(e) => setEditUserName(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">
                      New E-Mail:
                    </label>
                    <input
                      type="email"
                      value={editUserEmail}
                      onChange={(e) => setEditUserEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditUserId(null)}
                    className="ml-4 bg-gray-300 text-black py-2 px-6 rounded-md hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex space-x-4 mt-4 justify-between">
                  <div>
                    {" "}
                    <button
                      onClick={() => handleEditUser(user)}
                      className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200 mr-6"
                    >
                      Edit
                    </button>
                    {user.email && (
                      <button
                        onClick={() => handleSendEmail(user)}
                        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-200"
                      >
                        Send Mail
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
      </ul>

      {boardData.ownerKey === ownerKey && (
        <div className="mt-8 bg-red-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Delete Board</h2>
          {isDeleteMode ? (
            <>
              <p className="mb-4">
                Are you sure you want to delete the entire board, including all
                users and data?
              </p>
              <p className="mb-4">Type DELETE to confirm:</p>
              <input
                type="text"
                placeholder="Type DELETE here"
                className=" flex w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                onChange={(e) => setInputValue(e.target.value)} // Track input directly
              />
              <button
                onClick={() => {
                  if (inputValue.trim() === "DELETE") {
                    handleDeleteBoard();
                  } else {
                    alert(
                      "Please type DELETE to confirm and then press the DELETE button."
                    );
                  }
                }}
                className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleteMode(false)}
                className="ml-4 bg-gray-300 text-black py-2 px-6 rounded-md hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsDeleteMode(true)}
              className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition duration-200"
            >
              Delete Board
            </button>
          )}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function CreateBoard() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedLayout = location.state?.layout || "Kein Layout ausgewählt";

  const [boardName, setBoardName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  const boardData = {
    boardName,
    ownerName,
    ownerEmail,
    layout: selectedLayout,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Zeigt die Daten an, die der User eingegeben hat
    console.log("Gesammelte Daten:", boardData);

    try {
      const response = await fetch(`${backendUrl}/api/create-new-board`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(boardData),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Erstellen des Shareboards");
      }

      const result = await response.json();
      console.log("Shareboard erstellt:", result);

      const logMessage = `Board - ${boardData.boardName} created by ${boardData.ownerName}`;
      const logResponse = await fetch(`${backendUrl}/api/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shareboard_fk: result.newShareboard.id,
          message: logMessage,
        }),
      });

      if (!logResponse.ok) {
        throw new Error("Fehler beim Erstellen des Logs");
      }

      console.log("Log erfolgreich erstellt");

      // Nach der erfolgreichen Erstellung des Boards auf die Settings-Seite umleiten
      // Ergebnis enthält den `shareboardId` und den `ownerKey`
      navigate(
        `/settings/${result.newShareboard.id}/${result.owner.shareboard_key}`,
        { state: { result } }
      );
    } catch (error) {
      console.error("Fehler:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 dark:bg-gray-900 dark:text-gray-200">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Create a New Board
      </h2>
      <p className="text-lg mb-6">Chosen Layout: {selectedLayout.name}</p>

      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Board Name:</label>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            required
            placeholder="Enter a Name for the board"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Owner Name:</label>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            required
            placeholder="Enter your Name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:bg-gray-600  dark:text-gray-200"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Owner Email:</label>
          <input
            type="email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            required
            placeholder="Enter your E-Mail"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:bg-gray-600  dark:text-gray-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white mt-6 py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          Create Board
        </button>
      </form>
    </div>
  );
}

export default CreateBoard;

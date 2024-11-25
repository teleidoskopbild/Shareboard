import { useState } from "react";
import { useLocation } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function CreateBoard() {
  const location = useLocation();
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

      // Hier kannst du weiter mit der Antwort vom Server arbeiten,
      // z.B. Redirect zur neuen Board-Seite oder eine Bestätigung anzeigen.
    } catch (error) {
      console.error("Fehler:", error);
    }
  };

  return (
    <div>
      <h2>Create a New Board</h2>
      <p>Ausgewähltes Layout: {selectedLayout.name}</p>

      {/* Zeigt die Spalten des ausgewählten Layouts an */}
      <div>
        <h3>Spalten:</h3>
        <ul>
          {selectedLayout.columns.length > 0 ? (
            selectedLayout.columns.map((column, index) => (
              <li key={index}>{column.name}</li>
            ))
          ) : (
            <p>Freestyle – keine vordefinierten Spalten</p>
          )}
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Board Name:</label>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Owner Name:</label>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Owner Email (optional):</label>
          <input
            type="email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
          />
        </div>
        <button type="submit">Create Board</button>
      </form>
    </div>
  );
}

export default CreateBoard;

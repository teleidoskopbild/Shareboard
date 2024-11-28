import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Board() {
  const { userKey } = useParams(); // Hole den userKey aus der URL
  const [boardData, setBoardData] = useState(null); // Board-Daten speichern
  const [error] = useState(null); // Fehler speichern

  useEffect(() => {
    // Funktion zum Abrufen der Daten
    const fetchBoardData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/board/${userKey}`);
        if (!response.ok) {
          throw new Error("Fehler beim Laden des Boards.");
        }
        const data = await response.json();
        setBoardData(data); // Speichere die Daten im State
        console.log("Board-Daten:", data); // Daten in der Konsole anzeigen
      } catch (err) {
        console.error("Fetch-Fehler:", err.message);
      }
    };

    fetchBoardData();
  }, [userKey]);

  if (error) {
    return <h1>Fehler: {error}</h1>;
  }

  if (!boardData) {
    return <h1>Board wird geladen...</h1>;
  }

  return (
    <div>
      <h1>Board Daten:</h1>
      <pre>{JSON.stringify(boardData, null, 2)}</pre>{" "}
      {/* Gibt das gesamte Objekt als JSON aus */}
    </div>
  );
}

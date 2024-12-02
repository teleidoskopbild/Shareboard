import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import BoardColumn from "../components/BoardColumn.jsx";
import Note from "../components/Note.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Board() {
  const { userKey } = useParams(); // Hole den userKey aus der URL
  const [boardData, setBoardData] = useState(null); // Board-Daten speichern
  const [error] = useState(null); // Fehler speichern

  const [notes, setNotes] = useState([]); // Original-Notizen
  const [activeNote, setActiveNote] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [userLog, setUserLog] = useState([]);

  const navigate = useNavigate();

  const handleNavigateToSettings = () => {
    // Navigiere zurück zur Settings-Seite mit den entsprechenden Parametern
    navigate(`/settings/${boardData.board.id}/${userKey}`);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const note = notes.find((note) => note.id === active.id);
    if (!note) {
      console.error("Keine Notiz mit der ID gefunden:", active.id);
      return;
    }
    setActiveNote(note);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveNote(null);

    if (!over) return;
    if (over) {
      const draggedNote = notes.find((note) => note.id === active.id);

      if (!draggedNote) {
        console.error("Keine Notiz mit der ID gefunden:", active.id);
        return;
      }

      // Sofort im Zwischenzustand (UI) aktualisieren
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === active.id
            ? { ...note, board_column_fk: over.id } // Update nur im Zwischenzustand
            : note
        )
      );

      try {
        // API-Call zum Backend für die Spaltenänderung
        const response = await fetch(
          `${backendUrl}/api/editNoteColumn/${active.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newColumnId: over.id }),
          }
        );

        if (!response.ok) {
          throw new Error("Fehler beim Aktualisieren der Notiz-Spalte.");
        }

        const updatedNote = await response.json();

        // Nach erfolgreicher API-Antwort aktualisieren wir den Originalzustand
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === active.id
              ? { ...note, board_column_fk: updatedNote.note.board_column_fk }
              : note
          )
        );

        // Log-Nachricht erstellen
        setUserLog((prevLog) => [
          ...prevLog,
          `${activeNote.title} wurde verschoben nach ${
            over.id
          } um ${new Date().toLocaleTimeString()}`,
        ]);
      } catch (error) {
        console.error("Fehler beim Verschieben der Notiz:", error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const shareboard_fk = boardData?.board.id;
    const currentUser = boardData.users.find(
      (user) => user.shareboard_key === userKey
    );

    const newNote = {
      title: newTitle,
      description: newDescription,
      board_column_fk: boardData.columns[0]?.id, // Erste Spalte als Standard
      shareboard_fk,
      user_fk: currentUser.id,
    };

    // Schritt 1: Sende die Notiz an das Backend
    try {
      const response = await fetch(`${backendUrl}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote), // Sende nur die Daten ohne ID
      });

      if (!response.ok) {
        throw new Error("Fehler beim Erstellen der Notiz.");
      }

      const savedNote = await response.json(); // Hole die Notiz mit der ID zurück

      // Schritt 2: Füge die Notiz mit der richtigen ID zum Zustand hinzu
      setNotes((prevNotes) => [
        ...prevNotes,
        savedNote, // Die vom Backend zurückgegebene Notiz mit der ID
      ]);

      setNewTitle(""); // Eingabefelder zurücksetzen
      setNewDescription("");

      // Log-Nachricht erstellen
      setUserLog((prevLog) => [
        ...prevLog,
        `Neue Notiz "${newTitle}" wurde um ${new Date().toLocaleTimeString()} erstellt`,
      ]);
    } catch (error) {
      console.error("Fehler beim Erstellen der Notiz:", error.message);
    }
  };

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/board/${userKey}`);
        if (!response.ok) {
          throw new Error("Fehler beim Laden des Boards.");
        }
        const data = await response.json();
        setBoardData(data); // Speichere die Daten im State
        setNotes(data.notes);

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
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      {boardData.isOwner && (
        <div>
          <button onClick={handleNavigateToSettings}>
            Zurück zu den Einstellungen
          </button>
        </div>
      )}
      <div>
        <h1>{boardData.board.name}</h1> {/* Boardname anzeigen */}
        <h2>Board Nutzer:</h2>
        <ul>
          {boardData.users.map((user) => (
            <li key={user.id}>{user.name}</li> // Nutzer anzeigen
          ))}
        </ul>
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          gap: "10px",
          margin: "20px",
        }}
      >
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Titel"
          required
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Beschreibung"
          required
        />
        <button type="submit">Notiz hinzufügen</button>
      </form>
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Dynamisches Rendern der Spalten */}
        {boardData.columns.map((column) => (
          <BoardColumn
            key={column.id}
            title={column.name} // Titel der Spalte
            notes={notes.filter((note) => note.board_column_fk === column.id)} // Notizen der Spalte aus dem Zwischenzustand
            columnId={column.id}
            userKey={userKey}
          />
        ))}
      </div>
      <div>
        <h3>User Log</h3>
        <ul>
          {userLog.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>

      <DragOverlay>
        {activeNote ? <Note note={activeNote} userKey={userKey} /> : null}{" "}
        {/* Overlay für das dragged Element */}
      </DragOverlay>
    </DndContext>
  );
}

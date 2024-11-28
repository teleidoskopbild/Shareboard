import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import BoardColumn from "../components/BoardColumn.jsx";
import Note from "../components/Note.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const mockNotes = [
  {
    id: "1",
    title: "Task 1",
    description: "Description for Task 1",
    status: "backlog",
  },
  {
    id: "2",
    title: "Task 2",
    description: "Description for Task 2",
    status: "in-progress",
  },
  {
    id: "3",
    title: "Task 3",
    description: "Description for Task 3",
    status: "done",
  },
  {
    id: "4",
    title: "Task 4",
    description: "Description for Task 4",
    status: "done",
  },
];

export default function Board() {
  const { userKey } = useParams(); // Hole den userKey aus der URL
  const [boardData, setBoardData] = useState(null); // Board-Daten speichern
  const [error] = useState(null); // Fehler speichern

  const [notes, setNotes] = useState(mockNotes);
  const [activeNote, setActiveNote] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [userLog, setUserLog] = useState([]);

  const boards = ["backlog", "in-progress", "done", "to-review"];

  const handleDragStart = (event) => {
    const { active } = event;
    const note = notes.find((note) => note.id === active.id);
    setActiveNote(note);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveNote(null);
    if (over && active.id !== over.id) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === active.id ? { ...note, status: over.id } : note
        )
      );
      // Log-Nachricht erstellen, wenn eine Notiz verschoben wird
      setUserLog((prevLog) => [
        ...prevLog,
        `${activeNote.title} wurde verschoben nach ${
          over.id
        } um ${new Date().toLocaleTimeString()}`,
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNote = {
      id: (notes.length + 1).toString(), // Generiere eine neue ID
      title: newTitle,
      description: newDescription,
      status: "backlog", // Neue Notiz landet im "backlog"
    };
    setNotes([...notes, newNote]);
    setNewTitle(""); // Eingabefelder zurücksetzen
    setNewDescription("");
    // Log-Nachricht erstellen, wenn eine Notiz erstellt wird
    setUserLog((prevLog) => [
      ...prevLog,
      `Neue Notiz "${newTitle}" wurde um ${new Date().toLocaleTimeString()} erstellt`,
    ]);
  };

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
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
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
        {boards.map((board) => (
          <BoardColumn
            key={board}
            title={board}
            notes={notes.filter((note) => note.status === board)}
          />
        ))}
        <h3>User Log</h3>
        <ul>
          {userLog.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>

      <DragOverlay>
        {activeNote ? <Note note={activeNote} /> : null}{" "}
        {/* Overlay für das dragged Element */}
      </DragOverlay>
    </DndContext>
  );
}

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
      console.error("Can not find Note with ID:", active.id);
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
        console.error("Can not find Note with ID:", active.id);
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
          throw new Error("Error updating the note column.");
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

        const fromColumn = boardData.columns.find(
          (column) => column.id === draggedNote.board_column_fk
        );
        const toColumn = boardData.columns.find(
          (column) => column.id === over.id
        );

        // Prüfen, ob sich die Spalte geändert hat
        if (fromColumn?.name !== toColumn?.name) {
          const currentUser = boardData.users.find(
            (user) => user.shareboard_key === userKey
          );

          const logMessage = `Note - ${draggedNote.title} moved from ${fromColumn.name} to ${toColumn.name} by ${currentUser.name}`;
          const logResponse = await fetch(`${backendUrl}/api/logs`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              shareboard_fk: draggedNote.shareboard_fk,
              message: logMessage,
            }),
          });

          if (!logResponse.ok) {
            throw new Error("Error creating the log.");
          }

          setUserLog((prevLogs) => [
            { message: logMessage, timestamp: new Date() },
            ...prevLogs,
          ]);
        }
      } catch (error) {
        console.error("Error while moving the note:", error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const shareboard_fk = boardData?.board.id;
    const currentUser = boardData.users.find(
      (user) => user.shareboard_key === userKey
    );
    console.log("cu: ", currentUser);
    console.log("uk: ", userKey);

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
        throw new Error("Error creating the log.");
      }

      const savedNote = await response.json(); // Hole die Notiz mit der ID zurück

      // Schritt 2: Füge die Notiz mit der richtigen ID zum Zustand hinzu
      setNotes((prevNotes) => [
        ...prevNotes,
        savedNote, // Die vom Backend zurückgegebene Notiz mit der ID
      ]);

      const logMessage = `Task ${savedNote.title} created by ${currentUser.name}`;
      const logResponse = await fetch(`${backendUrl}/api/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shareboard_fk: shareboard_fk,
          message: logMessage,
        }),
      });

      if (!logResponse.ok) {
        throw new Error("Error creating the log.");
      }
      setUserLog((prevLogs) => [
        { message: logMessage, timestamp: new Date() }, // Log-Eintrag hinzufügen
        ...prevLogs,
      ]);

      setNewTitle(""); // Eingabefelder zurücksetzen
      setNewDescription("");
    } catch (error) {
      console.error("Error while creatingthe note:", error.message);
    }
  };

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/board/${userKey}`);
        if (!response.ok) {
          throw new Error("Error loading the board.");
        }
        const data = await response.json();
        setBoardData(data); // Speichere die Daten im State
        setNotes(data.notes);
        setUserLog(data.logs);
      } catch (err) {
        console.error("Fetch-Error:", err.message);
      }
    };

    fetchBoardData();
  }, [userKey]);

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  if (!boardData) {
    return <h1>Loading BoardData...</h1>;
  }

  const currentUserName =
    boardData.users.find((user) => user.shareboard_key === userKey)?.name ||
    "Unbekannt";

  console.log("cun: ", currentUserName);

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      {/* Zurück zur Einstellung für den Besitzer */}
      {boardData.isOwner && (
        <div className="mb-4">
          <button
            onClick={handleNavigateToSettings}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Back to Settings
          </button>
        </div>
      )}

      {/* Board-Titel und Benutzerliste */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{boardData.board.name}</h1>
        <h2 className="text-xl font-semibold mb-2">Board Users:</h2>
        <ul className="list-disc ml-6">
          {boardData.users.map((user) => (
            <li key={user.id} className="text-gray-700">
              {user.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Task hinzufügen */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8 w-full max-w-md"
      >
        <h3 className="text-lg font-semibold mb-4">Add a Task</h3>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Title"
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          required
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Description"
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Add Task
        </button>
      </form>

      {/* Spaltenbereich */}
      <div className="flex flex-wrap gap-4">
        {boardData.columns.map((column) => (
          <BoardColumn
            key={column.id}
            title={column.name}
            notes={notes.filter((note) => note.board_column_fk === column.id)}
            columnId={column.id}
            userKey={userKey}
            currentUserName={currentUserName}
          />
        ))}
      </div>

      {/* Benutzer-Log */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">User Log</h3>
        <ul className="space-y-2">
          {userLog.map((log, index) => {
            const timestamp = new Date(log.timestamp);
            const formattedTime = timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <li key={index} className="text-gray-600">
                <p>
                  {log.message} at{" "}
                  <span className="font-medium">{formattedTime}</span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeNote ? (
          <Note
            note={activeNote}
            userKey={userKey}
            currentUserName={currentUserName}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

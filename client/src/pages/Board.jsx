import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import BoardColumn from "../components/BoardColumn.jsx";
import Note from "../components/Note.jsx";
import pusher from "../pusher.js";

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

  const [reload, setReload] = useState(true);

  const navigate = useNavigate();
  const handleNavigateToSettings = () => {
    // Navigiere zurück zur Settings-Seite mit den entsprechenden Parametern
    navigate(`/settings/${boardData.board.id}/${userKey}`);
  };
  const handleNavigateToUserLog = () => {
    // Navigiere zurück zur Settings-Seite mit den entsprechenden Parametern
    navigate(`/userlog/${boardData.board.id}/${userKey}`);
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

          const logMessage = `Task - ${draggedNote.title} moved from ${fromColumn.name} to ${toColumn.name} by ${currentUser.name}`;
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
        setReload(false);
      } catch (err) {
        console.error("Fetch-Error:", err.message);
      }
    };
    if (reload) {
      fetchBoardData();
    }
  }, [userKey, reload]);

  useEffect(() => {
    const channel = pusher.subscribe("notes");

    async function pusherHandler() {
      setReload(true);
    }
    channel.bind("reload", pusherHandler);

    // Setze Pusher Event Listener

    // Cleanup, wenn der Kanal nicht mehr benötigt wird
    return () => {
      channel.unbind("reload", pusherHandler);
    };
  }, []);

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  if (!boardData) {
    return <h1>Loading BoardData...</h1>;
  }

  const currentUserName =
    boardData.users.find((user) => user.shareboard_key === userKey)?.name ||
    "Unbekannt";

  // const columnColors = [
  //   "bg-red-500",
  //   "bg-blue-500",
  //   "bg-yellow-500",
  //   "bg-green-500",
  //   "bg-purple-500",
  // ];

  const columnColors = [
    "bg-blue-800",
    "bg-blue-700",
    "bg-blue-600",
    "bg-blue-500",
    "bg-blue-400",
    "bg-blue-300",
  ];

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="flex flex-col min-h-screen px-4 dark:bg-gray-900 dark:text-gray-200 ">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 px-4 gap-4 p-4 mt-2 rounded-lg">
          {/* Board Name */}
          <div className="">
            <h1 className="text-4xl font-bold text-gray-800 leading-tight dark:text-gray-200">
              Project: {boardData.board.name}
            </h1>
          </div>

          {/* Settings Button */}
          {boardData.isOwner && (
            <div className="mt-4 lg:mt-0">
              <button
                onClick={handleNavigateToSettings}
                className="bg-blue-500 text-white mr-16 py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 dark:bg-blue-900 dark:hover:bg-blue-800"
              >
                Go to Settings
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-2 flex-grow">
          {/* Task hinzufügen */}
          <div className="flex flex-col gap-0 w-full lg:w-1/4 mt-0 ">
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md  border border-gray-300 rounded-lg p-6 mb-8 w-full max-w-md dark:bg-gray-800 dark:text-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Add a Task
                </h3>{" "}
                <button
                  type="submit"
                  className="ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:bg-blue-900 dark:hover:bg-blue-800"
                >
                  Add Task
                </button>
              </div>

              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title"
                className="border border-gray-300 rounded-lg p-2 w-full mb-4 dark:bg-gray-600"
                required
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description"
                className="border border-gray-300 rounded-lg p-2 w-full mb-4 dark:bg-gray-600"
                required
              />
            </form>
            {/* Benutzer-Log */}
            <div className="mb-8 mt-2 w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6 dark:bg-gray-800 dark:text-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  User Log
                </h3>
                <button
                  onClick={handleNavigateToUserLog}
                  className="ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:bg-blue-900 dark:hover:bg-blue-800"
                >
                  View All
                </button>
              </div>

              <ul className="space-y-2">
                {userLog.slice(0, 5).map((log, index) => {
                  const timestamp = new Date(log.timestamp);
                  const formattedTime = timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const formattedDate = timestamp.toLocaleDateString([], {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });

                  return (
                    <li
                      key={index}
                      className="text-gray-600 bg-gray-50 rounded-md p-3 shadow-sm dark:bg-gray-600 dark:text-gray-200"
                    >
                      <p>{log.message} </p>
                      <p className="mt-2 text-gray-500 text-sm">
                        {formattedTime} on {formattedDate}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Spaltenbereich */}
          <div className="flex flex-nowrap gap-4 w-full lg:w-3/4 overflow-x-auto">
            {boardData.columns.map((column, index) => {
              const colorClass = columnColors[index % columnColors.length];
              return (
                <BoardColumn
                  key={column.id}
                  title={column.name}
                  notes={notes.filter(
                    (note) => note.board_column_fk === column.id
                  )}
                  columnId={column.id}
                  userKey={userKey}
                  currentUserName={currentUserName}
                  colorClass={colorClass}
                />
              );
            })}
          </div>
        </div>
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

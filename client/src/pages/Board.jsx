import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import BoardColumn from "../components/BoardColumn.jsx";
import Note from "../components/Note.jsx";
import pusher from "../pusher.js";
import FilterInput from "../components/FilterInput.jsx";

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

  const [filter, setFilter] = useState("");

  const [assignmentFilter, setAssignmentFilter] = useState("all");

  const [priorityFilter, setPriorityFilter] = useState("All");

  const handleResetButton = () => {
    setFilter("");
    setAssignmentFilter("all");
    setPriorityFilter("All");
  };

  const handlePriorityChange = (event) => {
    setPriorityFilter(event.target.value);
  };

  const handleAssignmentChange = (event) => {
    setAssignmentFilter(event.target.value);
  };

  const filteredNotes = notes.filter((note) => {
    const matchesAssignment =
      assignmentFilter === "all" ||
      (assignmentFilter === "nobody" && note.assignee === "nobody") ||
      note.assignee === assignmentFilter;

    const matchesTitle = note.title
      .toLowerCase()
      .includes(filter.toLowerCase());

    const matchesPriority =
      priorityFilter === "All" ||
      (priorityFilter === "No Priority" && note.priority === "No Priority") ||
      (priorityFilter === "Low Priority" && note.priority === "Low Priority") ||
      (priorityFilter === "Normal Priority" &&
        note.priority === "Normal Priority") ||
      (priorityFilter === "High Priority" && note.priority === "High Priority");

    return matchesAssignment && matchesTitle && matchesPriority;
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // const filteredNotes = notes.filter((note) =>
  //   note.title.toLowerCase().includes(filter.toLowerCase())
  // );

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

          const logMessage = `${draggedNote.title} moved from ${fromColumn.name} to ${toColumn.name} by ${currentUser.name}`;
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
      <div className=" flex flex-col min-h-screen px-4 dark:bg-gray-950 dark:text-gray-200 ">
        {/* Header */}
        <div className="flex flex-col flex-wrap  lg:flex-row justify-between items-center mb-8 px-4 gap-4 p-4 mt-2 rounded-lg">
          {/* Board Name */}
          <div className="flex flex-wrap">
            <h1 className="mr-8 text-4xl font-bold text-gray-800 leading-tight dark:text-gray-200">
              Project: {boardData.board.name}
            </h1>
            <FilterInput
              onFilterChange={handleFilterChange}
              filter={filter}
              // setFilter={setFilter}
            />
            <div className="flex items-center mt-2 sm:ml-4">
              <select
                value={assignmentFilter}
                onChange={handleAssignmentChange}
                className="w-40 p-2 border border-gray-300 rounded-lg dark:bg-gray-600 dark:text-gray-200 dark:border-gray-400 dark:text-gray-400"
              >
                <option value="" disabled>
                  Filter Users
                </option>
                <option value="all">All</option>
                <option value="nobody">Nobody</option>
                {boardData.users.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
              <p className="ml-2 text-gray-800 dark:text-gray-400"></p>
            </div>
            <div className="flex items-center mt-2 sm:ml-4">
              <select
                value={priorityFilter}
                onChange={handlePriorityChange}
                className="w-40 p-2 border border-gray-300 rounded-lg dark:bg-gray-600 dark:text-gray-200 dark:border-gray-400 dark:text-gray-400"
              >
                <option value="" disabled>
                  Filter Priorities
                </option>
                <option value="All">All</option>
                <option value="No Priority">No Priority</option>
                <option value="Low Priority">Low Priority</option>
                <option value="Normal Priority">Normal Priority</option>
                <option value="High Priority">High Priority</option>
              </select>
            </div>{" "}
            <button
              onClick={handleResetButton}
              className="ml-4 mt-2 bg-blue-500 text-white py-0 px-4 rounded-lg rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Reset Filters
            </button>
          </div>

          {/* Settings Button */}
          {boardData.isOwner && (
            <div className="mt-2">
              <button
                onClick={handleNavigateToSettings}
                className="mr-auto 2xl:mr-16 bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Go to Settings
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-2 flex-grow">
          {/* Task hinzufügen */}
          <div className="flex flex-col gap-0 w-full lg:w-1/4 mt-0">
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md  border border-2 border-gray-300 rounded-lg p-6 mb-8 w-full max-w-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-500"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Add a Task
                </h3>{" "}
                <button
                  type="submit"
                  className="ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
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
            <div className="mb-8 mt-8 w-full max-w-md bg-white border border-2 border-gray-300 rounded-lg shadow-lg p-6 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  User Log
                </h3>
                <button
                  onClick={handleNavigateToUserLog}
                  className="ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  View All
                </button>
              </div>

              <ul className="space-y-2">
                {userLog.slice(0, 4).map((log, index) => {
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
                      <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
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
                  notes={filteredNotes.filter(
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

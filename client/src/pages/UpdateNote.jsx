import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UpdateNote = () => {
  const location = useLocation();
  const { shareboard_fk, userName } = location.state;
  console.log(userName);
  const { id, userKey } = useParams(); // Hole die ID der Notiz aus der URL
  const navigate = useNavigate();
  const [note, setNote] = useState({
    title: "",
    description: "",
    priority: "",
    columnId: "",
    assignee: "",
  });

  console.log(id);
  console.log(userKey);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [users, setUsers] = useState([]);
  const [originalNote, setOriginalNote] = useState(null);
  // const [answer, setAnswer] = useState(null);

  const [isMarkdownView, setIsMarkdownView] = useState(false);

  console.log("shareboard_fk:", shareboard_fk);
  console.log("userName ", userName);

  useEffect(() => {
    const fetchNote = async () => {
      const response = await fetch(`${backendUrl}/api/notes/${id}`);
      const data = await response.json();
      console.log("Note data:", data);
      setNote(data);
      setSelectedColumn(data.columnId);
      setOriginalNote(data);
    };

    const fetchColumns = async () => {
      const response = await fetch(`${backendUrl}/api/columns/user/${userKey}`);
      const columnsData = await response.json();
      setColumns(columnsData);
      console.log("Columns data:", columnsData);
    };

    const fetchUsers = async () => {
      const response = await fetch(`${backendUrl}/api/board/${userKey}/users`);
      const usersData = await response.json();
      setUsers(usersData);
    };

    fetchNote();
    fetchColumns();
    fetchUsers();
  }, [id, userKey]);

  const toggleMarkdownView = () => {
    setIsMarkdownView((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const generateDescriptionFromTitle = async (title) => {
    try {
      const response = await fetch(`${backendUrl}/api/generate-description`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Error generating description");
      }

      const data = await response.json();
      console.log("Generated description:", data.description);

      // Nur in das Description-Feld setzen, ohne zu speichern
      setNote((prevNote) => ({
        ...prevNote,
        description: data.description, // Die generierte Beschreibung wird nur im Feld angezeigt
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // console.log("answer: ", answer);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!note.title.trim()) {
      // Überprüft, ob der Titel leer ist
      alert("Title cannot be empty!");
      return; // Bricht die Funktion ab, wenn der Titel leer ist
    }

    let logMessage = "";
    // Überprüfen, ob sich der Titel geändert hat
    if (note.title !== originalNote.title) {
      logMessage += `Task renamed: from "${originalNote.title}" to "${note.title}" by ${userName} `;
    }

    // Wenn sich die Spalte ändert, nur dann loggen
    // if (note.columnId !== originalNote.columnId) {
    //   logMessage += `Task  ${note.title} was moved from ${originalNote.board_column_fk} to ${note.columnId} by ${userName}`;
    // }

    // Funktion, um den Spaltennamen basierend auf der columnId zu finden
    const getColumnNameById = (id) => {
      const column = columns.find((col) => col.id == id);
      console.log(" column inside: ", column);
      return column ? column.name : "Unbekannte Spalte";
    };

    // Wenn sich die Spalte ändert, nur dann loggen
    if (note.columnId !== originalNote.columnId) {
      const originalColumnName = getColumnNameById(
        originalNote.board_column_fk
      );
      const newColumnName = getColumnNameById(note.columnId);
      logMessage += `${note.title} was moved from ${originalColumnName} to ${newColumnName} by ${userName}`;
    }

    // Wenn sich der Assignee geändert hat, logge es
    if (note.assignee !== originalNote.assignee) {
      logMessage += `${note.title} was assigned to ${note.assignee} by ${userName}`;
    }

    // Überprüfen, ob die Priorität sich geändert hat
    if (note.priority !== originalNote.priority) {
      logMessage += `${note.title} changed from ${originalNote.priority} to ${note.priority} by ${userName}`;
    }

    // Wenn es eine Änderung gibt, erstelle das Log
    if (logMessage) {
      const logResponse = await fetch(`${backendUrl}/api/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shareboard_fk,
          message: logMessage,
        }),
      });

      if (!logResponse.ok) {
        throw new Error("Fehler beim Erstellen des Logs");
      }

      console.log("Log erfolgreich erstellt");
    }

    // Notiz aktualisieren
    const response = await fetch(`${backendUrl}/api/notes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });

    if (response.ok) {
      navigate(`/board/${userKey}`); // Nach dem Update zurück zur Notiz-Seite navigieren
    } else {
      console.error("Fehler beim Aktualisieren der Notiz");
    }
  };

  const handleDelete = async () => {
    const noteToDelete = note.title;

    const response = await fetch(`${backendUrl}/api/notes/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const logMessage = `${noteToDelete} was deleted by ${userName}`;

      // Log an das Backend senden
      const logResponse = await fetch(`${backendUrl}/api/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shareboard_fk, // Übernimm den Wert von `shareboard_fk`, den du über `location.state` bekommst
          message: logMessage,
        }),
      });

      if (!logResponse.ok) {
        throw new Error("Fehler beim Erstellen des Logs");
      }

      console.log("Log erfolgreich erstellt");

      navigate(`/board/${userKey}`); // Nach dem Löschen zurück zur Notiz-Seite navigieren
    } else {
      console.error("Fehler beim Löschen der Notiz");
    }
  };

  const handleColumnChange = (e) => {
    setSelectedColumn(e.target.value); // Update den `selectedColumn`-State
    setNote((prevNote) => ({
      ...prevNote,
      columnId: e.target.value, // Die ausgewählte Spalte wird ebenfalls aktualisiert
    }));
  };

  const handlePriorityChange = (newPriority) => {
    setNote((prevNote) => ({
      ...prevNote,
      priority: newPriority,
    }));
  };

  const priorityLevels = [
    "No Priority",
    "Low Priority",
    "Normal Priority",
    "High Priority",
  ];

  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-gray-200">
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center gap-0 ">
          {" "}
          <h1 className="text-3xl font-bold">Edit Task</h1>
          <div className="ml-auto sm:space-x-2 flex flex-wrap justify-center gap-2 mt-2">
            {" "}
            {priorityLevels.map((priority) => (
              <button
                type="button"
                key={priority}
                className={`px-2 py-2 rounded-md m-1 w-32 ${
                  note.priority === priority
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => handlePriorityChange(priority)}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={note.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600"
            />
          </div>

          <div>
            <div className="flex mb-4 justify-between">
              <label
                htmlFor="description"
                className="block text-lg font-medium mb-2"
              >
                Description
              </label>{" "}
              <span>
                {" "}
                <button
                  onClick={toggleMarkdownView}
                  type="button"
                  className="bg-blue-500 text-white ml-2 py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  {isMarkdownView ? "Edit" : "Preview"}
                </button>
              </span>
            </div>

            {isMarkdownView ? (
              <div className="p-2 h-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 overflow-auto h-full">
                {console.log(note.description)}
                <ReactMarkdown
                  className=""
                  components={{
                    ol: ({ ...props }) => (
                      <ol {...props} className="list-decimal pl-4" />
                    ),
                    ul: ({ ...props }) => (
                      <ul {...props} className="list-disc pl-4" />
                    ),
                    li: ({ ...props }) => <li {...props} className="mb-2" />,
                    p: ({ ...props }) => <p {...props} className="mb-4" />,
                    h1: ({ ...props }) => (
                      <h1 {...props} className="text-2xl mb-2 mt-2" />
                    ),
                    h3: ({ ...props }) => (
                      <h3 {...props} className="text-xl mb-2" />
                    ),
                  }}
                >
                  {note.description}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                id="description"
                name="description"
                value={note.description}
                onChange={handleChange}
                className="w-full p-3 h-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600"
              />
            )}
          </div>

          <div>
            <button
              onClick={() => generateDescriptionFromTitle(note.title)}
              type="button"
              className="mb-4 w-full bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Generate User Story - AI
            </button>

            <label htmlFor="column" className="block text-lg font-medium mb-2">
              Column
            </label>
            <select
              id="column"
              name="columnId"
              value={selectedColumn}
              onChange={handleColumnChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600"
            >
              <option className="" value="">
                Select:
              </option>
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="assignee"
              className="block text-lg font-medium mb-2"
            >
              Assign:
            </label>
            <select
              id="assignee"
              name="assignee"
              value={note.assignee}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600"
            >
              <option value="Nobody">Nobody</option>
              {users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
            <p className="mt-2">Assigned to: {note.assignee}</p>
          </div>

          <div className="flex flex-col space-y-4 mt-6">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Update Task
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition duration-200 dark:bg-gray-600 dark:hover:bg-blue-500"
            >
              Go Back without Changes
            </button>
            <button
              onClick={handleDelete}
              className="w-full bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-500 transition duration-200"
            >
              Delete Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateNote;

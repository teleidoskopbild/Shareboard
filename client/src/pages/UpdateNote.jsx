import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

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

  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [users, setUsers] = useState([]);
  const [originalNote, setOriginalNote] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  console.log("n: ", note);
  console.log("on: ", originalNote);

  const handleUpdate = async (e) => {
    e.preventDefault();

    let logMessage = "";
    // Überprüfen, ob sich der Titel geändert hat
    if (note.title !== originalNote.title) {
      logMessage += `Notiz geändert: Titel von "${originalNote.title}" zu "${note.title}" von ${userName} `;
    }

    // Wenn sich die Spalte ändert, nur dann loggen
    // if (note.columnId !== originalNote.columnId) {
    //   logMessage += `Task  ${note.title} was moved from ${originalNote.board_column_fk} to ${note.columnId} by ${userName}`;
    // }

    console.log("Columns:", columns);
    console.log("Original Column ID:", originalNote.board_column_fk);
    console.log("New Column ID:", note.columnId);

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
      logMessage += `Task ${note.title} was moved from ${originalColumnName} to ${newColumnName} by ${userName}`;
    }

    // Wenn sich der Assignee geändert hat, logge es
    if (note.assignee !== originalNote.assignee) {
      logMessage += `Task ${note.title} was assigned to ${note.assignee} by ${userName}`;
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

  console.log("Location state:", location.state);

  return (
    <div>
      <h1>Edit Task</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={note.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={note.description}
            onChange={handleChange}
          />
        </div>
        {/* <div>
          <label htmlFor="priority">Priority</label>
          <input
            type="text"
            id="priority"
            name="priority"
            value={note.priority}
            onChange={handleChange}
          />
        </div> */}
        <div>
          <label htmlFor="column">Column</label>
          <select
            id="column"
            name="columnId"
            value={selectedColumn}
            onChange={handleColumnChange}
          >
            <option value="">Select:</option>
            {columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="assignee">Assign:</label>
          <select
            id="assignee"
            name="assignee"
            value={note.assignee}
            onChange={handleChange}
          >
            <option value="nobody assigned">Nobody assigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
          <p>Assigned to: {note.assignee}</p>{" "}
        </div>

        <button type="submit">Update Task</button>
        <div>
          {" "}
          <button type="button" onClick={() => navigate(-1)}>
            Go Back without Changes
          </button>
        </div>
      </form>
      <button onClick={handleDelete}>Delete Task</button>
    </div>
  );
};

export default UpdateNote;

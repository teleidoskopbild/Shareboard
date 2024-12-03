import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UpdateNote = () => {
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

  console.log("userKey in UpdateNote:", userKey);

  useEffect(() => {
    const fetchNote = async () => {
      const response = await fetch(`${backendUrl}/api/notes/${id}`);
      const data = await response.json();
      console.log("Note data:", data);
      setNote(data);
      setSelectedColumn(data.columnId);
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

  const handleUpdate = async (e) => {
    e.preventDefault();

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
    const response = await fetch(`${backendUrl}/api/notes/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
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

  return (
    <div>
      <h1>Notiz bearbeiten</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label htmlFor="title">Titel</label>
          <input
            type="text"
            id="title"
            name="title"
            value={note.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Beschreibung</label>
          <textarea
            id="description"
            name="description"
            value={note.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="priority">Priorität</label>
          <input
            type="text"
            id="priority"
            name="priority"
            value={note.priority}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="column">Spalte</label>
          <select
            id="column"
            name="columnId"
            value={selectedColumn}
            onChange={handleColumnChange}
          >
            <option value="">Bitte wählen</option>
            {columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="assignee">Zuweisung</label>
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

        <button type="submit">Notiz aktualisieren</button>
      </form>
      <button onClick={handleDelete}>Notiz löschen</button>
    </div>
  );
};

export default UpdateNote;

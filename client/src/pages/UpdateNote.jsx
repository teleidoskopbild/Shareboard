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
  });

  console.log("userKey in UpdateNote:", userKey);

  useEffect(() => {
    const fetchNote = async () => {
      const response = await fetch(`${backendUrl}/api/notes/${id}`);
      const data = await response.json();
      console.log(data);
      setNote(data);
    };

    fetchNote();
  }, [id]);

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
        <button type="submit">Notiz aktualisieren</button>
      </form>
      <button onClick={handleDelete}>Notiz löschen</button>
    </div>
  );
};

export default UpdateNote;

import { useState } from "react";
import { Link } from "react-router-dom";

function FreestyleBoard() {
  const [columns, setColumns] = useState([]);
  const [newColumnName, setNewColumnName] = useState("");

  const addColumn = () => {
    if (newColumnName.trim()) {
      setColumns([
        ...columns,
        { name: newColumnName, position: columns.length + 1 },
      ]);
      setNewColumnName("");
    }
  };

  const removeColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Freestyle Layout erstellen</h2>

      <div>
        <label htmlFor="newColumn">Spaltenname:</label>
        <input
          id="newColumn"
          type="text"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          placeholder="Spaltenname eingeben"
        />
        <button onClick={addColumn}>Spalte hinzufügen</button>
      </div>

      <ul>
        {columns.map((column, index) => (
          <li key={index}>
            {column.name}{" "}
            <button onClick={() => removeColumn(index)}>Entfernen</button>
          </li>
        ))}
      </ul>
      {columns.length > 0 && (
        <Link
          to="/createboard"
          state={{ layout: { name: "FreestyleBoard", columns } }}
        >
          <button>Weiter</button>
        </Link>
      )}
    </div>
  );
}

export default FreestyleBoard;

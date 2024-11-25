import { useState } from "react";
import { Link } from "react-router-dom";

function SelectBoard() {
  const [selectedLayout, setSelectedLayout] = useState(null);

  // Vordefinierte Layouts mit Spalten
  const layouts = [
    {
      name: "Kanban",
      columns: [
        { name: "Backlog", position: 1 },
        { name: "Doing", position: 2 },
        { name: "Review", position: 3 },
        { name: "Done", position: 4 },
      ],
    },
    {
      name: "Scrum",
      columns: [
        { name: "To Do", position: 1 },
        { name: "Doing", position: 2 },
        { name: "Done", position: 3 },
      ],
    },
    {
      name: "User Story",
      columns: [
        { name: "Goals", position: 1 },
        { name: "Activities", position: 2 },
        { name: "Stories", position: 3 },
      ],
    },
    {
      name: "Freestyle", // Für individuelle Layouts
      columns: [],
    },
  ];

  return (
    <div>
      <h2>Select a Board Layout</h2>
      {layouts.map((layout, index) => (
        <button key={index} onClick={() => setSelectedLayout(layout)}>
          {layout.name}
        </button>
      ))}
      {selectedLayout && selectedLayout.name === "Freestyle" && (
        <Link to="/freestyleboard">
          <button>Weiter</button>
        </Link>
      )}
      {selectedLayout && selectedLayout.name !== "Freestyle" && (
        <Link to="/createboard" state={{ layout: selectedLayout }}>
          <button>Weiter</button>
        </Link>
      )}
    </div>
  );
}

export default SelectBoard;

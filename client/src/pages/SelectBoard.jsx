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
    <div className="flex flex-col items-center p-4 md:p-8">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Select a Board Layout
      </h2>

      <div className="flex flex-col gap-4 w-full max-w-lg">
        {layouts.map((layout, index) => (
          <button
            key={index}
            onClick={() => setSelectedLayout(layout)}
            className="bg-gray-200 text-lg text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition duration-200 w-full"
          >
            {layout.name}
          </button>
        ))}
      </div>

      {selectedLayout && (
        <div className="mt-6 w-full max-w-lg">
          {selectedLayout.name === "Freestyle" ? (
            <Link to="/freestyleboard" className="w-full">
              <button className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200 w-full">
                Continue
              </button>
            </Link>
          ) : (
            <Link
              to="/createboard"
              state={{ layout: selectedLayout }}
              className="w-full"
            >
              <button className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200 w-full">
                Continue
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default SelectBoard;

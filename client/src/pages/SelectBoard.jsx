import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SelectBoard() {
  const [selectedLayout, setSelectedLayout] = useState(null);
  const navigate = useNavigate();

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
      description:
        "Create a traditional Kanban Board with a Backlog, To Do, Doing and Done Column",
    },
    // {
    //   name: "Scrum",
    //   columns: [
    //     { name: "To Do", position: 1 },
    //     { name: "Doing", position: 2 },
    //     { name: "Done", position: 3 },
    //   ],
    // },
    // {
    //   name: "User Story",
    //   columns: [
    //     { name: "Goals", position: 1 },
    //     { name: "Activities", position: 2 },
    //     { name: "Stories", position: 3 },
    //   ],
    // },
    {
      name: "Freestyle", // Für individuelle Layouts
      columns: [],
      description: "Create your own Board with your own specifications",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center  min-h-screen p-4 md:p-8 dark:bg-gray-900 dark:text-gray-200">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Select a Board Layout
      </h2>

      <div className="flex flex-col gap-2 w-full max-w-lg mt-4">
        {layouts.map((layout, index) => (
          <div key={index} className="group relative w-full">
            <button
              key={index}
              onClick={() => setSelectedLayout(layout)}
              className="bg-gray-200 text-lg text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition duration-200 w-full  focus:outline-none focus:bg-blue-500 focus:text-white dark:focus:bg-green-500"
            >
              {layout.name}
            </button>
            <p className="top-full text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition duration-200 text-center mt-2 dark:text-gray-300">
              {layout.description}
            </p>
          </div>
        ))}
        {selectedLayout && (
          <div className="mt-6 w-full max-w-lg">
            {selectedLayout.name === "Freestyle" ? (
              <Link to="/freestyleboard" className="w-full">
                <button className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-200 w-full dark:bg-blue-600 dark:hover:bg-blue-500">
                  Continue
                </button>
              </Link>
            ) : (
              <Link
                to="/createboard"
                state={{ layout: selectedLayout }}
                className="w-full"
              >
                <button className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-200 w-full dark:bg-blue-600 dark:hover:bg-blue-500">
                  Continue
                </button>
              </Link>
            )}
          </div>
        )}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition duration-200 mt-4 dark:bg-sky-600 dark:hover:bg-sky-500"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default SelectBoard;

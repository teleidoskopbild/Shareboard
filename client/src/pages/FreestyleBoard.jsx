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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 dark:bg-gray-900 dark:text-gray-200">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg  dark:bg-gray-900 dark:text-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Create your own Layout
        </h2>

        {/* Spalte hinzufügen */}
        <div className="mb-6">
          <label htmlFor="newColumn" className="block text-lg font-medium mb-2">
            Column Name:
          </label>
          <input
            id="newColumn"
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="Enter a name for the column"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600"
          />
          <button
            onClick={addColumn}
            className="mt-2 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200 w-full dark:bg-blue-800 dark:hover:bg-blue-700"
          >
            Add Column
          </button>
        </div>

        {/* Liste der Spalten */}
        <ul className="space-y-4 mb-6">
          {columns.map((column, index) => (
            <li
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center dark:bg-gray-600"
            >
              <span>{column.name}</span>
              <button
                onClick={() => removeColumn(index)}
                className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 transition duration-200"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        {/* Continue Button */}
        {columns.length > 0 && (
          <Link
            to="/createboard"
            state={{ layout: { name: "FreestyleBoard", columns } }}
            className="inline-block mt-6 w-full"
          >
            <button className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-200 w-full dark:bg-blue-600 dark:hover:bg-blue-500">
              Continue
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default FreestyleBoard;

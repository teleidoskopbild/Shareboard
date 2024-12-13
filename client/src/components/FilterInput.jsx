import { useState } from "react";

const FilterInput = ({ onFilterChange }) => {
  const [filter, setFilter] = useState("");

  const handleChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div>
      {" "}
      <input
        type="text"
        value={filter}
        onChange={handleChange}
        placeholder="Filter tasks by title..."
        className="border border-gray-300 rounded-lg p-2 w-full dark:bg-gray-600 mt-2"
      />
    </div>
  );
};

export default FilterInput;

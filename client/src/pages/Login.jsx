import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [key, setKey] = useState("");

  return (
    <div className="flex flex-col items-center p-4 md:p-8">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Login Page</h1>
      <form className="w-full max-w-lg">
        <div className="mb-4">
          <label htmlFor="key" className="block text-lg font-medium mb-2">
            Enter your shareboard key:
          </label>
          <input
            id="key"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="e.g. tm9ckk0gk"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {key.trim() && (
          <Link to={`/board/${key}`} className="w-full">
            <button
              type="button"
              className="w-full bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Go to Board
            </button>
          </Link>
        )}
      </form>
    </div>
  );
}

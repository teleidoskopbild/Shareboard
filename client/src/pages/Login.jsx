import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [key, setKey] = useState("");
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-h-screen justify-center p-4 md:p-8 dark:bg-gray-900 dark:text-gray-200">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Login Page</h1>
      <form className="w-full max-w-lg">
        <div className="mb-4 text-center">
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
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-800 dark:bg-gray-600"
          />
        </div>
        {key.trim() && (
          <Link to={`/board/${key}`} className="w-full">
            <button
              type="button"
              className="w-full bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-200 dark:bg-blue-900 dark:hover:bg-blue-800"
            >
              Go to Board
            </button>
          </Link>
        )}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition duration-200 mt-8 dark:bg-sky-900 dark:hover:bg-sky-800"
        >
          Back to Home
        </button>
      </form>
    </div>
  );
}

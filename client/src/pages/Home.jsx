import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center p-4 md:p-8">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">
        Welcome to Shareboard!
      </h1>
      <p className="text-lg md:text-xl text-center mb-8 max-w-2xl">
        A collaborative tool for creating and managing projects with real-time
        teamwork.
      </p>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-lg">
        <Link to="/login" className="w-full">
          <button className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200 w-full">
            Login
          </button>
        </Link>
        <Link to="/selectboard" className="w-full">
          <button className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-200 w-full">
            Create a Board
          </button>
        </Link>
      </div>
    </div>
  );
}

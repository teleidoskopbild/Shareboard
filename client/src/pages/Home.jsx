import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 min-h-screen">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">
        Welcome to Shareboard!
      </h1>
      <p className="text-lg md:text-xl text-center mb-8 max-w-2xl mt-4">
        A collaborative tool for creating and managing projects with real-time
        teamwork.
      </p>

      <div className="flex flex-col items-center w-full max-w-lg mt-16">
        <Link to="/selectboard" className="w-full group">
          <div className="relative">
            <button className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-200 w-full">
              Create a Board
            </button>
            <p className="mt-2 text-sm text-gray-600 text-center opacity-0 group-hover:opacity-100 transition duration-200">
              Create a new Shareboard
            </p>
          </div>
        </Link>{" "}
        <Link to="/login" className="w-full group mt-4">
          <div className="relative">
            <button className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200 w-full">
              Login
            </button>
            <p className="mt-2 text-sm text-gray-600 text-center opacity-0 group-hover:opacity-100 transition duration-200">
              Participate on a Shareboard
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

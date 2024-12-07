import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Um die URL-Parameter zu extrahieren

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function UserLog() {
  const navigate = useNavigate();
  const { shareboardId, userKey } = useParams();
  const params = useParams();
  console.log({ params });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(shareboardId);
  console.log(userKey);
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/logs/${shareboardId}`);
        if (!response.ok) {
          throw new Error("Fehler beim Abrufen der Logs");
        }
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        console.error("Fetch-Fehler:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [shareboardId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg flex flex-col">
        <h1 className="text-2xl font-semibold mb-4">User Log</h1>
        {/* Logs mit max-height und Scrollen */}
        <ul
          className="space-y-2 flex-1 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {logs.map((log, index) => {
            const timestamp = new Date(log.timestamp);
            const formattedTime = timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const formattedDate = timestamp.toLocaleDateString([], {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            return (
              <li
                key={index}
                className="text-gray-600 bg-gray-50 rounded-md p-3 shadow-sm"
              >
                <p>{log.message}</p>
                <p className="mt-2 text-gray-500 text-sm">
                  {formattedTime} on {formattedDate}
                </p>
              </li>
            );
          })}
        </ul>

        {/* Button unterhalb der Logs */}
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Go Back to Board
          </button>
        </div>
      </div>
    </div>
  );
}

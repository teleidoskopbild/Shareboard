import { useParams } from "react-router-dom";

export default function Settings() {
  const { shareboardId } = useParams();

  if (!shareboardId) {
    return <h1>Error: No Settings ID provided</h1>;
  }

  return <h1>Settings Page - ID: {shareboardId}</h1>;
}

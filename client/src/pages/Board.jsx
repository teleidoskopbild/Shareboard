import { useParams } from "react-router-dom";

export default function Board() {
  const { shareboardId } = useParams();

  if (!shareboardId) {
    return <h1>Error: No Board ID provided</h1>;
  }

  return <h1>Board Page - ID: {shareboardId}</h1>;
}

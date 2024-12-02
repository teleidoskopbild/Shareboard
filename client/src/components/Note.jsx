import { useDraggable } from "@dnd-kit/core";
import { useNavigate } from "react-router-dom";

const Note = ({ note, userKey }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: note.id,
  });

  const navigate = useNavigate();

  const handleUpdateClick = () => {
    navigate(`/board/${userKey}/notes/${note.id}`);
  };

  console.log("userKey in Note:", userKey);
  console.log(`/board/${userKey}/notes/${note.id}`);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        border: "1px solid gray",
        margin: "5px 0",
        padding: "10px",
        background: "#f9f9f9",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <h4>{note.title}</h4>
      <p>{note.description}</p>
      <button onClick={handleUpdateClick}>Update</button>
    </div>
  );
};

export default Note;

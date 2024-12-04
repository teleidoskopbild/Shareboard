import { useDraggable } from "@dnd-kit/core";
import { useNavigate } from "react-router-dom";

const Note = ({ note, userKey, currentUserName }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: note.id,
  });

  const navigate = useNavigate();

  const handleUpdateClick = (e) => {
    console.debug(e);
    navigate(`/board/${userKey}/notes/${note.id}`, {
      state: { shareboard_fk: note.shareboard_fk, userName: currentUserName },
    });
  };

  console.log("note cun: ", currentUserName);

  return (
    <div
      onClick={(e) => console.debug(e)}
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
      <p> wird bearbeitet von {note.assignee}</p>
      <button onClick={handleUpdateClick}>Update</button>
    </div>
  );
};

export default Note;

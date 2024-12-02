import { useDroppable } from "@dnd-kit/core";
import Note from "./Note";

const BoardColumn = ({ title, notes, columnId, userKey }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });
  console.log(title);
  console.log("userKey in Board:", userKey);

  return (
    <div
      ref={setNodeRef}
      style={{
        border: "3px solid black",
        padding: "10px",
        width: "300px",
        minHeight: "200px",
        backgroundColor: "lightgray",
        borderColor: isOver ? "#00ff00" : "black",
      }}
    >
      <h3>{title}</h3>
      {notes.map((note) => (
        <Note key={note.id} note={note} userKey={userKey} />
      ))}
    </div>
  );
};

export default BoardColumn;

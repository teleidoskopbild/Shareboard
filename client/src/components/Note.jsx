import { useDraggable } from "@dnd-kit/core";

const Note = ({ note }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: note.id,
  });

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
    </div>
  );
};

export default Note;

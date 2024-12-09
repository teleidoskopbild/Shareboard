import { useDroppable } from "@dnd-kit/core";
import Note from "./Note";

const BoardColumn = ({
  title,
  notes,
  columnId,
  userKey,
  currentUserName,
  colorClass,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });
  console.log("board cun: ", currentUserName);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-lg w-80 min-h-[350px] bg-gray-50 shadow-md transition-all mb-8 ${
        isOver ? "border-blue-600 scale-105 shadow-lg" : "border-gray-300"
      }`}
    >
      <div
        className={`bg-blue-500 text-white p-4 rounded-t-lg ${colorClass}`}
        style={{ fontWeight: "bold", fontSize: "1.25rem", textAlign: "center" }}
      >
        {title}
      </div>

      <div
        className="flex flex-col gap-4 p-4 overflow-y-auto w-80"
        style={{ height: "750px" }}
      >
        {notes.length > 0 ? (
          notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              userKey={userKey}
              currentUserName={currentUserName}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">No tasks here yet.</p>
        )}
      </div>
    </div>
  );
};

export default BoardColumn;

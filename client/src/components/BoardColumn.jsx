import { useDroppable } from "@dnd-kit/core";
import Note from "./Note";

const BoardColumn = ({ title, notes, columnId, userKey, currentUserName }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });
  console.log("board cun: ", currentUserName);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col border-2 rounded-lg w-80 min-h-[350px] bg-gray-50 shadow-md transition-all ${
        isOver ? "border-blue-600 scale-105 shadow-lg" : "border-gray-300"
      }`}
    >
      <div
        className="bg-blue-500 text-white p-4 rounded-t-lg"
        style={{ fontWeight: "bold", fontSize: "1.25rem", textAlign: "center" }}
      >
        {title}
      </div>

      <div className="flex flex-col gap-4 p-4">
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

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

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-lg w-80 min-h-[350px] bg-gray-100 dark:bg-gray-700 shadow-md transition-all mb-8 ${
        isOver ? "border border-4 border-blue-600 shadow-lg" : "border-gray-300"
      }`}
    >
      <div
        className={`bg-blue-500 text-white p-2 rounded-t-lg ${colorClass} dark:bg-gray-700 dark:text-gray-200`}
        style={{ fontWeight: "bold", fontSize: "1.25rem", textAlign: "center" }}
      >
        <span className="px-2 py-1">{title}</span>
        <span className="bg-blue-400 dark:bg-gray-600 px-2 py-1 rounded-lg">
          {notes.length}
        </span>
      </div>

      <div
        className="flex flex-col gap-4 p-4 overflow-y-auto w-80 dark:bg-gray-400"
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

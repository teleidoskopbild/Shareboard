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

  const sortedNotes = [...notes].sort((a, b) => a.id - b.id);

  return (
    <div
      ref={setNodeRef}
      className={`border border-2 flex flex-col flex-shrink-0 rounded-md w-80 min-h-[350px] dark:bg-gray-700 shadow-md transition-all mb-8 ${
        isOver
          ? " border-2 border-blue-600 shadow-lg"
          : "dark:border-gray-500 border-gray-200"
      }`}
      style={{ height: "850px" }}
    >
      <div
        className={`bg-blue-500 text-white p-2 rounded-t dark:rounded-t-lg ${colorClass} dark:bg-gray-900 dark:text-gray-200`}
        style={{ fontWeight: "bold", fontSize: "1.25rem", textAlign: "center" }}
      >
        <span className="px-2 py-1">{title}</span>
        <span className="bg-blue-400 dark:bg-gray-600 px-2 py-1 rounded-lg">
          {notes.length}
        </span>
      </div>

      <div
        className="flex flex-col gap-4 p-2 overflow-y-auto dark:bg-gray-950"
        style={{ height: "800px" }}
      >
        {sortedNotes.length > 0 ? (
          sortedNotes.map((note) => (
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

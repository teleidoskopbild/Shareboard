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

  return (
    <div className="border-0 flex flex-col">
      <div
        onClick={(e) => console.debug(e)}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`border border-gray-300 p-4 mb-2 bg-gray-200 h-20 overflow-hidden bg-gray-300 rounded-md ${
          isDragging ? "opacity-50" : "opacity-100"
        } transition-opacity dark:bg-gray-400 dark:text-gray-200`}
      >
        {" "}
        {note.assignee && (
          <p className="text-gray-600 text-xs mb-2">
            Assigned to {note.assignee}
          </p>
        )}
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-xl font-medium">
            {note.title.length > 20
              ? `${note.title.substring(0, 20)}...`
              : note.title}
          </h4>
        </div>
        {/* <p className="text-gray-700">{note.description}</p> */}
      </div>
      <div className="mt-0">
        {" "}
        <button
          onClick={handleUpdateClick}
          className="w-full bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 transition duration-200 dark:bg-blue-800 dark:hover:bg-blue-700"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default Note;

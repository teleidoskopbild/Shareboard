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
    <div className="border-0">
      <div
        onClick={(e) => console.debug(e)}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`border border-gray-300 p-4 mb-2 bg-gray-50 h-40 overflow-hidden ${
          isDragging ? "opacity-50" : "opacity-100"
        } transition-opacity`}
      >
        {" "}
        {note.assignee && note.assignee !== "nobody assigned" && (
          <p className="text-gray-600 text-xs mb-2">
            Assigned to {note.assignee}
          </p>
        )}
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-xl font-semibold">{note.title}</h4>
        </div>
        <p className="text-gray-700">{note.description}</p>
      </div>
      <div className="mt-2">
        {" "}
        <button
          onClick={handleUpdateClick}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default Note;

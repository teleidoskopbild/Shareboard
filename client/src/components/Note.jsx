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
    <div className="border border-2 dark:border-gray-600 rounded-md flex flex-col">
      <div
        onClick={(e) => console.debug(e)}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={` p-4  bg-gray-50 h-20 overflow-hidden dark:border-gray-700 dark:bg-gray-900 ${
          isDragging ? "opacity-50" : "opacity-100"
        } transition-opacity dark:bg-gray-900 dark:text-gray-200`}
      >
        {" "}
        {note.assignee && (
          <p className="text-gray-600 text-xs mb-2 dark:text-gray-300">
            Assigned to {note.assignee}
          </p>
        )}
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-xl font-medium">
            {note.title.length > 22
              ? `${note.title.substring(0, 22)}...`
              : note.title}
          </h4>
        </div>
        {/* <p className="text-gray-700">{note.description}</p> */}
      </div>
      <div className="mt-0">
        {" "}
        <button className=" w-full bg-gray-50 text-left text-blue-400 py-2 px-4  transition duration-200 dark:bg-gray-900">
          <span className="hover:text-blue-600" onClick={handleUpdateClick}>
            View Task
          </span>
        </button>
      </div>
    </div>
  );
};

export default Note;

import React from "react";


const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div className="p-4 animate-fade-in transition duration-300 ease-in-out">
      <p className="text-sm text-gray-700">{content}</p>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-sm transition-transform duration-200 hover:scale-105"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;

import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center border-black ">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1l6 6m0 0l6-6m-6 6l6 6m-6-6l-6 6"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="pt-4 text-sm text-gray-800">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

import React from "react";
import ReactDOM from "react-dom";
import Button from "./Button";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300">
            &times;
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;

// components/Modal.tsx
import React from "react";

interface ModalProps {
  message: string;
  onClose: () => void;
}

export const SignModal: React.FC<ModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <p className="text-sm text-gray-600 mt-2">{message}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-primary-100 text-white px-4 py-2 rounded-md"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

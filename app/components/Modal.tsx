"use client";
// modal.tsx
import React, { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import { RxCross2 } from "react-icons/rx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const body = document.body;
    if (isOpen) {
      body.classList.add("overflow-hidden");
    } else {
      body.classList.remove("overflow-hidden");
    }

    // Clean up function to ensure no class remains after the component is unmounted or modal is closed.
    return () => {
      body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="w-full md:w-[500px] bg-white rounded-[20px] p-4 relative">
        <RxCross2
          onClick={onClose}
          className="text-[20px] absolute right-4 top-4 cursor-pointer"
        />
        {/* <h6 className="text-[16px] text-center text-[#000000] pb-2">Sign in</h6> */}
        {/* <hr className="w-full border-[#E4E4E4] pt-3 " /> */}
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;

import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  show: boolean;
  duration?: number; // in ms
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, show, duration = 3000, onClose }) => {
  useEffect(() => {
    if (show && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div
      id="toast-container"
      className="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
      style={{ zIndex: 11 }}
    >
      <div className="toast show align-items-center text-bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Toast; 
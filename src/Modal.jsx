import React from 'react';
import './Modal.css'; // Make sure to create this CSS file for styling the modal

const Modal = ({ show, handleClose, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-message">{message}</div>
        <button className="modal-close" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;

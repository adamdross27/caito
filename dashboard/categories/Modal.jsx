import React from 'react';
import './Modal.css'; // Import CSS for styling

const Modal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null; // If the modal is not open, return nothing

    const handleOverlayClick = (e) => {
        // Close modal if the outside of modal is clicked
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modalOverlay" onClick={handleOverlayClick}>
            <div className="modalContent">
                <button className="closeButton" onClick={onClose}>X</button>
                <h4>{title}</h4>
                <div className="modalBody" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    );
};

export default Modal;

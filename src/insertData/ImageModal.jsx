// src/insertData/ImageModal.jsx
import React from 'react';
import sampleImage from './DataGuide.jpg'; // Replace with the actual path to your JPG image

const ImageModal = ({ toggleModal }) => {
    return (
        <div style={styles.overlay}>
            <div style={styles.imageContainer}>
                <button style={styles.closeButton} onClick={toggleModal}>
                    X
                </button>
                <img src={sampleImage} alt="Sample" style={styles.image} />
            </div>
        </div>
    );
};

// Styles for overlay and image container
const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    imageContainer: {
        position: 'relative',
        maxWidth: '100%',
        maxHeight: '100%',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'grey',
        color: 'white',
        border: 'none',
        borderRadius: '4px', // Changed to make it square or slightly rounded
        width: '30px',
        height: '30px',
        fontSize: '18px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
    },
};

export default ImageModal;
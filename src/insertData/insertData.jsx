import React, { useEffect, useState } from 'react';
import Navbar from '../../navbar/Navbar';
import './insertData.css'; // Ensure the path is correct
import { database } from '../firebase/firebaseConfig';
import { db } from '../firebase/firebaseConfig'; 
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import ImageModal from './ImageModal';


const InsertData = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false); // Track if we are adding a new category
  const [newCategory, setNewCategory] = useState(""); // Store the new category name
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };


  useEffect(() => {
    document.title = "CAITO - Insert Data"; // Set the title for this page
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const dataRef = collection(db, 'Data'); // Reference to the 'Data' collection
      const snapshot = await getDocs(dataRef);
      const categoryNames = snapshot.docs.map(doc => doc.id); // Get category names from the document IDs
      setCategories(categoryNames);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedCategory) {
      alert("Please select a file and category first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', selectedCategory);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Upload success:', result);
        alert(result.message);

        // Clear file input and category selection
        setSelectedFile(null);
        setSelectedCategory("");

        // Reset the file input element
        document.querySelector('input[type="file"]').value = "";
      } else {
        const errorResult = await response.text(); // Capture any error message
        console.error('Upload error:', errorResult);
        alert('Failed to upload file. Server responded with error.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Check console for details.');
    }
  };

  const handleNewCategoryChange = (event) => {
    // Capitalize and limit input to a short text (not a paragraph)
    const inputValue = event.target.value;
    setNewCategory(inputValue.charAt(0).toUpperCase() + inputValue.slice(1));
  };

  const handleCreateNewCategory = async () => {
    if (!newCategory.trim()) {
      alert("Category name cannot be empty.");
      return;
    }

    try {
      await setDoc(doc(db, 'Data', newCategory), {}); // Create a new document in Firestore under 'Data'
      setCategories([...categories, newCategory]); // Add the new category to the list
      setIsAddingCategory(false); // Close the input form
      setNewCategory(""); // Clear the input field
    } catch (error) {
      console.error("Error creating new category:", error);
      alert("Failed to create category.");
    }
  };

  const handleCancelFile = () => {
    setSelectedFile(null);
    document.getElementById('file-input').value = null; // Reset the file input
  };

  // Drag and drop event handlers
  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent default behavior
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault(); // Prevent default behavior
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="insertData">
      <Navbar />
      <div className="content-container">
        <br /> <br /> <br />
        <h1 className="welcomeText">Insert Data</h1>
        <div className="stepContainer">
          <div className="stepHeader">
            <div className="stepNumber">1</div>
            <span className="stepTitle">Select file</span>
          </div>
          <h3 className="stepDescription">
            Choose a file that you would like to visualise on the dashboard.
          </h3>
        </div>
        {/* <h3 className="step1">Step 1: Choose a file that you would like to visualise on the dashboard.</h3> */}
        {/* <h3>
        Our Workforce Intelligence System pipeline allows you to upload your Excel spreadsheet files and
        have them transformed onto our dashboard! <br /><br />
      </h3> */}
        {/* <h3>
        You can choose which category you would like for the data to go under, or create your
        own category!.<br /><br /><br />
      </h3> */}
        {/* <h4>Click the Insert Data button below to insert your company data that you'd like visualized!</h4> */}
        {/*<input type="file" accept=".json,.xlsx" onChange={handleFileChange} />*/}

        {/* Display message based on file selection */}

        {/* <br /> */}
        {/* <div className="file-upload"> */}
        <div
          className={`file-upload ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDragging ? '2px dashed #007bff' : '2px dashed #ccc',
            padding: '20px', // Decrease padding
            textAlign: 'center',
            width: '70%', // Set width to a smaller value
            height: '200px', // Set height to a smaller value
            margin: '20px auto', // Center horizontally
            display: 'flex', // Use Flexbox
            justifyContent: 'center', // Center horizontally
            alignItems: 'center', // Center vertically
          }}
        >
          <label htmlFor="file-input" className="file-upload-button">
            Choose a file
          </label>
          <input
            id="file-input"
            type="file"
            accept=".json,.xlsx"
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hides the default file input
          />

        </div>

        <br />

        <div className="file-status">
          <p>{selectedFile ? `Selected file: ${selectedFile.name}` : 'No file selected'}</p>
          {selectedFile && (
            <button onClick={handleCancelFile} className="cancel-button">Cancel</button>
          )}
        </div>


        {/* Dropdown for categories */}
        <div className="category-container">
          <div className="stepContainer">
            <div className="stepHeader">
              <div className="stepNumber">2</div>
              <span className="stepTitle">Select data category</span>
            </div>
            <h3 className="stepDescription">
              Choose a data category that you would like to store your file in or create a new one
            </h3>
          </div>

          {/* <h3 className="step2">Step 2: Choose a data category that you would like to store your file in or create a new one.</h3> */}
          <select className="category-dropdown" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="" disabled>Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {!isAddingCategory && (
            <button className="addNewCategoryButton" onClick={() => setIsAddingCategory(true)}>
              + New Category
            </button>
          )}
        </div>

        <br /><br />

        {/* Button to upload the file
        <button className="uploadButton" onClick={handleFileUpload}>Insert Data</button> */}



        {/* Button to show the modal */}
        <button className="guideButton" onClick={toggleModal}>Show Guide</button>
        {showModal && <ImageModal toggleModal={toggleModal} />}

        {/* New category form */}
        {isAddingCategory && (
          <div className="newCategoryForm">
            <input
              type="text"
              value={newCategory}
              onChange={handleNewCategoryChange}
              placeholder="Enter new category"
              maxLength="30"
              className="newCategoryInput"
            />
            <div className="buttonContainer">
              <button className="createCategoryButton" onClick={handleCreateNewCategory}>
                Create New Category
              </button>
              <button className="cancelButton" onClick={() => setIsAddingCategory(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Button to upload the file */}
        <button className="uploadButton" onClick={handleFileUpload}>Insert Data</button>
      </div>
    </div>
  );
};

export default InsertData;

import React, { useEffect, useState, useContext } from "react";
import { auth, database } from "./firebase/firebaseConfig";
import { ref, get, set } from "firebase/database"; // Import 'set' to update data
import { AuthContext } from "./AuthProvider";
import "./Profile.css"; // Import the CSS file
import Navbar from "../navbar/Navbar";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false); // To toggle between view and edit mode
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userRef = ref(database, "users/" + currentUser.uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          setFormData({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          });
        } else {
          console.log("No data available");
        }
      } else {
        console.log("No authenticated user");
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async () => {
    if (currentUser) {
      const userRef = ref(database, "users/" + currentUser.uid);
      await set(userRef, { ...formData }); // Update user data in Firebase
      setUserData(formData);
      setEditMode(false);
    }
  };

  if (!userData) {
    return <div>No user data</div>;
  }

  return (
    <div className="profile-container">
      <Navbar />
      <h1> Hi, {userData.firstName} </h1>

      {editMode ? (
        <div>
          <p>
            <span className="profile-label">First Name:</span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <span className="profile-label">Last Name:</span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </p>
          <button className="save-button" onClick={handleSaveChanges}>
            Save Changes
          </button>
          <button className="cancel-button" onClick={handleEditToggle}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <p>
            <span className="profile-label">First Name:</span>
            <span className="profile-value">{userData.firstName}</span>
          </p>
          <p>
            <span className="profile-label">Last Name:</span>
            <span className="profile-value">{userData.lastName}</span>
          </p>
          <p>
            <span className="profile-label">Email:</span>
            <span className="profile-value">{userData.email}</span>
          </p>
          <button className="edit-button" onClick={handleEditToggle}>
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;

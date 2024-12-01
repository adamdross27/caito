import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './App.css';
import styles from './Login.module.css';
import { auth } from './firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database'; // Import functions for Realtime Database
import Modal from './Modal';

const Register = () => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [modalMessage, setModalMessage] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setModalMessage('Passwords do not match!');
      setShowModal(true);
      return;
    }
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user data in Realtime Database
      const db = getDatabase();
      await set(ref(db, 'users/' + user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
      });

      setModalMessage('Registration successful');
      setShowModal(true);

      // Redirect to landing page after modal is closed
      // Use a timeout to ensure the modal message is shown before redirect
      setTimeout(() => {
        navigate('/dashboard-landing');
      }, 1500); // Adjust delay as needed
    } catch (error) {
      setModalMessage('Error registering: ' + error.message);
      setPassword(''); // Clear password field
      setConfirmPassword(''); // Clear confirm password field
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Optionally redirect here if registration is successful
  };

  return (
    <div>
      <Helmet>
        <title>Register - CAITO</title>
        <link rel="icon" type="image/png" href="/caitoicon.png" />
      </Helmet>
      <div className="App">
        <div className="container">
          <div className="logo-section">
            <Link to="/"><img src="/caito/logo.webp" alt="Caito Logo" className="logo" /></Link>
            <p className="tagline">CAITO Solutions for Knowledge & Data Collection, Analysis, and Insights.</p>
          </div>
          <div className="form-section">
            <h2 className="form-title">Register</h2>
            <form className="signup-form" onSubmit={handleRegisterSubmit}>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className={styles.primarybutton}>Register</button>
              <br /><br />
              <button type="button" className={styles.Registerbutton} onClick={() => navigate('/login')}>Already have an Account?</button>
            </form>
          </div>
        </div>
      </div>
      <Modal show={showModal} handleClose={handleCloseModal} message={modalMessage} />
    </div>
  );
};

export default Register;

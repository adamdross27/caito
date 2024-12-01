import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import styles from './Login.module.css';
import { auth } from './firebase/firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence, onAuthStateChanged } from 'firebase/auth';
import Modal from './Modal';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard-landing");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const persistence = keepLoggedIn ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);
      await signInWithEmailAndPassword(auth, email, password);
      setModalMessage('Login successful');
      setShowModal(true);
      navigate("/dashboard-landing");
    } catch (error) {
      setModalMessage('Username or password incorrect!');
      setPassword('');
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setModalMessage('Please enter your email address to reset your password.');
      setShowModal(true);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setModalMessage('A Password Reset Link has been sent to your email');
      setPassword('');
      setShowModal(true);
    } catch (error) {
      let errorMessage = 'Error sending password reset email: ' + error.message;
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address you entered is not valid.';
      }
      setModalMessage(errorMessage);
      setPassword('');
      setShowModal(true);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Login - CAITO</title>
        <link rel="icon" type="image/png" href="/caitoicon.png" />
      </Helmet>
      <div className="App">
        <div className="container">
          <div className="logo-section">
            <Link to="/"><img src="/logo.webp" alt="Caito Logo" className="logo" /></Link>
            <p className="tagline">CAITO Solutions for Knowledge & Data Collection, Analysis, and Insights.</p>
          </div>
          <div className="form-section">
            <h2 className="form-title">Log In</h2>
            <form className="signup-form" onSubmit={handleLoginSubmit}>
              <input
                type="text"
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
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="keepLoggedIn"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                />
                <label htmlFor="keepLoggedIn">Keep Me Logged In</label>
              </div>
              <button type="submit" className={styles.primarybutton}>Log In</button>
              <button type="button" onClick={handleForgotPassword} className={styles.forgotbutton}>Forgot Password</button>
              <br /><br />
              <button type="button" className={styles.Registerbutton} onClick={() => window.location.href = '/register'}>No, I don't have an Account</button>
            </form>
          </div>
        </div>
      </div>
      <Modal show={showModal} handleClose={handleCloseModal} message={modalMessage} />
    </div>
  );
};

export default Login;

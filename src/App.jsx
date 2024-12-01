import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './App.css';
import styles from './Login.module.css';
import Login from './Login';
import Register from './Register';
import Landing from '../landing/Landing';
import About from './About';
import Profile from './Profile';
import DashboardPage from '../dashboard/dashboard';
import Dictionary from '../dictionary/Dictionary';
import DashboardLanding from '../dashboard/dashboardLanding';
import Jobs from '../dashboard/categories/jobs/jobs';
import Courses from '../dashboard/categories/courses/courses';
import Employers from '../dashboard/categories/employers/employers';
import Educators from '../dashboard/categories/educators/educators';
import Students from '../dashboard/categories/students/students';
import Universities from '../dashboard/categories/universities/universities';
import Trades from '../dashboard/categories/trades/trades';
import Income from '../dashboard/categories/income/income';
import Population from '../dashboard/categories/population/population';
import Skills from '../dashboard/categories/skills/skills';
import InsertData from '../src/insertData/insertData';
import WorkforcePlanning from '../workforce-planning/WorkforcePlanning';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard-landing" element={<DashboardLanding />} />
        <Route path="/dashboard/jobs" element={<Jobs />} />
        <Route path="/dashboard/courses" element={<Courses />} />
        <Route path="/dashboard/employers" element={<Employers />} />
        <Route path="/dashboard/educators" element={<Educators />} />
        <Route path="/dashboard/students" element={<Students />} />
        <Route path="/dashboard/universities" element={<Universities />} />
        <Route path="/dashboard/trades" element={<Trades />} />
        <Route path="/dashboard/income" element={<Income />} />
        <Route path="/dashboard/population" element={<Population />} />
        <Route path="/dashboard/skills" element={<Skills />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/insert-data" element={<InsertData />} />
        <Route path="/workforce-planning" element={<WorkforcePlanning />} />
        <Route
          path="/"
          element={
            <div className="App">
              <div className="container">
                <div className="logo-section">
                  <Link to="/"><img src="/caitoicon.png" alt="Caito Logo" className="logo" /></Link>
                  <p className="tagline">CAITO Solutions for Knowledge & Data Collection, Analysis, and Insights.</p>
                </div>
                <div className="form-section">
                  <h2 className="form-title">Welcome to CAITO</h2>
                  <nav className="nav-links">
                    <Link to="/login" className={styles.primarybutton}>Log In</Link>
                  <Link to="/register" className={styles.Registerbutton}>Register</Link>
                  </nav>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

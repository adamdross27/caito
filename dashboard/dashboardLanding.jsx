import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import './dashboardLanding.css'; 
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../src/firebase/firebaseConfig'; 


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faBook, faBuilding, faChalkboardTeacher, faGraduationCap, faUniversity, faTools, faDollarSign, faGlobe, faLightbulb, faGear } from '@fortawesome/free-solid-svg-icons'; // Add the icon for Population

function DashboardLanding() {
  const [firstName, setFirstName] = useState(''); // State to store the user's first name
  const [loading, setLoading] = useState(true); // State to manage loading state
  
  useEffect(() => {
    document.title = "CAITO - Dashboard Main"; // Set the title for this page
  }, []);

  useEffect(() => {
    // Fetch the user's first name from the database
    const fetchUserData = async () => {
        if (auth.currentUser) { // Check if a user is authenticated
            const userId = auth.currentUser.uid;
            const db = getDatabase();
            const userRef = ref(db, 'users/' + userId);

            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    // Set firstName if it exists, otherwise use a fallback value
                    setFirstName(userData.firstName || 'User');
                } else {
                    console.log('No user data available');
                    setFirstName('User'); // Fallback value if no user data exists
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setFirstName('User'); // Fallback value in case of an error
            } finally {
                setLoading(false); // Set loading to false when done
            }
        } else {
            console.log('No user is currently authenticated');
            setFirstName('User'); // Fallback value if no user is authenticated
            setLoading(false); // Set loading to false if no user is authenticated
        }
    };

    fetchUserData();
}, []);

  return (
    <div className="dashboardLandingPage">
      <Navbar />
      <h1 className="welcomeText"> {loading ? 'Loading...' : `Welcome ${firstName}, to the WIS Dashboard!`}
      </h1>
      <h3>Click one of the below categories to see data!</h3>
      <div className="dashboardLinks">
        <a href="/dashboard/courses" className="dashboardLink">
          <FontAwesomeIcon icon={faBook} className="dashboardIcon" />
          Courses
        </a>
        <a href="/dashboard/educators" className="dashboardLink">
          <FontAwesomeIcon icon={faChalkboardTeacher} className="dashboardIcon" />
          Educators
        </a>
        <a href="/dashboard/employers" className="dashboardLink">
          <FontAwesomeIcon icon={faBuilding} className="dashboardIcon" />
          Employers
        </a>
        <a href="/dashboard/income" className="dashboardLink">
          <FontAwesomeIcon icon={faDollarSign} className="dashboardIcon" />
          Income
        </a>
        <a href="/dashboard/jobs" className="dashboardLink">
          <FontAwesomeIcon icon={faBriefcase} className="dashboardIcon" />
          Jobs
        </a>
        <a href="/dashboard/population" className="dashboardLink">
          <FontAwesomeIcon icon={faGlobe} className="dashboardIcon" />
          Population
        </a>
        <a href="/dashboard/skills" className="dashboardLink">
          <FontAwesomeIcon icon={faGear} className="dashboardIcon" />
          Skills
        </a>
        <a href="/dashboard/students" className="dashboardLink">
          <FontAwesomeIcon icon={faGraduationCap} className="dashboardIcon" />
          Students
        </a>
        <a href="/dashboard/trades" className="dashboardLink">
          <FontAwesomeIcon icon={faTools} className="dashboardIcon" />
          Trades
        </a>
        <a href="/dashboard/universities" className="dashboardLink">
          <FontAwesomeIcon icon={faUniversity} className="dashboardIcon" />
          Universities
        </a>
      </div>

    </div>
  );
}

export default DashboardLanding;

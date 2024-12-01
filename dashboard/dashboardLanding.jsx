import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import './dashboardLanding.css'; 
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../src/firebase/firebaseConfig'; 
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faBook, faBuilding, faChalkboardTeacher, faGraduationCap, faUniversity, faTools, faDollarSign, faGlobe, faGear } from '@fortawesome/free-solid-svg-icons';

function DashboardLanding() {
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "CAITO - Dashboard Main";
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const db = getDatabase();
        const userRef = ref(db, 'users/' + userId);

        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setFirstName(userData.firstName || 'User');
          } else {
            console.log('No user data available');
            setFirstName('User');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setFirstName('User');
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No user is currently authenticated');
        setFirstName('User');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="dashboardLandingPage">
      <Navbar />
      <h1 className="welcomeText"> 
        {loading ? 'Loading...' : `Welcome ${firstName}, to the WIS Dashboard!`}
      </h1>
      <h3>Click one of the below categories to see data!</h3>
      <div className="dashboardLinks">
        <div className="dashboardLink" onClick={() => navigate('/dashboard/courses')}>
          <FontAwesomeIcon icon={faBook} className="dashboardIcon" />
          Courses
        </div>
        <div className="dashboardLink" onClick={() => navigate('/dashboard/educators')}>
          <FontAwesomeIcon icon={faChalkboardTeacher} className="dashboardIcon" />
          Educators
        </div>
        <div className="dashboardLink" onClick={() => navigate('/dashboard/employers')}>
          <FontAwesomeIcon icon={faBuilding} className="dashboardIcon" />
          Employers
        </div>
        <div className="dashboardLink" onClick={() => navigate('/dashboard/income')}>
          <FontAwesomeIcon icon={faDollarSign} className="dashboardIcon" />
          Income
        </div>
        <div className="dashboardLink" onClick={() => navigate('/dashboard/jobs')}>
          <FontAwesomeIcon icon={faBriefcase} className="dashboardIcon" />
          Jobs
        </div>
        <div className="dashboardLink" onClick={() => navigate('/dashboard/population')}>
          <FontAwesomeIcon icon={faGlobe} className="dashboardIcon" />
          Population
        </div>
        <div className="dashboardLink" onClick={() => navigate('/dashboard/skills')}>
          <FontAwesomeIcon icon={faGear} className="dashboardIcon" />
          Skills
        </div>
        <div className="dashboardLink" onClick={() => navigate('/dashboard/students')}>
          <FontAwesomeIcon icon={faGraduationCap} className="dashboardIcon" />
          Students
        </div>
        <div className="dashboardLink" onClick={() => navigate('/dashboard/trades')}>
          <FontAwesomeIcon icon={faTools} className="dashboardIcon" />
          Trades
        </div>
        <div className="dashboardLink" onClick={() => navigate('/dashboard/universities')}>
          <FontAwesomeIcon icon={faUniversity} className="dashboardIcon" />
          Universities
        </div>
      </div>
    </div>
  );
}

export default DashboardLanding;

import React, { useEffect } from 'react';
import Navbar from '../../../navbar/Navbar'; // Adjust the path if needed
import './jobs.css'; // Import the specific CSS file for the Jobs component
import Graph from './Graph'; // Import the Graph component
import styles from './jobs.module.css';

function Jobs() {
  useEffect(() => {
    document.title = "CAITO - Jobs";
  }, []);

  return (
    <div className={styles.categoryPage}>
      <Navbar />
      <h1 className={styles.categoryHeading}>Jobs</h1>
      <Graph /> {/* Include the Graph component */}
    </div>
  );
}

export default Jobs;

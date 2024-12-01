import React, { useEffect } from 'react';
import Navbar from '../../../navbar/Navbar';
import '../Graphs.css';
import StudentsGraphs from './StudentsGraphs';

function Students() {
  useEffect(() => {
    document.title = "CAITO - Students";
  }, []);

  return (
    <div className="categoryPage">
      <Navbar />
      <h1 className="categoryHeading">Students Dashboard</h1>
      <StudentsGraphs categoryName="Students" />
    </div>
  );
}

export default Students;

import React, { useEffect } from 'react';
import Navbar from '../../../navbar/Navbar';
import '../Graphs.css';
import CoursesGraphs from './coursesGraphs';

function Courses() {
  useEffect(() => {
    document.title = "CAITO - Courses";
  }, []);

  return (
    <div className="categoryPage">
      <Navbar />
      <h1 className="categoryHeading">Courses Dashboard</h1>
      <CoursesGraphs categoryName="Courses" />
    </div>
  );
}

export default Courses;

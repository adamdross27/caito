import React, { useEffect } from 'react';
import Navbar from '../../../navbar/Navbar';
import './educators.css';
import EducatorsGraphs from './educatorsGraphs';

function Educators() {
  useEffect(() => {
    document.title = "CAITO - Educators";
  }, []);

  return (
    <div className="categoryPage">
      <Navbar />
      <h1 className="categoryHeading">Educators Dashboard</h1>
      <EducatorsGraphs categoryName="Educators" />
    </div>
  );
}

export default Educators;

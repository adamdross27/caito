import React, { useEffect } from 'react';
import Navbar from '../../../navbar/Navbar';
import './employers.css';
import EmployersGraphs from './employersGraphs';

function Employers() {
  useEffect(() => {
    document.title = "CAITO - Employers";
  }, []);

  return (
    <div className="categoryPage">
      <Navbar />
      <h1 className="categoryHeading">Employers Dashboard</h1>
      <EmployersGraphs categoryName="Employers" />
    </div>
  );
}

export default Employers;

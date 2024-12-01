import React, { useEffect } from 'react';
import Navbar from '../../../navbar/Navbar';
import '../Graphs.css';
import PopulationGraphs from './populationGraphs';

function Population() {
  useEffect(() => {
    document.title = "CAITO - Population";
  }, []);

  return (
    <div className="categoryPage">
      <Navbar />
      <h1 className="categoryHeading">Population Dashboard</h1>
      <PopulationGraphs categoryName="Population" />
    </div>
  );
}

export default Population;

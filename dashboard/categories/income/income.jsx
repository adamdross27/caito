import React, { useEffect } from 'react';
import Navbar from '../../../navbar/Navbar';
import '../Graphs.css';
import IncomeGraphs from './incomeGraphs';

function Income() {
  useEffect(() => {
    document.title = "CAITO - Income";
  }, []);

  return (
    <div className="categoryPage">
      <Navbar />
      <h1 className="categoryHeading">Income Dashboard</h1>
      <IncomeGraphs categoryName="Income" />
    </div>
  );
}

export default Income;

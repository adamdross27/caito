import React, { useEffect } from 'react';
import Navbar from '../../../navbar/Navbar';
import '../Graphs.css';
import TradesGraphs from './tradesGraphs';

function Trades() {
  useEffect(() => {
    document.title = "CAITO - Trades";
  }, []);

  return (
    <div className="categoryPage">
      <Navbar />
      <h1 className="categoryHeading">Trades Dashboard</h1>
      <TradesGraphs categoryName="Trades" />
    </div>
  );
}

export default Trades;

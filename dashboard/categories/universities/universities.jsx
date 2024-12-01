import React, { useEffect } from 'react';
import Navbar from '../../../navbar/Navbar';
import '../Graphs.css';
import UniversitiesGraphs from './universitiesGraphs';

function Universities() {
  useEffect(() => {
    document.title = "CAITO - Universities";
  }, []);

  return (
    <div className="categoryPage">
      <Navbar />
      <h1 className="categoryHeading">Universities Dashboard</h1>
      <UniversitiesGraphs categoryName="Universities" />
    </div>
  );
}

export default Universities;

import React, { useEffect } from 'react';
import Navbar from '../../../navbar/Navbar';
import '../Graphs.css';
import SkillsGraphs from './skillsGraphs';

function Skills() {
  useEffect(() => {
    document.title = "CAITO - Skills";
  }, []);

  return (
    <div className="categoryPage">
      <Navbar />
      <h1 className="categoryHeading">Skills Dashboard</h1>
      <SkillsGraphs categoryName="Skills" />
    </div>
  );
}

export default Skills;

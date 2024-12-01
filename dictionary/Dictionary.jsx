import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../src/firebase/firebaseConfig";
import "./Dictionary.css";
import IR4Header from "./Header";

const JobSkillsTable = ({ searchQuery }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetch all jobs from Firestore
        const querySnapshot = await getDocs(collection(db, "jobDictionary"));
        const jobsData = querySnapshot.docs.map((doc) => doc.data());

        // Filter jobs based on search query (case-insensitive)
        if (searchQuery) {
          const filteredJobs = jobsData.filter((job) =>
            job.job.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setJobs(filteredJobs);
        } else {
          setJobs(jobsData);
        }

        console.log("Jobs fetched:", jobsData);
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };

    fetchJobs();
  }, [searchQuery]);

  const renderSkillsList = (skills) => {
    if (!skills || typeof skills !== "string") {
      return <li>No skills available</li>; // Fallback in case skills are missing or undefined
    }

    return skills
      .split(",")
      .map((skill, index) => <li key={index}>{skill.trim()}</li>);
  };

  return (
    <div className="job-skills-table">
      {jobs.map((job, index) => (
        <div key={index} className="job-item">
          <h3 className="job-title">{job.job}</h3>
          <ul className="skills-list">{renderSkillsList(job.skills)}</ul>
        </div>
      ))}
    </div>
  );
};

function Dictionary() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "CAITO - Dictionary"; // Set the title for this page
  }, []);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="dictionary">
      <Navbar />
      <div>
        <IR4Header />
      </div>

      <div className="dc-search-bar-container">
        <form onSubmit={handleSubmit} className="dc-search-bar">
          <input
            type="text"
            placeholder="Search for Jobs..."
            value={searchQuery}
            onChange={handleInputChange}
          />
          {/* <button type="submit">Search</button> */}
        </form>
      </div>
      <JobSkillsTable searchQuery={searchQuery} />
    </div>
  );
}

export default Dictionary;

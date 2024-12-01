import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import "./WorkforcePlanning.css";
import { db } from "../src/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { JobsBar } from "./JobsBar";
import SkillExtractor from "./ExtractSkills";

function WorkforcePlanning() {
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedQuery, setFetchedQuery] = useState("");
  const [jobCount, setJobCount] = useState(0);
  const [jobsData, setJobsData] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    document.title = "CAITO - Workforce Planning"; // Set the title for this page
  }, []);

  const fetchJobs = (searchTerm) => {
    fetch(
      `http://localhost:5001/api/job-search?term=${encodeURIComponent(
        searchTerm
      )}`,
      {
        method: "GET",
        mode: "cors",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setFetchedQuery(searchTerm);
        setJobCount(data.jobs[0].totalCount);
        setJobsData(data.jobs);
        setShowResults(true);
      })
      .catch((err) => console.log(err));
  };

  // store data in firebase
  const saveToFirebase = async () => {
    if (!jobsData || jobsData.length === 0) {
      alert("No jobs available to save. Please scrape jobs first.");
    }

    try {
      const q = query(
        collection(db, "jobSearchResults"),
        where("searchTerm", "==", fetchedQuery.toLowerCase())
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        const docRef = doc(db, "jobSearchResults", existingDoc.id);

        await updateDoc(docRef, {
          jobs: jobsData,
          timestamp: new Date(),
        });

        alert(`Data for search term "${fetchedQuery}" has been updated.`);
      } else {
        await addDoc(collection(db, "jobSearchResults"), {
          searchTerm: fetchedQuery.toLowerCase(),
          jobs: jobsData,
          timestamp: new Date(),
        });

        alert(`Data for search term "${fetchedQuery}" has been added.`);
      }
    } catch (err) {
      console.err("Error saving or updating data in Firestore: ", err);
      alert("Failed to save or update data. Please try again.");
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim() !== "") {
      fetchJobs(searchQuery);
    } else {
      alert("Please enter a search term.");
    }
  };

  return (
    <div className="workforce-planning">
      <div>
        <Navbar />
      </div>
      <div className="wp-header">
        <h2>Jobstreet Philippines Job Scraper</h2>
      </div>
      <div className="search-bar-container">
        <form onSubmit={handleSubmit} className="search-bar">
          <input
            type="text"
            placeholder="Search for jobs to scrape on Jobstreet PH... (e.g. Renewable Energy, Smart Manufacturing, etc.)"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button type="submit">Scrape</button>
        </form>
      </div>

      {showResults && (
        <div className="results-info">
          <p>
            You scraped a total of <strong>{jobCount}</strong> jobs for the
            search term <strong>{fetchedQuery}</strong>.
          </p>
          <div className="save-button-container">
            <button onClick={saveToFirebase} className="save-button">
              Save to Firebase
            </button>
          </div>
        </div>
      )}

      <div className="graph-container">
        <h3>Jobs scraped in the system:</h3>
        <JobsBar />
      </div>

      <hr />
      <div className="skill-extractor">
        <h2>Job Description Skill Extractor</h2>
        <div>
          <SkillExtractor />
        </div>
      </div>
    </div>
  );
}

export default WorkforcePlanning;

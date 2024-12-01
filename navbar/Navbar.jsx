import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { auth } from "../src/firebase/firebaseConfig"; // Ensure the path is correct for your project
import { signOut } from "firebase/auth";
import Search from "./SearchResults.json";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login page after sign out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const filteredLinks = Search.filter((link) =>
        link.keywords.some((keyword) =>
          keyword.toLowerCase().includes(value.toLowerCase())
        )
      );
      setSearchResults(filteredLinks);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchClick = (page) => {
    setSearchTerm("");
    setSearchResults([]); 
    navigate(page); 
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard-landing">
      <img src="/caito/caitoicon.png" alt="Caito Icon" style={{ height: "90px", cursor: "pointer" }} />

      </Link>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && searchResults.length > 0 && (
          <div className="search-suggestions">
            <ul>
              {searchResults.map((link, index) => (
                <li key={index}>
                  <span
                    onClick={() => handleSearchClick(link.page)}
                    style={{ cursor: "pointer" }}
                  >
                    {link.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ul className="navbar-nav">
        {/*
        <li className="nav-item">
          <Link to="/landing" className="nav-link">
            Home
          </Link>
        </li>
        */}
        <li className="nav-item">
          <Link to="/dashboard-landing" className="nav-link">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/workforce-planning" className="nav-link">
            Workforce Planning
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/insert-data" className="nav-link">
            Insert Data
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/dictionary" className="nav-link">
            Dictionary
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/about" className="nav-link">
            About Us
          </Link>
        </li>
        <li className="nav-item">
          <span
            onClick={handleLogout}
            className="nav-link"
            style={{ cursor: "pointer" }}
          >
            Log Out
          </span>
        </li>
        <li className="nav-item">
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

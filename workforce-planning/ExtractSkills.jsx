import React, { useEffect, useState } from "react";

const SkillExtractor = () => {
  const [data, setData] = useState(null);
  const [skills, setSkills] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");

  const fetchAccessToken = async () => {
    const url = "https://auth.emsicloud.com/connect/token";

    const body = new URLSearchParams();
    body.append("client_id", "wq0wqgzev4ys8maj");
    body.append("client_secret", "NE7Ju7Xi");
    body.append("grant_type", "client_credentials");
    body.append("scope", "emsi_open");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      setError(error.message);
    }
  };

  const extractSkills = async () => {
    const url = "https://emsiservices.com/skills/versions/latest/extract";
    const token = await fetchAccessToken();

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: inputText,
        confidenceThreshold: 0.6,
      }),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const skillsData = await response.json();
      setSkills(skillsData.data);
      console.log(skillsData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    extractSkills();
  }, []);

  if (loading) return <div className="buffer">Loading...</div>;
  if (error) return <div className="buffer">Error: {error}</div>;

  return (
    <div className="skill-extractor">
      <p className="skill-description">
        Enter a job description or key responsibilities in the text box below
        and click the Extract Skills button to see the skills related to the
        job.
      </p>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows={5}
        cols={50}
        placeholder="Enter job description or key responsibilities of a job posting here..."
      />
      <button onClick={extractSkills}>Extract Skills</button>

      <div className="extracted-skills">
        {skills.length > 0 ? (
          <div className="skills-container">
            {skills.map((item, index) => (
              <div className="skill-item" key={index}>
                <strong>Skill:</strong>{" "}
                <a
                  href={item.skill.infoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.skill.name}
                </a>
                <br />
                <strong>Confidence:</strong> {item.confidence.toFixed(2)}
                <br />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h3>No description extracted yet.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillExtractor;

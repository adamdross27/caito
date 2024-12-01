import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { db } from "../src/firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const JobsBar = () => {
  const [chartData, setChartData] = useState(null);
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    const fetchChartData = () => {
      // Listen for real-time updates to the collection
      const unsubscribe = onSnapshot(
        collection(db, "jobSearchResults"),
        (snapshot) => {
          const labels = [];
          const data = [];

          snapshot.forEach((doc) => {
            const docData = doc.data();
            const searchTerm = docData.searchTerm || "Unknown";
            const jobCount = docData.jobs ? docData.jobs[0].totalCount : 0;

            labels.push(searchTerm);
            data.push(jobCount);
          });

          // Update chart data dynamically
          setChartData({
            labels: labels,
            datasets: [
              {
                label: "Searched terms fetched from Firebase",
                data: data,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.7)",
                  "rgba(75, 192, 192, 0.7)",
                  "rgba(255, 205, 86, 0.7)",
                  "rgba(54, 162, 235, 0.7)",
                  "rgba(153, 102, 255, 0.7)",
                  "rgba(185, 244, 207, 0.7)",
                  "rgba(88, 113, 77, 0.7)",
                  "rgba(9, 191, 138, 0.7)",
                  "rgba(231, 255, 119, 0.7)",
                  "rgba(202, 69, 243, 0.7)",
                  "rgba(186, 163, 141, 0.7)",
                  "rgba(23, 29, 169, 0.7)",
                  "rgba(240, 103, 108, 0.7)",
                  "rgba(210, 12, 146, 0.7)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(255, 205, 86, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(185, 244, 207, 1)",
                  "rgba(88, 113, 77, 1)",
                  "rgba(9, 191, 138, 1)",
                  "rgba(231, 255, 119, 1)",
                  "rgba(202, 69, 243, 1)",
                  "rgba(186, 163, 141, 1)",
                  "rgba(23, 29, 169, 1)",
                  "rgba(240, 103, 108, 1)",
                  "rgba(210, 12, 146, 1)",
                ],
                borderWidth: 2,
              },
            ],
          });
        }
      );

      // Cleanup listener on unmount
      return () => unsubscribe();
    };

    fetchChartData();
  }, []);

  const toggleChartVisibility = () => {
    setShowChart((prevShowChart) => !prevShowChart);
  };

  return (
    <div className="chart-container">
      <div>
        <button onClick={toggleChartVisibility} className="toggle-button">
          {showChart ? "Hide Chart" : "Show Chart"}
        </button>
      </div>
      {showChart && chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      ) : (
        <p>Chart is loading/hidden.</p>
      )}
    </div>
  );
};

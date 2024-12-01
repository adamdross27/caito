import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getDatabase, ref, get } from 'firebase/database';
import '../Graphs.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function JobsGraphs() {
    const [chartDataSets, setChartDataSets] = useState([]);
    const [isVisible, setIsVisible] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const db = getDatabase();
            const dataRef = ref(db, 'Data/Jobs');

            try {
                const snapshot = await get(dataRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const allCharts = [];
                    const initialVisibility = {};

                    Object.keys(data).forEach((fileKey, index) => {
                        const fileContents = data[fileKey];

                        if (fileContents && fileContents.graphs) {
                            const titleFromData = fileContents.title;
                            const fileGraphs = [];

                            fileContents.graphs.forEach((graphData) => {
                                const chartData = {
                                    title: graphData.yAxisLabel,
                                    data: {
                                        labels: graphData.xAxis,
                                        datasets: [
                                            {
                                                label: graphData.yAxisLabel,
                                                data: graphData.yAxis,
                                                backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
                                                borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                                                borderWidth: 1,
                                            },
                                        ],
                                    },
                                    mainTitle: titleFromData,
                                };
                                fileGraphs.push(chartData);
                            });

                            allCharts.push({ title: titleFromData, graphs: fileGraphs });
                            initialVisibility[index] = true;
                        }
                    });

                    setChartDataSets(allCharts);
                    setIsVisible(initialVisibility);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const toggleVisibility = (index) => {
        setIsVisible((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    return (
        <div className="graphContainer">
            {chartDataSets.length > 0 ? (
                chartDataSets.map((fileData, index) => (
                    <div key={index} className="fileWrapper">
                        <div className="titleContainer">
                            <h2>{fileData.title}</h2>
                            <div className="toggleButtonContainer">
                                <button className="softRoundedButton" onClick={() => toggleVisibility(index)}>
                                    {isVisible[index] ? 'Hide' : 'Show'} Graphs
                                </button>
                            </div>
                        </div>
                        {isVisible[index] && fileData.graphs.map((chart, chartIndex) => (
                            <div key={chartIndex} className="chartWrapper">
                                <h3>{chart.title}</h3>
                                <Bar
                                    data={chart.data}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        layout: {
                                            padding: {
                                                top: -10,
                                                bottom: 20,
                                                left: 5,
                                                right: 5,
                                            },
                                        },
                                        scales: {
                                            x: {
                                                title: {
                                                    display: true,
                                                    text: "Industries",
                                                    font: {
                                                        weight: 'bold',
                                                    },
                                                },
                                            },
                                            y: {
                                                title: {
                                                    display: true,
                                                    text: chart.data.datasets[0].label,
                                                    font: {
                                                        weight: 'bold',
                                                    },
                                                },
                                                ticks: {
                                                    font: {
                                                        weight: 'bold',
                                                    },
                                                },
                                            },
                                        },
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'top',
                                            },
                                            tooltip: {
                                                enabled: true,
                                            },
                                        },
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <p>No graphs available to display.</p>
            )}
        </div>
    );
}

export default JobsGraphs;

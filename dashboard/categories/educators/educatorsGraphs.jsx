import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, ArcElement, LineElement } from 'chart.js'; 
import { Bar, Pie, Line } from 'react-chartjs-2';
import { getDatabase, ref, get } from 'firebase/database';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 
import '../graphs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartPie, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { requestGroqAi } from '../jobs/groq';
import Modal from '../Modal'; 
import ReactMarkdown from 'react-markdown';
import { PointElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, ChartDataLabels);

function EducatorsGraphs() {
    const [chartDataSets, setChartDataSets] = useState([]);
    const [isVisible, setIsVisible] = useState({});
    const [graphTypes, setGraphTypes] = useState({});
    const [analysisResponse, setAnalysisResponse] = useState({});
    const [modalOpen, setModalOpen] = useState(false); // State for modal
    const [modalContent, setModalContent] = useState({ title: '', content: '' }); // Content for modal
    const chartRefs = useRef({});
    const [loadingStates, setLoadingStates] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const db = getDatabase();
            const dataRef = ref(db, 'Data/Educators');

            try {
                const snapshot = await get(dataRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const allCharts = [];
                    const initialVisibility = {};
                    const initialGraphTypes = {};

                    Object.keys(data).forEach((fileKey, index) => {
                        const fileContents = data[fileKey];

                        if (fileContents && fileContents.graphs) {
                            const titleFromData = fileContents.title;
                            const fileGraphs = [];

                            fileContents.graphs.forEach((graphData, graphIndex) => {
                                const { xAxis, yAxis, yAxisLabel } = graphData;
                                const originalData = yAxis.map((value, idx) => ({ value, label: xAxis[idx] }));
                                const sortedData = [...originalData].sort((a, b) => b.value - a.value);
                                const sortedValues = sortedData.map(item => item.value);
                                const sortedLabels = sortedData.map(item => item.label);
                                const backgroundColors = generateColors(sortedValues.length);
                                const borderColors = backgroundColors.map(color => color.replace('0.6', '1'));

                                const chartData = {
                                    title: yAxisLabel,
                                    data: {
                                        labels: sortedLabels,
                                        datasets: [{
                                            label: yAxisLabel,
                                            data: sortedValues,
                                            backgroundColor: backgroundColors,
                                            borderColor: borderColors,
                                            borderWidth: 1,
                                            datalabels: {
                                                display: true,
                                                anchor: 'end',
                                                align: 'top',
                                                formatter: (value) => value,
                                                color: '#000',
                                                font: { weight: 'bold' },
                                            },
                                        }],
                                    },
                                    mainTitle: titleFromData,
                                };

                                fileGraphs.push(chartData); // Store chart data for bar and pie
                                initialGraphTypes[`${fileKey}-${graphIndex}`] = 'bar'; // Default graph type is Bar
                            });

                            allCharts.push({ title: titleFromData, graphs: fileGraphs });
                            initialVisibility[index] = true;
                        }
                    });

                    setChartDataSets(allCharts);
                    setIsVisible(initialVisibility);
                    setGraphTypes(initialGraphTypes);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const generateColors = (num) => {
        return Array.from({ length: num }, () => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`);
    };

    const toggleVisibility = (index) => {
        setIsVisible(prevState => ({ ...prevState, [index]: !prevState[index] }));
    };

    const changeGraphType = (key, type) => {
        setGraphTypes(prevTypes => ({ ...prevTypes, [key]: type }));
    };

    const handleDownload = (chartName) => {
        const chartInstance = chartRefs.current[chartName];
        if (chartInstance) {
            const link = document.createElement('a');
            link.download = `${chartName}-chart.png`;
            link.href = chartInstance.toBase64Image();
            link.click();
        }
    };

    const handleGraphAnalysis = async (graphId, graphName) => {
        // Check if the analysis is already done for this graph
        if (analysisResponse[graphName]) {
            // Open modal with existing response
            setModalContent({ title: graphName, content: analysisResponse[graphName] });
            setModalOpen(true);
            return; // Exit if already analyzed
        }
    
        setLoadingStates(prev => ({ ...prev, [graphId]: true }));
    
        // Split the graphId to get the index of the chartDataSets
        const [dataSetIndex, graphIndex] = graphId.split('-').map(Number);
        const graphData = chartDataSets[dataSetIndex]?.graphs[graphIndex];
    
        if (!graphData) {
            console.error(`Graph data not found for graphId ${graphId}`);
            return; // Exit if graphData is not found
        }
    
        // Construct the content to send to the AI
        const content = 
            `Job Market Dashboard - Philippines\n\n` +
            `Data is sourced from webscape job postings\n\n` +
            `Please analyze the data for the "${graphName}" graph\n\n` +
            `**Graph Title** "${graphData.title}"\n\n` +
            `**X-Axis Data**\n- ${graphData.data.labels.join('\n- ')}\n\n` +
            `**Y-Axis (Data Label)** ${graphData.data.datasets[0].label}\n\n` +
            `**Y-Axis Data Points**\n- ${graphData.data.datasets[0].data.join('\n- ')}\n\n` +
            `**Summary** Identify key insights, trends, and patterns within the data. Provide a professional analysis`;
    
        try {
            const response = await requestGroqAi(content);
    
            const formatResponse = (response) => {
                return response
                    .replace(/\*\*(.*?)\*\*/g, '<br /><strong>$1</strong><br />')  // New lines around headings
                    .replace(/(\d+\.\s)(.*?)(?=\s|$)/g, '<br />$1$2')              // Combine number with title on the same line (no new line after number)
                    .replace(/:\s/g, '')                                          // Remove colons
                    .replace(/(\-\s)/g, '<br />$1')                               // New lines before bullet points
                    .replace(/\n{3,}/g, '<br /><br />')                           // Trim excessive newlines
                    .trim();                                                      // Remove any leading/trailing newlines
            };
            
            
    
            const formattedResponse = formatResponse(response);
    
            setAnalysisResponse(prev => ({ ...prev, [graphName]: formattedResponse }));
            // Open modal with new formatted response
            setModalContent({ title: graphName, content: formattedResponse });
            setModalOpen(true);
        } catch (error) {
            console.error('Error analyzing graph', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [graphId]: false }));
        }
    };
    
    
    
    const closeModal = () => {
        setModalOpen(false);
    };

    const renderChart = (chart, currentGraphType, chartIndex) => {
        const ChartComponent = currentGraphType === 'bar' ? Bar : currentGraphType === 'pie' ? Pie : Line;
    
        // Calculate total value for percentage calculations only for pie charts
        const total = currentGraphType === 'pie' ? chart.data.datasets[0].data.reduce((acc, value) => acc + value, 0) : null;
    
        // Modify data labels to show percentages only for pie charts
        const dataWithPercentages = currentGraphType === 'pie' 
            ? chart.data.datasets[0].data.map(value => {
                const percentage = ((value / total) * 100).toFixed(1); // Calculate percentage and format to one decimal
                return {
                    value,
                    percentage: percentage < 3 ? null : percentage + '%', // Return null if less than 3%
                };
            })
            : chart.data.datasets[0].data.map(value => ({ value })); // Keep original values for bar and line charts
    
        // Update dataset with new labels
        const updatedDataset = {
            ...chart.data.datasets[0],
            data: currentGraphType === 'pie' ? dataWithPercentages.map(item => item.value) : chart.data.datasets[0].data, // Use original values for bar and line
            datalabels: {
                display: true,
                anchor: 'center',
                align: 'center',
                formatter: (value, context) => {
                    if (currentGraphType === 'pie') {
                        const percentageLabel = dataWithPercentages[context.dataIndex].percentage;
                        return percentageLabel; // Return percentage for pie chart
                    }
                    return value; // Return actual value for bar and line charts
                },
                color: '#000',
                font: { weight: 'bold' },
            },
        };
    
        return (
            <div style={{ width: '100%', height: currentGraphType === 'pie' ? '65vh' : '68vh' }}>
                <div style={{ position: 'relative', width: '100%', height: currentGraphType === 'pie' ? '65vh' : '68vh' }}>
                    <h3 style={{
                        position: 'absolute',
                        top: '-10px', // Adjust as needed
                        left: '0', // Adjust as needed
                        zIndex: '10', // Ensure it appears above the chart
                        color: '#000', 
                        textAlign: 'center', // Center the title
                        width: '100%', // Make it full width
                    }}>
                        {chart.title} {/* Title to display */}
                    </h3>
                    <ChartComponent
                        ref={(ref) => (chartRefs.current[chart.title] = ref)}
                        data={{
                            ...chart.data,
                            datasets: [updatedDataset], // Use updated dataset
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            layout: {
                                padding: { top: 15, bottom: 20, left: 5, right: 5 },
                            },
                            plugins: {
                                legend: { display: currentGraphType === 'pie' }, // Show legend only for pie chart
                                tooltip: { enabled: true },
                            },
                        }}
                    />
                    <div className="buttonContainer">
                        <button className="downloadChartButton barLineChart" onClick={() => handleDownload(chart.title)}>
                            Download {chart.title} Chart
                        </button>
                        <button onClick={() => handleGraphAnalysis(chartIndex, chart.title)} className={`analyseButton barLineChart ${loadingStates[chartIndex] ? 'loading' : ''}`} disabled={loadingStates[chartIndex]}>
                            {loadingStates[chartIndex] ? 'Analysing...' : `Analyse ${chart.title} Data`}
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    

    return (
        <div className="graphContainer">
            {chartDataSets.length > 0 ? (
                chartDataSets.map((fileData, index) => (
                    <div key={index} className="fileWrapper">
                        <div className="titleContainer">
                            <h2>{fileData.title}</h2>
                        </div>

                        <div className="visibilityToggleContainer">
                            <button className="softRoundedButton showHideButton" onClick={() => toggleVisibility(index)}>
                                {isVisible[index] ? 'Hide' : 'Show'} Graphs
                            </button>
                        </div>
                        {isVisible[index] && fileData.graphs.map((chart, chartIndex) => {
                            const graphKey = `${index}-${chartIndex}`; 
                            const currentGraphType = graphTypes[graphKey] || 'bar'; 

                            return (
                                <div key={chart.title} className="chartWrapper">
                                    <div className="graphTypeToggle">
                                        <button onClick={() => changeGraphType(graphKey, 'bar')} className={`graphTypeButton ${currentGraphType === 'bar' ? 'active' : ''}`}>
                                            <FontAwesomeIcon icon={faChartBar} />
                                        </button>
                                        <button onClick={() => changeGraphType(graphKey, 'pie')} className={`graphTypeButton ${currentGraphType === 'pie' ? 'active' : ''}`}>
                                            <FontAwesomeIcon icon={faChartPie} />
                                        </button>
                                        <button onClick={() => changeGraphType(graphKey, 'line')} className={`graphTypeButton ${currentGraphType === 'line' ? 'active' : ''}`}>
                                            <FontAwesomeIcon icon={faChartLine} />
                                        </button>
                                    </div>
                                    {renderChart(chart, currentGraphType, graphKey)}
                                </div>
                            );
                        })}
                    </div>
                ))
            ) : (
                <p>No charts available.</p>
            )}
            <Modal 
                isOpen={modalOpen} 
                onClose={closeModal} 
                title={modalContent.title} 
                content={modalContent.content} 
            />
        </div>
    );
}

export default EducatorsGraphs;

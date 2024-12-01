import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { getDatabase, ref, get } from 'firebase/database';
import styles from './jobs.module.css';
import ReactMarkdown from 'react-markdown';
import { requestGroqAi } from './groq';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

ChartJS.register({
    id: 'customBackground',
    beforeDraw: (chart, args, opts) => {
      const ctx = chart.canvas.getContext('2d');
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = opts.color || 'white';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  });

const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { beginAtZero: true } },
    plugins: { legend: { display: false } }
};

const initialGraphs = [
  { id: 'location', name: 'Location', visible: true, deleted: false },
  { id: 'workType', name: 'Work Type', visible: true, deleted: false },
  { id: 'classification', name: 'Classification', visible: true, deleted: false },
  { id: 'subClassification', name: 'Sub Classification', visible: true, deleted: false },
  { id: 'workArrangements', name: 'Work Arrangements', visible: true, deleted: false },
];

const Graph = () => {
    const [jobData, setJobData] = useState([]);
    const [filters, setFilters] = useState({});
    const [graphs, setGraphs] = useState(initialGraphs);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [addGraphDropdownOpen, setAddGraphDropdownOpen] = useState(false);
    const chartRefs = useRef({});
    const [analysisResponse, setAnalysisResponse] = useState({});
    const [loadingStates, setLoadingStates] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const db = getDatabase();
            const jobsRef = ref(db, 'JobPostData/data');
            try {
                const snapshot = await get(jobsRef);
                if (snapshot.exists()) {
                    setJobData(snapshot.val());
                } else {
                    console.log('No data available');
                }
            } catch (error) {
                console.error('Error: ', error);
            } 
        };
        fetchData();
    }, []);

    const handleGraphAnalysis = async (graphId, graphName) => {
        setLoadingStates(prev => ({ ...prev, [graphId]: true }));
        const graphData = chartData[graphId];
    
        const content = `
            Job Market Dashboard - Philippines. 
            Data is sourced from webscape job postings. 
            Please analyze the data for the ${graphId} graph. 
            Current Filters only showing: ${JSON.stringify(filters)}. 
            Data: ${JSON.stringify(graphData)}. 
            Identify key insights, trends, and patterns within the data. 
            Provide a professional analyze.
            `;
    
        try {
            const response = await requestGroqAi(content);
            setAnalysisResponse(prev => ({
                ...prev,
                [graphName]: response
            }));
        } catch (error) {
            console.error('Error analysing graph:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [graphId]: false }));
        }
    };
    
    const applyFilters = (data) => {
        return data.filter(item => {
            return (!filters.location || item.location === filters.location) &&
                   (!filters.workType || item.workType === filters.workType) &&
                   (!filters.classification || item.classification?.description === filters.classification) &&
                   (!filters.subClassification || item.subClassification?.description === filters.subClassification);
        });
    };

    const dataproc = (data, key, nestedKey = null) => {
        const filteredData = applyFilters(data);
        const counts = filteredData.reduce((acc, item) => {
            const value = nestedKey ? item[key]?.[nestedKey] : item[key];
            if (value) {
                acc[value] = (acc[value] || 0) + 1;
            }
            return acc;
        }, {});
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
    };

    const locations = dataproc(jobData, 'location');
    const workType = dataproc(jobData, 'workType');
    const classifications = dataproc(jobData, 'classification', 'description');
    const subClassification = dataproc(jobData, 'subClassification', 'description');
    
    const workArrangements = applyFilters(jobData).reduce((acc, job) => {
        if (job.workArrangements?.data) {
            job.workArrangements.data.forEach(arrangement => {
                const label = arrangement.label.text;
                acc[label] = (acc[label] || 0) + 1;
            });
        }
        return acc;
    }, {});

    const createChartData = (data, label, backgroundColor, borderColor) => ({
        labels: Object.keys(data),
        datasets: [{
            label,
            data: Object.values(data),
            backgroundColor,
            borderColor,
            borderWidth: 1,
        }],
    });

    const chartData = {
        location: createChartData(locations, 'Location', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)'),
        workType: createChartData(workType, 'Work Type', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)'),
        classification: createChartData(classifications, 'Classification', 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)'),
        subClassification: createChartData(subClassification, 'Sub Classification', 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)'),
        workArrangements: createChartData(workArrangements, 'Work Arrangements', 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)'),
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    const handleGraphToggle = (graphId) => {
        setGraphs(prevGraphs => prevGraphs.map(graph => 
            graph.id === graphId ? { ...graph, visible: !graph.visible } : graph
        ));
    };

    const handleGraphDelete = (graphId) => {
        setGraphs(prevGraphs => prevGraphs.map(graph =>
            graph.id === graphId ? { ...graph, deleted: true } : graph
        ));
    };

    const handleGraphAdd = (graphId) => {
        setGraphs(prevGraphs => prevGraphs.map(graph =>
            graph.id === graphId ? { ...graph, deleted: false, visible: true } : graph
        ));
    };

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    const toggleAddGraphDropdown = () => {
        setAddGraphDropdownOpen(prev => !prev);
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

    const FilterSelect = ({ options, value, onChange, label }) => (
        <select value={value} onChange={onChange} className={styles.filterSelect}>
            <option value="">{`All ${label}s`}</option>
            {Object.keys(options).map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    );

    const ChartComponent = ({ chartId, chartName, chartData, ChartType, totalUnique}) => (
        <div className={styles.dataCard}>
            <div className={styles.chartHeader}>
                <h3>{chartName}</h3>
            </div>
        <div className={styles.smallDataCard}>
            <h4>Total Unique {chartName}</h4>
            <p className={styles.dataNumber}>{totalUnique}</p>
        </div> 
            <div className={styles.chartWrapper}>
                <div className={styles.chartContainer}>
                    <ChartType
                        data={chartData}
                        options={options}
                        ref={(ref) => chartRefs.current[chartName] = ref}
                    />
                </div>
            </div>
            <button onClick={() => handleDownload(chartName)} className={styles.downloadButton}>
                Download {chartName} Chart
            </button>
            <button 
                onClick={() => handleGraphAnalysis(chartId, chartName)} 
                className={`${styles.analysisButton} ${loadingStates[chartId] ? styles.loading : ''}`}
                disabled={loadingStates[chartId]}
            >
                {loadingStates[chartId] ? 'Analysing...' : `Analyse ${chartName} Data`}
            </button>
            <button onClick={() => handleGraphDelete(chartId)} className={styles.deleteButton}>
                Delete
            </button>
            {analysisResponse[chartName] && (
                <div className={styles.analysisResponse}>
                    <ReactMarkdown>
                        {analysisResponse[chartName]}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );

    return (
        <div className={styles.graphContainer}>
            <h2>Job Market Dashboard - Philippines</h2>
            
            <div className={styles.filters}>
                <FilterSelect 
                    options={locations}
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    label="Location"
                />
                <FilterSelect 
                    options={workType}
                    value={filters.workType || ''}
                    onChange={(e) => handleFilterChange('workType', e.target.value)}
                    label="Work Type"
                />
                <FilterSelect 
                    options={classifications}
                    value={filters.classification || ''}
                    onChange={(e) => handleFilterChange('classification', e.target.value)}
                    label="Classification"
                />
                <FilterSelect 
                    options={subClassification}
                    value={filters.subClassification || ''}
                    onChange={(e) => handleFilterChange('subClassification', e.target.value)}
                    label="Sub Classification"
                />
            </div>
            
            <div className={styles.dropdownContainer}>
                <div className={`${styles.dropdown} ${dropdownOpen ? styles.show : ''}`}>
                    <button className={styles.dropbtn} onClick={toggleDropdown}>Graph Filter</button>
                    <div className={styles.dropdownContent}>
                        {graphs.filter(graph => !graph.deleted).map(graph => (
                            <label key={graph.id}>
                                <input
                                    type="checkbox"
                                    checked={graph.visible}
                                    onChange={() => handleGraphToggle(graph.id)}
                                />
                                {graph.name} Graph
                            </label>
                        ))}
                    </div>
                </div>

                <div className={`${styles.dropdown} ${addGraphDropdownOpen ? styles.show : ''}`}>
                    <button className={styles.dropbtn} onClick={toggleAddGraphDropdown}>Add Graph</button>
                    <div className={styles.dropdownContent}>
                        {graphs.filter(graph => graph.deleted).map(graph => (
                            <label key={graph.id} onClick={() => handleGraphAdd(graph.id)}>
                                {graph.name} Graph
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.dataCardRow}>
                <div className={styles.smallDataCard}>
                    <h4>Total Job Postings</h4>
                    <p className={styles.dataNumber}>{Object.values(locations).reduce((a, b) => a + b, 0)}</p>
                </div>
            </div>
            
            {graphs.filter(graph => graph.visible && !graph.deleted).map(graph => (
                <ChartComponent
                    key={graph.id}
                    chartId={graph.id}
                    chartName={graph.name}
                    chartData={chartData[graph.id]}
                    ChartType={Bar}
                    totalUnique={Object.keys(chartData[graph.id].datasets[0].data).length}
                />
            ))}
        </div>
    );
}

export default Graph;
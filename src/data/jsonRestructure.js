export const restructureJSON = (jsonData) => {
    const structuredJSON = {
        title: '',
        xAxisLabel: '',
        graphs: []
    };

    if (jsonData.length < 3) {
        throw new Error('Invalid JSON format');
    }

    // Set title from the last row
    structuredJSON.title = jsonData[jsonData.length - 1][Object.keys(jsonData[jsonData.length - 1])[0]] || "Unknown Title";
    const headersRow = jsonData[0]; // First row for headers
    structuredJSON.xAxisLabel = headersRow[0] || "Industry"; 

    // Include all headers (not just slice(1))
    Object.keys(headersRow).forEach((headerKey, index) => {
        const graph = {
            yAxisLabel: headersRow[headerKey], 
            xAxis: [],
            yAxis: []
        };

        jsonData.slice(1, -1).forEach(entry => {
            const industry = entry[Object.keys(entry)[0]] || "Unknown Industry";
            const yValue = entry[headerKey] || 0; 

            graph.xAxis.push(industry);
            graph.yAxis.push(yValue);
        });

        structuredJSON.graphs.push(graph);
    });

    console.log('Number of graphs created:', structuredJSON.graphs.length); // Debugging line

    return structuredJSON;
};
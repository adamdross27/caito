import xlsx from 'xlsx';

export const cleanExcelData = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    const cleanedData = [];

    sheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { raw: false });

        // Clean the data
        jsonData.forEach(row => {
            const cleanedRow = {};
            Object.keys(row).forEach(key => {
                let value = row[key];
                
                // Remove leading dots
                if (typeof value === 'string') {
                    value = value.replace(/^\.+/, ''); // Remove leading dots
                }
                
                cleanedRow[key] = value;
            });

            // Add only relevant rows
            if (Object.values(cleanedRow).some(val => val !== "")) {
                cleanedData.push(cleanedRow);
            }
        });
    });

    // Move the first row to the end
    if (cleanedData.length > 1) {
        const headerRow = cleanedData.shift(); // Remove the first row
        cleanedData.push(headerRow); // Add it to the end
    }

    return cleanedData;
};

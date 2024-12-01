import xlsx from 'xlsx';
import { getDatabase, ref, set } from 'firebase/database';
import { restructureJSON } from './jsonRestructure.js';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebase/firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to sanitize file names for Firebase paths
const sanitizeFileName = (filename) => {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

// Process Excel files and upload to Firebase
export const xlsxToJsonConverter = (filePath, fileName, category) => {
    const workbook = xlsx.readFile(filePath);
    const sheetNames = workbook.SheetNames;

    sheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        // Log parsed data for debugging
        console.log('Parsed JSON Data:', jsonData);

        // Restructure the JSON data using the custom logic
        const structuredData = restructureJSON(jsonData);

        // Log structured data
        console.log('Structured Data:', structuredData);
        
        // Sanitize the file name to create a valid Firebase path
        const sanitizedFileName = sanitizeFileName(fileName);

        // Create the path for the file in Firebase
        const fileRef = ref(database, `Data/${category}/${sanitizedFileName}`);

        // Upload the restructured data to Firebase
        set(fileRef, structuredData)
            .then(() => {
                console.log(`Data from ${fileName} uploaded to Firebase successfully under category ${category}.`);
            })
            .catch((error) => {
                console.error('Error uploading data to Firebase:', error);
            });
    });
};

import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { xlsxToJsonConverter } from '../data/uploadExcel.js'; 
import { restructureJSON } from '../data/jsonRestructure.js'; 
import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import firebaseConfig from '../firebase/firebaseConfig.js';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Create an Express application
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

// Function to sanitize file names for Firebase paths
const sanitizeFileName = (fileName) => {
    return fileName.replace(/[.#$[\]]/g, '_'); // Replace invalid characters with underscores
};

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    const { path: filePath, originalname } = req.file;
    const { category } = req.body;
    const fileExt = path.extname(originalname).toLowerCase();

    try {
        if (fileExt === '.xlsx') {
            // If it's an XLSX file, process it
            xlsxToJsonConverter(filePath, originalname, category);  // Pass category to the converter
            res.status(200).send({ message: 'XLSX file uploaded and processed successfully!' });
        } else if (fileExt === '.json') {
            // If it's a JSON file, read and restructure it
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) throw err;
                const jsonData = JSON.parse(data);
                const structuredData = restructureJSON(jsonData);

                const sanitizedFileName = sanitizeFileName(originalname);
                const fileRef = ref(database, `Data/${category}/${sanitizedFileName}`);

                // Upload structured data to Firebase
                set(fileRef, structuredData)
                    .then(() => {
                        console.log(`Data from ${originalname} uploaded to Firebase successfully under category ${category}.`);
                        res.status(200).send({ message: 'File uploaded and processed successfully!' });
                    })
                    .catch((error) => {
                        console.error('Error uploading data to Firebase:', error);
                        res.status(500).send({ message: 'Error uploading JSON data.' });
                    });
            });
        } else {
            res.status(400).send({ message: 'Unsupported file type.' });
        }
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send({ message: 'Error processing file.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

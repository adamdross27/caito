import fs from 'fs';
import path from 'path';
import csv from 'csv-parser'; 
import { getDatabase, ref, set, push } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebase/firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Get directory paths
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const toUploadDir = path.join(__dirname, 'ToUpload');
const uploadedDir = path.join(__dirname, 'Uploaded');

// Function to process and upload CSV files
const processFiles = () => {
  fs.readdir(toUploadDir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach((file) => {
      if (path.extname(file) === '.csv') {
        const filePath = path.join(toUploadDir, file);
        const uploadedFilePath = path.join(uploadedDir, file);
        const fileName = path.basename(file, '.csv');

        // Read and process CSV file
        const data = [];
        fs.createReadStream(filePath)
          .pipe(csv({ headers: false })) // Disable automatic header parsing
          .on('data', (row) => {
            // Skip rows that are headers or titles
            if (row['Field1'] && row['Field2']) { // Example condition
              data.push(row);
            }
          })
          .on('end', () => {
            // Create a reference for the file in Firebase
            const fileRef = ref(database, `Data/CSVFiles/${fileName}`);

            // Upload data to Firebase
            data.forEach((entry) => {
              const newRef = push(fileRef);
              set(newRef, entry)
                .then(() => {
                  console.log(`Data from ${file} uploaded to Firebase successfully.`);
                })
                .catch((error) => {
                  console.error('Error uploading data to Firebase:', error);
                });
            });

            // Move the file to the 'Uploaded' folder
            fs.rename(filePath, uploadedFilePath, (err) => {
              if (err) {
                console.error('Error moving file:', err);
              } else {
                console.log(`File ${file} moved to Uploaded folder.`);
              }
            });
          });
      }
    });
  });
};

// Run the script
processFiles();

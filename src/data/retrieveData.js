import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebase/firebaseConfig.js'; // Import the default export
import readline from 'readline';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to retrieve data from Firebase
const retrieveData = async (fileName) => {
  try {
    // Create a reference to the specific folder in Firebase
    const dataRef = ref(database, `Data/ExcelFiles/${fileName}`);

    // Get the data snapshot
    const snapshot = await get(dataRef);

    if (snapshot.exists()) {
      // Get the data from the snapshot
      const data = snapshot.val();
      
      // Iterate through each child node (row)
      Object.keys(data).forEach((key) => {
        const rowData = data[key];
        console.log(`Row ID: ${key}`, rowData);
      });
    } else {
      console.log('No data available');
    }
  } catch (error) {
    console.error('Error retrieving data from Firebase:', error);
  }
};

// Set up readline to get user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Please enter the file name (without .xlsx extension): ', (fileName) => {
  // Retrieve data based on user input
  retrieveData(fileName);

  // Close the readline interface
  rl.close();
});

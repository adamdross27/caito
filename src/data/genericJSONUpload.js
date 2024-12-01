import { getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebase/firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Sanitize function to avoid invalid characters in Firebase paths
const sanitizePath = (path) => {
  return path.replace(/[.#$[\]]/g, '');
};

export const uploadJSONData = async (jsonData, category, fileName) => {
  // Sanitize category and fileName
  const sanitizedCategory = sanitizePath(category);
  const sanitizedFileName = sanitizePath(fileName);

  // Log sanitized paths
  console.log(`Sanitized Category: ${sanitizedCategory}`);
  console.log(`Sanitized File Name: ${sanitizedFileName}`);
  console.log(`Full Path: Data/${sanitizedCategory}/${sanitizedFileName}`);

  const dataRef = ref(database, `Data/${sanitizedCategory}/${sanitizedFileName}`);
  
  try {
    await set(dataRef, jsonData);
    console.log(`Data uploaded successfully to Data/${sanitizedCategory}/${sanitizedFileName}`);
  } catch (error) {
    console.error('Error uploading data to Firebase:', error);
    throw error;
  }
};

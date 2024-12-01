import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx'; // Dependency for Excel files
import uploadData from './InsertData.js'; // Existing JSON uploader
import uploadExcelData from './InsertExcelData.js'; // Excel uploader function

const uploadFolder = './ToUpload';
const uploadedFolder = path.join(uploadFolder, 'Uploaded');

// Create the Uploaded directory if it doesn't exist
if (!fs.existsSync(uploadedFolder)) {
  fs.mkdirSync(uploadedFolder);
}

const processExcelFile = async (filePath) => {
  try {
    if (typeof filePath !== 'string') {
      throw new TypeError('Invalid file path. Expected a string.');
    }

    console.log(`Processing Excel file: ${filePath}`);

    // Read the Excel file
    const workbook = xlsx.readFile(filePath);
    
    // Get the first sheet's name
    const sheetName = workbook.SheetNames[0];
    
    // Get the sheet data
    const sheet = workbook.Sheets[sheetName];
    
    // Convert the sheet to JSON
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    console.log('Excel file parsed successfully:', jsonData);

    // Upload the parsed JSON data
    await uploadExcelData(jsonData);

    // Move the Excel file to the "Uploaded" folder after processing
    const newFilePath = path.join(uploadedFolder, path.basename(filePath));
    fs.renameSync(filePath, newFilePath);
    console.log(`Excel file moved to ${newFilePath}`);
    
  } catch (error) {
    console.error(`Error processing Excel file: ${error.message}`);
  }
};

// Initialize the watcher
chokidar.watch(uploadFolder, { ignored: /(^|[\/\\])\../, persistent: true })
  .on('add', async filePath => {
    const ext = path.extname(filePath);

    if (ext === '.json') {
      console.log(`Detected new JSON file: ${filePath}`);
      try {
        await uploadData(filePath); // Upload JSON data
        const newFilePath = path.join(uploadedFolder, path.basename(filePath));
        fs.renameSync(filePath, newFilePath); // Move JSON file after processing
        console.log(`JSON file moved to ${newFilePath}`);
      } catch (error) {
        console.error('Error processing JSON file:', error);
      }
    } else if (ext === '.xlsx') {
      console.log(`Detected new Excel file: ${filePath}`);
      try {
        await processExcelFile(filePath); // Process Excel file
      } catch (error) {
        console.error('Error processing Excel file:', error);
      }
    }
  });

console.log('Watching for changes in', uploadFolder);

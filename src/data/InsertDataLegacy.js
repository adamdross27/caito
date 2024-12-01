import { database } from '../firebase/firebaseConfig.js';
import { ref, set, get } from 'firebase/database';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const uploadData = async (filePath) => {
  const data = fs.readFileSync(filePath, 'utf8');
  let jsonData;

  try {
    jsonData = JSON.parse(data);
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
    throw parseError; // Re-throw error to handle it in the caller
  }

  for (const item of jsonData) {
    let path;
    let dataObject = {};
    const uniqueId = uuidv4(); // Generate a unique ID for each entry

    switch (item.datatype) {
      case 'job':
        path = 'Data/Jobs';
        dataObject = {
          company: item.company || "",
          datePosted: item.datePosted || "",
          industry: item.industry || "",
          jobType: item.jobType || "",
          location: item.location || "",
          salary: item.salary || "",
          skillRequirements: item.skillRequirements || ""
        };
        break;
      case 'student':
        path = 'Data/Students';
        dataObject = {
          degreeName: item.degreeName || "",
          lengthOfCourse: item.lengthOfCourse || "",
          institution: item.institution || "",
          graduationYear: item.graduationYear || "",
          skillsAcquired: item.skillsAcquired || "",
          employmentStatus: item.employmentStatus || "",
          studentType: item.studentType || "",
          internshipExperience: item.internshipExperience || ""
        };
        break;
      case 'trade':
        path = 'Data/Trades';
        dataObject = {
          tradeName: item.tradeName || "",
          apprenticeshipLength: item.apprenticeshipLength || "",
          certificationBody: item.certificationBody || "",
          numberOfApprentices: item.numberOfApprentices || "",
          tradeSkills: item.tradeSkills || "",
          tradeTools: item.tradeTools || ""
        };
        break;
      case 'university':
        path = 'Data/Universities';
        dataObject = {
          universityName: item.universityName || "",
          location: item.location || "",
          numberOfStudents: item.numberOfStudents || "",
          courses: item.courses || "",
          faculties: item.faculties || ""
        };
        break;
      case 'employer':
        path = 'Data/Employers';
        dataObject = {
          industry: item.industry || "",
          jobOpenings: item.jobOpenings || "",
          location: item.location || "",
          name: item.name || "",
          numOfEmployees: item.numOfEmployees || ""
        };
        break;
      case 'course':
        path = 'Data/Courses';
        dataObject = {
          certification: item.certification || "",
          content: item.content || "",
          duration: item.duration || "",
          institution: item.institution || "",
          name: item.name || "",
          skillLevel: item.skillLevel || ""
        };
        break;
      case 'labourMarket':
        path = 'Data/LabourMarket';
        dataObject = {
          skillShortages: item.skillShortages || "",
          skillMismatches: item.skillMismatches || "",
          jobDemandTrends: item.jobDemandTrends || "",
          industryGrowthAreas: item.industryGrowthAreas || "",
          economicIndicators: item.economicIndicators || ""
        };
        break;
      case 'workforceAnalytics':
        path = 'Data/WorkforceAnalytics';
        dataObject = {
          employmentRates: item.employmentRates || "",
          unemploymentRates: item.unemploymentRates || "",
          workforceDemographics: item.workforceDemographics || "",
          jobVacancyRates: item.jobVacancyRates || "",
          wageTrends: item.wageTrends || ""
        };
        break;
      case 'employmentTrends':
        path = 'Data/EmploymentTrends';
        dataObject = {
          emergingJobRoles: item.emergingJobRoles || "",
          enviroImpact: item.enviroImpact || "",
          sectorGrowth: item.sectorGrowth || "",
          techImpact: item.techImpact || ""
        };
        break;
      default:
        console.error('Unknown datatype:', item.datatype);
        continue;
    }

    try {
      const dataRef = ref(database, `${path}/${uniqueId}`);
      // Check if the data already exists
      const snapshot = await get(dataRef);
      if (!snapshot.exists()) {
        await set(dataRef, dataObject);
        console.log(`Data for ${item.datatype} saved successfully at ${path}/${uniqueId}`);
      } else {
        console.log(`Data for ${item.datatype} already exists at ${path}/${uniqueId}`);
      }
    } catch (error) {
      console.error('Data could not be saved.', error);
    }
  }
};
 //FIX DUPLICATION ISSUE     
export default uploadData;

import admin from 'firebase-admin';
import serviceAccount from './caito-rnd-firebase-adminsdk-txd4r-72c480bfe9.json' assert { type: 'json' };

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://caito-rnd-default-rtdb.firebaseio.com' 
});

const db = admin.firestore();

const categories = [
  'Courses',
  'Educators',
  'Employers',
  'Income',
  'Jobs',
  'Population',
  'Skills',
  'Students',
  'Trades',
  'Universities'
];

async function createCategories() {
  try {
    for (const category of categories) {
      await db.collection('Data').doc(category).set({});
      console.log(`Created collection: ${category}`);
    }
    
    // Verify data write
    for (const category of categories) {
      const doc = await db.collection('Data').doc(category).get();
      if (doc.exists) {
        console.log(`Verified category ${category} exists.`);
      } else {
        console.log(`Category ${category} does not exist.`);
      }
    }
    
    console.log('All categories created and verified successfully.');
  } catch (error) {
    console.error('Error creating categories:', error);
  }
}

createCategories();

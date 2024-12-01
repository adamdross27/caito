import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../src/firebase/firebaseConfig'; // Adjust the path as necessary
import './Landing.css';

function LandingPage() {
    const [firstName, setFirstName] = useState(''); // State to store the user's first name
    const [loading, setLoading] = useState(true); // State to manage loading state

    useEffect(() => {
        document.title = "CAITO - Home"; // Set the title for this page
      }, []);

    useEffect(() => {
        // Fetch the user's first name from the database
        const fetchUserData = async () => {
            if (auth.currentUser) { // Check if a user is authenticated
                const userId = auth.currentUser.uid;
                const db = getDatabase();
                const userRef = ref(db, 'users/' + userId);

                try {
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        // Set firstName if it exists, otherwise use a fallback value
                        setFirstName(userData.firstName || 'User');
                    } else {
                        console.log('No user data available');
                        setFirstName('User'); // Fallback value if no user data exists
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setFirstName('User'); // Fallback value in case of an error
                } finally {
                    setLoading(false); // Set loading to false when done
                }
            } else {
                console.log('No user is currently authenticated');
                setFirstName('User'); // Fallback value if no user is authenticated
                setLoading(false); // Set loading to false if no user is authenticated
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="landingPage">
            <Navbar />
            <h1 className="welcomeText">
                {loading ? 'Loading...' : `Welcome, ${firstName}!`}
            </h1>
        </div>
    );
}

export default LandingPage;

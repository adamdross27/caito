import React, { useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import './About.css';

const About = () => {
    useEffect(() => {
        document.title = "CAITO - About"; // Set the title for this page
      }, []);
    return (

        <div>
            <Navbar />
            <div className="about-page">
                <section className="about-section">
                    <h2>About CAITO</h2>
                    <p>Welcome to CAITO! We are dedicated to providing the best service possible.</p>
                    <p>CAITO Solutions for Knowledge & Data Collection, Analysis, and Insights</p>
                </section>

                <section className="about-section">
                    <h2>About IR 4.0</h2>
                    <p>Industry 4.0, or the Fourth Industrial Revolution, represents the current trend of automation and data exchange in manufacturing technologies. It includes cyber-physical systems, the Internet of Things (IoT), cloud computing, and cognitive computing. At CAITO, we are at the forefront of implementing these technologies to enhance operational efficiency and innovation.</p>
                </section>

                <section className="about-section">
                    <h2>About the System</h2>
                    <p>The CAITO workforce intelligence system integrates advanced data analytics, machine learning algorithms, and user-friendly interfaces to deliver actionable insights. Our system is designed to be intuitive and powerful, enabling users to make data-driven decisions with ease.</p>
                </section>
            </div>

        </div>


    );
};

export default About;
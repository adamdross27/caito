# CAITO Workforce Intelligence System (CAITO WIS)

## Overview

The **CAITO Workforce Intelligence System (CAITO WIS)** is part of a Research and Development project created by a team of five AUT students: Adam Ross, Jarrett Sanchez, Salsabil Sofyan, Steven Zhu, and Triona D'Souza. The project aims to develop an intelligent system tailored for the Technical Vocational and Educational Training (TVET) sector in Southeast Asia. The CAITO WIS is designed to provide actionable insights through data-driven decision-making, helping stakeholders within the TVET industry make informed choices.

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [nodemon](https://nodemon.io/) (for running the backend)
- Installing nodemon can be completed by: bash terminal --> npm install -g nodemon

### Getting Started

1. **Clone the repository:**
   
To run this project you will need to clone the github link https://github.com/jarrettsanchez/caito-rnd.git into your IDE / Code Editor. 

2. **Install Dependencies:**

To install all the necessary dependencies, in your terminal ensure that you are in the root directory folder of caito-rnd.
Then enter 'npm install' to install the dependencies required.

3. **Running the WIS:**

Now you are ready to run the project! There are three steps involved.

Firstly, this can be done by entering 'npm run dev' to start the frontend server from the root directory. 

Secondly, to run the backend server, open an additional terminal and enter 'nodemon src/server/fileUploadHandler.js'. This will run the backend server so you are able to upload files to Firebase.

Thirdly, to run the Workforce Planning backend server, open another terminal and enter 'node src/server/backendProxy.js'. This will run the backend server allowing you to web scrape jobs and extract skills from job descriptions.

Note: If running on Windows OS, it is highly recommended to run this on with the display setting of 125% instead of the default 150% view.

## Proposal

The objective of this project is to develop a **Workforce Intelligence System (WIS)** focused on the TVET sector in Southeast Asia. It will serve as a comprehensive tool for collecting, processing, and analyzing both structured and unstructured data related to the region’s labor market. The system will offer a user-friendly dashboard that presents insights to government organizations and TVET industry stakeholders.

By automating the collection of relevant data and offering easy-to-understand visualizations, CAITO WIS aims to improve the effectiveness and competitiveness of Southeast Asia’s labor market. The tool provides timely, accurate, and actionable insights to assist stakeholders in making better decisions.

## Scope

Key functional requirements of the CAITO Workforce Intelligence System include:
- **User registration and login**: Secure access for different users.
- **Web scraping**: Automated data acquisition from various sources related to the TVET industry.
- **Data visualization and analysis**: Presenting data in the form of charts and graphs for decision-making support using a **Large Language Model (LLM)**.
- **Dashboard**: A user-friendly interface where data-driven insights are displayed.
- **Security and privacy**: Compliance with **New Zealand's Privacy Act 2020** and other data protection regulations.
- **Compatibility**: The system will work across web browsers and devices, ensuring accessibility and reliability.

## Methodology

Our team follows the **Agile Scrum Methodology** to manage the project. We selected this methodology for its flexibility, iterative nature, and emphasis on stakeholder collaboration. Agile’s focus on delivering small, manageable increments of the product during short sprints allows us to adapt quickly to changes and feedback. This ensures that the final product aligns with our client's needs and expectations.

### Why Agile Scrum?
- **Iterative Development**: Breaking down the project into smaller, shippable increments.
- **Stakeholder Collaboration**: Engaging the client, CAITO, throughout the process to ensure alignment with their needs.
- **Flexibility**: The ability to adapt to changing requirements quickly and effectively.

## Team

- **Adam Ross - adamdross27**
- **Jarrett Sanchez - jarrettsanchez**
- **Salsabil Sofyan - salsabildivas**
- **Steven Zhu - stezhu-ux**
- **Triona D'Souza - triona6**

## License

This project follows the [MIT License](LICENSE). Please review the license details for more information.

## How to Contribute

If you're interested in contributing to this project, follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b your-feature`).
3. Make your changes and commit (`git commit -m 'Add some feature'`).
4. Push your branch (`git push origin your-feature`).
5. Submit a pull request for review.

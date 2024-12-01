import { useState } from 'react';
import './dashboard.css';
import Navigationbar from '../components/Navigationbar'; 
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import JobsGraphs from '../dashboard/categories/jobs/jobsGraphs';

function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='main'>
      <Sidebar isOpen={isOpen} />
      <div className={`dashboardcontainer ${isOpen}`}>
        <Navigationbar toggleSidebar={toggleSidebar} />
        <div className="Dashboard">
          <Dashboard />
          <Graph />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
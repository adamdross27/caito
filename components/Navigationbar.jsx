import React from 'react';
import sidebarIcon from '../assets/sidebarIcon.png';

function Navigationbar({ toggleSidebar }) {
  return (
    <div className='dashboardNavigationbar'>
      <div className='Navigationbarcontent'>
        <img src={sidebarIcon} className="sidebaricon" 
          onClick={toggleSidebar} 
          style={{ cursor: 'pointer' }} 
        />
      </div>
    </div>
  );
}

export default Navigationbar;

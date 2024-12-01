import React from 'react';
import SidebarItems from './SidebarItems';
import items from '../data/sidebarsubmenu.json';
import caitoLogo from '../assets/CaitoLogo.png';

function Sidebar({ isOpen }) {
  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <img src={caitoLogo} className="dashboardlogo" />
      {items.map((item, index) => <SidebarItems key={index} item={item} />)}
    </div>
  );
}

export default Sidebar;

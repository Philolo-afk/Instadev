import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DashboardNav from './DashboardNav'
import DashboardSidebar from './DashboardSidebar'
import DashboardTabs from './DashboardTabs'
import DevelopersTab from './tabs/DevelopersTab'
import ProjectsTab from './tabs/ProjectsTab'
import StoriesTab from './tabs/StoriesTab'
import FriendsTab from './tabs/FriendsTab'
import ProjectModal from './modals/ProjectModal'
import StoryModal from './modals/StoryModal'

const Dashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('developers')

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'developers':
        return <DevelopersTab />
      case 'projects':
        return <ProjectsTab />
      case 'stories':
        return <StoriesTab />
      case 'friends':
        return <FriendsTab />
      default:
        return <DevelopersTab />
    }
  }

  return (
    <section className="dashboard-section">
      <DashboardNav />
      
      <div className="dashboard-content">
        <DashboardSidebar user={user} />
        
        <div className="dashboard-main">
          <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {renderActiveTab()}
        </div>
      </div>
      
      <ProjectModal />
      <StoryModal />
    </section>
  )
}

export default Dashboard
import React from 'react'

const DashboardTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'developers', label: 'Developers' },
    { id: 'projects', label: 'Projects' },
    { id: 'stories', label: 'Stories' },
    { id: 'friends', label: 'Friends' }
  ]

  return (
    <div className="dashboard-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default DashboardTabs
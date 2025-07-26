import React from 'react'

const getStackName = (stack) => {
  const stackNames = {
    'mern': 'MERN Stack',
    'mean': 'MEAN Stack',
    'django': 'Django/Python',
    'rails': 'Ruby on Rails',
    'php': 'PHP/Laravel',
    'dotnet': '.NET',
    'java': 'Java/Spring',
    'other': 'Other'
  }
  return stackNames[stack] || 'Other'
}

const capitalizeFirst = (str) => {
  return str?.charAt(0).toUpperCase() + str?.slice(1)
}

const DashboardSidebar = ({ user }) => {
  return (
    <div className="dashboard-sidebar">
      <div className="user-profile">
        <div className="profile-avatar"></div>
        <h4>{user?.username}</h4>
        <p>{getStackName(user?.primaryStack)}</p>
        <p>{capitalizeFirst(user?.skillLevel)} Developer</p>
      </div>
      
      <div className="online-status">
        <h5>Your Status</h5>
        <div className="status-indicator online"></div>
        <span>Online & Available</span>
      </div>
    </div>
  )
}

export default DashboardSidebar
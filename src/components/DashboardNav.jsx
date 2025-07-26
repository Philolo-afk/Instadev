import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const DashboardNav = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="dashboard-nav">
      <div className="nav-brand">
        <h3>InstaDev</h3>
      </div>
      <div className="nav-user">
        <span className="user-welcome">Welcome, {user?.username}</span>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default DashboardNav
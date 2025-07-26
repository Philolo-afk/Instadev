import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'

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

const DevelopersTab = () => {
  const { showNotification } = useAuth()
  const [developers, setDevelopers] = useState([])
  const [skillFilter, setSkillFilter] = useState('')
  const [stackFilter, setStackFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const loadDevelopers = async () => {
    try {
      const params = new URLSearchParams()
      if (skillFilter) params.append('skillLevel', skillFilter)
      if (stackFilter) params.append('primaryStack', stackFilter)
      
      const response = await axios.get(`/users/online?${params}`)
      setDevelopers(response.data)
    } catch (error) {
      showNotification('Failed to load developers', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDevelopers()
  }, [skillFilter, stackFilter])

  const sendFriendRequest = async (userId) => {
    try {
      await axios.post(`/friends/request/${userId}`)
      showNotification('Friend request sent!')
      loadDevelopers()
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to send friend request', 'error')
    }
  }

  const generateRandomGradient = () => {
    const gradients = [
      'linear-gradient(135deg, #667eea, #764ba2)',
      'linear-gradient(135deg, #f093fb, #f5576c)',
      'linear-gradient(135deg, #4facfe, #00f2fe)',
      'linear-gradient(135deg, #43e97b, #38f9d7)',
      'linear-gradient(135deg, #fa709a, #fee140)',
      'linear-gradient(135deg, #a8edea, #fed6e3)'
    ]
    return gradients[Math.floor(Math.random() * gradients.length)]
  }

  if (loading) {
    return <div>Loading developers...</div>
  }

  return (
    <div className="tab-content active">
      <div className="tab-header">
        <h3>Developers Online</h3>
        <div className="filter-controls">
          <select 
            value={skillFilter} 
            onChange={(e) => setSkillFilter(e.target.value)}
          >
            <option value="">All Skill Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
          <select 
            value={stackFilter} 
            onChange={(e) => setStackFilter(e.target.value)}
          >
            <option value="">All Stacks</option>
            <option value="mern">MERN</option>
            <option value="mean">MEAN</option>
            <option value="django">Django</option>
            <option value="rails">Ruby on Rails</option>
            <option value="php">PHP/Laravel</option>
            <option value="dotnet">.NET</option>
            <option value="java">Java/Spring</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
      <div className="developers-grid">
        {developers.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.7 }}>
            No developers found matching your filters.
          </p>
        ) : (
          developers.map(dev => (
            <div key={dev._id} className="dev-card">
              <div 
                className="dev-avatar" 
                style={{ background: generateRandomGradient() }}
              ></div>
              <h3 className="dev-name">{dev.username}</h3>
              <p className="dev-stack">{getStackName(dev.primaryStack)}</p>
              <p className="dev-level">{capitalizeFirst(dev.skillLevel)} Developer</p>
              <button 
                className="cta-button" 
                style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                onClick={() => sendFriendRequest(dev._id)}
              >
                Connect
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DevelopersTab
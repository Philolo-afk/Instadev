import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Configure axios defaults
axios.defaults.baseURL = '/api'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'))

  // Set up axios interceptor for auth token
  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [authToken])

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('authToken')
      const savedUser = localStorage.getItem('currentUser')

      if (savedToken && savedUser) {
        try {
          setAuthToken(savedToken)
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error('Error parsing saved user:', error)
          localStorage.removeItem('authToken')
          localStorage.removeItem('currentUser')
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div')
    notification.className = `${type}-notification`
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' 
        ? 'linear-gradient(135deg, #51cf66, #40c057)' 
        : 'linear-gradient(135deg, #ff6b6b, #ee5a52)'
      };
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 10px 30px ${type === 'success' 
        ? 'rgba(81, 207, 102, 0.3)' 
        : 'rgba(255, 107, 107, 0.3)'
      };
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.remove()
    }, 4000)
  }

  const login = async (username, password) => {
    try {
      const response = await axios.post('/auth/login', { username, password })
      
      const { token, user: userData } = response.data
      
      setAuthToken(token)
      setUser(userData)
      localStorage.setItem('authToken', token)
      localStorage.setItem('currentUser', JSON.stringify(userData))
      
      showNotification(response.data.message)
      return true
    } catch (error) {
      showNotification(error.response?.data?.message || 'Login failed', 'error')
      return false
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData)
      
      const { token, user: newUser } = response.data
      
      setAuthToken(token)
      setUser(newUser)
      localStorage.setItem('authToken', token)
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      
      showNotification(response.data.message)
      return true
    } catch (error) {
      showNotification(error.response?.data?.message || 'Registration failed', 'error')
      return false
    }
  }

  const logout = async () => {
    try {
      if (authToken) {
        await axios.post('/auth/logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setAuthToken(null)
      setUser(null)
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUser')
      delete axios.defaults.headers.common['Authorization']
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    showNotification
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
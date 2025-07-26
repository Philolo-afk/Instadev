import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useModal } from '../hooks/useModal'

const AuthModal = () => {
  const { login, register } = useAuth()
  const { modalType, isOpen, closeModal } = useModal()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    skillLevel: '',
    primaryStack: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const success = await login(formData.username, formData.password)
    if (success) {
      closeModal()
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        skillLevel: '',
        primaryStack: ''
      })
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters!")
      return
    }

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      skillLevel: formData.skillLevel,
      primaryStack: formData.primaryStack
    }

    const success = await register(userData)
    if (success) {
      closeModal()
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        skillLevel: '',
        primaryStack: ''
      })
    }
  }

  const switchModal = (type) => {
    closeModal()
    setTimeout(() => {
      if (type === 'login') {
        document.dispatchEvent(new CustomEvent('openModal', { detail: 'login' }))
      } else {
        document.dispatchEvent(new CustomEvent('openModal', { detail: 'register' }))
      }
    }, 100)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay active" onClick={(e) => e.target.classList.contains('modal-overlay') && closeModal()}>
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>&times;</button>
        
        {modalType === 'login' ? (
          <>
            <h2>Welcome Back</h2>
            <p className="modal-subtitle">Sign in to your developer account</p>
            
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <button type="submit" className="auth-submit">Sign In</button>
            </form>
            
            <p className="auth-switch">
              Don't have an account? 
              <span className="auth-link" onClick={() => switchModal('register')}> Create one</span>
            </p>
          </>
        ) : (
          <>
            <h2>Join the Community</h2>
            <p className="modal-subtitle">Create your developer profile</p>
            
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                <span className="form-hint">This will be your unique identifier</span>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <span className="form-hint">At least 6 characters</span>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="skillLevel">Skill Level</label>
                <select
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="primaryStack">Primary Stack</label>
                <select
                  name="primaryStack"
                  value={formData.primaryStack}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your stack</option>
                  <option value="mern">MERN (MongoDB, Express, React, Node)</option>
                  <option value="mean">MEAN (MongoDB, Express, Angular, Node)</option>
                  <option value="django">Django (Python)</option>
                  <option value="rails">Ruby on Rails</option>
                  <option value="php">PHP/Laravel</option>
                  <option value="dotnet">.NET</option>
                  <option value="java">Java/Spring</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <button type="submit" className="auth-submit">Create Account</button>
            </form>
            
            <p className="auth-switch">
              Already have an account? 
              <span className="auth-link" onClick={() => switchModal('login')}> Sign in</span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthModal
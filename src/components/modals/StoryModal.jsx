import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { useModal } from '../../hooks/useModal'

const StoryModal = () => {
  const { showNotification } = useAuth()
  const { modalType, isOpen, closeModal } = useModal()
  const [formData, setFormData] = useState({
    content: '',
    tags: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.content.length > 500) {
      showNotification('Story must be 500 characters or less!', 'error')
      return
    }
    
    try {
      await axios.post('/stories', formData)
      closeModal()
      setFormData({
        content: '',
        tags: ''
      })
      showNotification('Story shared successfully!')
      
      // Trigger a refresh of stories
      window.dispatchEvent(new CustomEvent('refreshStories'))
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to share story', 'error')
    }
  }

  if (!isOpen || modalType !== 'story') return null

  return (
    <div className="modal-overlay active" onClick={(e) => e.target.classList.contains('modal-overlay') && closeModal()}>
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>&times;</button>
        <h2>Share Your Story</h2>
        <p className="modal-subtitle">What's on your developer mind?</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="content">Your Story</label>
            <textarea
              name="content"
              rows="6"
              placeholder="Share your coding journey, achievements, or thoughts..."
              value={formData.content}
              onChange={handleInputChange}
              required
            />
            <span className="form-hint">Max 500 characters</span>
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Tags (optional)</label>
            <input
              type="text"
              name="tags"
              placeholder="e.g., #javascript #learning #project"
              value={formData.tags}
              onChange={handleInputChange}
            />
          </div>
          
          <button type="submit" className="auth-submit">Share Story</button>
        </form>
      </div>
    </div>
  )
}

export default StoryModal
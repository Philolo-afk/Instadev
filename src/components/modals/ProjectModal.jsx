import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { useModal } from '../../hooks/useModal'

const ProjectModal = () => {
  const { showNotification } = useAuth()
  const { modalType, isOpen, closeModal } = useModal()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    projectLink: '',
    demoLink: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await axios.post('/projects', formData)
      closeModal()
      setFormData({
        title: '',
        description: '',
        technologies: '',
        projectLink: '',
        demoLink: ''
      })
      showNotification('Project added successfully!')
      
      // Trigger a refresh of projects
      window.dispatchEvent(new CustomEvent('refreshProjects'))
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to add project', 'error')
    }
  }

  if (!isOpen || modalType !== 'project') return null

  return (
    <div className="modal-overlay active" onClick={(e) => e.target.classList.contains('modal-overlay') && closeModal()}>
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>&times;</button>
        <h2>Add Project</h2>
        <p className="modal-subtitle">Showcase your work to the community</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="title">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="technologies">Technologies Used</label>
            <input
              type="text"
              name="technologies"
              placeholder="e.g., React, Node.js, MongoDB"
              value={formData.technologies}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="projectLink">Project Link (optional)</label>
            <input
              type="url"
              name="projectLink"
              placeholder="https://github.com/username/project"
              value={formData.projectLink}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="demoLink">Demo Link (optional)</label>
            <input
              type="url"
              name="demoLink"
              placeholder="https://myproject.netlify.app"
              value={formData.demoLink}
              onChange={handleInputChange}
            />
          </div>
          
          <button type="submit" className="auth-submit">Add Project</button>
        </form>
      </div>
    </div>
  )
}

export default ProjectModal
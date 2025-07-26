import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { useModal } from '../../hooks/useModal'

const ProjectsTab = () => {
  const { showNotification } = useAuth()
  const { openModal } = useModal()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const loadProjects = async () => {
    try {
      const response = await axios.get('/projects')
      setProjects(response.data)
    } catch (error) {
      showNotification('Failed to load projects', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  if (loading) {
    return <div>Loading projects...</div>
  }

  return (
    <div className="tab-content active">
      <div className="tab-header">
        <h3>Project Showcase</h3>
        <button className="cta-button" onClick={() => openModal('project')}>
          Add Project
        </button>
      </div>
      
      <div className="projects-grid">
        {projects.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.7 }}>
            No projects shared yet. Be the first to showcase your work!
          </p>
        ) : (
          projects.map(project => (
            <div key={project._id} className="project-card">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-author">by {project.author.username}</p>
              <p className="project-description">{project.description}</p>
              <div className="project-tech">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
              <div className="project-links">
                {project.projectLink && (
                  <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="project-link">
                    View Code
                  </a>
                )}
                {project.demoLink && (
                  <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="project-link">
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ProjectsTab
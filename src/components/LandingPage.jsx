import React from 'react'
import { useModal } from '../hooks/useModal'

const LandingPage = () => {
  const { openModal } = useModal()

  return (
    <section className="hero-section">
      <div className="hero-bg"></div>
      <h1 className="hero-title">InstaDev</h1>
      <p className="hero-subtitle">
        Connect with developers worldwide. Code together, grow together.
      </p>
      <div className="auth-buttons">
        <button className="cta-button" onClick={() => openModal('login')}>
          Login
        </button>
        <button className="cta-button secondary" onClick={() => openModal('register')}>
          Join Community
        </button>
      </div>
      <div className="scroll-indicator">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 13l3 3 7-7"/>
          <path d="M7 6l3 3 7-7"/>
        </svg>
      </div>
    </section>
  )
}

export default LandingPage
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { useModal } from '../../hooks/useModal'

const getTimeAgo = (date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

const StoriesTab = () => {
  const { user, showNotification } = useAuth()
  const { openModal } = useModal()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  const loadStories = async () => {
    try {
      const response = await axios.get('/stories')
      setStories(response.data)
    } catch (error) {
      showNotification('Failed to load stories', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStories()
  }, [])

  const toggleLike = async (storyId) => {
    try {
      await axios.post(`/stories/${storyId}/like`)
      loadStories()
    } catch (error) {
      showNotification('Failed to update like', 'error')
    }
  }

  const toggleRetweet = async (storyId) => {
    try {
      await axios.post(`/stories/${storyId}/retweet`)
      loadStories()
    } catch (error) {
      showNotification('Failed to update retweet', 'error')
    }
  }

  if (loading) {
    return <div>Loading stories...</div>
  }

  return (
    <div className="tab-content active">
      <div className="tab-header">
        <h3>Developer Stories</h3>
        <button className="cta-button" onClick={() => openModal('story')}>
          Share Story
        </button>
      </div>
      
      <div className="stories-feed">
        {stories.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.7 }}>
            No stories yet. Share your coding journey!
          </p>
        ) : (
          stories.map(story => {
            const isLiked = story.likes.includes(user?.id)
            const isRetweeted = story.retweets.includes(user?.id)
            
            return (
              <div key={story._id} className="story-card">
                <div className="story-header">
                  <div className="story-avatar"></div>
                  <div>
                    <div className="story-author">{story.author.username}</div>
                  </div>
                  <div className="story-time">{getTimeAgo(story.createdAt)}</div>
                </div>
                <div className="story-content">{story.content}</div>
                <div className="story-tags">
                  {story.tags.map((tag, index) => (
                    <span key={index} className="story-tag">{tag}</span>
                  ))}
                </div>
                <div className="story-actions">
                  <button 
                    className={`story-action ${isLiked ? 'liked' : ''}`}
                    onClick={() => toggleLike(story._id)}
                  >
                    ❤️ {story.likes.length}
                  </button>
                  <button 
                    className={`story-action ${isRetweeted ? 'retweeted' : ''}`}
                    onClick={() => toggleRetweet(story._id)}
                  >
                    🔄 {story.retweets.length}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default StoriesTab
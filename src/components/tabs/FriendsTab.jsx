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

const FriendsTab = () => {
  const { showNotification } = useAuth()
  const [friendRequests, setFriendRequests] = useState([])
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)

  const loadFriends = async () => {
    try {
      const [requestsResponse, friendsResponse] = await Promise.all([
        axios.get('/friends/requests'),
        axios.get('/friends')
      ])
      
      setFriendRequests(requestsResponse.data)
      setFriends(friendsResponse.data)
    } catch (error) {
      showNotification('Failed to load friends', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFriends()
  }, [])

  const acceptFriendRequest = async (requestId) => {
    try {
      await axios.post(`/friends/accept/${requestId}`)
      showNotification('Friend request accepted!')
      loadFriends()
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to accept request', 'error')
    }
  }

  const declineFriendRequest = async (requestId) => {
    try {
      await axios.post(`/friends/decline/${requestId}`)
      showNotification('Friend request declined')
      loadFriends()
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to decline request', 'error')
    }
  }

  const messageUser = (username) => {
    showNotification(`Opening chat with ${username}... (Feature coming soon!)`)
  }

  if (loading) {
    return <div>Loading friends...</div>
  }

  return (
    <div className="tab-content active">
      <div className="tab-header">
        <h3>Your Network</h3>
        <div className="friend-stats">
          <span>{friends.length} connection{friends.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <div className="friends-section">
        <h4>Friend Requests</h4>
        <div className="friend-requests">
          {friendRequests.length === 0 ? (
            <p style={{ opacity: 0.7 }}>No pending friend requests</p>
          ) : (
            friendRequests.map(request => (
              <div key={request._id} className="friend-card">
                <div className="friend-avatar"></div>
                <div className="friend-info">
                  <div className="friend-name">{request.from.username}</div>
                  <div className="friend-details">
                    {capitalizeFirst(request.from.skillLevel)} • {getStackName(request.from.primaryStack)}
                  </div>
                </div>
                <div className="friend-actions">
                  <button 
                    className="friend-btn accept" 
                    onClick={() => acceptFriendRequest(request._id)}
                  >
                    Accept
                  </button>
                  <button 
                    className="friend-btn decline" 
                    onClick={() => declineFriendRequest(request._id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <h4>Your Friends</h4>
        <div className="friends-list">
          {friends.length === 0 ? (
            <p style={{ opacity: 0.7 }}>No friends yet. Start connecting with other developers!</p>
          ) : (
            friends.map(friend => (
              <div key={friend._id} className="friend-card">
                <div className="friend-avatar"></div>
                <div className="friend-info">
                  <div className="friend-name">{friend.username}</div>
                  <div className="friend-details">
                    {capitalizeFirst(friend.skillLevel)} • {getStackName(friend.primaryStack)}
                  </div>
                </div>
                <div className="friend-actions">
                  <button 
                    className="friend-btn" 
                    onClick={() => messageUser(friend.username)}
                  >
                    Message
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default FriendsTab
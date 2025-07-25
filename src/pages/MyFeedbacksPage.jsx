import React, { useState, useEffect } from 'react';
import FeedbackCard from '../components/FeedbackCard';

function MyFeedbacksPage({ userId, userName, userEmail }) {
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [message, setMessage] = useState('');

  const fetchMyFeedbacks = async () => {
    try {
      const res = await fetch('http://localhost:5000/feedback');
      if (!res.ok) {
        throw new Error('Failed to fetch feedback');
      }
      const allFeedbacks = await res.json();
      const filteredFeedbacks = allFeedbacks.filter(feedback => feedback.id_user === userId);
      
      // Sort by votes in descending order
      const sortedFeedbacks = filteredFeedbacks.sort((a, b) => {
        const votesA = parseInt(a.votes) || 0;
        const votesB = parseInt(b.votes) || 0;
        return votesB - votesA;
      });
      
      setMyFeedbacks(sortedFeedbacks);
    } catch (error) {
      console.error("Error fetching my feedbacks:", error);
      setMessage("Failed to load your feedbacks.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMyFeedbacks();
    }
  }, [userId]);

  const handleVote = async (id, voteType) => {
    try {
      const payload = {
        vote: voteType,
        userId: userId
      };
      const res = await fetch(`http://localhost:5000/feedback/${id}/vote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage(result.error || 'Failed to vote');
        return;
      }
      
      // Re-fetch and sort after voting
      await fetchMyFeedbacks();
      setMessage('');
    } catch (error) {
      console.error("Error voting:", error);
      setMessage(error.message || "Failed to cast vote.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/feedback/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const errorResult = await res.json();
        setMessage(errorResult.error || 'Failed to delete feedback');
        return;
      }
      
      // Re-fetch after deletion
      await fetchMyFeedbacks();
      setMessage('Feedback deleted successfully!');
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setMessage(error.message || "Failed to delete feedback.");
    }
  };

  return (
    <div className="page-container">
      <h2>My Feedbacks (Sorted by Votes)</h2>
      {message && <p className={`status-message ${message.includes('Failed') || message.includes('already') ? 'error' : ''}`}>{message}</p>}
      <div className="feedback-list">
        {myFeedbacks.length > 0 ? (
          myFeedbacks.map(feedback => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              userId={userId}
              isAuthenticated={true}
              onDelete={handleDelete}
              onVote={handleVote}
            />
          ))
        ) : (
          <p>You haven't submitted any feedback yet. Share your thoughts!</p>
        )}
      </div>
    </div>
  );
}

export default MyFeedbacksPage;
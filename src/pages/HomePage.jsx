import React, { useState, useEffect } from 'react';
import FeedbackCard from '../components/FeedbackCard';

function HomePage({ userId, userName, userEmail, isAuthenticated }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({
    message: ''
  });
  const [message, setMessage] = useState('');

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('http://localhost:5000/feedback');
      if (!res.ok) {
        throw new Error('Failed to fetch feedback');
      }
      const data = await res.json();
      
      // Sort feedbacks by votes in descending order
      const sortedFeedbacks = data.sort((a, b) => {
        const votesA = parseInt(a.votes) || 0;
        const votesB = parseInt(b.votes) || 0;
        return votesB - votesA; // Descending order
      });
      
      setFeedbacks(sortedFeedbacks);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setMessage("Failed to load feedbacks.");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleInputChange = (e) => {
    setNewFeedback({ ...newFeedback, message: e.target.value });
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setMessage("You should be logged in to perform this action.");
      return;
    }
    
    if (!newFeedback.message.trim()) {
      setMessage("Feedback message cannot be empty.");
      return;
    }

    try {
      const payload = {
        name: userName,
        email: userEmail,
        message: newFeedback.message,
        userId: userId
      };

      const res = await fetch('http://localhost:5000/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage(result.error || 'Failed to submit feedback');
        return;
      }

      // Re-fetch and sort feedbacks after adding new one
      await fetchFeedbacks();
      setNewFeedback({ message: '' });
      setMessage('Feedback submitted successfully!');
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setMessage(error.message || "Failed to submit feedback.");
    }
  };

  const handleVote = async (id, voteType) => {
    if (!isAuthenticated) {
      setMessage("You should be logged in to perform this action.");
      return;
    }

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
      
      // Re-fetch and sort feedbacks after voting to maintain order
      await fetchFeedbacks();
      setMessage('');
    } catch (error) {
      console.error("Error voting:", error);
      setMessage(error.message || "Failed to cast vote.");
    }
  };

  const handleDelete = async (id) => {
    if (!isAuthenticated) {
      setMessage("You should be logged in to perform this action.");
      return;
    }

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
      
      // Re-fetch feedbacks after deletion
      await fetchFeedbacks();
      setMessage('Feedback deleted successfully!');
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setMessage(error.message || "Failed to delete feedback.");
    }
  };

  return (
    <div className="page-container">
      <h2>All Feedbacks</h2>
      {!isAuthenticated && (
        <p className="guest-notice">You're viewing as a guest. <a href="/login">Login</a> to submit feedback and vote.</p>
      )}

      {isAuthenticated && (
        <div className="feedback-form-section">
          <h3>Submit New Feedback</h3>
          <form onSubmit={handleSubmitFeedback}>
            <label>
              Your Feedback:
              <textarea
                name="message"
                value={newFeedback.message}
                onChange={handleInputChange}
                rows="4"
                required
              ></textarea>
            </label>
            <br />
            <button type="submit">Submit Feedback</button>
          </form>
        </div>
      )}

      {message && <p className={`status-message ${message.includes('Failed') || message.includes('already') || message.includes('should be logged in') ? 'error' : ''}`}>{message}</p>}

      <div className="feedback-list">
        <h3>Feedbacks (Sorted by Votes)</h3>
        {feedbacks.length > 0 ? (
          feedbacks.map(feedback => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              userId={userId}
              isAuthenticated={isAuthenticated}
              onDelete={handleDelete}
              onVote={handleVote}
            />
          ))
        ) : (
          <p>No feedback submitted yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
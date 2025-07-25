import React from 'react';

function FeedbackCard({ feedback, userId, isAuthenticated, onDelete, onVote }) {
  const isMyFeedback = feedback.id_user === userId;
  const votes = parseInt(feedback.votes) || 0;

  const handleVoteClick = (voteType) => {
    if (!isAuthenticated) {
      // This will be handled in HomePage/MyFeedbacksPage
      onVote(feedback.id, voteType);
      return;
    }
    onVote(feedback.id, voteType);
  };

  const handleDeleteClick = () => {
    if (!isAuthenticated) {
      onDelete(feedback.id);
      return;
    }
    onDelete(feedback.id);
  };

  return (
    <div className="feedback-card">
      <p><strong>Name:</strong> {feedback.name}</p>
      <p><strong>Email:</strong> {feedback.email}</p>
      <p><strong>Message:</strong> {feedback.message}</p>
      <p><strong>Votes:</strong> <span className={`votes ${votes > 0 ? 'positive' : votes < 0 ? 'negative' : 'neutral'}`}>{votes}</span></p>
      <div className="feedback-actions">
        <button 
          onClick={() => handleVoteClick('up')}
          className={!isAuthenticated ? 'disabled-action' : ''}
          title={!isAuthenticated ? 'Login required' : 'Upvote'}
        >
          👍 Upvote
        </button>
        <button 
          onClick={() => handleVoteClick('down')}
          className={!isAuthenticated ? 'disabled-action' : ''}
          title={!isAuthenticated ? 'Login required' : 'Downvote'}
        >
          👎 Downvote
        </button>
        {isMyFeedback && isAuthenticated && (
          <button 
            onClick={handleDeleteClick} 
            className="delete-button"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default FeedbackCard;
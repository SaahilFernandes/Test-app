import React, { useState, useEffect } from 'react';
// Import NavLink instead of Link
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom'; 
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import MyFeedbacksPage from './pages/MyFeedbacksPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // Check for stored credentials on app load
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');
    if (storedUserId && storedUserName && storedUserEmail) {
      setUserId(storedUserId);
      setUserName(storedUserName);
      setUserEmail(storedUserEmail);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (id, name, email) => {
    setUserId(id);
    setUserName(name);
    setUserEmail(email);
    setIsAuthenticated(true);
    localStorage.setItem('userId', id);
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
  };

  const handleLogout = () => {
    setUserId(null);
    setUserName(null);
    setUserEmail(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
  };

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Feedback Tracker</h1>
          <nav>
            {isAuthenticated ? (
              <>
                <span>Welcome, {userName}!</span>
                {/* Use NavLink for active styling */}
                <NavLink 
                  to="/" 
                  className={({ isActive }) => isActive ? 'active-link' : undefined}
                  end // Add 'end' prop to exactly match the path for the root "/"
                >
                  All Feedbacks
                </NavLink>
                <NavLink 
                  to="/my-feedbacks" 
                  className={({ isActive }) => isActive ? 'active-link' : undefined}
                >
                  My Feedbacks
                </NavLink>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </>
            ) : (
              <>
                {/* Use NavLink for guests on homepage, without active style here (Login Link is covered separately) */}
                <NavLink 
                  to="/" 
                  className={({ isActive }) => isActive ? 'active-link' : undefined}
                  end
                >
                  All Feedbacks
                </NavLink>
                {/* Use NavLink for Login page for consistent styling behavior, or Link if no active style is needed there */}
                <NavLink 
                  to="/login"
                  className={({ isActive }) => isActive ? 'active-link' : undefined}
                >
                  Login
                </NavLink>
              </>
            )}
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route
              path="/"
              element={<HomePage userId={userId} userName={userName} userEmail={userEmail} isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/my-feedbacks"
              element={isAuthenticated ? <MyFeedbacksPage userId={userId} userName={userName} userEmail={userEmail} /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
import { useState } from 'react';
import './index.css';
import ChatContainer from './components/ChatContainer';
import Login from './components/Login';
import Register from './components/Register';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-snitch-dark text-gray-200 font-sans selection:bg-snitch-gold/30 selection:text-snitch-gold-light">
      {currentView === 'dashboard' && (
        <ChatContainer 
          onNavigate={handleNavigate} 
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn} 
          user={user}
          setUser={setUser}
        />
      )}
      {currentView === 'login' && <Login onNavigate={handleNavigate} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
      {currentView === 'register' && <Register onNavigate={handleNavigate} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
    </div>
  );
}

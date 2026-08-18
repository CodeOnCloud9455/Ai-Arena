import './index.css';
import ChatContainer from './components/ChatContainer';

export default function App() {
  return (
    <div className="min-h-screen bg-snitch-dark text-gray-200 font-sans selection:bg-snitch-gold/30 selection:text-snitch-gold-light">
      <ChatContainer />
    </div>
  );
}

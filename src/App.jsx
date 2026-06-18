import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import SettingsModal from './components/SettingsModal';
import { sendMessageTo9Router } from './services/api';
import { PanelLeftOpen, ChevronDown } from 'lucide-react';

const MOBILE_BREAKPOINT = 768;

function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  const [endpoint, setEndpoint] = useState('http://localhost:20128/v1/chat/completions');
  const [modelName, setModelName] = useState('gpt-4o');

  // Detect mobile / desktop
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      // On desktop, default sidebar open; on mobile, closed
      if (!mobile) setSidebarOpen(true);
    };
    window.addEventListener('resize', onResize);
    // Init
    if (window.innerWidth <= MOBILE_BREAKPOINT) setSidebarOpen(false);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSendMessage = async (content) => {
    const userMsg = { role: 'user', content };
    const history = [...messages, userMsg];
    setMessages(history);
    setIsTyping(true);
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    // Beri jeda 600ms agar animasi loading (spinner) selalu terlihat sejenak
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      await sendMessageTo9Router(history, endpoint, modelName, (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, content: last.content + chunk };
          return updated;
        });
      });
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: `**Connection error.** Could not reach 9Router at \`${endpoint}\`.\n\nMake sure 9Router is running, then check your endpoint in Settings.\n\n_Details: ${err.message}_`,
        };
        return updated;
      });
    } finally {
      setIsTyping(false);
    }
  };

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  // On mobile: sidebar uses slide-in class, on desktop uses collapsed class
  const sidebarClass = [
    'sidebar',
    isMobile
      ? sidebarOpen ? 'open' : 'collapsed'
      : sidebarOpen ? '' : 'collapsed',
  ].filter(Boolean).join(' ');

  return (
    <div className="app-container">
      {/* Mobile dim overlay */}
      {isMobile && (
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClass}>
        <Sidebar
          onNewChat={() => { setMessages([]); if (isMobile) closeSidebar(); }}
          onOpenSettings={() => { setIsSettingsOpen(true); if (isMobile) closeSidebar(); }}
          onClose={closeSidebar}
        />
      </div>

      {/* Main */}
      <main className="main-area">
        <div className="top-bar">
          <div className="topbar-left">
            {/* Show open button when sidebar is closed */}
            {!sidebarOpen && (
              <button
                className="sidebar-toggle"
                onClick={openSidebar}
                aria-label="Open sidebar"
              >
                <PanelLeftOpen size={17} strokeWidth={1.8} />
              </button>
            )}
            <span className="topbar-title">FakhriAI</span>
          </div>

          <button
            className="model-badge"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Change model"
          >
            <span>Model</span>
            <span className="model-name">{modelName}</span>
            <ChevronDown size={13} strokeWidth={2} />
          </button>
        </div>

        <ChatWindow messages={messages} isTyping={isTyping} />
        <MessageInput onSendMessage={handleSendMessage} isLoading={isTyping} />
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        endpoint={endpoint}
        setEndpoint={setEndpoint}
        modelName={modelName}
        setModelName={setModelName}
      />
    </div>
  );
}

export default App;

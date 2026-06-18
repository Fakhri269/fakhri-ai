import React from 'react';
import { Plus, MessageSquare, Settings, PanelLeftClose } from 'lucide-react';

const Sidebar = ({ onNewChat, onOpenSettings, onClose }) => {
  return (
    <div className="sidebar-inner">
      <div className="logo-row">
        <div className="logo-mark">FA</div>
        <span className="logo-text">FakhriAI</span>
        <button
          className="sidebar-toggle"
          onClick={onClose}
          aria-label="Close sidebar"
          style={{ marginLeft: 'auto' }}
        >
          <PanelLeftClose size={17} strokeWidth={1.8} />
        </button>
      </div>

      <button className="new-chat-btn" onClick={onNewChat}>
        <Plus size={15} strokeWidth={2.2} />
        New conversation
      </button>

      <div className="sidebar-section-label">Recent</div>

      <div className="sidebar-nav">
        <button className="sidebar-item active">
          <MessageSquare size={14} strokeWidth={1.8} />
          Current session
        </button>
      </div>

      <div className="sidebar-bottom">
        <button className="sidebar-item" onClick={onOpenSettings}>
          <Settings size={14} strokeWidth={1.8} />
          Settings
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

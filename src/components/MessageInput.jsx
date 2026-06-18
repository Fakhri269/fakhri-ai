import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const MessageInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    onSendMessage(text);
    setInput('');
  };

  return (
    <div className="input-area">
      <div className="input-shell">
        <textarea
          ref={textareaRef}
          className="input-textarea"
          placeholder="Message FakhriAI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
        />
        <div className="input-footer">
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            <ArrowUp size={17} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;

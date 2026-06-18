import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { User, Sparkles } from 'lucide-react';

marked.setOptions({ breaks: true, gfm: true });

const TypingAnimation = () => (
  <div className="apple-typing">
    <div className="apple-dot" />
    <div className="apple-dot" />
    <div className="apple-dot" />
  </div>
);

const ChatWindow = ({ messages, isTyping }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const renderMarkdown = (text) => {
    const raw = marked.parse(text || '');
    return { __html: DOMPurify.sanitize(raw) };
  };

  if (messages.length === 0) {
    return (
      <div className="welcome-screen">
        <div className="welcome-logo">
          <span className="welcome-logo-text">FA</span>
        </div>
        <h1 className="welcome-heading">How can I help you?</h1>
        <p className="welcome-sub">
          Connected to your 9Router instance. Start a conversation below.
        </p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="message-list">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          const isLast = idx === messages.length - 1;
          const isEmpty = msg.content === '';

          return (
            <div
              key={idx}
              className={`message-row ${isUser ? 'user-row' : 'ai-row'}`}
            >
              {/* Avatar — icon only, no text */}
              <div className={`msg-avatar ${isUser ? 'user' : 'assistant'}`}>
                {isUser
                  ? <User size={14} strokeWidth={2} />
                  : <Sparkles size={14} strokeWidth={1.8} />
                }
              </div>

              {/* Bubble */}
              <div className={`msg-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}>
                <div className="bubble-card">
                  {isEmpty && isLast && isTyping ? (
                    <TypingAnimation />
                  ) : (
                    <div
                      className={`markdown-body ${isLast && isTyping ? 'streaming' : ''}`}
                      dangerouslySetInnerHTML={renderMarkdown(msg.content)}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatWindow;

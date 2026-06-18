import React from 'react';
import { X } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, endpoint, setEndpoint, modelName, setModelName, apiKey, setApiKey }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">Settings</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={15} strokeWidth={2.2} />
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">API Endpoint URL</label>
          <input
            type="text"
            className="form-input"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="http://localhost:20128/v1/chat/completions"
            spellCheck={false}
          />
          <p className="form-hint">Default 9Router port: 20128</p>
        </div>

        <div className="form-group">
          <label className="form-label">API Key</label>
          <input
            type="password"
            className="form-input"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            spellCheck={false}
          />
          <p className="form-hint">Your secure API key.</p>
        </div>

        <div className="form-group">
          <label className="form-label">Model Name</label>
          <input
            type="text"
            className="form-input"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="e.g. gpt-4o, claude-3-5-sonnet-20241022"
            spellCheck={false}
          />
          <p className="form-hint">Forwarded to your provider via 9Router.</p>
        </div>

        <button className="btn-save" onClick={onClose}>
          Save
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;

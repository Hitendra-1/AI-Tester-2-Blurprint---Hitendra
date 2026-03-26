import React, { useState, useEffect, useRef } from 'react';
import { Plus, Settings, MessageSquare, Send, Paperclip, X, Check, Activity, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './App.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Settings
  const [provider, setProvider] = useState('Ollama');
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [model, setModel] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // Load saved settings on mount
  useEffect(() => {
    const saved = localStorage.getItem('aiTesterConfig');
    if (saved) {
      const config = JSON.parse(saved);
      setProvider(config.provider || 'Ollama');
      setApiKey(config.apiKey || '');
      setApiUrl(config.apiUrl || '');
      setModel(config.model || '');
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('aiTesterConfig', JSON.stringify({ provider, apiKey, apiUrl, model }));
    setIsSettingsOpen(false);
  };

  const testConnection = async () => {
    setTestStatus('testing');
    try {
      const res = await fetch('http://localhost:3001/api/health');
      if (res.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch {
      setTestStatus('error');
    }
    setTimeout(() => setTestStatus('idle'), 3000);
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    
    const userPrompt = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userPrompt }]);
    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          config: { provider, apiKey, apiUrl, model }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate');
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.result }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `**Error:** ${error.message}` }]);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-placeholder" style={{ backgroundColor: 'var(--accent-primary)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>AI</div>
          <span>Tester AG</span>
        </div>
        
        <button className="new-chat-btn" onClick={() => setMessages([])}>
          <Plus size={20} />
          <span>New Chat</span>
        </button>

        <div className="history-list">
          <div className="history-item">
            <MessageSquare size={16} />
            <span style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Login Page Test Cases</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="settings-btn" onClick={() => setIsSettingsOpen(true)}>
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="top-nav">
          <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
            {provider} {model ? `(${model})` : ''} / Jira Format
          </div>
        </div>

        <div className="chat-area">
          {messages.length === 0 ? (
            <div className="empty-state">
              <h2>What do you want to test today?</h2>
              <p>Paste Jira requirements or describe features to generate functional and non-functional test cases.</p>
            </div>
          ) : (
            <div className="messages-list" style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px', borderBottom: msg.role === 'user' ? 'none' : '1px solid var(--border-color)', paddingBottom: '24px' }}>
                  <div style={{ minWidth: '36px', height: '36px', borderRadius: '50%', backgroundColor: msg.role === 'user' ? 'var(--bg-tertiary)' : 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div style={{ flex: 1, color: msg.role === 'user' ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {msg.role === 'user' ? (
                      <div>{msg.content}</div>
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ minWidth: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Bot size={20} />
                  </div>
                  <div style={{ flex: 1, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Loader2 size={16} className="animate-spin" /> Generating Jira test cases...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        <div className="input-container">
          <div className="input-box">
            <textarea
              placeholder="Ask here or paste Jira TC Requirement..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
            />
            <div className="input-toolbar">
              <div className="input-actions">
                <button title="Attach Requirements">
                  <Paperclip size={20} />
                </button>
              </div>
              <button 
                className="send-btn" 
                style={{ opacity: input.trim() && !isGenerating ? 1 : 0.5, cursor: input.trim() && !isGenerating ? 'pointer' : 'default' }}
                disabled={!input.trim() || isGenerating}
                onClick={handleSend}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal (Unchanged) */}
      {isSettingsOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Settings size={24} /> Configuration</h2>
              <button className="modal-close" onClick={() => setIsSettingsOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body" style={{ color: 'var(--text-primary)' }}>
              <div className="settings-group">
                <label>LLM Provider</label>
                <select value={provider} onChange={(e) => setProvider(e.target.value)}>
                  <option value="Ollama">Ollama API (Local)</option>
                  <option value="LM Studio">LM Studio (Local)</option>
                  <option value="OpenAI">OpenAI API</option>
                  <option value="Claude">Claude API</option>
                  <option value="Gemini">Gemini API</option>
                  <option value="Grok">Grok API</option>
                </select>
              </div>

              {(provider === 'Ollama' || provider === 'LM Studio') && (
                <div className="settings-group">
                  <label>API URL</label>
                  <input 
                    type="text" 
                    placeholder={provider === 'Ollama' ? "http://127.0.0.1:11434" : "http://127.0.0.1:1234/v1"}
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                  />
                </div>
              )}

              {(provider !== 'Ollama' && provider !== 'LM Studio') && (
                <div className="settings-group">
                  <label>API Key</label>
                  <input 
                    type="password" 
                    placeholder={`Enter ${provider} API Key`}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
              )}

              <div className="settings-group">
                <label>Model Name</label>
                <input 
                  type="text" 
                  placeholder={provider === 'Ollama' ? "llama3" : (provider === 'OpenAI' ? "gpt-4o" : "default-model")}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
            </div>
            
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button 
                className="btn-secondary" 
                onClick={testConnection} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: testStatus === 'success' ? 'var(--success)' : (testStatus === 'error' ? 'var(--danger)' : 'inherit') }}
                disabled={testStatus === 'testing'}
              >
                {testStatus === 'testing' ? <Activity size={18} className="animate-spin" /> : (testStatus === 'success' ? <Check size={18} /> : (testStatus === 'error' ? <X size={18} /> : <Activity size={18} />))}
                {testStatus === 'testing' ? 'Testing API...' : (testStatus === 'success' ? 'Backend Live' : (testStatus === 'error' ? 'Backend Offline' : 'Test Backend'))}
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" onClick={() => setIsSettingsOpen(false)}>Cancel</button>
                <button className="btn-primary" onClick={saveSettings}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

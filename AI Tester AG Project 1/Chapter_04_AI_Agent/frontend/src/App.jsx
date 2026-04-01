import React, { useState } from 'react';
import axios from 'axios';
import { Settings, FileText, History, Moon, Sun, LayoutDashboard, BookOpen, Target } from 'lucide-react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [jiraConfig, setJiraConfig] = useState({
    connection_name: 'VWO Production',
    jira_url: '',
    jira_email: '',
    api_token: ''
  });
  
  const [llmConfig, setLlmConfig] = useState({
    provider: 'groq',
    model_name: 'llama3-8b-8192', // example default
    api_key: '',
    base_url: 'http://localhost:11434'
  });

  const [fetchData, setFetchData] = useState({
    issue_id: '',
    additional_context: ''
  });
  
  const [issueResult, setIssueResult] = useState(null);
  const [testPlan, setTestPlan] = useState('');

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  };

  const testJira = async () => {
    try {
      const res = await axios.post(`${API_BASE}/connections/jira/test`, jiraConfig);
      if (res.data.status === 'success') {
        alert('Jira Connected Successfully!');
      }
    } catch (e) {
      alert('Jira Connection Failed: ' + (e.response?.data?.detail || e.message));
    }
  };

  const testLLM = async () => {
    try {
      const res = await axios.post(`${API_BASE}/connections/llm/test`, llmConfig);
      if (res.data.status === 'success') {
        alert('LLM Connected Successfully!');
      }
    } catch (e) {
      alert('LLM Connection Failed: ' + (e.response?.data?.detail || e.message));
    }
  };

  const fetchIssues = async () => {
    if (!fetchData.issue_id) {
       alert("Please enter a Jira Issue ID.");
       return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/issues/fetch`, {
        jira_config: jiraConfig,
        issue_id: fetchData.issue_id,
        additional_context: fetchData.additional_context
      });
      setIssueResult(res.data.issue_data);
      setStep(3);
    } catch (e) {
      alert('Failed to fetch issue: ' + (e.response?.data?.detail || e.message));
    }
    setLoading(false);
  };

  const generatePlan = async () => {
    setLoading(true);
    setStep(4);
    try {
      const res = await axios.post(`${API_BASE}/testplan/generate`, {
        llm_config: llmConfig,
        issue_data: issueResult,
        additional_context: fetchData.additional_context
      });
      setTestPlan(res.data.test_plan_content);
    } catch (e) {
      setTestPlan('Error generating test plan: ' + (e.response?.data?.detail || e.message));
    }
    setLoading(false);
  };

  return (
    <div className="layout">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div className="sidebar-header">
           <div className="sidebar-logo">TB</div>
           <div>
              <div style={{fontWeight: 600, fontSize: '15px'}}>TestingBuddy AI</div>
              <div style={{fontSize: '12px', opacity: 0.7}}>Testing Platform</div>
           </div>
        </div>
        <div className="sidebar-menu">
           <div className="menu-group">Main</div>
           <div className="menu-item"><LayoutDashboard size={18}/> Dashboard</div>
           <div className="menu-item"><BookOpen size={18}/> Curriculum</div>
           <div className="menu-item"><Settings size={18}/> Settings</div>
           
           <div className="menu-group" style={{marginTop: 20}}>PLANNING & STRATEGY</div>
           <div className="menu-item active"><Target size={18}/> Intelligent Test Planning Agent</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="app-container">
          
          <div className="header-section">
            <div className="header-left">
              <div className="logo-icon">
                <Target size={28} />
              </div>
              <div className="header-text">
                <h1>Intelligent Test Planning Agent</h1>
                <p>Generate comprehensive test plans from Jira requirements using AI</p>
              </div>
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <button className="btn-icon" onClick={toggleTheme}>
                {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
              </button>
              <button className="btn-secondary">
                <History size={16} /> View History
              </button>
            </div>
          </div>

          <div className="stepper">
            <div className={`step ${step === 1 ? 'active' : ''}`}>1. Setup</div>
            <div className={`step ${step === 2 ? 'active' : ''}`}>2. Fetch Issues</div>
            <div className={`step ${step === 3 ? 'active' : ''}`}>3. Review</div>
            <div className={`step ${step === 4 ? 'active' : ''}`}>4. Test Plan</div>
          </div>

          {step === 1 && (
            <>
              <div className="card">
                 <h2 className="card-title">LLM Connection</h2>
                 <p className="card-subtitle">Select and configure your AI model provider required for Test Plan generation</p>
                 <div className="form-group">
                   <label>Provider</label>
                   <select className="form-control" value={llmConfig.provider} onChange={e => setLlmConfig({...llmConfig, provider: e.target.value})}>
                     <option value="groq">GROQ (Cloud)</option>
                     <option value="ollama">Ollama (Local)</option>
                   </select>
                 </div>
                 {llmConfig.provider === 'groq' ? (
                   <div className="form-group">
                     <label>GROQ API Key</label>
                     <input type="password" className="form-control" value={llmConfig.api_key} onChange={e => setLlmConfig({...llmConfig, api_key: e.target.value})} />
                   </div>
                 ) : (
                   <div className="form-group">
                     <label>Ollama Base URL</label>
                     <input type="text" className="form-control" value={llmConfig.base_url} onChange={e => setLlmConfig({...llmConfig, base_url: e.target.value})} />
                   </div>
                 )}
                 <div className="form-group">
                   <label>Model Name</label>
                   <input type="text" className="form-control" value={llmConfig.model_name} onChange={e => setLlmConfig({...llmConfig, model_name: e.target.value})} />
                 </div>
                 <button className="btn-secondary" onClick={testLLM} style={{marginBottom: 20}}>Test LLM Connection</button>
              </div>
              
              <div className="card">
                <h2 className="card-title">Jira Connection</h2>
                <p className="card-subtitle">Connect to your Jira instance to fetch requirements dynamically</p>
                
                <div className="form-group">
                  <label>Jira URL</label>
                  <input type="text" className="form-control" placeholder="https://yourcompany.atlassian.net" value={jiraConfig.jira_url} onChange={e => setJiraConfig({...jiraConfig, jira_url: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Jira Email</label>
                  <input type="text" className="form-control" placeholder="your-email@company.com" value={jiraConfig.jira_email} onChange={e => setJiraConfig({...jiraConfig, jira_email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>API Token</label>
                  <input type="password" className="form-control" placeholder="Your Jira API token" value={jiraConfig.api_token} onChange={e => setJiraConfig({...jiraConfig, api_token: e.target.value})} />
                </div>
                <button className="btn-secondary" onClick={testJira} style={{marginBottom: 20}}>Test Jira Connection</button>
              </div>

              <button className="btn-primary" onClick={() => setStep(2)}>Continue to Fetch Issues</button>
            </>
          )}

          {step === 2 && (
            <div className="card">
              <h2 className="card-title">Fetch Jira Requirements</h2>
              <p className="card-subtitle">Enter project details to fetch user stories from Jira</p>
              
              <div className="form-group">
                <label>Jira Issue ID (e.g., VWOAPP-123)</label>
                <input type="text" className="form-control" value={fetchData.issue_id} onChange={e => setFetchData({...fetchData, issue_id: e.target.value})} />
              </div>
              
              <div className="form-group">
                <label>Additional Context (Optional)</label>
                <textarea className="form-control" rows="4" placeholder="Any additional testing goals or constraints..." value={fetchData.additional_context} onChange={e => setFetchData({...fetchData, additional_context: e.target.value})}></textarea>
              </div>

              <button className="btn-primary" onClick={fetchIssues} disabled={loading}>
                {loading ? 'Fetching...' : 'Fetch Jira Issue'}
              </button>
              <button className="btn-secondary" onClick={() => setStep(1)} style={{marginTop: 10, width: '100%', justifyContent: 'center'}}>Back</button>
            </div>
          )}

          {step === 3 && (
            <div className="card">
              <h2 className="card-title">Review Jira Issue</h2>
              <p className="card-subtitle">Issue that will be used to generate the test plan</p>
              
              {issueResult ? (
                <div style={{background: 'var(--stepper-bg)', padding: 20, borderRadius: 8, marginBottom: 20, textAlign: 'left'}}>
                  <h3>{issueResult.issue_key}: {issueResult.summary}</h3>
                  <p><strong>Status:</strong> {issueResult.status}</p>
                  <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit'}}>{issueResult.description}</pre>
                </div>
              ) : (
                <p>No issue fetched yet.</p>
              )}

              <button className="btn-primary" onClick={generatePlan}>Generate Test Plan</button>
              <button className="btn-secondary" onClick={() => setStep(2)} style={{marginTop: 10, width: '100%', justifyContent: 'center'}}>Back</button>
            </div>
          )}

          {step === 4 && (
            <div className="card">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                <h2 className="card-title" style={{margin: 0}}>Generated Test Plan</h2>
                <button className="btn-secondary"><FileText size={16}/> Download MD</button>
              </div>
              
              {loading ? (
                 <div style={{textAlign: 'center', padding: 40, color: 'var(--text-muted)'}}>
                   Generating test plan from {llmConfig.provider.toUpperCase()}... This may take up to 60 seconds.
                 </div>
              ) : (
                 testPlan ? (
                   <div className="test-plan-content">
                     <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit'}}>{testPlan}</pre>
                   </div>
                 ) : (
                   <div style={{textAlign: 'center', padding: 40}}>
                     <FileText size={48} color="var(--text-muted)" style={{marginBottom: 16}} />
                     <h3 style={{color: 'var(--text-main)'}}>No test plan generated yet</h3>
                   </div>
                 )
              )}
              <button className="btn-secondary" onClick={() => setStep(3)} style={{marginTop: 20, width: '100%', justifyContent: 'center'}}>Back to Review</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;

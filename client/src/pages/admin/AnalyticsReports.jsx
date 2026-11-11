import React, { useState } from 'react';
import api from '../../services/api';
import { Sparkles, Send, BarChart3, FileText, Download } from 'lucide-react';

const AnalyticsReports = () => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const presetQuestions = [
    "Which booths are most popular?",
    "Which session has the highest attendance?",
    "What time is the expo busiest?",
    "Which exhibitors should receive more visibility?"
  ];

  const handleAskAI = async (q) => {
    const promptText = q || query;
    if (!promptText.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/ai/chat', { message: promptText });
      setAiResponse(res.data.response);
    } catch (err) {
      setAiResponse("Failed to query database analytics.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h4 className="fw-bold" style={{ color: "var(--heading-color)" }} className2=" mb-0">AI Admin Analytics & Insights</h4>
        <p className="text-muted small">Ask deep analytical questions about booth foot-traffic, session attendance, and exhibitor visibility.</p>
      </div>

      {/* Preset Questions Bar */}
      <div className="glass-card p-4">
        <h6 className="fw-bold" style={{ color: "var(--heading-color)" }} className2=" mb-3 d-flex align-items-center gap-2">
          <Sparkles className="text-warning" size={18} /> Quick AI Analytics Queries
        </h6>
        <div className="d-flex flex-wrap gap-2 mb-4">
          {presetQuestions.map((pq, idx) => (
            <button key={idx} onClick={() => { setQuery(pq); handleAskAI(pq); }} className="btn btn-sm btn-outline-custom">
              {pq}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleAskAI(); }} className="d-flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask custom question: e.g. Which exhibitors need visibility boost?"
            className="form-control"
          />
          <button type="submit" disabled={loading} className="btn btn-primary-custom px-4 d-flex align-items-center gap-2">
            <Send size={16} /> Analyze
          </button>
        </form>
      </div>

      {/* AI Response Output Card */}
      {aiResponse && (
        <div className="glass-card p-4 border border-primary border-opacity-50" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(19,27,46,0.9) 100%)' }}>
          <h5 className="fw-bold" style={{ color: "var(--heading-color)" }} className2=" mb-3 d-flex align-items-center gap-2">
            <Sparkles className="text-warning" size={20} /> AI EVENT INSIGHT REPORT
          </h5>
          <div className="p-3 rounded border border-secondary small" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
            {aiResponse}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsReports;

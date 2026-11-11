import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, Send, X, Sparkles, User, RefreshCw, Mic, MicOff, 
  MapPin, Navigation, Calendar, Volume2, VolumeX, CheckCheck, MessageSquare, Zap, Building
} from 'lucide-react';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { soundFX } from '../../utils/soundFX';

const AIAssistantModal = () => {
  const { theme, isNeon } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "**Assalam-o-Alaikum & Welcome to EventSphere Neural AI!**\n\nI am your intelligent expo concierge. I can guide you across all 4 building levels, show exhibitor booths, assist with 3D floor navigation, and assemble a conflict-free personalized schedule.\n\nFeel free to ask questions in English or Urdu!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { label: 'Building Floors & Levels', type: 'QUERY_SUGGESTION', query: 'Show building floors' },
        { label: 'Featured Tech Exhibitors', type: 'QUERY_SUGGESTION', query: 'Which technology exhibitors are available?' },
        { label: 'Locate Booth A12', type: 'QUERY_SUGGESTION', query: 'Where is booth A12?' },
        { label: 'Create Day Schedule (10AM - 4PM)', type: 'QUERY_SUGGESTION', query: 'Build a schedule for me from 10 AM to 4 PM' }
      ]
    }
  ]);

  const quickPrompts = [
    "Building ke floors dikhao",
    "VIP floor par kya hai?",
    "Tech exhibitors kaun se hain?",
    "Where is booth A12?",
    "Plan schedule from 10 AM to 4 PM"
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Text-To-Speech (TTS) Voice Synthesis
  const speakText = (text) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Remove markdown asterisks and icons for clean audio reading
      const cleanText = text.replace(/[*_#•`]/g, '').replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Speech error
    }
  };

  // Voice Input Speech Recognition
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    if (!isListening) {
      soundFX.playBeep(600, 0.1, 'sine');
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    soundFX.playClick();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: query });
      const replyText = res.data.response || "I am ready to help you with your query.";
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: res.data.actions || []
      }]);
      speakText(replyText);
    } catch (err) {
      const fallbackText = "I am ready to assist you! You can ask about booths, schedules, building floors, or exhibitors.";
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: fallbackText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: []
      }]);
      speakText(fallbackText);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    soundFX.playTeleport();
    if (action.type === 'QUERY_SUGGESTION') {
      handleSend(action.query);
    } else if (action.type === 'NAVIGATE_PAGE') {
      setIsOpen(false);
      navigate(action.url);
    } else if (action.type === 'OPEN_BADGE') {
      setIsOpen(false);
      const vipBtn = document.querySelector('button[title*="VIP Pass"]');
      if (vipBtn) vipBtn.click();
    } else if (
      action.type === 'CHANGE_FLOOR' || 
      action.type === 'VIEW_EXTERIOR' ||
      action.type === 'VIEW_INDOOR' ||
      action.type === 'VIEW_BUILDING_STACK' || 
      action.type === 'TELEPORT_BOOTH' || 
      action.type === 'TELEPORT_FACILITY' ||
      action.type === 'NAVIGATE_BOOTH' || 
      action.type === 'TRIGGER_EMERGENCY'
    ) {
      setIsOpen(false);
      navigate('/floor-plan');
    }
  };

  return (
    <>
      {/* Compact AI Concierge Floating Button — icon-only, expands on hover */}
      <div className="position-fixed bottom-0 end-0 m-3 m-md-4" style={{ zIndex: 1050 }}>
        <button
          onClick={() => {
            soundFX.playClick();
            setIsOpen(!isOpen);
          }}
          className="ai-floating-btn d-flex align-items-center border-0"
          style={{ 
            background: isNeon 
              ? 'linear-gradient(135deg, #059669 0%, #00d66f 50%, #06b6d4 100%)' 
              : 'linear-gradient(135deg, #047857 0%, #10b981 50%, #0284c7 100%)',
            cursor: 'pointer',
            borderRadius: '9999px',
            padding: '0 14px',
            height: '52px',
            gap: '10px',
          }}
          title="EventSphere AI Concierge"
        >
          {/* Pulse rings */}
          <span className="ai-btn-pulse-ring" />
          <span className="ai-btn-pulse-ring" />

          {/* Sparkle Icon — always visible */}
          <div className="ai-sparkle-icon d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '24px', height: '24px' }}>
            <Sparkles size={20} color="#fff" />
          </div>

          {/* Expandable label + wave — hidden by default, shown on hover via CSS */}
          <div className="ai-fab-expand d-flex align-items-center" style={{ gap: '8px' }}>
            <span className="fw-bold text-white text-nowrap" style={{ fontSize: '0.88rem', letterSpacing: '0.01em' }}>
              EventSphere AI
            </span>

            <div className="d-flex align-items-center" style={{ gap: '3px', height: '16px', borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '8px', marginLeft: '2px' }}>
              <span className="ai-online-dot" />
              <span className="ai-wave-bar" style={{ height: '8px', background: '#fff', width: '2px' }} />
              <span className="ai-wave-bar" style={{ height: '14px', background: '#fff', width: '2px', animationDelay: '0.2s' }} />
              <span className="ai-wave-bar" style={{ height: '6px', background: '#fff', width: '2px', animationDelay: '0.4s' }} />
            </div>
          </div>
        </button>
      </div>

      {/* Chat Window Drawer / Modal */}
      {isOpen && (
        <div 
          className="position-fixed glass-card d-flex flex-column shadow-lg animate-fade-in"
          style={{ 
            width: '420px', 
            maxWidth: '100vw',
            height: '620px', 
            maxHeight: '100vh',
            bottom: '0',
            right: '0',
            margin: '0',
            zIndex: 2200, 
            borderRadius: window.innerWidth < 576 ? '0' : '24px',
            border: isNeon ? '1px solid rgba(0, 214, 111, 0.35)' : '1px solid rgba(18, 140, 126, 0.3)',
            background: isNeon ? '#09130e' : '#f0f2f5'
          }}
        >
          {/* Header */}
          <div 
            className="p-3 d-flex justify-content-between align-items-center position-relative overflow-hidden" 
            style={{ 
              background: isNeon 
                ? 'linear-gradient(135deg, #0b1c13 0%, #06120b 100%)' 
                : 'linear-gradient(135deg, #075e54 0%, #128c7e 100%)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              borderBottom: isNeon ? '1px solid rgba(0,214,111,0.2)' : 'none'
            }}
          >
            <div className="d-flex align-items-center gap-2.5">
              {/* 🌟 Animated Futuristic AI Avatar Orb */}
              <div 
                className="position-relative d-flex align-items-center justify-content-center" 
                style={{ width: '42px', height: '42px' }}
              >
                <div 
                  className="position-absolute w-100 h-100 rounded-circle ai-orb-ring"
                  style={{
                    border: isNeon ? '2px dashed #00d66f' : '2px dashed #ffffff',
                    opacity: 0.7
                  }}
                />
                <div 
                  className="p-2 rounded-circle d-flex align-items-center justify-content-center ai-orb-core shadow" 
                  style={{ 
                    background: isNeon ? 'linear-gradient(135deg, #00d66f 0%, #06b6d4 100%)' : 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                    width: '32px',
                    height: '32px',
                    color: '#000000'
                  }}
                >
                  <Sparkles size={16} className="text-white" />
                </div>
              </div>

              <div>
                <div className="d-flex align-items-center gap-2">
                  <h6 className="mb-0 fw-bold text-white">EventSphere AI</h6>
                  {/* Live Audio Equalizer Waveform Animation */}
                  {voiceEnabled && (
                    <div className="d-flex align-items-end gap-0.5" style={{ height: '14px' }}>
                      <div className="ai-wave-bar" />
                      <div className="ai-wave-bar" />
                      <div className="ai-wave-bar" />
                      <div className="ai-wave-bar" />
                      <div className="ai-wave-bar" />
                    </div>
                  )}
                </div>
                <small className="d-flex align-items-center gap-1" style={{ color: isNeon ? '#00d66f' : '#dcfce7', fontSize: '11px' }}>
                  <span className="rounded-circle d-inline-block animate-pulse" style={{ width: '6px', height: '6px', background: isNeon ? '#00d66f' : '#25d366' }} />
                  Neural Assistant • 3D Arena Engine
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-1">
              {/* TTS Voice Toggle */}
              <button 
                onClick={() => {
                  soundFX.playClick();
                  setVoiceEnabled(p => !p);
                }} 
                className="btn btn-sm text-white p-1.5 rounded-circle transition-all"
                style={{ background: voiceEnabled ? 'rgba(0,214,111,0.35)' : 'rgba(255,255,255,0.1)' }}
                title={voiceEnabled ? 'Voice Output ON' : 'Voice Output OFF'}
              >
                {voiceEnabled ? <Volume2 size={16} className="text-warning animate-pulse" /> : <VolumeX size={16} />}
              </button>

              <button 
                onClick={() => {
                  soundFX.playClick();
                  setIsOpen(false);
                }} 
                className="btn btn-sm text-white p-1.5 rounded-circle ms-1"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Quick Prompt Horizontal Scrollbar */}
          <div 
            className="px-3 py-2 d-flex gap-1.5 overflow-x-auto"
            style={{ 
              background: isNeon ? '#070f0b' : '#ffffff',
              borderBottom: isNeon ? '1px solid rgba(0,214,111,0.1)' : '1px solid #e9edef'
            }}
          >
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="btn btn-sm text-nowrap py-1 px-2.5"
                style={{ 
                  fontSize: '0.74rem', 
                  borderRadius: '16px',
                  background: isNeon ? 'rgba(0, 214, 111, 0.1)' : '#f0f2f5',
                  color: isNeon ? '#00d66f' : '#128c7e',
                  border: isNeon ? '1px solid rgba(0, 214, 111, 0.25)' : '1px solid rgba(18, 140, 126, 0.2)',
                  fontWeight: 600
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Feed */}
          <div 
            className="flex-grow-1 p-3 overflow-y-auto d-flex flex-column gap-3"
            style={{
              background: isNeon ? '#08110c' : '#efeae2',
              backgroundImage: isNeon 
                ? 'radial-gradient(rgba(0, 214, 111, 0.05) 1px, transparent 1px)' 
                : 'radial-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`d-flex flex-column ${msg.sender === 'user' ? 'align-items-end' : 'align-items-start'}`}
              >
                <div
                  className="p-3 rounded-4 shadow-sm position-relative"
                  style={{
                    maxWidth: '85%',
                    fontSize: '0.88rem',
                    lineHeight: '1.5',
                    background: msg.sender === 'user'
                      ? (isNeon ? '#00d66f' : '#d9fdd3')
                      : (isNeon ? '#0e1c15' : '#ffffff'),
                    color: msg.sender === 'user'
                      ? (isNeon ? '#050d08' : '#111b21')
                      : (isNeon ? '#f0fdf4' : '#111b21'),
                    border: msg.sender === 'user'
                      ? 'none'
                      : isNeon ? '1px solid rgba(0, 214, 111, 0.2)' : '1px solid rgba(0,0,0,0.05)',
                    borderTopRightRadius: msg.sender === 'user' ? '4px' : '18px',
                    borderTopLeftRadius: msg.sender === 'ai' ? '4px' : '18px',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.text}

                  {/* WhatsApp style time & double ticks */}
                  <div 
                    className="d-flex align-items-center justify-content-end gap-1 mt-1" 
                    style={{ fontSize: '10px', opacity: 0.7 }}
                  >
                    <span>{msg.time}</span>
                    {msg.sender === 'user' && (
                      <CheckCheck size={13} style={{ color: isNeon ? '#050d08' : '#53bdeb' }} />
                    )}
                  </div>
                </div>

                {/* Actionable buttons generated by AI */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="d-flex flex-wrap gap-1.5 mt-2 ms-1" style={{ maxWidth: '85%' }}>
                    {msg.actions.map((act, actIdx) => (
                      <button
                        key={actIdx}
                        onClick={() => handleActionClick(act)}
                        className="btn btn-sm d-flex align-items-center gap-1 shadow-sm"
                        style={{
                          fontSize: '0.75rem',
                          borderRadius: '12px',
                          background: isNeon ? '#0e2419' : '#ffffff',
                          color: isNeon ? '#00d66f' : '#075e54',
                          border: isNeon ? '1px solid #00d66f' : '1px solid #128c7e',
                          fontWeight: 600,
                          padding: '4px 10px'
                        }}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div 
                className="p-3 rounded-4 d-flex align-items-center gap-2.5 shadow-sm animate-fade-in" 
                style={{ 
                  background: isNeon ? '#0e1c15' : '#ffffff', 
                  color: isNeon ? '#00d66f' : '#128c7e',
                  fontSize: '0.82rem',
                  width: 'fit-content',
                  border: isNeon ? '1px solid rgba(0, 214, 111, 0.25)' : '1px solid rgba(0,0,0,0.06)'
                }}
              >
                <div className="d-flex align-items-center gap-1.5 me-1">
                  <div className="ai-typing-dot" />
                  <div className="ai-typing-dot" />
                  <div className="ai-typing-dot" />
                </div>
                <span className="fw-semibold">AI is analyzing 3D building & schedules...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div 
            className="p-2.5 border-top"
            style={{ 
              background: isNeon ? '#09130e' : '#f0f2f5',
              borderColor: isNeon ? 'rgba(0,214,111,0.15)' : '#e9edef',
              borderBottomLeftRadius: '24px',
              borderBottomRightRadius: '24px'
            }}
          >
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="d-flex align-items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className="btn btn-sm p-2 rounded-circle"
                style={{
                  background: isListening ? '#ef4444' : isNeon ? 'rgba(0, 214, 111, 0.15)' : '#ffffff',
                  color: isListening ? '#ffffff' : isNeon ? '#00d66f' : '#128c7e',
                  border: isNeon ? '1px solid rgba(0, 214, 111, 0.3)' : '1px solid #e9edef'
                }}
                title={isListening ? 'Listening...' : 'Voice Input'}
              >
                {isListening ? <MicOff size={16} className="animate-pulse" /> : <Mic size={16} />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about building floors, booths, schedule..."
                className="form-control form-control-sm flex-grow-1"
                style={{
                  background: isNeon ? '#0b1911' : '#ffffff',
                  border: isNeon ? '1px solid rgba(0, 214, 111, 0.25)' : '1px solid #e9edef',
                  color: isNeon ? '#f0fdf4' : '#111b21',
                  borderRadius: '20px',
                  padding: '8px 14px',
                  fontSize: '0.88rem'
                }}
              />

              <button 
                type="submit" 
                disabled={loading || !input.trim()} 
                className="btn btn-sm btn-primary-custom d-flex align-items-center justify-content-center p-2 rounded-circle"
                style={{ width: '38px', height: '38px' }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistantModal;

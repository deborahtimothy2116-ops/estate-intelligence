import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, Building2 } from 'lucide-react';
import { aiService } from '../services/aiService';
import { Property } from '../types';
import { Link } from 'react-router-dom';

export const AiChatAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string; properties?: Property[] }[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your AI Property Advisor. Ask me anything about current listings, budget recommendations, or location highlights.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const data = await aiService.chatAssistant(
        updatedMessages.map((m) => ({ role: m.role, content: m.content }))
      );

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          properties: data.suggestedProperties,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error connecting to the AI service.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-drawer">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="btn gradient-btn rounded-circle p-3 d-flex align-items-center justify-content-center shadow-lg ai-pulse"
          style={{ width: 60, height: 60 }}
          title="Open AI Property Assistant"
        >
          <Bot size={28} />
        </button>
      ) : (
        <div className="glass-panel p-3 shadow-lg text-white" style={{ width: 360, maxHeight: 520, borderRadius: 20, display: 'flex', flexDirection: 'column' }}>
          <div className="d-flex align-items-center justify-content-between pb-2 mb-2 border-bottom border-secondary">
            <div className="d-flex align-items-center gap-2">
              <div className="gradient-btn p-1 rounded-circle">
                <Bot size={20} />
              </div>
              <div>
                <h6 className="fw-bold mb-0 text-white">AI Property Assistant</h6>
                <span className="small text-success d-flex align-items-center gap-1">
                  <span className="badge bg-success rounded-circle p-1"></span> Grounded on DB Listings
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="btn btn-sm text-secondary p-0">
              <X size={20} />
            </button>
          </div>

          <div className="flex-grow-1 overflow-auto pe-1 my-2" style={{ maxHeight: 340 }}>
            {messages.map((m, idx) => (
              <div key={idx} className={`mb-3 ${m.role === 'user' ? 'text-end' : 'text-start'}`}>
                <div
                  className={`d-inline-block p-2 px-3 rounded-3 small text-break ${
                    m.role === 'user'
                      ? 'gradient-btn text-white'
                      : 'bg-dark border border-secondary text-white-50'
                  }`}
                >
                  {m.content}
                </div>

                {m.properties && m.properties.length > 0 && (
                  <div className="mt-2 text-start">
                    {m.properties.map((p) => (
                      <div key={p._id} className="p-2 mb-2 bg-dark rounded border border-secondary d-flex gap-2 align-items-center">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'}
                          alt={p.title}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
                        />
                        <div className="overflow-hidden flex-grow-1">
                          <div className="fw-bold small text-white text-truncate">{p.title}</div>
                          <div className="small text-indigo">₹{(p.price / 100000).toFixed(1)} Lakhs</div>
                        </div>
                        <Link to={`/properties/${p._id}`} className="btn btn-xs btn-outline-light py-1 px-2 small">
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="text-start small text-secondary">
                <span className="spinner-border spinner-border-sm me-2"></span> AI is generating grounded recommendations...
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="mt-auto pt-2 border-top border-secondary">
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-sm bg-dark text-white border-secondary"
                placeholder="Ask AI property advisor..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="btn btn-sm gradient-btn" disabled={loading}>
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

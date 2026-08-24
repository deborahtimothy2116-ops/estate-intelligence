import React, { useState, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Conversation, Message } from '../types';
import { MessageSquare, Send, User, Circle } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [activePartner, setActivePartner] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const convs = await chatService.getConversations();
      setConversations(convs);
      if (convs.length > 0 && !activePartnerId) {
        setActivePartnerId(convs[0].user.id || (convs[0].user as any)._id);
        setActivePartner(convs[0].user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activePartnerId) return;
    const fetchMessages = async () => {
      try {
        const msgs = await chatService.getMessages(activePartnerId);
        setMessages(msgs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [activePartnerId]);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (msg: Message) => {
      if (msg.senderId === activePartnerId || msg.receiverId === activePartnerId) {
        setMessages((prev) => [...prev, msg]);
      }
      fetchConversations();
    });

    socket.on('message_sent', (msg: Message) => {
      if (msg.senderId === activePartnerId || msg.receiverId === activePartnerId) {
        setMessages((prev) => [...prev, msg]);
      }
      fetchConversations();
    });

    socket.on('user_typing', (data: { senderId: string }) => {
      if (data.senderId === activePartnerId) {
        setIsTyping(true);
      }
    });

    socket.on('user_stopped_typing', (data: { senderId: string }) => {
      if (data.senderId === activePartnerId) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off('receive_message');
      socket.off('message_sent');
      socket.off('user_typing');
      socket.off('user_stopped_typing');
    };
  }, [socket, activePartnerId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activePartnerId || !socket) return;

    socket.emit('send_message', {
      receiverId: activePartnerId,
      content: inputMessage,
    });

    setInputMessage('');
  };

  const handleSelectPartner = (conv: Conversation) => {
    const partnerId = conv.user.id || (conv.user as any)._id;
    setActivePartnerId(partnerId);
    setActivePartner(conv.user);
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <MessageSquare className="text-indigo" size={28} />
        <h2 className="fw-bold text-white mb-0">Real-Time Messaging Center</h2>
      </div>

      <div className="row g-4" style={{ minHeight: '520px' }}>
        {/* Left Conversation List Sidebar */}
        <div className="col-md-4">
          <div className="glass-panel p-3 h-100 overflow-auto">
            <h6 className="fw-bold text-white mb-3">Conversations</h6>
            {loading ? (
              <div className="text-center py-4 text-secondary">
                <div className="spinner-border spinner-border-sm text-indigo"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center text-secondary py-4 small">No active conversations yet.</div>
            ) : (
              conversations.map((c) => {
                const partnerId = c.user.id || (c.user as any)._id;
                const isActive = partnerId === activePartnerId;
                return (
                  <div
                    key={partnerId}
                    onClick={() => handleSelectPartner(c)}
                    className={`p-3 rounded-3 mb-2 cursor-pointer transition ${
                      isActive ? 'bg-indigo bg-opacity-25 border border-indigo' : 'bg-dark bg-opacity-50 border border-secondary'
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="fw-bold text-white small">{c.user.name}</div>
                      {c.unreadCount > 0 && <span className="badge bg-danger rounded-circle">{c.unreadCount}</span>}
                    </div>
                    <div className="small text-secondary text-truncate">{c.lastMessage}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Message Thread */}
        <div className="col-md-8">
          <div className="glass-panel p-3 h-100 d-flex flex-column">
            {activePartner ? (
              <>
                <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-secondary">
                  <div className="d-flex align-items-center gap-2">
                    <div className="gradient-btn rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                      <User size={20} />
                    </div>
                    <div>
                      <h6 className="fw-bold text-white mb-0">{activePartner.name}</h6>
                      <span className="small text-secondary">{activePartner.agencyName || activePartner.role}</span>
                    </div>
                  </div>
                  {isTyping && <span className="small text-indigo fst-italic">Typing message...</span>}
                </div>

                <div className="flex-grow-1 overflow-auto pe-2 mb-3" style={{ maxHeight: 380 }}>
                  {messages.map((m) => {
                    const isMe = m.senderId === user?.id;
                    return (
                      <div key={m._id} className={`mb-3 ${isMe ? 'text-end' : 'text-start'}`}>
                        <div
                          className={`d-inline-block p-2 px-3 rounded-3 small text-break ${
                            isMe ? 'gradient-btn text-white' : 'bg-dark border border-secondary text-white'
                          }`}
                        >
                          {m.content}
                        </div>
                        <div className="text-secondary" style={{ fontSize: '0.7rem' }}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSendMessage} className="mt-auto pt-2 border-top border-secondary">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Type real-time message..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <button type="submit" className="btn gradient-btn px-4">
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="m-auto text-center text-secondary">
                <MessageSquare size={40} className="mb-2" />
                <p>Select a conversation thread to start messaging.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

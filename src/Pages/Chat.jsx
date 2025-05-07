import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';

const Chat = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChat();
    const interval = setInterval(loadChat, 5000); // Poll for new messages every 5 seconds
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = async () => {
    try {
      const [messagesRes, userRes] = await Promise.all([
        axiosInstance.get(`/api/chat/${userId}`),
        axiosInstance.get(`/api/users/${userId}`)
      ]);
      setMessages(messagesRes.data.data);
      setOtherUser(userRes.data.data);
    } catch (err) {
      console.error('Error loading chat:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axiosInstance.post(`/api/chat/${userId}`, {
        content: newMessage
      });
      setNewMessage('');
      loadChat(); // Reload messages
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f7ff] p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0070cc] mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      {/* Chat header */}
      <div className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-[#f0f7ff] rounded-full mr-4"
          >
            <ArrowLeft className="h-5 w-5 text-[#084b88]" />
          </button>
          <div>
            <h2 className="font-semibold text-[#084b88]">
              {otherUser?.name || 'Chat'}
            </h2>
            <p className="text-sm text-[#4e4942]">
              {otherUser?.isOnline ? 'En ligne' : 'Hors ligne'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg min-h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.senderId === userId ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderId === userId
                      ? 'bg-[#f0f7ff] text-[#084b88]'
                      : 'bg-[#0070cc] text-white'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.createdAt).toLocaleTimeString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <form onSubmit={handleSend} className="p-4 border-t border-[#bae0fd]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 bg-[#f0f7ff] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0070cc]"
              />
              <button
                type="submit"
                className="p-2 bg-[#0070cc] text-white rounded-lg hover:bg-[#005ba6] transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;

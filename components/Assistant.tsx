import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Loader2, Sparkles } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AssistantProps {
  onClose?: () => void;
}

const Assistant: React.FC<AssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: "Bonjour! I am Maître D'. How may I assist you with your table setting or dining etiquette today?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const responseText = await sendChatMessage(history, userMsg.text);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I apologize, I am momentarily distracted. Could you repeat that?",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I am having trouble connecting to my knowledge base. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-2xl rounded-2xl overflow-hidden border border-stone-200">
      <div className="bg-stone-900 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500 rounded-full">
            <Bot size={18} className="text-stone-900" />
          </div>
          <h3 className="font-serif font-semibold text-lg">Maître D'</h3>
        </div>
        {onClose && (
            <button onClick={onClose} className="hover:bg-stone-700 p-1 rounded transition-colors">
                <X size={20} />
            </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-stone-800 text-white rounded-br-none' 
                : 'bg-white text-stone-800 border border-stone-100 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-stone-100 flex items-center gap-2">
              <Loader2 className="animate-spin text-amber-500" size={16} />
              <span className="text-xs text-stone-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-stone-100">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about etiquette..."
            className="flex-1 px-4 py-2 bg-stone-100 border-none rounded-full focus:ring-2 focus:ring-amber-500 focus:outline-none text-stone-800 placeholder-stone-400 pr-12"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-1 top-1 p-1.5 bg-stone-900 text-white rounded-full hover:bg-amber-600 disabled:bg-stone-300 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;

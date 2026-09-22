import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, X, Bot } from 'lucide-react';

interface ChatMessage {
  id: number;
  isUser: boolean;
  text: string;
  time: string;
}

interface ChatWidgetProps {
  context: string;
  title?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ context, title = "Report Assistant" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, isUser: false, text: `Hi! I'm ready to help you analyze this ${title}. What would you like to know about the data?`, time: 'Just now' }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Auto-hide the hint after 10 seconds to give them time to read it
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    
    const userMsg: ChatMessage = {
      id: Date.now(),
      isUser: true,
      text: prompt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setIsTyping(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `SYSTEM RULE: You must base your analysis ONLY on the attached JSON Context Data provided below (which represents the files attached in this current session). When the user navigates away or back to home, files are detached and this context changes. HARD RULE: Do not hallucinate or create irrelevant categories, metrics, or insights not explicitly supported by this context data. If asked something outside this scope, politely decline.\n\nContext Data from attached files:\n${context}\n\nUser Question: ${prompt}` 
        })
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        isUser: false,
        text: data.reply || "Sorry, I couldn't process that.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        isUser: false,
        text: "Connection error. Make sure the backend is running.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Centered Alert Modal */}
      {showHint && !isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-8 max-w-md w-full relative text-center scale-100">
            <div className="mx-auto w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mb-5 border-4 border-blue-100">
              <Bot size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Deck generated successfully! 🎉</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              I am your AI Assistant. You can use the <strong>Chat Panel</strong> on the right for further analysis on this specific data.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowHint(false)}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
              >
                Got it
              </button>
              <button 
                onClick={() => { setIsOpen(true); setShowHint(false); }}
                className="flex-1 bg-brand-blue text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition shadow-md"
              >
                Open Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (Middle Right Edge) */}
      {!isOpen && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center">
          {/* Button */}
          <button 
            onClick={() => { setIsOpen(true); setShowHint(false); }}
            className="bg-brand-blue text-white px-4 py-6 rounded-l-2xl shadow-[-4px_0_24px_rgba(0,0,0,0.15)] hover:bg-blue-700 transition flex flex-col items-center justify-center gap-3 hover:-translate-x-1"
          >
            <div className="relative">
              <Bot size={32} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-brand-blue rounded-full"></span>
            </div>
            <span className="font-bold text-sm text-center leading-tight">Chat<br/>Panel</span>
          </button>
        </div>
      )}

      {/* Chat Panel Window */}
      {isOpen && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 w-96 h-[550px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden animate-fade-in">
          <div className="bg-brand-blue text-white p-4 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <h3 className="font-semibold text-sm">{title}</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition bg-white/10 rounded p-1">
              <X size={16} />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                  msg.isUser ? 'bg-brand-blue text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                }`}>
                  <div className="whitespace-pre-wrap leading-relaxed markdown-body text-sm" dangerouslySetInnerHTML={{__html: msg.text.replace(/\n/g, '<br/>')}} />
                  <span className={`text-[10px] mt-1.5 block ${msg.isUser ? 'text-white/70 text-right' : 'text-gray-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 bg-white border-t border-gray-100 z-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask about this data..."
                className="w-full bg-gray-100 border-transparent rounded-full py-2.5 pl-4 pr-10 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue outline-none transition"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isTyping}
              />
              <button 
                onClick={handleSend}
                disabled={isTyping || !prompt.trim()}
                className={`absolute right-1.5 top-1.5 w-7 h-7 rounded-full flex items-center justify-center transition ${
                  isTyping || !prompt.trim() ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-brand-blue text-white hover:bg-blue-700 shadow-sm'
                }`}
              >
                <Send size={12} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, FileText, LayoutTemplate, TrendingUp, CalendarClock, MessageSquare, Paperclip, X } from 'lucide-react';

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  time: string;
}

const EmployeeHome = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default mock conversations in history
  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: "Fraud Detection root cause", time: "2:14 PM" },
    { id: 2, text: "Expense policy question", time: "11:02 AM" }
  ]);

  // Live messages in the center screen
  const [activeChat, setActiveChat] = useState<ChatMessage[]>([
    {
      id: 1,
      isUser: true,
      text: "What's our policy on expense reporting for client visits?",
      time: "Just now"
    },
    {
      id: 2,
      isUser: false,
      text: "Client visit expenses go under Travel & Entertainment, submitted within 5 business days with itemized receipts over 500 SEK. Want me to open the expense form?",
      time: "Just now"
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat, isTyping, uploadedFiles]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...filesArray]);
      // Reset input so the same file can be selected again if removed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const generateReport = () => {
    if (uploadedFiles.length === 0) return;
    
    setIsUploading(true);
    const fileName = uploadedFiles[0].name.toLowerCase();
    
    // Simulate backend analysis of the uploaded data shape
    setTimeout(() => {
      setIsUploading(false);
      // Dynamic routing based on the provided data
      if (fileName.includes('risk')) {
        navigate('/report/risk');
      } else if (fileName.includes('performance') || fileName.includes('process')) {
        navigate('/report');
      } else {
        // Default fallback for demo
        navigate('/report');
      }
    }, 2000);
  };

  const handleSend = async () => {
    if (!prompt.trim()) return;
    
    const userText = prompt;
    const newMessage: ChatMessage = { id: Date.now(), text: userText, isUser: true, time: "Just now" };
    
    // Add user message to UI
    setActiveChat(prev => [...prev, newMessage]);
    setPrompt('');
    setIsTyping(true);

    try {
      // Call the real backend LLM integration
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      
      const data = await response.json();
      
      const botMessage: ChatMessage = { 
        id: Date.now() + 1, 
        text: data.reply, 
        isUser: false, 
        time: "Just now" 
      };
      
      setActiveChat(prev => [...prev, botMessage]);
      
      // Optionally add to history sidebar if it's the first message of a new topic
      if (activeChat.length <= 2) {
         setChatHistory([{ id: Date.now(), text: userText, time: "Just now" }, ...chatHistory]);
      }

    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = { 
        id: Date.now() + 1, 
        text: "Error connecting to the server. Is the backend running on port 3001?", 
        isUser: false, 
        time: "Just now" 
      };
      setActiveChat(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 flex gap-8 h-full">
      {/* Left Column */}
      <div className="flex-1 flex flex-col h-full">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Good afternoon, Kaif</h1>
          <p className="text-gray-500 mb-6">Here's what you can do today.</p>

          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-4">
              
              <div 
                onClick={() => navigate('/report')}
                className="bg-brand-blue rounded-xl p-4 text-white shadow-sm cursor-pointer hover:bg-blue-700 transition"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-6">
                  <FileText size={18} />
                </div>
                <h3 className="font-semibold text-sm">New Monthly Report</h3>
                <p className="text-xs text-white/70 mt-1">Generate standard performance deck</p>
              </div>
              
              <div 
                onClick={() => navigate('/report/risk')}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-6 text-gray-600">
                  <LayoutTemplate size={18} />
                </div>
                <h3 className="font-semibold text-sm text-gray-800">Risk Analysis</h3>
                <p className="text-xs text-gray-500 mt-1">Drill-down interactive risk report</p>
              </div>

              <div 
                onClick={() => navigate('/report')}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition relative"
              >
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center mb-6 text-teal-600">
                  <TrendingUp size={18} />
                </div>
                <h3 className="font-semibold text-sm text-gray-800">Trend Watch</h3>
                <p className="text-xs text-gray-500 mt-1">1 anomaly flagged this month</p>
              </div>

            </div>
          </div>
        </div>

        {/* Live Assistant Box */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col flex-1 min-h-[400px]">
          <div className="p-4 border-b flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white">
              <MessageSquare size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-800">General Assistant</h3>
              <p className="text-xs text-gray-500">Not tied to a report — ask about policies, data, or anything else.</p>
            </div>
          </div>
          
          <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto bg-gray-50/50">
            {activeChat.map((msg) => (
              <div 
                key={msg.id} 
                className={`text-sm max-w-[80%] whitespace-pre-wrap leading-relaxed ${
                  msg.isUser 
                    ? 'self-end bg-brand-blue text-white rounded-2xl rounded-tr-sm px-4 py-2' 
                    : 'self-start bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            ))}
            
            {isTyping && (
              <div className="self-start bg-white border border-gray-100 text-gray-500 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t">
            {uploadedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-blue-50 text-brand-blue px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100">
                    <FileText size={12} />
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button 
                      onClick={() => removeFile(idx)}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="relative flex items-center gap-2">
              <div className="relative flex items-center flex-1">
                <input 
                  type="file" 
                  accept=".csv,.xlsx" 
                  multiple 
                  hidden 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                />
                <button 
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute left-2 w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  placeholder={isUploading ? "Scanning files..." : "Message the assistant or upload data..."}
                  className="w-full bg-gray-100 border-transparent rounded-full py-3 pl-12 pr-12 text-sm focus:bg-white focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isTyping || isUploading}
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping || (!prompt.trim() && uploadedFiles.length === 0)}
                  className={`absolute right-2 w-8 h-8 rounded-full flex items-center justify-center transition ${
                    isTyping || (!prompt.trim() && uploadedFiles.length === 0) ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-brand-blue text-white hover:bg-blue-700'
                  }`}
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </div>
              {uploadedFiles.length > 0 && (
                <button 
                  onClick={generateReport}
                  disabled={isUploading}
                  className="bg-brand-blue text-white px-4 py-3 rounded-full text-sm font-semibold hover:bg-blue-700 transition flex items-center whitespace-nowrap shadow-sm"
                >
                  {isUploading ? 'Scanning...' : 'Generate Deck'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Chat History */}
      <div className="w-80 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col h-[700px]">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Chat History</h3>
          <button 
            className="text-xs bg-brand-blue text-white px-3 py-1.5 rounded-full hover:bg-blue-700"
            onClick={() => setActiveChat([])}
          >
            + New chat
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Today</h4>
          <div className="space-y-1 mb-6">
            {chatHistory.map((chat, i) => (
              <div key={chat.id} className={`p-3 rounded-lg cursor-pointer ${i === 0 ? 'bg-blue-50 text-brand-blue' : 'hover:bg-gray-50 text-gray-700'}`}>
                <p className="text-sm font-medium truncate">{chat.text}</p>
                <p className={`text-xs mt-1 ${i === 0 ? 'text-blue-400' : 'text-gray-400'}`}>{chat.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;

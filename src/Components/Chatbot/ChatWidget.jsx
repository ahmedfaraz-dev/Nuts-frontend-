import React, { useState, useRef, useEffect } from 'react';
import { X, Send, RefreshCw, Minus, Mic } from 'lucide-react';
import { chatbotApi } from '../../Api/chatbotApi';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: 'Hi! 👋 Welcome to Aura-Nuts.\n\nI may share some of your information with our trusted service providers in order to assist you better.\n\nHow can I help you today?'
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen, isMinimized]);

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput('');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const history = newMessages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await chatbotApi.sendMessage(userMessage, history);

      if (response.data.success) {
        setMessages([...newMessages, { role: 'assistant', content: response.data.reply }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now. Please try again.' }]);
      }
    } catch (error) {
      console.error('Chatbot API Error:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Oops! Something went wrong. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3">

      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div className="w-[360px] sm:w-[390px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: '530px' }}>

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              {/* Logo circle */}
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#a3e635] via-[#fde047] to-[#fef08a] p-[2px] shadow-sm flex-shrink-0">
                <div className="flex items-center justify-center w-full h-full rounded-full bg-white overflow-hidden">
                  <img src="/images/logos.png" alt="Aura-Nuts" className="w-[85%] h-[85%] object-contain" />
                </div>
              </div>
              <span className="font-semibold text-[15px] text-gray-800 tracking-tight">
                Aura-Nuts Support
              </span>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reset conversation"
                className="p-2 cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                title="Minimize"
                className="p-2 cursor-pointer text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto px-4 pt-5 pb-3 flex flex-col gap-4 custom-scrollbar bg-white">

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-end gap-2.5'}`}
              >
                {/* Bot Avatar Left */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[#a3e635] via-[#fde047] to-[#fef08a] p-[2px] shadow-sm flex-shrink-0">
                    <div className="flex items-center justify-center w-full h-full rounded-full bg-white overflow-hidden">
                      <img src="/images/logos.png" alt="bot" className="w-[85%] h-[85%] object-contain" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[78%] text-[13.5px] leading-relaxed ${msg.role === 'user'
                    ? 'bg-[#F59115] text-white px-4 py-2.5 rounded-2xl rounded-br-sm shadow-sm'
                    : 'text-gray-600 text-center'
                    }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {msg.role === 'assistant' && idx === 0 ? (
                    <p className="text-gray-500 text-[13px] text-center leading-relaxed">
                      {msg.content}
                    </p>
                  ) : msg.role === 'assistant' ? (
                    <div className="bg-gray-50 border border-gray-100 text-gray-700 px-4 py-2.5 rounded-2xl rounded-bl-sm text-left text-[13.5px]">
                      {msg.content}
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-end gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[#a3e635] via-[#fde047] to-[#fef08a] p-[2px] shadow-sm flex-shrink-0">
                  <div className="flex items-center justify-center w-full h-full rounded-full bg-white overflow-hidden">
                    <img src="/images/logos.png" alt="bot" className="w-[85%] h-[85%] object-contain" />
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Area ── */}
          <div className="px-4 pt-2 pb-2 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 focus-within:border-[#F59115] focus-within:ring-1 focus-within:ring-[#F59115]/20 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-[13.5px] text-gray-700 placeholder-gray-400 outline-none min-w-0"
              />
              <button type="button" className="cursor-pointer text-gray-400 hover:text-gray-500 transition-colors ml-1">
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="cursor-pointer text-gray-400 hover:text-[#F59115] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Powered by */}
            <p className="text-center text-[10.5px] text-gray-400 mt-2 pb-1">
              ⚡ Powered by <span className="font-medium">Aura-Nuts AI</span>
            </p>
          </div>

        </div>
      )}

      {/* ── Toggle / Launcher Button ── */}
      <button
        onClick={() => {
          if (isMinimized) {
            setIsMinimized(false);
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className="cursor-pointer flex items-center gap-2 bg-white pl-1 pr-5 py-1 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105 active:scale-95 border border-gray-100"
      >
        {isOpen && !isMinimized ? (
          /* Close state */
          <div className="flex items-center gap-2">
            <div className="w-[2.75rem] h-[2.75rem] rounded-full bg-[#F59115] flex items-center justify-center text-white">
              <X className="w-5 h-5" />
            </div>
            <span className="text-[#3f3f46] font-bold text-[14px] mr-1">Close chat</span>
          </div>
        ) : (
          /* Open state */
          <>
            <div className="flex items-center justify-center w-[2.75rem] h-[2.75rem] rounded-full bg-gradient-to-tr from-[#a3e635] via-[#fde047] to-[#fef08a] p-[2px]">
              <div className="flex items-center justify-center w-full h-full rounded-full bg-white overflow-hidden">
                <img src="/images/logos.png" alt="logo" className="w-[88%] h-auto object-contain" />
              </div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[#3f3f46] font-black text-[14px] leading-[1.1]">Ask anything</span>
              <span className="text-[#71717a] text-[11.5px] font-medium leading-[1.1] mt-0.5">Chat about the order</span>
            </div>
          </>
        )}
      </button>

    </div>
  );
};

export default ChatWidget;

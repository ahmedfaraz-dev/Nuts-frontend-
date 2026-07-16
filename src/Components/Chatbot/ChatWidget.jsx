import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { chatbotApi } from '../../Api/chatbotApi';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi there! 👋 I am your Aura-Nuts assistant.\n\nI can help you find products, check deals, and answer any questions. How can I help?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        
        // Add user message to UI immediately
        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            // Prepare history for Groq. Map to simple role/content pairs.
            // Exclude the most recent message (since that goes in 'message' field)
            const history = newMessages.slice(0, -1).map(m => ({ 
                role: m.role, 
                content: m.content 
            }));

            const response = await chatbotApi.sendMessage(userMessage, history);
            
            if (response.data.success) {
                setMessages([...newMessages, { role: 'assistant', content: response.data.reply }]);
            } else {
                setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now.' }]);
            }
        } catch (error) {
            console.error('Chatbot API Error:', error);
            setMessages([...newMessages, { role: 'assistant', content: 'Oops! Something went wrong. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[999]">
            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[500px] max-h-[80vh] transition-all duration-300 transform origin-bottom-right">
                    
                    {/* Header */}
                    <div className="bg-[#F59115] text-white p-4 flex justify-between items-center shadow-[0_2px_10px_rgba(245,145,21,0.2)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden p-1">
                                <img src="/images/logos.png" alt="logo" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[15px] leading-tight">Aura-Nuts Assistant</h3>
                                <p className="text-[11px] text-orange-100 mt-0.5 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                    Online right now
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar bg-[#fafafa]">
                        {messages.map((msg, idx) => (
                            <div 
                                key={idx} 
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 mr-2 mt-auto mb-1 shadow-sm p-1 border border-gray-100">
                                        <img src="/images/logos.png" alt="logo" className="w-full h-full object-contain" />
                                    </div>
                                )}
                                <div 
                                    className={`max-w-[75%] rounded-2xl p-3.5 text-[14px] leading-relaxed shadow-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-[#F59115] text-white rounded-br-sm' 
                                            : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'
                                    }`}
                                    style={{ whiteSpace: 'pre-line' }}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex justify-start items-end">
                                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 mr-2 mb-1 shadow-sm p-1 border border-gray-100">
                                    <img src="/images/logos.png" alt="logo" className="w-full h-full object-contain" />
                                </div>
                                <div className="bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-bl-sm p-3.5 shadow-sm flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-[#F59115]" />
                                    <span className="text-xs text-gray-500 font-medium tracking-wide">Typing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full pl-5 pr-12 py-3.5 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#F59115] focus:ring-1 focus:ring-[#F59115] focus:bg-white transition-all text-gray-700 shadow-inner"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 p-2.5 bg-[#F59115] text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-[#F59115] transition-all transform active:scale-95 shadow-md shadow-orange-500/20"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white pl-1 pr-5 py-1 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105 active:scale-95 border border-gray-100"
            >
                {isOpen ? (
                    <div className="flex items-center gap-2">
                        <div className="w-[2.75rem] h-[2.75rem] rounded-full bg-[#F59115] flex items-center justify-center text-white text-lg">
                            <X className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col items-start hidden sm:flex">
                            <span className="text-[#3f3f46] font-extrabold text-[15px] leading-[1.2] mr-1">Close chat</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-center w-[2.75rem] h-[2.75rem] rounded-full bg-gradient-to-tr from-[#a3e635] via-[#fde047] to-[#fef08a] p-[2px]">
                            <div className="flex items-center justify-center w-full h-full rounded-full bg-white overflow-hidden p-[2px]">
                                <div className="flex items-center justify-center w-full h-full rounded-full bg-white overflow-hidden">
                                    <img src="/images/logos.png" alt="logo" className="w-[90%] h-auto object-contain" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[#3f3f46] font-black tracking-wide text-[14.5px] leading-[1.1]">Ask anything</span>
                            <span className="text-[#71717a] text-[11.5px] font-medium leading-[1.1] mt-0.5">Chat about the order</span>
                        </div>
                    </>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';
import { setCurrentChatId } from '../chat.slice';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../../../context/ThemeContext';

const Dashboard = () => {
    const dispatch = useDispatch();
    const chat = useChat();
    const { theme, setDarkTheme, setLightTheme } = useTheme();
    const { user } = useSelector(state => state.auth);
    const [message, setMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const messagesEndRef = useRef(null);

    const chats = useSelector((state) => state.chat.chats)
    const currentChatId = useSelector((state) => state.chat.currentChatId)
    const isLoading = useSelector((state) => state.chat.isLoading)

    const currentMessages = chats[currentChatId]?.messages || [];
    const [isSharing, setIsSharing] = useState(false);

    const handleShare = async () => {
        if (!currentChatId) return;
        setIsSharing(true);
        try {
            const data = await chat.handleShareChat(currentChatId);
            if (data && data.shareUrl) {
                await navigator.clipboard.writeText(data.shareUrl);
                alert("Share link copied to clipboard: " + data.shareUrl);
            }
        } catch (err) {
            console.error("Share failed", err);
        } finally {
            setIsSharing(false);
        }
    };


    useEffect(() => {
        chat.initializeSocketConnection();
        chat.handleGetChats();
    }, []);

    useEffect(() => {
        if (currentChatId && (!chats[currentChatId]?.messages || chats[currentChatId].messages.length === 0)) {
            chat.handleGetMessages(currentChatId);
        }
    }, [currentChatId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentMessages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const trimmedMessage = message.trim();
        if (!trimmedMessage) return;

        chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
        setMessage('');
    };

    return (
        <main className="h-screen w-full flex bg-[#FFFBEB] dark:bg-[#0F1111] text-gray-900 dark:text-gray-200 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-[#FEFCE8] dark:bg-[#191C1C] border-r border-yellow-200 dark:border-white/5 flex flex-col h-full overflow-hidden relative`}>
                <div className="p-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-violet-500 bg-clip-text text-transparent">LuminAI</h1>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-200 dark:bg-white/10 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-all group"
                        title="Collapse Sidebar"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                </div>

                <div className="px-4 py-2">
                    <button
                        onClick={() => dispatch(setCurrentChatId(null))}
                        className="w-full py-2.5 px-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/10 rounded-full flex items-center justify-between group transition-all duration-200"
                    >
                        <span className="text-sm font-semibold">New Thread</span>
                        <div className="w-5 h-5 flex items-center justify-center rounded-md border border-white/20 group-hover:border-white/40 text-xs font-bold text-gray-500 transition-colors">+</div>
                    </button>
                </div>

                <nav className="flex-1 mt-6 px-2 space-y-1 overflow-y-auto custom-scrollbar">
                    {[
                        { icon: '🏠', label: 'Home', active: true },
                    ].map((item) => (
                        <a
                            key={item.label}
                            href="#"
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${item.active ? 'bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white' : 'hover:bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white'}`}
                        >
                            <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">{item.icon}</span>
                            <span className="text-sm font-medium">{item.label}</span>
                        </a>
                    ))}

                    <div className="mt-10 px-3">
                        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Recently</h2>
                        <div className="space-y-1.5">
                            {Object.values(chats).map((chat, index) => (
                                <div
                                    key={chat._id}
                                    onClick={() => dispatch(setCurrentChatId(chat._id))}
                                    className={`text-[13px] p-2.5 rounded-lg cursor-pointer truncate transition-colors ${currentChatId === chat._id ? 'bg-yellow-100 dark:bg-white/10 text-yellow-900 dark:text-white' : 'text-gray-500 hover:bg-[#FFFBEB] dark:bg-white/5 hover:text-gray-700 dark:text-gray-300'}`}
                                >
                                    {chat.title}
                                </div>
                            ))}
                        </div>
                    </div>
                </nav>

                <div className="p-4 border-t border-yellow-200 dark:border-white/5 bg-[#FEFCE8] dark:bg-[#191C1C]">
                    <div className="flex items-center gap-3 p-2.5 hover:bg-yellow-100 dark:bg-white/5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-yellow-200 dark:border-white/5 group">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-violet-600 flex items-center justify-center text-sm font-bold text-gray-900 dark:text-white shadow-lg group-hover:scale-105 transition-transform">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold truncate group-hover:text-gray-900 dark:text-white transition-colors">{user?.username || 'User'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <section className="flex-1 flex flex-col items-center relative bg-[#FFFBEB] dark:bg-radial-gradient dark:bg-[#0F1111] h-screen overflow-hidden">
                {/* Floating Toggle Button (Visible when sidebar is closed) */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="absolute top-4 left-4 z-50 p-2.5 bg-gray-50 dark:bg-[#191C1C]/80 backdrop-blur-xl border border-gray-300 dark:border-white/10 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-white/5 transition-all shadow-2xl animate-fade-in group"
                        title="Expand Sidebar"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform duration-300">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                )}

                {/* Top Action Bar */}
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2 animate-fade-in">
                    {/* Theme Toggle Buttons */}
                    <div className="flex items-center gap-1 p-1 bg-white/50 dark:bg-[#191C1C]/80 backdrop-blur-xl border border-yellow-200 dark:border-white/10 rounded-xl shadow-lg">
                        <button 
                            onClick={setDarkTheme}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${theme === 'dark' ? 'bg-white/10 text-white shadow' : 'bg-transparent text-gray-500 hover:bg-yellow-100 dark:hover:bg-white/5'}`}
                        >
                            Dark
                        </button>
                        <button 
                            onClick={setLightTheme}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${theme === 'light' ? 'bg-white shadow border border-yellow-100 text-yellow-900' : 'bg-transparent text-gray-500 hover:bg-yellow-100 dark:hover:bg-white/5'}`}
                        >
                            Light
                        </button>
                    </div>

                    {currentChatId && (
                        <button
                            onClick={handleShare}
                            disabled={isSharing}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-[#191C1C]/80 backdrop-blur-xl border border-gray-300 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-white/5 transition-all shadow-2xl group"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`${isSharing ? 'animate-spin' : 'group-hover:scale-110'} transition-transform`}>
                                {isSharing ? (
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                ) : (
                                    <>
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                        <polyline points="16 6 12 2 8 6" />
                                        <line x1="12" y1="2" x2="12" y2="15" />
                                    </>
                                )}
                            </svg>
                            <span className="hidden sm:inline">{isSharing ? 'Creating Link...' : 'Share'}</span>
                        </button>
                    )}
                </div>

                {/* Messages Area */}
                <div className="w-full max-w-3xl flex-1 overflow-y-auto px-6 py-20 custom-scrollbar scroll-smooth">
                    {currentMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center gap-12 animate-fade-in">
                            <h2 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight text-center">
                                What do you want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-violet-500">know?</span>
                            </h2>
                            <div className="flex flex-wrap justify-center gap-3">
                                {['Build a neural network', 'Impact of Quantum Computing', 'Modern CSS Architecture', 'Philosophy of AI'].map(suggestion => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => setMessage(suggestion)}
                                        className="px-5 py-2 bg-[#1E2121] hover:bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:border-white/10 rounded-2xl text-[13px] font-semibold text-gray-600 dark:text-gray-400 hover:text-teal-400 transition-all shadow-lg hover:shadow-teal-500/10"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {currentMessages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-6 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-yellow-200 dark:border-white/10 ${msg.role === 'ai' ? 'bg-gradient-to-tr from-teal-500 to-violet-600' : 'bg-white dark:bg-white/5'}`}>
                                        <span className="text-xs font-bold text-gray-900 dark:text-white">{msg.role === 'ai' ? 'L' : user?.username?.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className={`flex-1 space-y-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
                                        <div className={`inline-block max-w-[90%] text-left ${msg.role === 'user' ? 'bg-[#FEFCE8] dark:bg-white/5 p-4 rounded-2xl border border-yellow-200 dark:border-white/10 shadow-lg' : ''}`}>
                                            {msg.role === 'ai' ? (
                                                msg.content ? (
                                                    <div className="markdown-content text-lg leading-relaxed text-gray-700 dark:text-gray-300 prose prose-invert max-w-none">
                                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    <div className="ai-msg">
                                                        <div className="spinner" /> Thinking...
                                                    </div>
                                                )
                                            ) : (
                                                <p className="text-lg leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-white font-medium">
                                                    {msg.content}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Bottom Input Area */}
                <div className="w-full max-w-3xl px-6 pb-10 pt-4 bg-gradient-to-t from-[#FFFBEB] via-[#FFFBEB] to-transparent dark:from-[#0F1111] dark:via-[#0F1111]">
                    <form
                        onSubmit={handleSendMessage}
                        className="w-full relative"
                    >
                        <div className="w-full bg-white dark:bg-[#1E2121]/80 backdrop-blur-xl rounded-3xl p-4 shadow-xl shadow-yellow-900/5 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus-within:border-yellow-400 dark:focus-within:border-white/20 border border-yellow-200 dark:border-transparent transition-all duration-300 flex flex-col gap-2">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ask LuminAI anything..."
                                className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none min-h-[60px] max-h-[200px] placeholder:text-gray-400 dark:placeholder:text-gray-600 scrollbar-hide font-medium text-gray-900 dark:text-gray-200"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                            />

                            <div className="flex items-center justify-end pt-2 border-t border-gray-200 dark:border-white/5">
                                <div className="flex items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={!message.trim()}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${message.trim()
                                            ? 'bg-teal-500 text-gray-900 dark:text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-105'
                                            : 'bg-gray-100 dark:bg-white/5 text-gray-600 cursor-not-allowed'
                                            }`}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 19V5M5 12l7-7 7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Aesthetic Footer Element (Hidden when many messages) */}
                {currentMessages.length < 3 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-5xl px-8 flex justify-between items-center opacity-10 pointer-events-none">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-teal-500"></div>
                        <div className="px-6 text-[9px] font-black uppercase tracking-[0.3em] text-teal-400">LuminAI Enterprise</div>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-violet-500"></div>
                    </div>
                )}
            </section>
        </main>
    );
};

export default Dashboard;

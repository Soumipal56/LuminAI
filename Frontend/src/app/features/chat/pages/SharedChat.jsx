import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getSharedChat } from '../service/chat.api';
import ReactMarkdown from 'react-markdown';

const SharedChat = () => {
    const { shareId } = useParams();
    const [shareData, setShareData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSharedChat = async () => {
            try {
                const data = await getSharedChat(shareId);
                setShareData(data.share);
            } catch (err) {
                setError(err.response?.data?.message || "Shared chat not found");
            } finally {
                setLoading(false);
            }
        };
        fetchSharedChat();
    }, [shareId]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#0F1111] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium">Loading shared chat...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#0F1111] text-white p-6 text-center">
                <div className="max-w-md">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-violet-500 bg-clip-text text-transparent">LuminAI</h1>
                    <p className="text-xl text-gray-300 mb-8">{error}</p>
                    <a href="/" className="px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-xl font-bold transition-all shadow-lg shadow-teal-500/20">Go to Dashboard</a>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen w-full bg-[#0F1111] text-gray-200 font-sans overflow-y-auto custom-scrollbar">
            {/* Header */}
            <header className="w-full border-b border-white/5 bg-[#191C1C]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-violet-500 bg-clip-text text-transparent">LuminAI</h1>
                        <div className="h-4 w-px bg-white/10"></div>
                        <span className="text-sm font-medium text-gray-400 truncate max-w-[200px] sm:max-w-md">{shareData.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/10">Shared Snapshot</span>
                        <a href="/" className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors hidden sm:block">Try LuminAI →</a>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 py-12 sm:py-20">
                <div className="mb-12 pb-12 border-b border-white/5">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">{shareData.title}</h2>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                            {shareData.user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-300">Shared by {shareData.user?.username || 'User'}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{new Date(shareData.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    {shareData.messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/10 ${msg.role === 'ai' ? 'bg-gradient-to-tr from-teal-500 to-violet-600' : 'bg-white/5'}`}>
                                <span className="text-xs font-bold text-white">{msg.role === 'ai' ? 'L' : shareData.user?.username?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className={`flex-1 space-y-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
                                <div className={`inline-block max-w-[90%] text-left ${msg.role === 'user' ? 'bg-white/5 p-4 rounded-2xl border border-white/10 shadow-lg' : ''}`}>
                                    {msg.role === 'ai' ? (
                                        <div className="markdown-content text-lg leading-relaxed text-gray-300 prose prose-invert max-w-none">
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-lg leading-relaxed whitespace-pre-wrap text-white font-medium">
                                            {msg.content}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to action */}
                <div className="mt-24 p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Want to ask your own questions?</h3>
                    <p className="text-gray-400 mb-8">Join LuminAI today and experience the power of advanced AI reasoning.</p>
                    <a href="/register" className="px-8 py-4 bg-teal-500 hover:bg-teal-600 rounded-2xl font-bold text-white transition-all shadow-xl shadow-teal-500/20 inline-block">Get Started for Free</a>
                </div>
            </div>

            <footer className="py-12 border-t border-white/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">LuminAI © 2026</p>
            </footer>
        </main>
    );
};

export default SharedChat;

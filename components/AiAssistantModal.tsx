import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Sender } from '../types';
import { geminiService } from '../services/geminiService';
import type { Chat } from '@google/genai';

// Using `declare` to tell TypeScript that `marked` is available globally
declare var marked: {
    parse(markdown: string): string;
};
declare var renderMathInElement: (element: HTMLElement, options?: any) => void;

interface AiAssistantModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const aiChat = useRef<Chat | null>(null);
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            aiChat.current = geminiService.createChat(
                "You are a helpful AI assistant for a machine learning course. Explain concepts clearly, concisely, and in a way that is easy for beginners to understand. Use markdown for formatting. For mathematical formulas, use LaTeX syntax enclosed in single dollar signs for inline math (e.g., $E=mc^2$) and double dollar signs for block math (e.g., $$L = \\frac{1}{2} \\rho v^2 S C_L$$)."
            );
             if (messages.length === 0) {
                setMessages([]);
            }
        }
    }, [isOpen]);
    
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
            if (typeof renderMathInElement === 'function') {
                renderMathInElement(chatHistoryRef.current, {
                     delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false},
                        {left: '\\(', right: '\\)', display: false},
                        {left: '\\[', right: '\\]', display: true}
                    ]
                });
            }
        }
    }, [messages]);

    const handleSendMessage = async (messageText?: string) => {
        const text = (messageText || input).trim();
        if (!text || isLoading) return;

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: Sender.USER,
            content: text,
        };
        
        const aiMessageId = `ai-${Date.now()}`;
        const aiMessagePlaceholder: ChatMessage = {
            id: aiMessageId,
            sender: Sender.AI,
            content: '',
            isLoading: true,
        };

        setMessages(prev => [...prev, userMessage, aiMessagePlaceholder]);
        setInput('');
        setIsLoading(true);

        let fullResponse = '';
        await geminiService.generateChatResponseStream(aiChat.current!, text, (chunk) => {
            fullResponse += chunk;
            setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId ? { ...msg, content: fullResponse, isLoading: true } : msg
            ));
        });

        setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, content: fullResponse, isLoading: false } : msg
        ));
        setIsLoading(false);
    };

    const quickButtons = [
        { label: '线性回归原理', message: '请解释线性回归的原理' },
        { label: '神经网络图', message: '用简单的语言描述一下神经网络的结构' },
        { label: '激活函数对比', message: '对比各种激活函数' }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold">🤖 AI学习助手</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div ref={chatHistoryRef} className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4 mb-4 min-h-[200px]">
                        {messages.length === 0 ? (
                             <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                <div className="text-4xl mb-2">🤖</div>
                                <p>你好！我是您的AI学习助手。</p>
                                <p className="text-sm mt-2">我可以帮您解答学习问题。</p>
                            </div>
                        ) : (
                            messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${msg.sender === Sender.USER ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}>
                                        <div className="text-sm prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: msg.isLoading ? msg.content + '...' : marked.parse(msg.content) }}></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex space-x-2">
                        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="请输入您的问题..."
                               className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-base" />
                        <button onClick={() => handleSendMessage()} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors" disabled={isLoading}>
                            发送
                        </button>
                    </div>
                     <div className="flex flex-wrap gap-2 mt-3">
                        {quickButtons.map(btn => (
                             <button key={btn.label} onClick={() => handleSendMessage(btn.message)}
                                    className="ai-quick-btn bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded-lg text-sm transition-colors">
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiAssistantModal;
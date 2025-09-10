
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import type { Chat } from '@google/genai';

type GameState = 'intro' | 'playing' | 'result';
type Participant = 'A' | 'B';

interface Conversation {
    author: 'user' | 'participant';
    text: string;
}

const humanResponses = [
    "I'm not sure, what do you think?",
    "That's an interesting question.",
    "Haha, that's funny.",
    "Let me think about that for a moment.",
    "I'm more of a cat person.",
    "The weather has been really nice lately, hasn't it?",
    "I could really go for some pizza right now.",
    "Can you ask me something else?",
];

const TuringTest: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('intro');
    const [aiParticipant, setAiParticipant] = useState<Participant>('A');
    const [conversations, setConversations] = useState<{ A: Conversation[], B: Conversation[] }>({ A: [], B: [] });
    const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
    const [userInput, setUserInput] = useState('');
    const [isResponding, setIsResponding] = useState(false);
    const [timer, setTimer] = useState(120);
    const [result, setResult] = useState<{ correct: boolean, guess: Participant } | null>(null);
    const timerInterval = useRef<NodeJS.Timeout | null>(null);
    const aiChat = useRef<Chat | null>(null);

    const startTest = useCallback(() => {
        setAiParticipant(Math.random() < 0.5 ? 'A' : 'B');
        setConversations({ A: [], B: [] });
        setCurrentParticipant(null);
        setResult(null);
        setTimer(120);
        setGameState('playing');
        
        aiChat.current = geminiService.createChat(
            "You are an AI participant in a Turing Test. Your goal is to convince the user that you are human. Answer questions naturally, with human-like brevity, personality, and occasional quirks. Don't be overly formal or perfect. Avoid revealing you are an AI."
        );

        timerInterval.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timerInterval.current!);
                    setGameState('result'); // End game when timer runs out
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const restartTest = useCallback(() => {
        if (timerInterval.current) clearInterval(timerInterval.current);
        setGameState('intro');
    }, []);
    
    useEffect(() => {
        return () => {
            if (timerInterval.current) clearInterval(timerInterval.current);
        };
    }, []);

    const handleSendMessage = async () => {
        if (!userInput.trim() || !currentParticipant || isResponding) return;

        const userMessage: Conversation = { author: 'user', text: userInput };
        setConversations(prev => ({
            ...prev,
            [currentParticipant]: [...prev[currentParticipant], userMessage],
        }));
        setUserInput('');
        setIsResponding(true);

        let responseText: string;
        if (currentParticipant === aiParticipant) {
            let fullResponse = '';
            await geminiService.generateChatResponseStream(aiChat.current!, userInput, (chunk) => {
              fullResponse += chunk;
            });
            responseText = fullResponse || "I'm not sure how to respond to that.";
        } else {
            await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
            responseText = humanResponses[Math.floor(Math.random() * humanResponses.length)];
        }

        const participantMessage: Conversation = { author: 'participant', text: responseText };
        setConversations(prev => ({
            ...prev,
            [currentParticipant]: [...prev[currentParticipant], participantMessage],
        }));
        setIsResponding(false);
    };

    const handleGuess = (guess: Participant) => {
        if (timerInterval.current) clearInterval(timerInterval.current);
        setResult({ correct: guess === aiParticipant, guess });
        setGameState('result');
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex justify-between items-center mb-3">
                <h5 className="font-semibold text-green-700 dark:text-green-400">🎭 图灵测试互动演示</h5>
                {gameState === 'intro' && (
                    <button onClick={startTest} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors">
                        开始测试
                    </button>
                )}
                 {gameState === 'result' && (
                    <button onClick={restartTest} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors">
                        重新测试
                    </button>
                )}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 min-h-[300px]">
                {gameState === 'intro' && (
                     <div className="text-center py-8">
                         <div className="text-4xl mb-4">🤖❓👤</div>
                         <h6 className="font-semibold mb-2">图灵测试挑战</h6>
                         <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                             你将与两个对话者交流，其中一个是人类，一个是AI。<br />
                             你能区分出哪个是机器吗？
                         </p>
                         <div className="text-xs text-gray-500 dark:text-gray-500">
                             💡 如果机器能让人类无法准确区分，就通过了图灵测试
                         </div>
                     </div>
                )}
                {gameState === 'playing' && (
                     <div>
                         <div className="grid grid-cols-2 gap-4 mb-4">
                            <div onClick={() => setCurrentParticipant('A')} className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${currentParticipant === 'A' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}>
                                 <div className="text-center">
                                     <div className="text-2xl mb-2">💬</div>
                                     <div className="font-semibold text-blue-600 dark:text-blue-400">对话者 A</div>
                                     <div className="text-xs text-gray-500 mt-1">点击与 A 对话</div>
                                 </div>
                             </div>
                             <div onClick={() => setCurrentParticipant('B')} className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${currentParticipant === 'B' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20'}`}>
                                 <div className="text-center">
                                     <div className="text-2xl mb-2">💬</div>
                                     <div className="font-semibold text-purple-600 dark:text-purple-400">对话者 B</div>
                                     <div className="text-xs text-gray-500 mt-1">点击与 B 对话</div>
                                 </div>
                             </div>
                         </div>
                         
                         {currentParticipant && (
                             <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[150px] mb-4">
                                 <div className="flex justify-between items-center mb-3">
                                     <span className="font-semibold">与对话者 {currentParticipant} 交流中</span>
                                     <button onClick={() => setCurrentParticipant(null)} className="text-gray-400 hover:text-gray-600 text-sm">关闭</button>
                                 </div>
                                 <div className="space-y-2 mb-4 max-h-[100px] overflow-y-auto custom-scrollbar">
                                    {conversations[currentParticipant].map((msg, index) => (
                                        <div key={index} className={`text-sm ${msg.author === 'user' ? 'text-right' : 'text-left'}`}>
                                            <span className={`inline-block px-2 py-1 rounded-lg ${msg.author === 'user' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                                {msg.text}
                                            </span>
                                        </div>
                                    ))}
                                    {isResponding && <div className="text-sm text-left"><span className="inline-block px-2 py-1 rounded-lg bg-gray-200 dark:bg-gray-600 loading-dots"></span></div>}
                                 </div>
                                 <div className="flex space-x-2">
                                     <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="输入你的问题..." 
                                            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm" disabled={isResponding}/>
                                     <button onClick={handleSendMessage} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm" disabled={isResponding}>发送</button>
                                 </div>
                             </div>
                         )}
                         
                         <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                             <h6 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-3">🎯 做出你的判断</h6>
                             <div className="grid grid-cols-2 gap-3 mb-3">
                                 <button onClick={() => handleGuess('A')} className="border-2 border-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20 p-2 rounded text-sm transition-colors">
                                     A 是机器
                                 </button>
                                 <button onClick={() => handleGuess('B')} className="border-2 border-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/20 p-2 rounded text-sm transition-colors">
                                     B 是机器
                                 </button>
                             </div>
                             <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                 💭 基于对话内容，你认为谁是AI？
                             </div>
                         </div>
                         
                         <div className="text-center mt-3">
                             <span className="text-sm text-gray-500">测试时间: <span id="testTimer">{formatTime(timer)}</span></span>
                         </div>
                     </div>
                )}
                {gameState === 'result' && result && (
                    <div className="text-center py-6">
                        <div className="text-4xl mb-3">{result.correct ? '🎉' : '🤔'}</div>
                        <h6 className="font-semibold mb-2">{result.correct ? '恭喜你，判断正确！' : '判断错误'}</h6>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            你猜 {result.guess} 是机器，而AI实际上是对话者 <strong>{aiParticipant}</strong>。
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4 text-left">
                            <div className="text-sm space-y-2">
                                <p><strong>分析:</strong> {result.correct ? `你成功地识别出了AI的特征。` : `AI成功地模拟了人类的对话行为，让你做出了错误的判断。这正是图灵测试的挑战所在！`}</p>
                                <p>图灵测试的核心在于评估机器是否能表现出与人类无法区分的智能行为，而不在于机器是否真正拥有意识。</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TuringTest;

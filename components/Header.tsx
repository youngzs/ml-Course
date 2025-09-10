
import React from 'react';

interface HeaderProps {
    completedChapters: Set<string>;
    totalChapters: number;
    onOpenAiAssistant: () => void;
}

const Header: React.FC<HeaderProps> = ({ completedChapters, totalChapters, onOpenAiAssistant }) => {
    const progress = Math.round((completedChapters.size / totalChapters) * 100);

    return (
        <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold text-primary">ML 基础课程</h1>
                        </div>
                        <div className="hidden md:block">
                            <div className="flex items-center space-x-4 text-sm">
                                <span className="text-gray-500 dark:text-gray-400">进度:</span>
                                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                                        style={{ width: `${progress}%` }}>
                                    </div>
                                </div>
                                <span className="text-gray-600 dark:text-gray-300">{progress}%</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onOpenAiAssistant}
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        🤖 AI助手
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;

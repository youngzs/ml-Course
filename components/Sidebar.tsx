
import React from 'react';
import { Chapter, ChapterId } from '../types';

interface SidebarProps {
    chapters: Chapter[];
    currentChapter: ChapterId;
    onSelectChapter: (chapterId: ChapterId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chapters, currentChapter, onSelectChapter }) => {
    return (
        <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">课程目录</h2>
                <nav className="space-y-2">
                    {chapters.map((chapter) => (
                        <button
                            key={chapter.id}
                            onClick={() => onSelectChapter(chapter.id)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${
                                currentChapter === chapter.id
                                    ? 'bg-primary text-white'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <div className="font-medium">{chapter.title}</div>
                            <div className={`text-sm ${currentChapter === chapter.id ? 'opacity-90' : 'text-gray-600 dark:text-gray-400'}`}>
                                {chapter.subtitle}
                            </div>
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;

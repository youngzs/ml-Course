
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChapterIntro from './components/ChapterIntro';
import ChapterLinearRegression from './components/ChapterLinearRegression';
import ChapterLogisticRegression from './components/ChapterLogisticRegression';
import ChapterNeuralNetwork from './components/ChapterNeuralNetwork';
import ChapterAdvanced from './components/ChapterAdvanced';
import AiAssistantModal from './components/AiAssistantModal';
import { ChapterId } from './types';
import { COURSE_CHAPTERS } from './constants';

const App: React.FC = () => {
    const [currentChapter, setCurrentChapter] = useState<ChapterId>(ChapterId.INTRO);
    const [completedChapters, setCompletedChapters] = useState<Set<ChapterId>>(() => new Set([ChapterId.INTRO]));
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    useEffect(() => {
      // Dark mode preference
      const darkModeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
          if (e.matches) {
              document.documentElement.classList.add('dark');
          } else {
              document.documentElement.classList.remove('dark');
          }
      };
      if (darkModeMatcher.matches) {
          document.documentElement.classList.add('dark');
      }
      darkModeMatcher.addEventListener('change', handleChange);
      return () => darkModeMatcher.removeEventListener('change', handleChange);
    }, []);

    const handleSelectChapter = (chapterId: ChapterId) => {
        setCompletedChapters(prev => new Set(prev).add(currentChapter));
        setCurrentChapter(chapterId);
    };

    const renderChapter = () => {
        switch (currentChapter) {
            case ChapterId.INTRO:
                return <ChapterIntro onNavigate={handleSelectChapter} />;
            case ChapterId.LINEAR:
                return <ChapterLinearRegression onNavigate={handleSelectChapter} />;
            case ChapterId.LOGISTIC:
                return <ChapterLogisticRegression onNavigate={handleSelectChapter} />;
            case ChapterId.NEURAL:
                return <ChapterNeuralNetwork onNavigate={handleSelectChapter} />;
            case ChapterId.ADVANCED:
                return <ChapterAdvanced onNavigate={handleSelectChapter} />;
            default:
                return <ChapterIntro onNavigate={handleSelectChapter} />;
        }
    };

    return (
        <>
            <Header 
                completedChapters={completedChapters}
                totalChapters={COURSE_CHAPTERS.length}
                onOpenAiAssistant={() => setIsAiModalOpen(true)} 
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <Sidebar
                        chapters={COURSE_CHAPTERS}
                        currentChapter={currentChapter}
                        onSelectChapter={setCurrentChapter}
                    />
                    <main className="flex-1 min-w-0">
                        {renderChapter()}
                    </main>
                </div>
            </div>
            <AiAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
        </>
    );
};

export default App;
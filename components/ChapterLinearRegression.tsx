
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChapterId } from '../types';
import type { Chart } from 'chart.js';
import { geminiService } from '../services/geminiService';

declare var mermaid: any;

interface ChapterLinearRegressionProps {
    onNavigate: (chapterId: ChapterId) => void;
}

const AiGeneratedContent: React.FC<{
    onGenerateImage: (prompt: string) => void;
    onGenerateDiagram: (prompt: string) => void;
}> = ({ onGenerateImage, onGenerateDiagram }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [contentType, setContentType] = useState<'image' | 'diagram' | null>(null);
    const [content, setContent] = useState<string | null>(null);
    const mermaidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentType === 'diagram' && content && mermaidRef.current) {
            try {
                mermaid.render('mermaid-graph', content, (svgCode: string) => {
                    if (mermaidRef.current) {
                        mermaidRef.current.innerHTML = svgCode;
                    }
                });
            } catch (e) {
                console.error("Mermaid render error:", e);
                if (mermaidRef.current) {
                    mermaidRef.current.innerText = "Error rendering diagram.";
                }
            }
        }
    }, [contentType, content]);


    const handleGeneration = async (type: 'image' | 'diagram', prompt: string) => {
        setIsLoading(true);
        setContentType(type);
        setContent(null);

        let result: string | null = null;
        if (type === 'image') {
            result = await geminiService.generateImage(prompt);
        } else {
            result = await geminiService.generateDiagramCode(prompt);
        }
        
        setContent(result);
        setIsLoading(false);
    };
    
    return (
        <div className="mb-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <button onClick={() => handleGeneration('image', 'A clear, educational diagram of linear regression showing data points and a best-fit line.')} className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl transition-colors">
                    🖼️ 生成线性回归示意图
                </button>
                <button onClick={() => handleGeneration('diagram', 'A flowchart illustrating the machine learning process from data collection to model deployment.')} className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl transition-colors">
                    📊 显示学习流程图
                </button>
            </div>
            {(isLoading || content) && (
                 <div className="mt-6">
                    {isLoading && (
                         <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">AI正在生成内容<span className="loading-dots"></span></p>
                        </div>
                    )}
                    {content && contentType === 'image' && (
                        <div className="text-center">
                            <img src={content} alt="AI生成的图片" className="max-w-full h-auto rounded-lg mx-auto shadow-lg" />
                        </div>
                    )}
                    {content && contentType === 'diagram' && (
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                           <div ref={mermaidRef} id="mermaid-container"></div>
                        </div>
                    )}
                    {!isLoading && !content && (
                        <div className="text-center text-red-500">内容生成失败，请稍后再试。</div>
                    )}
                </div>
            )}
        </div>
    );
};

const ChapterLinearRegression: React.FC<ChapterLinearRegressionProps> = ({ onNavigate }) => {
    // Quiz state
    const [answerCorrect, setAnswerCorrect] = useState<boolean|null>(null);

    const handleCheckAnswer = () => {
        const selected = document.querySelector('input[name="q1"]:checked') as HTMLInputElement;
        if (selected && selected.value === 'b') {
            setAnswerCorrect(true);
        } else {
            setAnswerCorrect(false);
        }
    };
    
    return (
         <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">第一章：线性回归与机器学习基本范式</h2>
            
             <div className="mb-8">
                 <h3 className="text-xl font-semibold mb-4">1.1 什么是线性回归？</h3>
                 <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-6">
                     <p className="mb-4">线性回归是机器学习中最基础的<strong>监督学习</strong>算法，属于回归类问题。它通过寻找输入特征与连续数值输出之间的线性关系来进行预测。</p>
                     
                     <div className="grid md:grid-cols-2 gap-6 mb-4">
                         <div>
                             <h5 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">🔢 一元线性回归</h5>
                             <div className="math-equation text-center text-lg bg-white dark:bg-gray-800 p-3 rounded-lg border">
                                 y = w₀ + w₁x + ε
                             </div>
                             <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">单个特征的简单线性关系</p>
                         </div>
                         <div>
                             <h5 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">📊 多元线性回归</h5>
                             <div className="math-equation text-center text-lg bg-white dark:bg-gray-800 p-3 rounded-lg border">
                                 y = w₀ + w₁x₁ + w₂x₂ + ... + wₙxₙ + ε
                             </div>
                             <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">多个特征的复合线性关系</p>
                         </div>
                     </div>
                     
                     <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                         <h5 className="font-semibold mb-2">📝 参数含义</h5>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                             <div><strong>w₀</strong>: 截距(偏置)</div>
                             <div><strong>w₁,w₂,...wₙ</strong>: 权重系数</div>
                             <div><strong>x₁,x₂,...xₙ</strong>: 输入特征</div>
                             <div><strong>ε</strong>: 误差项</div>
                         </div>
                     </div>
                 </div>
                 <AiGeneratedContent onGenerateImage={() => {}} onGenerateDiagram={() => {}} />
            </div>

            <div className="mb-8">
                 <h3 className="text-xl font-semibold mb-4">1.6 理解检验</h3>
                 <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                     <div className="quiz-question mb-4">
                         <p className="font-medium mb-3">问题：线性回归的目标是什么？</p>
                         <div className="space-y-2">
                             <label className="flex items-center space-x-2 cursor-pointer">
                                 <input type="radio" name="q1" value="a" className="text-primary focus:ring-primary"/>
                                 <span>A. 找到最复杂的模型</span>
                             </label>
                             <label className="flex items-center space-x-2 cursor-pointer">
                                 <input type="radio" name="q1" value="b" className="text-primary focus:ring-primary"/>
                                 <span>B. 最小化预测误差</span>
                             </label>
                             <label className="flex items-center space-x-2 cursor-pointer">
                                 <input type="radio" name="q1" value="c" className="text-primary focus:ring-primary"/>
                                 <span>C. 增加数据量</span>
                             </label>
                         </div>
                         <button onClick={handleCheckAnswer} className="mt-3 bg-primary text-white px-4 py-2 rounded-lg text-sm" disabled={answerCorrect === true}>
                            {answerCorrect === true ? '已答对' : '检查答案'}
                         </button>
                         {answerCorrect === true && (
                            <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-sm text-green-800 dark:text-green-200">
                                ✅ 正确！线性回归的目标是找到最佳的权重参数，使得预测值与真实值之间的误差最小。
                            </div>
                         )}
                         {answerCorrect === false && (
                            <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-sm text-red-800 dark:text-red-200">
                                ❌ 错误，再试一次。提示：模型的目标是更准确。
                            </div>
                         )}
                     </div>
                 </div>
             </div>

            <div className="flex justify-between">
                <button onClick={() => onNavigate(ChapterId.INTRO)} className="prev-chapter-btn bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">← 上一章</button>
                <button onClick={() => onNavigate(ChapterId.LOGISTIC)} className="next-chapter-btn bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg">下一章 →</button>
            </div>
        </section>
    );
};

export default ChapterLinearRegression;

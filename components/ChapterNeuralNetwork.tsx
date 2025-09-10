
import React, { useState, useEffect, useRef } from 'react';
import { ChapterId } from '../types';
import type { Chart, ChartConfiguration } from 'chart.js';
import { geminiService } from '../services/geminiService';

type ActivationFunction = 'sigmoid' | 'tanh' | 'relu' | 'leaky_relu';

// Helper component for Activation Function Chart
const ActivationFunctionChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);
    const [activeFunction, setActiveFunction] = useState<ActivationFunction>('sigmoid');

    const activationFunctions: Record<ActivationFunction, { fn: (x: number) => number, range: [number, number] }> = {
        sigmoid: { fn: x => 1 / (1 + Math.exp(-x)), range: [0, 1] },
        tanh: { fn: x => Math.tanh(x), range: [-1, 1] },
        relu: { fn: x => Math.max(0, x), range: [0, 5] },
        leaky_relu: { fn: x => x > 0 ? x : 0.1 * x, range: [-1, 5] },
    };
    
    const functionInfo: Record<ActivationFunction, {title: string, points: string[]}> = {
        sigmoid: { title: 'Sigmoid函数特点:', points: ['• 输出范围: (0, 1)', '• 平滑可导', '• 可能存在梯度消失问题'] },
        tanh: { title: 'Tanh函数特点:', points: ['• 输出范围: (-1, 1)', '• 零中心化', '• 比Sigmoid收敛更快'] },
        relu: { title: 'ReLU函数特点:', points: ['• 输出范围: [0, +∞)', '• 计算简单高效', '• 可能存在神经元死亡问题'] },
        leaky_relu: { title: 'Leaky ReLU函数特点:', points: ['• 输出范围: (-∞, +∞)', '• 解决神经元死亡问题', '• 负值时有小斜率'] }
    };

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (!ctx) return;

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const data = Array.from({ length: 101 }, (_, i) => (i - 50) / 10);
            const selectedFn = activationFunctions[activeFunction];
            
            const config: ChartConfiguration = {
                type: 'line',
                data: {
                    labels: data,
                    datasets: [{
                        label: activeFunction,
                        data: data.map(selectedFn.fn),
                        borderColor: '#8b5cf6',
                        tension: 0.1,
                        pointRadius: 0
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { min: -5, max: 5 },
                        y: { min: selectedFn.range[0], max: selectedFn.range[1] }
                    }
                }
            };
            chartInstance.current = new (window as any).Chart(ctx, config);
        }
        return () => chartInstance.current?.destroy();
    }, [activeFunction]);

    return (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">选择激活函数:</label>
                <select onChange={(e) => setActiveFunction(e.target.value as ActivationFunction)} value={activeFunction} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-base">
                    <option value="sigmoid">Sigmoid</option>
                    <option value="tanh">Tanh</option>
                    <option value="relu">ReLU</option>
                    <option value="leaky_relu">Leaky ReLU</option>
                </select>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <canvas ref={chartRef} width="400" height="300"></canvas>
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="font-medium mb-2">{functionInfo[activeFunction].title}</div>
                <ul className="text-sm space-y-1">
                    {functionInfo[activeFunction].points.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
            </div>
        </div>
    );
};

// Main chapter component
const ChapterNeuralNetwork: React.FC<{ onNavigate: (chapterId: ChapterId) => void }> = ({ onNavigate }) => {
    const [isLoadingDiagram, setIsLoadingDiagram] = useState(false);
    const [diagramUrl, setDiagramUrl] = useState<string | null>(null);
    const [diagramTitle, setDiagramTitle] = useState<string>('');

    const handleGenerateDiagram = async (method: 'decision_tree' | 'svm' | 'random_forest' | 'certificate') => {
        setIsLoadingDiagram(true);
        setDiagramUrl(null);

        let prompt = '';
        let title = '';
        switch (method) {
            case 'decision_tree':
                prompt = 'A clear, educational diagram of a decision tree structure, showing a root node, branches, internal nodes, and leaf nodes. Use a simple classification example like predicting if a fruit is an apple or an orange.';
                title = '决策树结构图';
                break;
            case 'svm':
                prompt = 'A clear, educational diagram explaining Support Vector Machines (SVM). Show two classes of data points, the optimal hyperplane (decision boundary), the margins, and the support vectors.';
                title = '支持向量机原理图';
                break;
            case 'random_forest':
                prompt = 'A clear, educational diagram of a Random Forest. Show multiple decision trees being trained on different subsets of data, and how their individual predictions are combined (e.g., by voting) to produce a final result.';
                title = '随机森林集成图';
                break;
            case 'certificate':
                prompt = 'A beautiful, formal-looking certificate of completion for an "Interactive Machine Learning Basics" course. It should have a placeholder for a name, "Completion Date", decorative borders, and a seal of excellence.';
                title = '课程学习证书';
                break;
        }

        setDiagramTitle(title);
        const result = await geminiService.generateImage(prompt);
        setDiagramUrl(result);
        setIsLoadingDiagram(false);
    };

    return (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">第三章：人工神经网络及其他经典方法</h2>
            
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">3.1 神经网络基础</h3>
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-6 rounded-xl mb-6">
                    <p className="mb-4">人工神经网络受生物神经元启发，通过多层非线性变换学习复杂的数据模式。</p>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">🔗</div>
                            <div className="font-semibold">神经元</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">基本计算单元</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">🕸️</div>
                            <div className="font-semibold">网络层</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">神经元组合</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">⚡</div>
                            <div className="font-semibold">激活函数</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">非线性变换</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">3.2 激活函数对比</h3>
                <ActivationFunctionChart />
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">3.3 其他经典机器学习方法</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl">
                        <h4 className="font-semibold mb-3 text-green-800 dark:text-green-300">决策树</h4>
                        <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                            <li>• 易于理解和解释</li>
                            <li>• 处理类别型特征</li>
                            <li>• 可能过拟合</li>
                        </ul>
                        <button onClick={() => handleGenerateDiagram('decision_tree')} className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                            生成结构图
                        </button>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl">
                        <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-300">支持向量机</h4>
                        <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                            <li>• 最大间隔分类器</li>
                            <li>• 核技巧处理非线性</li>
                            <li>• 对异常值敏感</li>
                        </ul>
                        <button onClick={() => handleGenerateDiagram('svm')} className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                            生成原理图
                        </button>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl">
                        <h4 className="font-semibold mb-3 text-purple-800 dark:text-purple-300">随机森林</h4>
                        <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                            <li>• 集成多个决策树</li>
                            <li>• 减少过拟合</li>
                            <li>• 特征重要性评估</li>
                        </ul>
                        <button onClick={() => handleGenerateDiagram('random_forest')} className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                            生成集成图
                        </button>
                    </div>
                </div>
            </div>

            {(isLoadingDiagram || diagramUrl) && (
                <div className="mb-8">
                     <h3 className="text-xl font-semibold mb-4">AI 生成的内容: {diagramTitle}</h3>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl text-center">
                        {isLoadingDiagram && (
                            <div className="py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">AI正在生成内容<span className="loading-dots"></span></p>
                            </div>
                        )}
                        {diagramUrl && (
                             <img src={diagramUrl} alt={diagramTitle} className="max-w-full h-auto rounded-lg mx-auto shadow-lg" />
                        )}
                        {!isLoadingDiagram && !diagramUrl && (
                             <p className="text-red-500">内容生成失败，请稍后再试。</p>
                        )}
                    </div>
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">3.4 课程总结</h3>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-6 rounded-xl">
                    <div className="text-center mb-6">
                        <h4 className="text-lg font-semibold mb-2">🎉 恭喜完成机器学习基础课程！</h4>
                        <p className="text-gray-600 dark:text-gray-400">您已经掌握了机器学习的核心概念和经典算法</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                            <div className="text-2xl mb-2">📈</div>
                            <div className="font-medium">线性回归</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">回归问题基础</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl mb-2">🎯</div>
                            <div className="font-medium">逻辑回归</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">分类问题解决</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl mb-2">🧠</div>
                            <div className="font-medium">神经网络</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">深度学习入门</div>
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <button onClick={() => handleGenerateDiagram('certificate')} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105">
                            🏆 生成学习证书
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button onClick={() => onNavigate(ChapterId.LOGISTIC)} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">← 上一章</button>
                <button onClick={() => onNavigate(ChapterId.ADVANCED)} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg">下一章 →</button>
            </div>
        </section>
    );
};

export default ChapterNeuralNetwork;
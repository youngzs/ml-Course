
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChapterId } from '../types';
import type { Chart, ChartConfiguration, ChartData } from 'chart.js';

// --- Interactive Demo for Ensemble Learning (Random Forest) ---
const EnsembleDemo: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);
    const [numTrees, setNumTrees] = useState<number>(5);
    const [isTrained, setIsTrained] = useState<boolean>(false);
    const [data, setData] = useState<{ class0: any[], class1: any[] }>({ class0: [], class1: [] });

    const generateData = useCallback(() => {
        setIsTrained(false);
        const class0 = Array.from({ length: 40 }, () => ({ x: Math.random() * 10, y: Math.random() * 4 + Math.sin(Math.random() * 10) * 2 + 1 }));
        const class1 = Array.from({ length: 40 }, () => ({ x: Math.random() * 10, y: Math.random() * 4 + Math.sin(Math.random() * 10) * 2 + 6 }));
        setData({ class0, class1 });
    }, []);

    useEffect(() => {
        generateData();
    }, [generateData]);

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const chartData: ChartData = {
            datasets: [
                { label: '类别 0', data: data.class0, backgroundColor: '#3b82f6', type: 'scatter' },
                { label: '类别 1', data: data.class1, backgroundColor: '#ef4444', type: 'scatter' },
            ]
        };

        if (isTrained) {
            const boundaryPoints = [];
            for (let i = 0; i <= 10; i += 0.1) {
                // The boundary becomes more complex with more trees
                const y = 5 + Math.sin(i * numTrees / 10) * (10 / (numTrees + 5));
                boundaryPoints.push({ x: i, y });
            }
            (chartData.datasets as any[]).push({
                label: '决策边界',
                data: boundaryPoints,
                borderColor: '#10b981',
                borderWidth: 3,
                type: 'line',
                pointRadius: 0,
                fill: false,
                tension: 0.4,
            });
        }

        chartInstance.current = new (window as any).Chart(ctx, {
            type: 'scatter',
            data: chartData,
            options: {
                scales: { x: { min: 0, max: 10 }, y: { min: 0, max: 12 } },
                plugins: { legend: { position: 'bottom' } }
            }
        });

    }, [data, isTrained, numTrees]);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mt-4">
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <button onClick={generateData} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">生成新数据</button>
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="numTrees" className="block text-sm font-medium">决策树数量: {numTrees}</label>
                    <input id="numTrees" type="range" min="1" max="50" value={numTrees} onChange={e => setNumTrees(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                </div>
                <button onClick={() => setIsTrained(true)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">训练模型</button>
            </div>
            <canvas ref={chartRef} height="200"></canvas>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">观察决策树数量如何影响决策边界的平滑度。树越多，模型越能捕捉复杂模式，但也要小心过拟合！</p>
        </div>
    );
};


// --- Interactive Demo for PCA ---
const PcaDemo: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [showPca, setShowPca] = useState(false);

    const generateData = useCallback(() => {
        setShowPca(false);
        const points = Array.from({ length: 50 }, () => {
            const r = Math.random() * 4;
            const theta = Math.PI / 4; // 45 degrees
            const noiseX = (Math.random() - 0.5) * 2;
            const noiseY = (Math.random() - 0.5) * 2;
            return {
                x: 5 + r * Math.cos(theta) + noiseX,
                y: 5 + r * Math.sin(theta) + noiseY,
            };
        });
        setData(points);
    }, []);
    
    useEffect(() => {
        generateData();
    }, [generateData]);

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        
        const chartData: ChartData = {
            datasets: [{ label: '原始数据', data, backgroundColor: '#6366f1', type: 'scatter' }]
        };
        
        if (showPca) {
            // Pre-calculated for this specific data generation pattern
            const pc1 = { x1: 2, y1: 2, x2: 10, y2: 10 }; 
            const projectedData = data.map(p => {
                const proj = ((p.x - 5) + (p.y - 5)) / 2;
                return { x: 5 + proj, y: 5 + proj };
            });

            (chartData.datasets as any[]).push(
                { label: '主成分1 (PC1)', data: [{x: pc1.x1, y: pc1.y1}, {x: pc1.x2, y: pc1.y2}], borderColor: '#f59e0b', borderWidth: 2, type: 'line', pointRadius: 0, fill: false },
                { label: '投影数据', data: projectedData, backgroundColor: '#f59e0b', type: 'scatter' }
            );
        }

        chartInstance.current = new (window as any).Chart(ctx, {
            type: 'scatter',
            data: chartData,
            options: {
                scales: { x: { min: 0, max: 12 }, y: { min: 0, max: 12 } },
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }, [data, showPca]);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mt-4">
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <button onClick={generateData} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">生成新数据</button>
                <button onClick={() => setShowPca(true)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">应用PCA</button>
            </div>
            <canvas ref={chartRef} height="200"></canvas>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">PCA找到数据方差最大的方向（橙色线），并将数据投影到这个新轴上，实现降维。</p>
        </div>
    );
};

// --- Interactive Demo for K-Means Clustering ---
const KMeansDemo: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);
    const [k, setK] = useState<number>(3);
    const [data, setData] = useState<any[]>([]);
    const [centroids, setCentroids] = useState<any[]>([]);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const generateData = useCallback(() => {
        setIsAnimating(false);
        const clusters = Array.from({ length: k }, () => ({
            cx: Math.random() * 8 + 1,
            cy: Math.random() * 8 + 1,
        }));
        const points = [];
        for (let i = 0; i < 80; i++) {
            const cluster = clusters[i % k];
            points.push({
                x: cluster.cx + (Math.random() - 0.5) * 3,
                y: cluster.cy + (Math.random() - 0.5) * 3,
                cluster: -1,
            });
        }
        setData(points);
        // Initialize centroids
        const initialCentroids = [];
        for (let i = 0; i < k; i++) {
            initialCentroids.push({ x: Math.random() * 10, y: Math.random() * 10 });
        }
        setCentroids(initialCentroids);
    }, [k]);
    
    useEffect(() => {
        generateData();
    }, [k, generateData]);

    const runStep = () => {
        // 1. Assign points to closest centroid
        const newData = data.map(point => {
            let minDist = Infinity;
            let closestK = -1;
            centroids.forEach((centroid, i) => {
                const dist = Math.sqrt(Math.pow(point.x - centroid.x, 2) + Math.pow(point.y - centroid.y, 2));
                if (dist < minDist) {
                    minDist = dist;
                    closestK = i;
                }
            });
            return { ...point, cluster: closestK };
        });
        setData(newData);

        // 2. Update centroids
        setTimeout(() => {
            const newCentroids = Array.from({ length: k }, () => ({ x: 0, y: 0, count: 0 }));
            newData.forEach(point => {
                if (point.cluster !== -1) {
                    newCentroids[point.cluster].x += point.x;
                    newCentroids[point.cluster].y += point.y;
                    newCentroids[point.cluster].count++;
                }
            });
            setCentroids(newCentroids.map(c => c.count > 0 ? { x: c.x / c.count, y: c.y / c.count } : { x: Math.random() * 10, y: Math.random() * 10 }));
        }, 500);
    };

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;
        if (chartInstance.current) chartInstance.current.destroy();

        const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
        const datasets = [];
        
        // Data points by cluster
        for (let i = 0; i < k; i++) {
            datasets.push({
                label: `簇 ${i + 1}`,
                data: data.filter(p => p.cluster === i),
                backgroundColor: colors[i % colors.length] + '80', // semi-transparent
                type: 'scatter'
            });
        }
        // Unassigned points
        datasets.push({ label: '未分配', data: data.filter(p => p.cluster === -1), backgroundColor: '#9ca3af', type: 'scatter' });
        
        // Centroids
        datasets.push({
            label: '中心点',
            data: centroids,
            backgroundColor: colors.slice(0, k),
            pointStyle: 'crossRot',
            radius: 10,
            borderWidth: 3,
            type: 'scatter'
        });

        chartInstance.current = new (window as any).Chart(ctx, {
            type: 'scatter',
            data: { datasets },
            options: {
                scales: { x: { min: 0, max: 10 }, y: { min: 0, max: 10 } },
                plugins: { legend: { display: false } }
            }
        });
    }, [data, centroids, k]);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mt-4">
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <button onClick={generateData} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">生成新数据</button>
                 <div className="flex-1 min-w-[150px]">
                    <label htmlFor="kValue" className="block text-sm font-medium">聚类数 (K): {k}</label>
                    <input id="kValue" type="range" min="2" max="5" value={k} onChange={e => setK(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                </div>
                <button onClick={runStep} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">执行一步</button>
            </div>
            <canvas ref={chartRef} height="200"></canvas>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">"执行一步"会先将点分配给最近的中心点（颜色变化），然后移动中心点到其簇成员的平均位置。</p>
        </div>
    );
};


const ChapterAdvanced: React.FC<{ onNavigate: (chapterId: ChapterId) => void }> = ({ onNavigate }) => {
    return (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">第四章：机器学习进阶</h2>
            
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">4.1 集成学习 (Ensemble Learning)</h3>
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-6 rounded-xl mb-6">
                    <p className="mb-4">集成学习通过构建并结合多个学习器来完成学习任务，常能获得比单一学习器更显著的性能优势。"三个臭皮匠，顶个诸葛亮"正是其核心思想的体现。</p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
                            <h4 className="font-semibold text-teal-700 dark:text-teal-400 mb-2">主要方法</h4>
                            <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                                <li>• <strong>Bagging (装袋):</strong> 并行训练多个学习器，如随机森林。</li>
                                <li>• <strong>Boosting (提升):</strong> 串行训练学习器，后者关注前者错误。</li>
                            </ul>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
                             <h4 className="font-semibold text-cyan-700 dark:text-cyan-400 mb-2">优点</h4>
                            <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                                <li>• 显著提升模型准确率和稳定性。</li>
                                <li>• 有效降低过拟合风险。</li>
                            </ul>
                        </div>
                    </div>
                    <EnsembleDemo />
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">4.2 降维 (Dimensionality Reduction)</h3>
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl mb-6">
                    <p className="mb-4">当数据特征维度非常高时，会引发"维度灾难"。降维旨在用一组低维度的特征来表示数据，同时保留其内在结构和重要信息。</p>
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
                        <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">主成分分析 (PCA)</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">PCA是一种广泛应用的线性降维方法。它通过寻找数据方差最大的方向（主成分），将原始数据投影到新的低维空间中。</p>
                    </div>
                    <PcaDemo />
                </div>
            </div>
            
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">4.3 聚类 (Clustering)</h3>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-xl mb-6">
                    <p className="mb-4">聚类是一种<strong>无监督学习</strong>任务，目标是将数据集中的样本划分为若干个不相交的子集（簇），使得同一簇内的样本相似度高，而不同簇的样本相似度低。</p>
                     <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
                        <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">K-Means 算法</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">K-Means 是最经典的聚类算法之一。它通过迭代的方式寻找K个簇的中心，并将每个样本分配到最近的中心点所在的簇。</p>
                    </div>
                    <KMeansDemo />
                </div>
            </div>
            
            <div className="text-center mb-8 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                 <h4 className="text-lg font-semibold mb-2">🚀 继续探索！</h4>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    您已完成所有基础和进阶章节！机器学习领域博大精深，希望本课程能为您打开一扇通往数据科学世界的大门。
                </p>
            </div>

            <div className="flex justify-between">
                <button onClick={() => onNavigate(ChapterId.NEURAL)} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">← 上一章</button>
                <button onClick={() => onNavigate(ChapterId.INTRO)} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg">完成课程</button>
            </div>
        </section>
    );
};

export default ChapterAdvanced;


import React, { useEffect, useRef, useState } from 'react';
import { ChapterId } from '../types';
import type { Chart, ChartConfiguration } from 'chart.js';
import { geminiService } from '../services/geminiService';

interface Point {
    x: number;
    y: number;
}

const ChapterLogisticRegression: React.FC<{ onNavigate: (chapterId: ChapterId) => void }> = ({ onNavigate }) => {
    const sigmoidChartRef = useRef<HTMLCanvasElement>(null);
    const classificationChartRef = useRef<HTMLCanvasElement>(null);
    const sigmoidChartInstance = useRef<Chart | null>(null);
    const classificationChartInstance = useRef<Chart | null>(null);

    const [classificationData, setClassificationData] = useState<{ class0: Point[], class1: Point[] }>({ class0: [], class1: [] });
    const [modelTrained, setModelTrained] = useState(false);

    useEffect(() => {
        // Draw Sigmoid Chart
        if (sigmoidChartRef.current) {
            if (sigmoidChartInstance.current) {
                sigmoidChartInstance.current.destroy();
            }
            const ctx = sigmoidChartRef.current.getContext('2d');
            if (ctx) {
                const data = Array.from({ length: 121 }, (_, i) => (i - 60) / 10);
                const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
                
                sigmoidChartInstance.current = new (window as any).Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data,
                        datasets: [{
                            label: 'Sigmoid Function',
                            data: data.map(sigmoid),
                            borderColor: '#8b5cf6',
                            tension: 0.1,
                            pointRadius: 0,
                        }]
                    },
                    options: {
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { title: { display: true, text: 'z' } },
                            y: { title: { display: true, text: 'σ(z)' }, min: 0, max: 1 }
                        }
                    }
                });
            }
        }

        // Cleanup charts on component unmount
        return () => {
            sigmoidChartInstance.current?.destroy();
            classificationChartInstance.current?.destroy();
        };
    }, []);

    const generateClassificationData = () => {
        setModelTrained(false);
        const class0 = Array.from({ length: 30 }, () => ({ x: Math.random() * 4 + 1, y: Math.random() * 4 + 1 }));
        const class1 = Array.from({ length: 30 }, () => ({ x: Math.random() * 4 + 5, y: Math.random() * 4 + 5 }));
        setClassificationData({ class0, class1 });
    };

    const trainModel = () => {
        if (classificationData.class0.length === 0) return;
        setModelTrained(true);
    };

    useEffect(() => {
        if (classificationChartRef.current) {
             if (classificationChartInstance.current) {
                classificationChartInstance.current.destroy();
            }
            const ctx = classificationChartRef.current.getContext('2d');
            if (ctx) {
                const config: ChartConfiguration = {
                    type: 'scatter',
                    data: {
                        datasets: [
                            { label: '类别 0', data: classificationData.class0, backgroundColor: '#3b82f6' },
                            { label: '类别 1', data: classificationData.class1, backgroundColor: '#ef4444' },
                        ]
                    },
                    options: {
                        scales: { x: { min: 0, max: 10 }, y: { min: 0, max: 10 } }
                    }
                };

                if (modelTrained) {
                    (config.data.datasets as any[]).push({
                        type: 'line',
                        label: '决策边界',
                        data: [{x: 0, y: 10}, {x: 10, y: 0}],
                        borderColor: 'black',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    });
                }
                
                classificationChartInstance.current = new (window as any).Chart(ctx, config);
            }
        }
    }, [classificationData, modelTrained]);


    return (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">第二章：逻辑回归与分类问题</h2>
            
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">2.1 从回归到分类</h3>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl mb-6">
                    <p className="mb-4">逻辑回归虽然名字带"回归"，但实际上是用于<strong>分类问题</strong>的算法。它使用Sigmoid函数将线性输出映射到[0,1]区间，表示概率。</p>
                    <div className="math-equation text-center text-lg bg-white dark:bg-gray-800 p-4 rounded-lg border overflow-x-auto">
                        P(y=1|x) = σ(z) = 1 / (1 + e<sup>-z</sup>)
                    </div>
                     <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">其中 z = w₀ + w₁x₁ + ... + wₙxₙ</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">2.2 Sigmoid函数特性</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
                        <canvas ref={sigmoidChartRef} width="400" height="300"></canvas>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded text-center">
                            <div className="font-semibold text-primary">输出范围</div>
                            <div>(0, 1)</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded text-center">
                            <div className="font-semibold text-primary">S形曲线</div>
                            <div>平滑过渡</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded text-center">
                            <div className="font-semibold text-primary">决策阈值</div>
                            <div>通常0.5</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded text-center">
                            <div className="font-semibold text-primary">概率解释</div>
                            <div>直接输出</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">2.3 决策边界演示</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                    <div className="mb-4">
                        <button onClick={generateClassificationData} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mr-4">生成数据</button>
                        <button onClick={trainModel} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">训练模型</button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <canvas ref={classificationChartRef} width="400" height="300"></canvas>
                    </div>
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        🎯 蓝色和红色点代表两个不同的类别，黑色线是模型学习到的决策边界。
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button onClick={() => onNavigate(ChapterId.LINEAR)} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">← 上一章</button>
                <button onClick={() => onNavigate(ChapterId.NEURAL)} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg">下一章 →</button>
            </div>
        </section>
    );
};

export default ChapterLogisticRegression;

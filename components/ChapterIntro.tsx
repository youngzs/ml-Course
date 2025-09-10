
import React from 'react';
import TuringTest from './TuringTest';
import { ChapterId } from '../types';

interface ChapterIntroProps {
    onNavigate: (chapterId: ChapterId) => void;
}

const ChapterIntro: React.FC<ChapterIntroProps> = ({ onNavigate }) => {
    
    const timelineEvents = [
        { year: "1946", color: "blue", title: "第一台计算机诞生", description: "ENIAC（电子数值积分计算机）问世，标志着现代计算机时代的开始，为人工智能的发展奠定了硬件基础。" },
        { year: "1950", color: "green", title: "图灵测试提出", description: "艾伦·图灵提出\"图灵测试\"，为评估机器智能提供了重要标准，被誉为人工智能理论的奠基石。", isInteractive: true },
        { year: "1956", color: "purple", title: "达特茅斯会议", description: "\"人工智能\"一词正式诞生，达特茅斯会议标志着AI作为一门独立学科的建立，开启了AI研究的新纪元。" },
        { year: "1970s", color: "gray", title: "AI遇冷（第一次AI寒冬）", description: "由于技术限制和过度乐观的预期，AI研究遭遇资金削减，进入低潮期，被称为\"AI寒冬\"。" },
        { year: "1980s", color: "red", title: "AI在医疗的应用", description: "专家系统兴起，AI开始在医疗诊断、药物发现等领域展现实用价值，重新获得关注和投资。" },
        { year: "1997", color: "indigo", title: "深蓝战胜象棋冠军", description: "IBM深蓝击败世界象棋冠军卡斯帕罗夫，首次证明了机器在复杂策略游戏中可以超越人类。" },
        { year: "2000s", color: "yellow", title: "机器学习：预测与分类", description: "支持向量机、随机森林等算法成熟，机器学习在数据挖掘、推荐系统等领域广泛应用。" },
        { year: "2012", color: "cyan", title: "深度学习崛起 & ImageNet", description: "AlexNet在ImageNet比赛中取得突破性成果，深度学习重新定义了计算机视觉和AI的发展轨迹。" },
        { year: "2016", color: "pink", title: "AlphaGo战胜李世石、柯洁", description: "DeepMind的AlphaGo在围棋领域击败人类顶尖棋手，展示了深度强化学习的巨大潜力。" },
        { year: "2020s", color: "orange", title: "大模型时代", description: "GPT、BERT等大型语言模型出现，ChatGPT引发AI应用热潮，人工智能进入新的发展阶段。" },
    ];

    const colorClasses: { [key: string]: string } = {
        blue: "bg-blue-500 text-blue-600 dark:text-blue-400",
        green: "bg-green-500 text-green-600 dark:text-green-400",
        purple: "bg-purple-500 text-purple-600 dark:text-purple-400",
        gray: "bg-gray-500 text-gray-600 dark:text-gray-400",
        red: "bg-red-500 text-red-600 dark:text-red-400",
        indigo: "bg-indigo-500 text-indigo-600 dark:text-indigo-400",
        yellow: "bg-yellow-500 text-yellow-600 dark:text-yellow-400",
        cyan: "bg-cyan-500 text-cyan-600 dark:text-cyan-400",
        pink: "bg-pink-500 text-pink-600 dark:text-pink-400",
        orange: "bg-orange-500 text-orange-600 dark:text-orange-400",
    };

    return (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">机器学习基础互动课程</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    欢迎来到机器学习的奇妙世界！本课程将通过可视化和互动方式，带您深入了解机器学习的核心概念和经典算法。
                </p>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-center mb-6">🕒 人工智能发展史</h2>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl">
                    <div className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded"></div>
                        <div className="space-y-8">
                            {timelineEvents.map(event => (
                                <div key={event.year} className="flex items-start space-x-6">
                                    <div className={`flex-shrink-0 w-16 h-16 ${colorClasses[event.color].split(' ')[0]} rounded-full flex items-center justify-center text-white font-bold relative z-10`}>
                                        {event.year}
                                    </div>
                                    <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                        <h4 className={`font-bold ${colorClasses[event.color].split(' ').slice(1).join(' ')}`}>{event.title}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{event.description}</p>
                                        {event.isInteractive && <TuringTest />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl">
                    <div className="text-3xl mb-4">📊</div>
                    <h3 className="font-semibold mb-2">可视化学习</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">通过图表和动画直观理解算法原理</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl">
                    <div className="text-3xl mb-4">🎮</div>
                    <h3 className="font-semibold mb-2">互动练习</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">调整参数，观察模型行为变化</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl">
                    <div className="text-3xl mb-4">🤖</div>
                    <h3 className="font-semibold mb-2">AI助手</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">随时获得个性化解答和图表生成</p>
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <h3 className="font-semibold mb-4">课程内容概览</h3>
                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                        <div>
                            <h4 className="font-medium">线性回归与基本范式</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">学习机器学习的基本思想，通过线性回归理解监督学习的核心流程</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                        <div>
                            <h4 className="font-medium">逻辑回归与分类问题</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">深入分类算法，理解概率模型和决策边界</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                        <div>
                            <h4 className="font-medium">神经网络与深度学习</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">探索人工神经网络的结构和其他经典机器学习方法</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-8">
                <button onClick={() => onNavigate(ChapterId.LINEAR)} className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition-colors">
                    开始学习 →
                </button>
            </div>
        </section>
    );
};

export default ChapterIntro;


import { Chapter, ChapterId } from './types';

export const COURSE_CHAPTERS: Chapter[] = [
  {
    id: ChapterId.INTRO,
    title: '课程介绍',
    subtitle: '机器学习概述',
  },
  {
    id: ChapterId.LINEAR,
    title: '1. 线性回归',
    subtitle: '基本范式与实例',
  },
  {
    id: ChapterId.LOGISTIC,
    title: '2. 逻辑回归',
    subtitle: '分类问题解决',
  },
  {
    id: ChapterId.NEURAL,
    title: '3. 神经网络',
    subtitle: '深度学习基础',
  },
  {
    id: ChapterId.ADVANCED,
    title: '4. 机器学习进阶',
    subtitle: '集成与无监督学习',
  }
];
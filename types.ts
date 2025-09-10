
export enum ChapterId {
  INTRO = 'intro',
  LINEAR = 'linear',
  LOGISTIC = 'logistic',
  NEURAL = 'neural',
  ADVANCED = 'advanced',
}

export interface Chapter {
  id: ChapterId;
  title: string;
  subtitle: string;
}

export enum Sender {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  content: string;
  isLoading?: boolean;
}
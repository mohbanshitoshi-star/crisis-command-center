export type NavigationTab = 
  | 'chat'
  | 'crisis'
  | 'decision'
  | 'solver'
  | 'database'
  | 'spark'
  | 'students'
  | 'images'
  | 'videos'
  | 'library'
  | 'labs'
  | 'notebook';

export type GeminiModelId = 
  | 'gemini-3.1-pro-preview'
  | 'gemini-3.5-flash'
  | 'gemini-3.1-flash-lite'
  | 'gemini-3.8-flash';

export type AgentPerspective = 'tactical' | 'crisis' | 'stem' | 'code' | 'executive' | 'balanced';

export interface AgentParameters {
  perspective: AgentPerspective;
  temperature: number;
  depth: 'detailed' | 'concise';
  verifiedCheck: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  perspective?: AgentPerspective;
  thinkingProcess?: string;
  sources?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: Message[];
}

export interface TacticalNode {
  id: string;
  name: string;
  sector: string;
  x: number;
  y: number;
  status: 'nominal' | 'elevated' | 'critical';
  latency: number;
  traffic: number;
  threatScore: number;
}

export interface TacticalLog {
  id: string;
  timestamp: string;
  severity: 'INFO' | 'WARN' | 'EXEC' | 'CRIT';
  source: string;
  message: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  mastered: boolean;
}

export interface GeneratedImageItem {
  id: string;
  prompt: string;
  url: string;
  aspectRatio: string;
  model: string;
  createdAt: string;
}

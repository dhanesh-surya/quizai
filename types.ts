export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard"
}

export type Language = 'en' | 'hi';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizData {
  topic: string;
  difficulty: Difficulty;
  questions: Question[];
}

export interface QuizResult {
  id: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  topic: string;
  difficulty: Difficulty;
  date: string;
  language?: Language;
  details?: any; // To store full question/answer details for review
}

export type GameState = 'input' | 'loading' | 'quiz' | 'result';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string | null;
  history: QuizResult[];
}

export type AppView = 'auth' | 'home' | 'profile' | 'admin';
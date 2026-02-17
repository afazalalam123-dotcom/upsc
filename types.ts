
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  AI_TUTOR = 'AI_TUTOR',
  MAINS_EVALUATOR = 'MAINS_EVALUATOR',
  CURRENT_AFFAIRS = 'CURRENT_AFFAIRS',
  PRACTICE_ZONE = 'PRACTICE_ZONE',
  STUDY_PLANNER = 'STUDY_PLANNER',
  MOCK_TEST = 'MOCK_TEST'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface EvaluationResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  modelAnswerSummary: string;
}

export interface StudyPlanParams {
  hoursPerDay: number;
  durationWeeks: number;
  focusTopics: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface MockTestResult {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  subjectBreakdown: Record<string, number>;
}

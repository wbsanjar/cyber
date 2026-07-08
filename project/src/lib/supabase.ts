import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'citizen' | 'police' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  created_at: string;
}

export interface FraudReport {
  id: string;
  user_id: string;
  fraud_type: string;
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'investigating' | 'resolved' | 'rejected';
  risk_score: number;
  evidence: string[];
  created_at: string;
}

export interface ScamAlert {
  id: string;
  title: string;
  description: string;
  scam_type: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language: 'hi' | 'en' | 'hinglish';
  created_at: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  quiz_questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

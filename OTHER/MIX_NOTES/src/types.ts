export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Language = 'cpp' | 'python' | 'sql';

export interface Example {
  title: string;
  description: string;
  code: string;
  language?: Language; // defaults to the library's language
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  summary: string;
  definition: string;
  syntax?: string;
  parameters?: { name: string; type: string; description: string }[];
  returns?: string;
  keyPoints: string[];
  examples: Example[];
  related?: string[];
}

export interface Library {
  id: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  accent: string;
  icon: string;
  language: Language;
  categories: string[];
  topics: Topic[];
}

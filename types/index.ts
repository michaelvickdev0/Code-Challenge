 export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Mood {
  happiness: number;
  fear: number;
  anger: number;
  sadness: number;
  excitement: number;
}

export type MoodType = keyof Mood;

export interface Journal {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: Mood;
  userId?: string;
}



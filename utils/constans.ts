import {
  Frown,
  Heart,
  Shield,
  Smile,
  Zap
} from 'lucide-react-native';

import { Mood } from "@/types";

type MoodType = keyof Mood;

export interface MoodConfigItem {
  icon: React.ComponentType<any>;
  color: string;
  label: string;
}

export const moodConfig: Record<MoodType, MoodConfigItem> = {
  happiness: { icon: Smile, color: '#22C55E', label: 'Happiness' },
  fear: { icon: Shield, color: '#6366F1', label: 'Fear' },
  anger: { icon: Zap, color: '#DC2626', label: 'Anger' },
  sadness: { icon: Frown, color: '#6B7280', label: 'Sadness' },
  excitement: { icon: Heart, color: '#F97316', label: 'Excitement' }
};

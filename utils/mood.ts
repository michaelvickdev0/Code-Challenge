import { Mood } from '@/types';
import axios from 'axios';

interface MoodDetectionResult {
  mood: Mood;
}

export default async function detectMood(title: string, content: string): Promise<MoodDetectionResult> {
  const prompt = `
You are an emotion detection AI. Given a journal entry title and content, analyze the base moods expressed and assign a score from **1 to 10** for each relevant emotion (higher means stronger emotion). The output must be in JSON format.

title: ${title}
content: ${content}

Respond in this format:
{
  "mood": {
    "happiness": 8,
    "fear": 3,
    "sadness": 0,
    "anger": 2,
    "excitement": 6
  }
}
Only include emotions that are relevant and have scores greater than 0.
`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;

    const result: MoodDetectionResult = JSON.parse(content);
    return result;
  } catch (error: any) {
    console.error('Error detecting mood:', error.response?.data || error.message);
    throw new Error('Failed to detect mood');
  }
}


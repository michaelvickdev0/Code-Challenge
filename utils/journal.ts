import { useAuthStore } from '@/stores/auth-store';
import { Journal } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'journals';

function generateId(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

export async function saveJournal(data: Omit<Journal, 'id'>) {
  const journalsData = await AsyncStorage.getItem(STORAGE_KEY);
  const journals: Journal[] = journalsData ? JSON.parse(journalsData) : [];

  const user = useAuthStore.getState().user;

  const newJournal: Journal = {
    ...data,
    id: generateId(),
    date: new Date().toISOString(),
    userId: user?.id,
  };

  journals.push(newJournal);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(journals));

  return newJournal;
}

export async function getJournals() {
  const journalsData = await AsyncStorage.getItem(STORAGE_KEY);
  const journals: Journal[] = journalsData ? JSON.parse(journalsData) : [];

  const user = useAuthStore.getState().user;

  return journals.filter(item => item.userId === user?.id);
}


export async function removeJournal(id: string) {
  const journalsData = await AsyncStorage.getItem(STORAGE_KEY);
  const journals: Journal[] = journalsData ? JSON.parse(journalsData) : [];

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(journals.filter(item => item.id !== id)));

  return { message: 'Success' };
}

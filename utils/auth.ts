import { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';


const STORAGE_KEY = 'users';

function generateId(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

export async function signUp({ email, password, name }: { email: string, password: string, name: string }) {
  const usersData = await AsyncStorage.getItem(STORAGE_KEY);
  const users: User[] = usersData ? JSON.parse(usersData) : [];

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const newUser: User = {
    id: generateId(),
    name,
    email,
    password,
  };

  users.push(newUser);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));

  return newUser;
}

export async function signIn(email: string, password: string) {
  const usersData = await AsyncStorage.getItem(STORAGE_KEY);
  if (!usersData) throw new Error('No users found');

  const users: User[] = JSON.parse(usersData);
  const user = users.find(user => user.email === email && user.password === password);

  if (!user) throw new Error('Invalid credentials');

  return user;
}

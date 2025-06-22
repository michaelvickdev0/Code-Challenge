import { useAuthStore } from '@/stores/auth-store';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AuthLayout() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/sign-in');
    }
  }, [user]);
  return (
    <Stack>
      <Stack.Screen name='index' options={{ title: 'Home', headerShown: false }} />
      <Stack.Screen name='add-journal' options={{ title: 'Add Journal' }} />
      <Stack.Screen name='profile' options={{ title: 'Profile' }} />
    </Stack>
  );
}

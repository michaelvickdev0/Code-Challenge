import AppButton from '@/components/AppButton';
import Input from '@/components/Input';
import { useAuthStore } from '@/stores/auth-store';
import { signUp } from '@/utils/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { height } = Dimensions.get('window');

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (nameError) setNameError('');
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError('');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError('');
  };

  const handleSignUp = async () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');

    let hasError = false;

    if (!name.trim()) {
      setNameError('Name is required');
      hasError = true;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const user = await signUp({ name: name.trim(), email: email.trim(), password });
      setUser(user);
      router.replace('/(home)');
    } catch (err: any) {
      Alert.alert(
        'Registration Failed',
        err.message || 'Please check your information and try again',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-add" size={32} color="#6366F1" />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join us and start your journaling journey today
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Input 
                label="Full Name" 
                value={name} 
                onChangeText={handleNameChange}
                placeholder="Enter your full name" 
                autoCapitalize="words"
                autoComplete="name"
                error={nameError}
              />
            </View>

            <View style={styles.inputContainer}>
              <Input 
                label="Email Address" 
                value={email} 
                onChangeText={handleEmailChange}
                placeholder="Enter your email" 
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                error={emailError}
              />
            </View>

            <View style={styles.inputContainer}>
              <Input 
                label="Password" 
                value={password} 
                onChangeText={handlePasswordChange}
                placeholder="Create a password" 
                secureTextEntry
                error={passwordError}
              />
            </View>

            <View style={styles.buttonContainer}>
              <AppButton 
                title="Sign Up" 
                onPress={handleSignUp} 
                isLoading={loading}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity 
              onPress={() => router.push('/sign-in')}
              style={styles.signInButton}
              accessibilityLabel="Sign in"
              accessibilityHint="Navigate to sign in"
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    minHeight: height,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F0F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 12,
  },
  buttonContainer: {
    marginBottom: 32,
    marginTop: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
    marginRight: 2,
  },
  signInButton: {
    padding: 4,
  },
  signInText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignUpPage;

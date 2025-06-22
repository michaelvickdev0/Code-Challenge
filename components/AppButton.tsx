import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  variant?: 'contained' | 'outlined';
}

const AppButton: React.FC<AppButtonProps> = ({ 
  title, 
  onPress, 
  isLoading, 
  variant = 'contained' 
}) => {
  const isContained = variant === 'contained';
  
  return (
    <TouchableOpacity
      style={[styles.button, isContained ? styles.containedButton : styles.outlinedButton]}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={isContained ? "#fff" : "#2563EB"} />
      ) : (
        <Text style={[styles.text, isContained ? styles.containedText : styles.outlinedText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  containedButton: {
    backgroundColor: '#2563EB',
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
  containedText: {
    color: '#fff',
  },
  outlinedText: {
    color: '#2563EB',
  },
});

export default AppButton;

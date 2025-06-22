import AppButton from '@/components/AppButton';
import { Journal } from '@/types';
import { saveJournal } from '@/utils/journal';
import detectMood from '@/utils/mood';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';

interface AddJournalPageProps {
  onSave?: (journal: Omit<Journal, 'id'>) => void;
}

const AddJournalPage: React.FC<AddJournalPageProps> = ({ onSave }) => {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onCancel = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your journal entry.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Missing Content', 'Please write something in your journal entry.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newJournal: Omit<Journal, 'id'> = {
        title: title.trim(),
        content: content.trim(),
        date: new Date().toISOString(),
        mood: { happiness: 0, fear: 0, sadness: 0, anger: 0, excitement: 0 }
      };

      const res = await detectMood(newJournal.title, newJournal.content);

      newJournal.mood = res.mood;

      await saveJournal(newJournal);

      Alert.alert(
        'Journal Saved!',
        'Your journal entry has been saved successfully.',
        [{ text: 'OK', onPress: () => onCancel?.() }]
      );
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to save journal entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>


          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="What's on your mind?"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
              <Text style={styles.characterCount}>{title.length}/100</Text>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Your thoughts</Text>
              <TextInput
                style={styles.contentInput}
                placeholder="Write about your day, feelings, thoughts, or anything that comes to mind..."
                placeholderTextColor="#9CA3AF"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                maxLength={2000}
              />
              <Text style={styles.characterCount}>{content.length}/2000</Text>
            </View>

            <View style={styles.bottomPadding} />
          </ScrollView>

          <View style={styles.bottomContainer}>
            <AppButton 
              onPress={handleSave}
              isLoading={isSubmitting}
              title="Save"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  titleInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  contentInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
    minHeight: 120,
    lineHeight: 24,
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
  bottomContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  bottomPadding: {
    height: 40,
  },
});

export default AddJournalPage;

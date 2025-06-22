import { Journal, Mood, MoodType } from '@/types';
import { moodConfig } from '@/utils/constans';
import { formatDate } from '@/utils/format';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface JournalItemProps {
  journal: Journal;
  onPress?: (journal: Journal) => void;
}

const MoodIndicator: React.FC<{ mood: Mood }> = ({ mood }) => (
  <View style={styles.moodContainer}>
    {Object.entries(mood).map(([moodType, value]) => {
      if (!moodConfig[moodType as MoodType]) {
        return null;
      }
      const MoodIcon = moodConfig[moodType as MoodType].icon;
      return (
        <View key={moodType} style={styles.moodItem}>
          <MoodIcon
            size={18}
            color={moodConfig[moodType as MoodType].color}
          />
          <Text style={styles.moodValue}>{value}</Text>
        </View>
      );
    })}
  </View>
);

const JournalItem: React.FC<JournalItemProps> = ({ journal, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.journalCard} 
      activeOpacity={0.7}
      onPress={() => onPress?.(journal)}
    >
      <View style={styles.journalHeader}>
        <Text style={styles.journalTitle}>{journal.title}</Text>
        <Text style={styles.journalDate}>{formatDate(journal.date)}</Text>
      </View>
      <Text style={styles.journalContent} numberOfLines={2}>
        {journal.content}
      </Text>
      <MoodIndicator mood={journal.mood} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  journalCard: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  journalTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 12,
    lineHeight: 24,
  },
  journalDate: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  journalContent: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
  },
  moodContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  moodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moodValue: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});

export default JournalItem;

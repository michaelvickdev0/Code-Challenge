import { Mood, MoodType } from '@/types';
import { moodConfig } from '@/utils/constans';
import { formatFullDate, formatTime } from '@/utils/format';
import { Calendar, Trash2, X } from 'lucide-react-native';
import React, { useCallback } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface Journal {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: Mood;
}

interface JournalDetailModalProps {
  visible: boolean;
  journal: Journal | null;
  onClose: () => void;
  onDelete?: (journal: Journal) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.7;

const MoodDetail: React.FC<{ mood: Mood }> = React.memo(({ mood }) => {
  const moodEntries = Object.entries(mood).map(([moodType, value]) => {
    const config = moodConfig[moodType as MoodType];

    const MoodIcon = config?.icon;
    const percentage = Math.max(0, Math.min(100, (value / 10) * 100));

    return { moodType, config, MoodIcon, percentage, value };
  }).filter(item => item.MoodIcon);

  return (
    <View style={styles.moodDetailContainer}>
      <Text style={styles.sectionTitle}>Mood Overview</Text>
      <View style={styles.moodGrid}>
        {moodEntries.map(({ moodType, config, MoodIcon, percentage, value }) => (
          <View key={moodType} style={styles.moodDetailItem}>
            <View style={styles.moodIconContainer}>
              <MoodIcon
                size={24}
                color={config.color}
              />
            </View>
            <Text style={styles.moodLabel}>{config.label}</Text>
            <View style={styles.moodProgressContainer}>
              <View
                style={[
                  styles.moodProgressBar,
                  { width: `${percentage}%`, backgroundColor: config.color },
                ]}
              />
            </View>
            <Text style={[styles.moodScore, { color: config.color }]}>
              {value}/10
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});

MoodDetail.displayName = 'MoodDetail';

const JournalDetailModal: React.FC<JournalDetailModalProps> = ({
  visible,
  journal,
  onClose,
  onDelete,
}) => {
  const handleDelete = useCallback(() => {
    if (journal && onDelete) {
      onDelete(journal);
      onClose();
    }
  }, [journal, onDelete, onClose]);

  if (!journal) return null;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.bottomSheet}>
              <View style={styles.handle} />

              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Text style={styles.headerTitle}>Journal Entry</Text>
                  <View style={styles.dateTimeContainer}>
                    <Calendar size={14} color="#64748B" />
                    <Text style={styles.dateText}>
                      {formatFullDate(journal.date)} • {formatTime(journal.date)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <View style={styles.titleSection}>
                  <Text style={styles.journalTitle}>{journal.title}</Text>
                </View>

                <View style={styles.contentSection}>
                  <Text style={styles.sectionTitle}>Content</Text>
                  <Text style={styles.journalContent}>{journal.content}</Text>
                </View>

                <MoodDetail mood={journal.mood} />

                {onDelete && (
                  <View style={styles.actionsSection}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={handleDelete}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={18} color="#EF4444" />
                      <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                        Delete Entry
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.bottomPadding} />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: BOTTOM_SHEET_HEIGHT,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginLeft: 6,
  },
  closeButton: {
    padding: 4,
    marginLeft: 16,
  },
  titleSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  journalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 32,
  },
  contentSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  journalContent: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  moodDetailContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  moodGrid: {
    marginBottom: 16,
  },
  moodDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 80,
    marginLeft: 12,
  },
  moodProgressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    marginHorizontal: 8,
  },
  moodProgressBar: {
    height: '100%',
    borderRadius: 3,
  },
  moodScore: {
    fontSize: 14,
    fontWeight: '700',
    width: 40,
    textAlign: 'right',
  },
  actionsSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#EF4444',
  },
  bottomPadding: {
    height: 40,
  },
});

export default JournalDetailModal;

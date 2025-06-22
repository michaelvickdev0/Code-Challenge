import { MoodType } from '@/types';
import { moodConfig, MoodConfigItem } from '@/utils/constans';
import { Calendar, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AppButton from './AppButton';

type SortType = 'date' | MoodType;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.8;

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedMoodFilter: MoodType | '';
  moodThreshold: number;
  sortBy: SortType;
  onApplyFilters: (filters: {
    selectedMoodFilter: MoodType | '';
    moodThreshold: number;
    sortBy: SortType;
  }) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedMoodFilter,
  moodThreshold,
  sortBy,
  onApplyFilters
}) => {
  const [tempSelectedMoodFilter, setTempSelectedMoodFilter] = useState<MoodType | ''>('');
  const [tempMoodThreshold, setTempMoodThreshold] = useState(5);
  const [tempSortBy, setTempSortBy] = useState<SortType>('date');

  useEffect(() => {
    if (visible) {
      setTempSelectedMoodFilter(selectedMoodFilter);
      setTempMoodThreshold(moodThreshold);
      setTempSortBy(sortBy);
    }
  }, [visible]);

  const handleApplyFilters = useCallback(() => {
    onApplyFilters({
      selectedMoodFilter: tempSelectedMoodFilter,
      moodThreshold: tempMoodThreshold,
      sortBy: tempSortBy
    });
  }, [tempSelectedMoodFilter, tempMoodThreshold, tempSortBy, onApplyFilters]);

  const handleClearAllFilters = useCallback(() => {
    setTempSelectedMoodFilter('');
    setTempMoodThreshold(5);
    setTempSortBy('date');
  }, []);

  const toggleMoodFilter = useCallback((moodType: MoodType) => {
    setTempSelectedMoodFilter(prev => prev === moodType ? '' : moodType);
  }, []);

  const renderMoodFilter = useCallback((moodType: MoodType, config: MoodConfigItem) => {
    const MoodIcon = config.icon;
    const isSelected = tempSelectedMoodFilter === moodType;

    return (
      <TouchableOpacity
        key={moodType}
        style={[
          styles.moodFilterButton,
          isSelected && {
            ...styles.selectedMoodFilter,
            borderColor: config.color,
            backgroundColor: `${config.color}15`
          }
        ]}
        onPress={() => toggleMoodFilter(moodType)}
      >
        <MoodIcon size={20} color={config.color} />
        <Text style={[
          styles.moodFilterLabel,
          isSelected && { color: config.color, fontWeight: '600' }
        ]}>
          {config.label}
        </Text>
      </TouchableOpacity>
    );
  }, [tempSelectedMoodFilter, toggleMoodFilter]);

  const renderThresholdButton = useCallback((level: number) => (
    <TouchableOpacity
      key={level}
      style={[
        styles.thresholdButton,
        tempMoodThreshold === level && tempSelectedMoodFilter && {
          ...styles.selectedThreshold,
          backgroundColor: moodConfig[tempSelectedMoodFilter].color
        }
      ]}
      onPress={() => setTempMoodThreshold(level)}
    >
      <Text style={[
        styles.thresholdButtonText,
        tempMoodThreshold === level && styles.selectedThresholdText
      ]}>
        {level}
      </Text>
    </TouchableOpacity>
  ), [tempMoodThreshold, tempSelectedMoodFilter]);

  const renderSortButton = useCallback((sortType: SortType, icon: React.ComponentType<any>, label: string, color?: string) => {
    const Icon = icon;
    const isSelected = tempSortBy === sortType;

    return (
      <TouchableOpacity
        key={sortType}
        style={[styles.sortButton, isSelected && styles.selectedSort]}
        onPress={() => setTempSortBy(sortType)}
      >
        <Icon size={18} color={isSelected ? '#fff' : (color || '#6B7280')} />
        <Text style={[styles.sortButtonText, isSelected && styles.selectedSortText]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }, [tempSortBy]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHandle} />

          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>Filter & Sort</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.bottomSheetContent} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Filter by Mood</Text>
              <View style={styles.moodFilterContainer}>
                {Object.entries(moodConfig).map(([moodType, config]) =>
                  renderMoodFilter(moodType as MoodType, config)
                )}
              </View>
            </View>

            {tempSelectedMoodFilter && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  Minimum {moodConfig[tempSelectedMoodFilter].label} Level: {tempMoodThreshold}
                </Text>
                <View style={styles.thresholdButtons}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(renderThresholdButton)}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Sort by</Text>
              <View style={styles.sortButtons}>
                {renderSortButton('date', Calendar, 'Date')}
                {Object.entries(moodConfig).map(([moodType, config]) =>
                  renderSortButton(moodType as MoodType, config.icon, config.label, config.color)
                )}
              </View>
            </View>

            <View style={styles.bottomPadding} />
          </ScrollView>

          <View style={styles.fixedButtonContainer}>
            <View style={{ flex: 1 }}>
              <AppButton
                title="Clear All Filters"
                onPress={handleApplyFilters}
                variant="outlined"
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppButton
                title="Apply Filters"
                onPress={handleApplyFilters}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
    paddingTop: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 16,
  },
  moodFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moodFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    minWidth: 100,
  },
  selectedMoodFilter: {
    borderWidth: 2,
  },
  moodFilterLabel: {
    marginLeft: 10,
    fontSize: 15,
    color: '#475569',
    fontWeight: '500',
  },
  thresholdButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  thresholdButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    minWidth: 44,
    alignItems: 'center',
  },
  selectedThreshold: {
    borderColor: 'transparent',
  },
  thresholdButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  selectedThresholdText: {
    color: '#fff',
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    minWidth: 80,
  },
  selectedSort: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  sortButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  selectedSortText: {
    color: '#fff',
  },
  clearButton: {
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    flex: 1,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    gap: 12,
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    flex: 1,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomPadding: {
    height: 32,
  },
});

export default FilterModal;

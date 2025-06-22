import FilterModal from '@/components/FilterModal';
import JournalDetailModal from '@/components/JournalDetailModal';
import JournalItem from '@/components/JournalItem';
import useJournals from '@/hooks/useJournals';
import { Journal, MoodType } from '@/types';
import { moodConfig } from '@/utils/constans';
import { useRouter } from 'expo-router';
import {
  Filter,
  Meh,
  Plus,
  Search,
  User,
  X,
} from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

type SortType = 'date' | MoodType;

const JournalListPage: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<MoodType | ''>('');
  const [moodThreshold, setMoodThreshold] = useState(5);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDetailBottomSheet, setShowDetailBottomSheet] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [sortBy, setSortBy] = useState<SortType>('date');

  const { 
    journals, 
    filteredJournals, 
    loading, 
    error,
    refresh,
    remove,
  } = useJournals({
    searchText,
    selectedMoodFilter,
    moodThreshold,
    sortBy
  });

  const handleAddJournal = useCallback(() => {
    router.push('/add-journal');
  }, [router]);

  const handleJournalPress = useCallback((journal: Journal) => {
    setSelectedJournal(journal);
    setShowDetailBottomSheet(true);
  }, []);

  const handleDeleteJournal = useCallback((journal: Journal) => {
    Alert.alert(
      'Delete Journal',
      'Are you sure you want to delete this journal?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => remove(journal.id),
        },
      ],
      { cancelable: true }
    );
  }, [remove]);

  const handleCloseDetailBottomSheet = useCallback(() => {
    setShowDetailBottomSheet(false);
    setSelectedJournal(null);
  }, []);

  const handleApplyFilters = useCallback((filters: {
    selectedMoodFilter: MoodType | '';
    moodThreshold: number;
    sortBy: SortType;
  }) => {
    setSelectedMoodFilter(filters.selectedMoodFilter);
    setMoodThreshold(filters.moodThreshold);
    setSortBy(filters.sortBy);
    setShowFilterModal(false);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchText('');
    setSelectedMoodFilter('');
    setMoodThreshold(5);
    setSortBy('date');
  }, []);

  const clearSearchText = useCallback(() => setSearchText(''), []);
  const clearMoodFilter = useCallback(() => setSelectedMoodFilter(''), []);

  const activeFiltersCount = useMemo(() => {
    return (selectedMoodFilter ? 1 : 0) + (searchText ? 1 : 0);
  }, [selectedMoodFilter, searchText]);

  const hasActiveFilters = selectedMoodFilter || searchText;

  const renderListContent = () => {
    if (loading) {
      return (
        <View style={styles.listStateContainer}>
          <Text style={styles.loadingText}>Loading journals...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.listStateContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity onPress={refresh} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (filteredJournals.length === 0) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Meh size={32} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyStateText}>
            {journals.length === 0 ? 'No journals yet' : 'No journals found'}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {journals.length === 0 
              ? 'Start writing your first journal entry' 
              : 'Try adjusting your filters or search terms'
            }
          </Text>
        </View>
      );
    }

    return (
      <>
        {filteredJournals.map(journal => (
          <JournalItem 
            key={journal.id} 
            journal={journal} 
            onPress={handleJournalPress}
          />
        ))}
        <View style={styles.bottomPadding} />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>My Journal</Text>
              <Text style={styles.headerSubtitle}>
                {loading ? 'Loading...' : (
                  <>
                    {filteredJournals.length} {filteredJournals.length === 1 ? 'entry' : 'entries'}
                    {journals.length !== filteredJournals.length && ` of ${journals.length}`}
                  </>
                )}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[
                  styles.headerButton, 
                  activeFiltersCount > 0 && styles.headerButtonActive
                ]}
                onPress={() => setShowFilterModal(true)}
              >
                <Filter size={20} color={activeFiltersCount > 0 ? '#3B82F6' : '#6B7280'} />
                {activeFiltersCount > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/profile')}
                style={styles.headerButton}>
                <User size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
              editable={!loading}
            />
            {searchText ? (
              <TouchableOpacity onPress={clearSearchText}>
                <X size={18} color="#9CA3AF" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {hasActiveFilters && !loading && (
          <View style={styles.activeFilters}>
            <Text style={styles.activeFiltersLabel}>Active filters:</Text>
            {searchText && (
              <View style={styles.activeFilter}>
                <Text style={styles.activeFilterText}>"{searchText}"</Text>
                <TouchableOpacity onPress={clearSearchText}>
                  <X size={14} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            )}
            {selectedMoodFilter && (
              <View style={[
                styles.activeFilter, 
                { backgroundColor: `${moodConfig[selectedMoodFilter].color}15` }
              ]}>
                <Text style={[
                  styles.activeFilterText, 
                  { color: moodConfig[selectedMoodFilter].color }
                ]}>
                  {moodConfig[selectedMoodFilter].label} ≥ {moodThreshold}
                </Text>
                <TouchableOpacity onPress={clearMoodFilter}>
                  <X size={14} color={moodConfig[selectedMoodFilter].color} />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={clearAllFilters} style={styles.clearAllButton}>
              <Text style={styles.clearAllText}>Clear all</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView style={styles.journalList} showsVerticalScrollIndicator={false}>
          {renderListContent()}
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddJournal}
          activeOpacity={0.8}
        >
          <Plus size={24} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>

        <FilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          selectedMoodFilter={selectedMoodFilter}
          moodThreshold={moodThreshold}
          sortBy={sortBy}
          onApplyFilters={handleApplyFilters}
        />

        <JournalDetailModal
          visible={showDetailBottomSheet}
          journal={selectedJournal}
          onClose={handleCloseDetailBottomSheet}
          onDelete={handleDeleteJournal}
        />
      </View>
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
  listStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  headerButtonActive: {
    backgroundColor: '#EBF4FF',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#3B82F6',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  activeFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexWrap: 'wrap',
    gap: 8,
  },
  activeFiltersLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  activeFilterText: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '600',
  },
  clearAllButton: {
    marginLeft: 'auto',
  },
  clearAllText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
  },
  journalList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomPadding: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default JournalListPage;

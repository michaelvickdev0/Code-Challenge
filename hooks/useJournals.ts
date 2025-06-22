import { Journal, Mood } from "@/types";
import { getJournals, removeJournal } from "@/utils/journal";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

type MoodType = keyof Mood;
type SortType = 'date' | MoodType;

interface UseJournalsFilters {
  searchText?: string;
  selectedMoodFilter?: MoodType | '';
  moodThreshold?: number;
  sortBy?: SortType;
}

export default function useJournals(filters?: UseJournalsFilters) {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    searchText = '',
    selectedMoodFilter = '',
    moodThreshold = 5,
    sortBy = 'date'
  } = filters || {};

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getJournals();
      setJournals(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch journals');
    } finally {
      setLoading(false);
    }
  };

  const filteredJournals = useMemo(() => {
    let filtered = [...journals];

    if (searchText) {
      filtered = filtered.filter(journal =>
        journal.title.toLowerCase().includes(searchText.toLowerCase()) ||
        journal.content.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedMoodFilter) {
      filtered = filtered.filter(journal =>
        journal.mood[selectedMoodFilter] >= moodThreshold
      );
    }

    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      filtered.sort((a, b) => (b.mood[sortBy as MoodType] || 0) - (a.mood[sortBy as MoodType] || 0));
    }

    return filtered;
  }, [journals, searchText, selectedMoodFilter, moodThreshold, sortBy]);

  const refresh = async () => {
    await fetchData();
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const remove = async (journalId: string) => {
    await removeJournal(journalId);
    refresh();
  };

  return {
    journals,
    filteredJournals,
    loading: loading && journals.length === 0,
    error,
    refresh,
    remove,
  };
}

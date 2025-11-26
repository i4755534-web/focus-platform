'use client';

import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { FuseResultMatch } from 'fuse.js';
import { useAuth } from './useAuth';
import { useAnalytics } from './useAnalytics';
import { logger } from '@/lib/logger';

export interface SearchableItem {
  id: string;
  type: 'user' | 'channel' | 'message' | 'file';
  title: string;
  content?: string;
  metadata: {
    author?: string;
    channel?: string;
    timestamp?: Date;
    tags?: string[];
    category?: string;
    size?: number;
    mimeType?: string;
  };
  score?: number;
}

export interface SearchResult {
  item: SearchableItem;
  matches: readonly FuseResultMatch[];
  score: number;
}

export interface SearchFilters {
  type?: SearchableItem['type'][];
  author?: string[];
  channel?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  category?: string[];
}

export interface SearchSuggestions {
  queries: string[];
  filters: SearchFilters;
  related: SearchableItem[];
}

export const useAISearch = () => {
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();
  const [searchIndex, setSearchIndex] = useState<Fuse<SearchableItem> | null>(null);
  const [searchableData, setSearchableData] = useState<SearchableItem[]>([]);
  const [isIndexing, setIsIndexing] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Fuse.js configuration for fuzzy search
  const fuseConfig = useMemo(() => ({
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'content', weight: 0.3 },
      { name: 'metadata.author', weight: 0.1 },
      { name: 'metadata.channel', weight: 0.1 },
      { name: 'metadata.tags', weight: 0.1 },
    ],
    threshold: 0.3, // Lower = more strict
    includeMatches: true,
    includeScore: true,
    useExtendedSearch: true,
    ignoreLocation: true,
    findAllMatches: true,
  }), []);

  // Initialize search index
  useEffect(() => {
    if (searchableData.length > 0 && !searchIndex) {
      setIsIndexing(true);
      const index = new Fuse(searchableData, fuseConfig);
      setSearchIndex(index);
      setIsIndexing(false);
      logger.info('Search index initialized', { itemCount: searchableData.length });
    }
  }, [searchableData, searchIndex, fuseConfig]);

  // Load searchable data (mock implementation)
  const loadSearchableData = async () => {
    try {
      // In real app, this would fetch from API
      const mockData: SearchableItem[] = [
        {
          id: '1',
          type: 'channel',
          title: 'Общий чат',
          content: 'Основной канал для общения',
          metadata: {
            author: 'admin',
            category: 'general',
            tags: ['general', 'chat'],
          },
        },
        {
          id: '2',
          type: 'message',
          title: 'Встреча в 15:00',
          content: 'Не забудьте про встречу в конференц-зале',
          metadata: {
            author: 'user1',
            channel: 'Общий чат',
            timestamp: new Date(),
            tags: ['meeting', 'reminder'],
          },
        },
        {
          id: '3',
          type: 'user',
          title: 'Иван Петров',
          content: 'Разработчик frontend',
          metadata: {
            tags: ['developer', 'frontend'],
            category: 'team',
          },
        },
        {
          id: '4',
          type: 'file',
          title: 'Презентация проекта.pdf',
          metadata: {
            author: 'user2',
            size: 2048576,
            mimeType: 'application/pdf',
            tags: ['presentation', 'project'],
          },
        },
      ];

      setSearchableData(mockData);
      logger.info('Searchable data loaded', { count: mockData.length });
    } catch (error) {
      logger.error('Failed to load searchable data', error as Error);
    }
  };

  // Perform search
  const search = async (query: string, filters?: SearchFilters): Promise<SearchResult[]> => {
    if (!searchIndex || !query.trim()) return [];

    try {
      trackEvent('search_performed', { query, filters });

      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [query, ...prev.filter(q => q !== query)].slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        return newHistory;
      });

      let searchPattern = query;

      // Apply filters to search pattern
      if (filters) {
        if (filters.type?.length) {
          searchPattern += ` type:${filters.type.join('|')}`;
        }
        if (filters.author?.length) {
          searchPattern += ` author:${filters.author.join('|')}`;
        }
        if (filters.tags?.length) {
          searchPattern += ` tags:${filters.tags.join('|')}`;
        }
      }

      const results = searchIndex.search(searchPattern);

      // Apply additional filters
      let filteredResults = results;

      if (filters) {
        filteredResults = results.filter(result => {
          const item = result.item;

          if (filters.type && !filters.type.includes(item.type)) return false;
          if (filters.author && !filters.author.includes(item.metadata.author || '')) return false;
          if (filters.channel && !filters.channel.includes(item.metadata.channel || '')) return false;
          if (filters.tags && !filters.tags.some(tag => item.metadata.tags?.includes(tag))) return false;
          if (filters.category && !filters.category.includes(item.metadata.category || '')) return false;

          if (filters.dateRange && item.metadata.timestamp) {
            const timestamp = new Date(item.metadata.timestamp);
            if (timestamp < filters.dateRange.start || timestamp > filters.dateRange.end) return false;
          }

          return true;
        });
      }

      const searchResults: SearchResult[] = filteredResults.map(result => ({
        item: result.item,
        matches: result.matches || [],
        score: result.score || 0,
      }));

      logger.info('Search completed', { query, resultCount: searchResults.length });
      return searchResults;

    } catch (error) {
      logger.error('Search failed', error as Error, { query });
      return [];
    }
  };

  // Get search suggestions
  const getSuggestions = async (partialQuery: string): Promise<SearchSuggestions> => {
    if (!partialQuery.trim()) {
      return {
        queries: searchHistory.slice(0, 5),
        filters: {},
        related: [],
      };
    }

    try {
      // Get related items based on partial query
      const relatedResults = await search(partialQuery, undefined);
      const related = relatedResults.slice(0, 3).map(r => r.item);

      // Generate filter suggestions based on query
      const filters: SearchFilters = {};

      if (partialQuery.toLowerCase().includes('файл') || partialQuery.toLowerCase().includes('file')) {
        filters.type = ['file'];
      }

      if (partialQuery.toLowerCase().includes('сообщени') || partialQuery.toLowerCase().includes('message')) {
        filters.type = ['message'];
      }

      return {
        queries: searchHistory.filter(q => q.toLowerCase().includes(partialQuery.toLowerCase())).slice(0, 5),
        filters,
        related,
      };
    } catch (error) {
      logger.error('Failed to get suggestions', error as Error);
      return {
        queries: [],
        filters: {},
        related: [],
      };
    }
  };

  // Get search analytics
  const getSearchAnalytics = () => {
    return {
      totalSearches: searchHistory.length,
      popularQueries: searchHistory.slice(0, 5),
      searchIndexSize: searchableData.length,
      isIndexing,
    };
  };

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (error) {
        logger.error('Failed to load search history', error as Error);
      }
    }
  }, []);

  // Initialize data
  useEffect(() => {
    loadSearchableData();
  }, []);

  return {
    search,
    getSuggestions,
    getSearchAnalytics,
    isIndexing,
    searchHistory,
    reindexData: loadSearchableData,
  };
};
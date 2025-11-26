'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAISearch, SearchResult, SearchFilters, SearchSuggestions } from '@/hooks/useAISearch';
import { Search, Filter, X, FileText, MessageSquare, Users, Hash } from 'lucide-react';

export default function AISearch() {
  const {
    search,
    getSuggestions,
    getSearchAnalytics,
    isIndexing,
    searchHistory,
  } = useAISearch();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestions | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Perform search
  const performSearch = async (searchQuery: string, searchFilters?: SearchFilters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await search(searchQuery, searchFilters || filters);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (value: string) => {
    setQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Get suggestions immediately
    if (value.trim()) {
      getSuggestions(value).then(setSuggestions);
    } else {
      setSuggestions(null);
    }

    // Perform search after delay
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle filter change
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (query.trim()) {
      performSearch(query, newFilters);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
    setSuggestions(null);
  };

  // Get icon for item type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'channel':
        return <Hash className="w-4 h-4" />;
      case 'file':
        return <FileText className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const analytics = getSearchAnalytics();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Умный поиск по сообщениям, файлам, пользователям..."
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              className="pl-10 pr-4"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-blue-50' : ''}
          >
            <Filter className="w-4 h-4 mr-2" />
            Фильтры
          </Button>
        </div>

        {/* Suggestions */}
        {suggestions && suggestions.queries.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-10 mt-1">
            <CardContent className="p-2">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Недавние запросы:</p>
                {suggestions.queries.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Фильтры поиска</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Тип контента</label>
                <div className="space-y-1">
                  {['message', 'user', 'channel', 'file'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.type?.includes(type as any) || false}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...(filters.type || []), type as any]
                            : (filters.type || []).filter(t => t !== type);
                          handleFilterChange({ ...filters, type: newTypes.length > 0 ? newTypes : undefined });
                        }}
                        className="mr-2"
                      />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Категории</label>
                <div className="space-y-1">
                  {['general', 'work', 'personal', 'project'].map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.category?.includes(category) || false}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...(filters.category || []), category]
                            : (filters.category || []).filter(c => c !== category);
                          handleFilterChange({ ...filters, category: newCategories.length > 0 ? newCategories : undefined });
                        }}
                        className="mr-2"
                      />
                      <span className="capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Теги</label>
                <Input
                  placeholder="Введите теги через запятую"
                  value={filters.tags?.join(', ') || ''}
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                    handleFilterChange({ ...filters, tags: tags.length > 0 ? tags : undefined });
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Analytics */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>Индексировано: {analytics.searchIndexSize} элементов</span>
        <span>История: {analytics.totalSearches} поисков</span>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Результаты поиска ({results.length})</h3>
          {results.map((result, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getTypeIcon(result.item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{result.item.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {result.item.type}
                      </Badge>
                      {result.item.metadata.category && (
                        <Badge variant="outline" className="text-xs">
                          {result.item.metadata.category}
                        </Badge>
                      )}
                    </div>

                    {result.item.content && (
                      <p className="text-gray-600 text-sm mb-2">{result.item.content}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {result.item.metadata.author && (
                        <span>Автор: {result.item.metadata.author}</span>
                      )}
                      {result.item.metadata.channel && (
                        <span>Канал: {result.item.metadata.channel}</span>
                      )}
                      {result.item.metadata.size && (
                        <span>Размер: {formatFileSize(result.item.metadata.size)}</span>
                      )}
                      {result.item.metadata.timestamp && (
                        <span>
                          {new Date(result.item.metadata.timestamp).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {result.item.metadata.tags && result.item.metadata.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {result.item.metadata.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-400">
                      Релевантность: {Math.round((1 - result.score) * 100)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {query && !isSearching && results.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Ничего не найдено</h3>
            <p className="text-gray-500">
              Попробуйте изменить запрос или фильтры поиска
            </p>
          </CardContent>
        </Card>
      )}

      {/* Popular Queries */}
      {!query && searchHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Популярные запросы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.popularQueries.map((popularQuery, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(popularQuery)}
                >
                  {popularQuery}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
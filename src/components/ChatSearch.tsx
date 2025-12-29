import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SearchModeToggle from './SearchModeToggle';
import SearchResults from './SearchResults';
import SearchSettings from './SearchSettings';
import { searchAPI } from '@/lib/search-api';
import type { SearchMode, SearchResult, SearchResponse, SearchParams } from '@/types/search';
import { Send, AlertCircle } from 'lucide-react';

interface ChatSearchProps {
  onResultClick?: (result: SearchResult) => void;
}

const ChatSearch: React.FC<ChatSearchProps> = ({ onResultClick }) => {
  // Search state
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('hybrid');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Settings state
  const [threshold, setThreshold] = useState(0.5);
  const [limit, setLimit] = useState(10);
  const [semanticWeight, setSemanticWeight] = useState(0.7);
  const [keywordWeight, setKeywordWeight] = useState(0.3);

  // Search history
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = useCallback((q: string) => {
    const updated = [q, ...searchHistory.filter(h => h !== q)].slice(0, 10);
    setSearchHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  }, [searchHistory]);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams: SearchParams = {
        q: searchQuery,
        limit,
        threshold,
        semantic_weight: semanticWeight,
        keyword_weight: keywordWeight,
      };

      const response: SearchResponse = await searchAPI.search(searchMode, searchParams);
      setResults(response.results);
      saveToHistory(searchQuery);

      if (response.count === 0) {
        setError('No results found. Try adjusting your query or threshold.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchMode, threshold, limit, semanticWeight, keywordWeight, saveToHistory]);

  const handleSearch = () => {
    performSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4 bg-background">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Document Search</h2>
        <p className="text-sm text-muted-foreground">
          Search across your documents using semantic, keyword, or hybrid search
        </p>
      </div>

      {/* Search Mode Toggle */}
      <SearchModeToggle
        currentMode={searchMode}
        onModeChange={setSearchMode}
        disabled={loading}
      />

      {/* Search Input */}
      <Card className="p-4 border">
        <div className="flex gap-2">
          <Input
            placeholder="Enter your search query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            disabled={loading || !query.trim()}
            className="px-4"
            type="button"
          >
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </Card>

      {/* Settings */}
      <SearchSettings
        mode={searchMode}
        threshold={threshold}
        limit={limit}
        onThresholdChange={setThreshold}
        onLimitChange={setLimit}
        semanticWeight={semanticWeight}
        keywordWeight={keywordWeight}
        onSemanticWeightChange={setSemanticWeight}
        onKeywordWeightChange={setKeywordWeight}
      />

      {/* Search History */}
      {searchHistory.length > 0 && query === '' && (
        <Card className="p-4 bg-muted/30 border">
          <h3 className="text-xs font-semibold mb-2">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 5).map((hist, idx) => (
              <button
                key={idx}
                onClick={() => handleHistoryClick(hist)}
                className="px-3 py-1 text-xs bg-background border rounded-full hover:bg-accent transition-colors"
              >
                {hist}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Summary */}
      {results.length > 0 && !loading && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Found <span className="font-semibold text-foreground">{results.length}</span> result{results.length !== 1 ? 's' : ''}
          </span>
          <span className="text-xs text-muted-foreground capitalize">
            Mode: {searchMode} • Threshold: {threshold.toFixed(2)}
          </span>
        </div>
      )}

      {/* Results */}
      <SearchResults
        results={results}
        loading={loading}
        onResultClick={onResultClick}
      />
    </div>
  );
};

export default ChatSearch;

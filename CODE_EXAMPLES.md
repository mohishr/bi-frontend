# Code Examples & Snippets

## API Usage Examples

### 1. Basic Semantic Search

```bash
# Frontend will make this request
curl "http://localhost:8000/search/semantic?q=invoice+processing&limit=10&threshold=0.5"
```

**Response:**
```json
{
  "query": "invoice processing",
  "search_type": "semantic",
  "count": 3,
  "results": [
    {
      "file_id": 1,
      "page_number": 2,
      "filename": "document.pdf",
      "text_snippet": "Invoice processing involves extracting...",
      "score": 0.87,
      "search_type": "semantic"
    }
  ]
}
```

### 2. Keyword Search with Exact Terms

```bash
curl "http://localhost:8000/search/keyword?q=invoice+number+12345&limit=5&threshold=0.1"
```

**Response:**
```json
{
  "query": "invoice number 12345",
  "search_type": "keyword",
  "count": 2,
  "results": [
    {
      "file_id": 5,
      "page_number": 1,
      "filename": "invoices_2024.pdf",
      "text_snippet": "Invoice number 12345 processed on 2024-01-15...",
      "score": 0.92,
      "search_type": "keyword"
    }
  ]
}
```

### 3. Hybrid Search (Recommended)

```bash
curl "http://localhost:8000/search/hybrid?q=quarterly+report&limit=15&semantic_weight=0.7&keyword_weight=0.3&threshold=0.5"
```

**Response:**
```json
{
  "query": "quarterly report",
  "search_type": "hybrid",
  "semantic_weight": 0.7,
  "keyword_weight": 0.3,
  "count": 5,
  "results": [
    {
      "file_id": 2,
      "page_number": 1,
      "filename": "q3_financial.xlsx",
      "text_snippet": "Q3 2024 Quarterly Report - Executive Summary...",
      "combined_score": 0.89,
      "search_type": "hybrid"
    }
  ]
}
```

## React Component Examples

### 1. Using ChatSearch Standalone

```tsx
import ChatSearch from '@/components/ChatSearch';
import type { SearchResult } from '@/types/search';

function MySearchPage() {
  const handleResultClick = (result: SearchResult) => {
    console.log('Selected result:', result);
    // Navigate to file or open preview
    window.open(`/files/${result.file_id}`, '_blank');
  };

  return (
    <div className="h-full">
      <ChatSearch onResultClick={handleResultClick} />
    </div>
  );
}
```

### 2. Integrating with File Manager

```tsx
import ChatSearch from '@/components/ChatSearch';
import FilePreview from '@/components/FilePreviewDialog';
import type { SearchResult } from '@/types/search';
import type { FileItem } from '@/types/file-manager';

export function App() {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleSearchResult = async (result: SearchResult) => {
    // Fetch full file details from your API
    const response = await fetch(`/api/files/${result.file_id}`);
    const file = await response.json();
    setSelectedFile(file);
    setShowPreview(true);
  };

  return (
    <div className="flex h-screen">
      <ChatSearch onResultClick={handleSearchResult} />
      {showPreview && selectedFile && (
        <FilePreview file={selectedFile} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
```

### 3. Custom Search Component

```tsx
import { useState } from 'react';
import { searchAPI } from '@/lib/search-api';
import type { SearchMode, SearchParams, SearchResult } from '@/types/search';

export function CustomSearch() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('hybrid');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params: SearchParams = {
        q: query,
        limit: 20,
        threshold: 0.5,
        semantic_weight: 0.7,
        keyword_weight: 0.3,
      };

      const response = await searchAPI.search(mode, params);
      setResults(response.results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search query..."
        className="w-full p-2 border rounded"
      />
      
      <select 
        value={mode}
        onChange={(e) => setMode(e.target.value as SearchMode)}
        className="p-2 border rounded"
      >
        <option value="semantic">Semantic</option>
        <option value="keyword">Keyword</option>
        <option value="hybrid">Hybrid</option>
      </select>

      <button
        onClick={handleSearch}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      <div className="space-y-2">
        {results.map((result) => (
          <div key={`${result.file_id}-${result.page_number}`} className="p-3 border rounded">
            <h3 className="font-semibold">{result.filename}</h3>
            <p className="text-sm text-gray-600">{result.text_snippet}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {result.search_type}
              </span>
              <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                Match: {(result.score * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## API Client Examples

### 1. Direct API Usage

```tsx
import { searchAPI } from '@/lib/search-api';
import type { SearchParams } from '@/types/search';

// Semantic search
const params: SearchParams = {
  q: 'invoice processing',
  limit: 10,
  threshold: 0.6,
};

const results = await searchAPI.semantic(params);
console.log(`Found ${results.count} results`);
results.results.forEach(r => {
  console.log(`${r.filename} (Page ${r.page_number}): ${r.score}`);
});
```

### 2. Error Handling

```tsx
import { searchAPI } from '@/lib/search-api';

async function performSearch(query: string) {
  try {
    const response = await searchAPI.hybrid({
      q: query,
      limit: 15,
      threshold: 0.5,
      semantic_weight: 0.7,
      keyword_weight: 0.3,
    });

    if (response.count === 0) {
      console.warn('No results found for:', query);
      // Handle empty results
    } else {
      console.log(`Found ${response.count} results`);
      // Process results
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Search failed:', error.message);
      // Specific error handling
    }
  }
}
```

### 3. Batch Searches

```tsx
import { searchAPI } from '@/lib/search-api';

async function batchSearch(queries: string[]) {
  const promises = queries.map(q =>
    searchAPI.semantic({
      q,
      limit: 10,
      threshold: 0.5,
    })
  );

  try {
    const results = await Promise.all(promises);
    results.forEach((r, idx) => {
      console.log(`Query ${idx}: ${r.count} results`);
    });
  } catch (error) {
    console.error('Batch search failed:', error);
  }
}

// Usage
batchSearch(['invoice', 'contract', 'report']);
```

## Type Definitions (TypeScript)

### 1. Search Types

```typescript
import type { SearchMode, SearchResult, SearchResponse, SearchParams } from '@/types/search';

// Use types in your code
const results: SearchResult[] = [];
const response: SearchResponse = await searchAPI.search('hybrid', params);
const mode: SearchMode = 'semantic';

// Define function signatures
function handleSearch(mode: SearchMode, query: string): Promise<SearchResult[]> {
  // implementation
}
```

### 2. Custom Type Extensions

```typescript
// Extend search results with additional metadata
interface ExtendedSearchResult extends SearchResult {
  relevancePercentage: number;
  summary: string;
  category: string;
}

// Create helper function
function enhanceResults(results: SearchResult[]): ExtendedSearchResult[] {
  return results.map(r => ({
    ...r,
    relevancePercentage: r.score * 100,
    summary: r.text_snippet.substring(0, 100),
    category: categorizeResult(r),
  }));
}
```

## Advanced Patterns

### 1. Search with Debounce

```tsx
import { useState, useEffect } from 'react';
import { searchAPI } from '@/lib/search-api';

function useDebounceSearch(query: string, delay = 500) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await searchAPI.hybrid({
          q: query,
          limit: 10,
          threshold: 0.5,
        });
        setResults(response.results);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading };
}

// Usage
function SearchComponent() {
  const [query, setQuery] = useState('');
  const { results, loading } = useDebounceSearch(query);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading && <p>Searching...</p>}
      {results.map(r => <div key={r.file_id}>{r.filename}</div>)}
    </div>
  );
}
```

### 2. Search with Caching

```tsx
const searchCache = new Map();

async function cachedSearch(query: string, mode: SearchMode) {
  const cacheKey = `${mode}:${query}`;
  
  if (searchCache.has(cacheKey)) {
    console.log('Using cached results');
    return searchCache.get(cacheKey);
  }

  const results = await searchAPI.search(mode, {
    q: query,
    limit: 10,
    threshold: 0.5,
  });

  searchCache.set(cacheKey, results);
  return results;
}

// Clear cache when files update
function clearSearchCache() {
  searchCache.clear();
}
```

### 3. Real-time Search Statistics

```tsx
interface SearchStats {
  totalQueries: number;
  averageResultCount: number;
  modeDistribution: Record<SearchMode, number>;
  averageThreshold: number;
}

function trackSearch(
  mode: SearchMode,
  resultCount: number,
  threshold: number,
  stats: SearchStats
): SearchStats {
  return {
    totalQueries: stats.totalQueries + 1,
    averageResultCount: 
      (stats.averageResultCount * stats.totalQueries + resultCount) / 
      (stats.totalQueries + 1),
    modeDistribution: {
      ...stats.modeDistribution,
      [mode]: (stats.modeDistribution[mode] || 0) + 1,
    },
    averageThreshold:
      (stats.averageThreshold * stats.totalQueries + threshold) /
      (stats.totalQueries + 1),
  };
}
```

## Migration from Old Search

If you're replacing an old search implementation:

```tsx
// OLD - Direct file search
const oldSearch = async (query: string) => {
  const response = await fetch(`/api/search?pattern=${query}`);
  return response.json(); // Returns FileItem[]
};

// NEW - Using Chat Search
const newSearch = async (query: string) => {
  const response = await searchAPI.hybrid({
    q: query,
    limit: 20,
    threshold: 0.5,
  });
  return response.results; // Returns SearchResult[]
};

// Adapter function
async function migrateSearch(query: string) {
  const results = await newSearch(query);
  // Convert SearchResult[] to FileItem[] if needed
  const files = await Promise.all(
    results.map(r =>
      fetch(`/api/files/${r.file_id}`).then(res => res.json())
    )
  );
  return files;
}
```

## Testing Examples

### 1. Unit Test (Jest/Vitest)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { searchAPI } from '@/lib/search-api';

describe('searchAPI', () => {
  it('should call semantic endpoint correctly', async () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        query: 'test',
        search_type: 'semantic',
        count: 1,
        results: [],
      }),
    });

    const result = await searchAPI.semantic({
      q: 'test',
      limit: 10,
      threshold: 0.5,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/search/semantic')
    );
    expect(result.count).toBe(1);
  });
});
```

### 2. Integration Test

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatSearch from '@/components/ChatSearch';

describe('ChatSearch Integration', () => {
  it('should search and display results', async () => {
    const user = userEvent.setup();
    render(<ChatSearch />);

    const input = screen.getByPlaceholderText(/search query/i);
    await user.type(input, 'invoice');
    await user.keyboard('{Enter}');

    // Wait for results
    const results = await screen.findByText(/results/i);
    expect(results).toBeInTheDocument();
  });
});
```

## Performance Optimization Tips

### 1. Lazy Load Results

```tsx
const [displayedResults, setDisplayedResults] = useState<SearchResult[]>([]);
const [allResults, setAllResults] = useState<SearchResult[]>([]);
const ITEMS_PER_PAGE = 10;

useEffect(() => {
  setDisplayedResults(allResults.slice(0, ITEMS_PER_PAGE));
}, [allResults]);

const loadMore = () => {
  const currentCount = displayedResults.length;
  setDisplayedResults(allResults.slice(0, currentCount + ITEMS_PER_PAGE));
};
```

### 2. Memoize Results

```tsx
import { useMemo } from 'react';

const memoizedResults = useMemo(() => {
  return results
    .sort((a, b) => b.score - a.score)
    .filter(r => r.score > threshold);
}, [results, threshold]);
```

## Summary

- **SearchAPI**: Use for all search operations
- **SearchResult**: Type for individual results
- **SearchParams**: Type for search parameters
- **SearchMode**: Type for search mode selection

Always handle errors and provide user feedback for better UX.

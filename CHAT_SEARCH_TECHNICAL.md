# Chat Search - Technical Implementation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React/TypeScript)              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            ChatSearch Component (Main)               │   │
│  │  - Manages search state and orchestration            │   │
│  │  - Handles user input and keyboard shortcuts         │   │
│  │  - Manages search history in localStorage            │   │
│  └──────────────────────────────────────────────────────┘   │
│           ↓              ↓              ↓                     │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐      │
│  │SearchMode    │ │SearchResults │ │SearchSettings   │      │
│  │Toggle        │ │Component     │ │Component        │      │
│  │              │ │              │ │                 │      │
│  │- Semantic    │ │- Display     │ │- Threshold      │      │
│  │- Keyword     │ │  results     │ │  slider         │      │
│  │- Hybrid      │ │- Loading     │ │- Limit control  │      │
│  │              │ │  state       │ │- Hybrid weights │      │
│  │              │ │- Empty state │ │                 │      │
│  └──────────────┘ └──────────────┘ └─────────────────┘      │
│           │              │              │                     │
│           └──────────────┼──────────────┘                     │
│                          ↓                                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Search API Layer (search-api.ts)             │   │
│  │  - HTTP client for all search endpoints              │   │
│  │  - Type-safe request/response handling               │   │
│  │  - Error handling and retries                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                     │
└──────────────────────────────────────────────────────────────┘
                           │
                    HTTP (REST API)
                           │
┌──────────────────────────────────────────────────────────────┐
│                Backend (FastAPI/Python)                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  GET /search/semantic?q=query&limit=10&threshold=0.5         │
│  GET /search/keyword?q=query&limit=10&threshold=0.1          │
│  GET /search/hybrid?q=query&limit=10&weights...              │
│           ↓              ↓              ↓                     │
│  ┌──────────────────────────────────────────────────┐        │
│  │    Vector Search / Query Processing              │        │
│  │  - FastEmbed (Dense embeddings)                  │        │
│  │  - SPLADE (Sparse embeddings)                    │        │
│  │  - Scoring & ranking                            │        │
│  └──────────────────────────────────────────────────┘        │
│           │              │              │                    │
│           └──────┬───────┴───────┬──────┘                    │
│                  ↓               ↓                            │
│  ┌────────────────────────┐  ┌────────────────────┐          │
│  │  Qdrant Vector Store   │  │  MySQL Text Store  │          │
│  │  - Dense vectors       │  │  - Full text       │          │
│  │  - Sparse vectors      │  │  - Page metadata   │          │
│  │  - Payloads            │  │  - Timestamps      │          │
│  └────────────────────────┘  └────────────────────┘          │
│           ↑                              ↑                    │
│           └──────────────────┬───────────┘                    │
│                              │                                │
│  ┌──────────────────────────────────────────────────┐        │
│  │    Embedding & Vectorization (Background)        │        │
│  │  - OCR/Text extraction from documents            │        │
│  │  - Chunking into pages                           │        │
│  │  - Dense embedding generation                    │        │
│  │  - Sparse embedding generation                   │        │
│  └──────────────────────────────────────────────────┘        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## File Structure & Relationships

```
src/
├── components/
│   ├── ChatSearch.tsx
│   │   ├── imports: SearchModeToggle, SearchResults, SearchSettings
│   │   ├── state: query, mode, results, loading, error, settings
│   │   ├── hooks: useCallback, useEffect, useState
│   │   └── handlers: performSearch(), handleKeyPress(), handleHistoryClick()
│   │
│   ├── SearchModeToggle.tsx
│   │   ├── Props: currentMode, onModeChange, disabled
│   │   ├── Renders: 3 buttons for Semantic/Keyword/Hybrid
│   │   └── Uses: lucide-react icons
│   │
│   ├── SearchResults.tsx
│   │   ├── Props: results[], loading, onResultClick
│   │   ├── State: Handles loading & empty states
│   │   └── Renders: ScrollArea with result cards
│   │
│   ├── SearchSettings.tsx
│   │   ├── Props: mode, threshold, limit, weights, handlers
│   │   ├── State: expanded (collapsible)
│   │   └── Features:
│   │       ├── Native HTML range inputs
│   │       ├── Mode-specific threshold ranges
│   │       └── Hybrid weight sliders with sync
│   │
│   └── MySidebar.tsx (Updated)
│       └── Added: "Search" navigation button
│
├── lib/
│   ├── search-api.ts
│   │   ├── Exports: searchAPI object
│   │   ├── Methods:
│   │   │   ├── semantic(params)
│   │   │   ├── keyword(params)
│   │   │   ├── hybrid(params)
│   │   │   └── search(mode, params) - router function
│   │   └── Base URL: import.meta.env.VITE_API_BASE || localhost:8000
│   │
│   └── file-utils.tsx (Existing)
│
├── types/
│   ├── search.ts (New)
│   │   ├── SearchResult interface
│   │   ├── SearchResponse interface
│   │   ├── SearchMode type union
│   │   └── SearchParams interface
│   │
│   └── file-manager.ts (Existing)
│
└── App.tsx (Updated)
    ├── Added: import ChatSearch
    ├── Added: activeView type union includes 'chat-search'
    ├── Added: handleChatSearchResult() handler
    └── Added: Conditional rendering for ChatSearch view
```

## State Management

### ChatSearch Component State

```typescript
// Search State
const [query, setQuery] = useState<string>('');
const [searchMode, setSearchMode] = useState<SearchMode>('hybrid');
const [results, setResults] = useState<SearchResult[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);

// Settings State
const [threshold, setThreshold] = useState<number>(0.5);
const [limit, setLimit] = useState<number>(10);
const [semanticWeight, setSemanticWeight] = useState<number>(0.7);
const [keywordWeight, setKeywordWeight] = useState<number>(0.3);

// History State
const [searchHistory, setSearchHistory] = useState<string[]>([]);
```

### State Flow

```
User Input
   ↓
[query] → validateInput() → performSearch()
   ↓
[loading = true]
   ↓
searchAPI.search(mode, params)
   ↓
[loading = false]
   ↓
setResults(response.results) OR setError(message)
   ↓
saveToHistory(query)
   ↓
Render results / error
```

## Key Features Implementation

### 1. Search Mode Toggle

```tsx
// SearchModeToggle.tsx
const modes = [
  { mode: 'semantic', icon: <Zap />, description: 'Similar meaning' },
  { mode: 'keyword', icon: <Search />, description: 'Exact terms' },
  { mode: 'hybrid', icon: <MessageSquare />, description: 'Combined' }
];

// Dynamic styling based on currentMode
className={currentMode === mode ? 'active' : 'inactive'}
```

### 2. Dynamic Threshold Range

```tsx
// Based on search mode
const getThresholdRange = () => {
  switch (mode) {
    case 'semantic': return { min: 0.3, max: 0.95, step: 0.05 };
    case 'keyword': return { min: 0.1, max: 0.5, step: 0.05 };
    default: return { min: 0.1, max: 0.95, step: 0.05 };
  }
};
```

### 3. Hybrid Weight Synchronization

```tsx
// When semantic weight changes, keyword weight auto-adjusts
const handleSemanticChange = (newSemantic: number) => {
  const newKeyword = 1 - newSemantic;
  onSemanticWeightChange(newSemantic);
  onKeywordWeightChange(newKeyword); // Auto-sync
};
```

### 4. Search History with LocalStorage

```tsx
// Load on mount
useEffect(() => {
  const saved = localStorage.getItem('searchHistory');
  if (saved) setSearchHistory(JSON.parse(saved));
}, []);

// Save after each search
const saveToHistory = useCallback((q: string) => {
  const updated = [q, ...searchHistory.filter(h => h !== q)].slice(0, 10);
  setSearchHistory(updated);
  localStorage.setItem('searchHistory', JSON.stringify(updated));
}, [searchHistory]);
```

### 5. Keyboard Support

```tsx
const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter' && !loading) {
    handleSearch();
  }
};
```

### 6. API Integration

```typescript
// search-api.ts - All three search methods follow same pattern
export const searchAPI = {
  semantic: async (params: SearchParams): Promise<SearchResponse> => {
    const queryParams = new URLSearchParams({
      q: params.q,
      limit: params.limit.toString(),
      threshold: params.threshold.toString(),
    });
    const response = await fetch(`${API_BASE}/search/semantic?${queryParams}`);
    if (!response.ok) throw new Error('Semantic search failed');
    return response.json();
  },
  // ... keyword and hybrid similar
};
```

## Component Composition

```
App.tsx
├── Router logic: activeView === 'chat-search'
└── If chat-search:
    └── ChatSearch.tsx (Main Container)
        ├── Header (Title + Description)
        ├── SearchModeToggle.tsx
        ├── Search Input + Button Card
        ├── SearchSettings.tsx
        │   ├── Threshold Slider
        │   ├── Limit Slider
        │   └── [If Hybrid] Weight Sliders
        ├── Search History Pills
        ├── Error Alert
        ├── Results Summary
        └── SearchResults.tsx
            └── ScrollArea
                └── Result Cards[]
                    ├── Filename + Page Badge
                    ├── Text Snippet
                    ├── Score + Type Badge
                    └── External Link Icon
```

## Data Flow for Search

```
User Interaction:
1. User types query → setQuery(e.target.value)
2. User presses Enter or clicks button
3. handleSearch() → performSearch(query)

Search Execution:
4. Validate query (not empty)
5. setLoading(true), setError(null)
6. Build SearchParams object with:
   - q: query string
   - limit: results count
   - threshold: similarity threshold
   - semantic_weight (if hybrid)
   - keyword_weight (if hybrid)

7. Call searchAPI.search(searchMode, searchParams)
8. API makes HTTP request to backend

Response Handling:
9. Parse SearchResponse
10. setResults(response.results)
11. if count === 0: setError("No results found")
12. saveToHistory(query)
13. setLoading(false)

Error Handling:
14. Catch and display error in Alert component
15. Clear results on error

Rendering:
16. Results display with:
    - Loading spinner (while loading)
    - Error alert (if failed)
    - Empty state (if no results)
    - Result cards (if successful)
```

## Performance Optimizations

### 1. useCallback Dependencies

```tsx
// Only recreates when dependencies change
const performSearch = useCallback(async (query: string) => {
  // ...search logic
}, [searchMode, threshold, limit, semanticWeight, keywordWeight, saveToHistory]);
```

### 2. Native HTML Inputs

- Uses `<input type="range">` instead of external slider library
- Reduces bundle size
- Better browser support

### 3. LocalStorage Caching

- Search history stored locally
- No additional API calls for history
- Instant retrieval

### 4. Conditional Rendering

```tsx
// Only render search history if empty query
{searchHistory.length > 0 && query === '' && <SearchHistory />}

// Conditional result count display
{results.length > 0 && !loading && <ResultsSummary />}
```

## Error Handling

```tsx
try {
  const response = await searchAPI.search(searchMode, searchParams);
  setResults(response.results);
  if (response.count === 0) {
    setError('No results found. Try adjusting query or threshold.');
  }
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'Search failed';
  setError(errorMessage);
  setResults([]);
}
```

## Type Safety

All interactions are fully typed:

```typescript
// SearchParams defines API request
interface SearchParams {
  q: string;
  limit: number;
  threshold: number;
  semantic_weight?: number;
  keyword_weight?: number;
}

// SearchResponse defines API response
interface SearchResponse {
  query: string;
  search_type: 'semantic' | 'keyword' | 'hybrid';
  count: number;
  results: SearchResult[];
  semantic_weight?: number;
  keyword_weight?: number;
}

// SearchResult defines individual result
interface SearchResult {
  file_id: number;
  page_number: number;
  filename: string;
  text_snippet: string;
  score: number;  // 0-1
  search_type: 'semantic' | 'keyword' | 'hybrid';
}

// SearchMode restricts to valid values
type SearchMode = 'semantic' | 'keyword' | 'hybrid';
```

## Testing Scenarios

### Unit Tests

```typescript
describe('ChatSearch', () => {
  it('should perform search on Enter key', () => {});
  it('should update results on successful search', () => {});
  it('should display error on failed search', () => {});
  it('should save query to history', () => {});
  it('should load history from localStorage', () => {});
});

describe('SearchSettings', () => {
  it('should sync semantic and keyword weights', () => {});
  it('should show correct threshold range per mode', () => {});
});
```

### Integration Tests

```typescript
describe('Search Integration', () => {
  it('should call correct API endpoint per mode', () => {});
  it('should pass correct parameters to API', () => {});
  it('should handle API errors gracefully', () => {});
});
```

## Configuration

### Environment Variables

```bash
VITE_API_BASE=http://localhost:8000
```

### API Endpoints Required

```
POST /files/upload
GET /files/{file_id}/parsing-status
GET /search/semantic?q=...&limit=...&threshold=...
GET /search/keyword?q=...&limit=...&threshold=...
GET /search/hybrid?q=...&limit=...&semantic_weight=...&keyword_weight=...
GET /search/files/{file_id}/vector-count
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires modern JS (ES2020+)
- Uses Fetch API (no IE support)

## Accessibility

- ✅ Keyboard navigation (Enter to search)
- ✅ ARIA labels on buttons
- ✅ Color contrast meets WCAG AA
- ✅ Focus indicators on interactive elements
- ✅ Semantic HTML (buttons, inputs, headings)

## Maintenance & Future Updates

### Code Organization

- Separation of concerns: Components, API layer, Types
- Single Responsibility Principle: Each component does one thing
- DRY: SearchSettings handles all setting logic

### Adding New Features

1. **New Search Mode**: Add to `SearchMode` type, update SearchModeToggle UI, add API method
2. **New Setting**: Add to SearchSettings component, pass to performSearch()
3. **New Result Field**: Update `SearchResult` interface, render in SearchResults

### Performance Monitoring

Track these metrics:
- Search response time
- Error rates
- Most common search modes
- Typical threshold values used

# 🏗️ Chat Search Architecture Overview

## Complete System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         BROWSER / FRONTEND                                   │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                         React App (main.tsx)                            │ │
│  │                                                                          │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                    App.tsx (Main Router)                          │ │ │
│  │  │                                                                    │ │ │
│  │  │  State:                                                           │ │ │
│  │  │  • activeView: 'recent' | 'chat-search' | ...                   │ │ │
│  │  │  • files: FileItem[]                                            │ │ │
│  │  │  • previewFile: FileItem | null                                 │ │ │
│  │  │                                                                    │ │ │
│  │  │  Conditionally Renders:                                          │ │ │
│  │  │  IF activeView === 'chat-search'                                 │ │ │
│  │  │    ↓ Render ChatSearch (NEW!)                                    │ │ │
│  │  │  ELSE                                                             │ │ │
│  │  │    ↓ Render FilterBar + FileList (Original)                      │ │ │
│  │  │                                                                    │ │ │
│  │  │  Handlers:                                                        │ │ │
│  │  │  • handleChatSearchResult(result) [NEW!]                         │ │ │
│  │  │    └─ Opens file preview from search result                      │ │ │
│  │  └────────────────────────────────────────────────────────────────────┘ │ │
│  │                              ▲                                           │ │
│  │                              │                                           │ │
│  │                    (Routes activeView)                                   │ │
│  │                              │                                           │ │
│  │         ┌────────────────────┼────────────────────┐                     │ │
│  │         │                    │                    │                     │ │
│  │         ▼                    ▼                    ▼                     │ │
│  │    ┌──────────┐        ┌──────────────────┐  ┌──────────────┐         │ │
│  │    │MySidebar │        │  ChatSearch      │  │FilterBar +   │         │ │
│  │    │  (NAV)   │        │  (NEW)           │  │FileList      │         │ │
│  │    │          │        │                  │  │              │         │ │
│  │    │ Button:  │        │ Components:      │  │              │         │ │
│  │    │ "Search" │        │ • Input Field    │  │ Tag Filter   │         │ │
│  │    │          │        │ • Mode Toggle    │  │ Date Filter  │         │ │
│  │    │ onClick→ │        │ • Results        │  │ Type Filter  │         │ │
│  │    │setActive │        │ • Settings       │  │ Sorting      │         │ │
│  │    │View      │        │ • History        │  │              │         │ │
│  │    └──────────┘        │                  │  └──────────────┘         │ │
│  │                        │ API Integration: │                           │ │
│  │                        │ ↓ searchAPI      │                           │ │
│  │                        └──────────────────┘                           │ │
│  │                             │ │ │                                     │ │
│  └─────────────────────────────┼─┼─┼─────────────────────────────────────┘ │
│                                │ │ │                                         │
│                                ▼ ▼ ▼                                         │
│                    ┌──────────────────────────┐                              │
│                    │ search-api.ts (NEW!)     │                              │
│                    │                          │                              │
│                    │ searchAPI.{             │                              │
│                    │   semantic()             │                              │
│                    │   keyword()              │                              │
│                    │   hybrid()               │                              │
│                    │   search(mode, params)   │                              │
│                    │ }                        │                              │
│                    │                          │                              │
│                    │ + Error Handling         │                              │
│                    │ + Logging                │                              │
│                    └──────────────┬───────────┘                              │
│                                   │                                          │
│                    ┌──────────────┴──────────┐                              │
│                    │ search.ts (NEW!)        │                              │
│                    │ Type Definitions        │                              │
│                    │                         │                              │
│                    │ • SearchMode            │                              │
│                    │ • SearchResult          │                              │
│                    │ • SearchResponse        │                              │
│                    │ • SearchParams          │                              │
│                    └─────────────────────────┘                              │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ HTTP GET Requests
                                     │
                   ┌─────────────────┼─────────────────┐
                   │                 │                 │
                   ▼                 ▼                 ▼
        ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
        │ /search/       │ │ /search/       │ │ /search/       │
        │ semantic       │ │ keyword        │ │ hybrid         │
        │                │ │                │ │                │
        │ q=test         │ │ q=test         │ │ q=test         │
        │ limit=10       │ │ limit=10       │ │ limit=10       │
        │ threshold=0.5  │ │ threshold=0.2  │ │ threshold=0.5  │
        │                │ │                │ │ semantic_w=0.7 │
        │                │ │                │ │ keyword_w=0.3  │
        └────────────────┘ └────────────────┘ └────────────────┘
                   │                 │                 │
                   └─────────────────┼─────────────────┘
                                     │
                                     ▼
        ┌────────────────────────────────────────────────────────┐
        │                  BACKEND SERVER                        │
        │            (http://localhost:8000)                     │
        │                                                        │
        │  ┌──────────────────────────────────────────────────┐ │
        │  │         Search Service                          │ │
        │  │                                                  │ │
        │  │  ┌─────────────────────────────────────────┐   │ │
        │  │  │ Semantic Search Engine                  │   │ │
        │  │  │ (Dense embeddings + Vector DB)         │   │ │
        │  │  └─────────────────────────────────────────┘   │ │
        │  │                                                  │ │
        │  │  ┌─────────────────────────────────────────┐   │ │
        │  │  │ Keyword Search Engine                   │   │ │
        │  │  │ (Full-text + Sparse vectors)            │   │ │
        │  │  └─────────────────────────────────────────┘   │ │
        │  │                                                  │ │
        │  │  ┌─────────────────────────────────────────┐   │ │
        │  │  │ Hybrid Search (Both combined)           │   │ │
        │  │  │ with configurable weights               │   │ │
        │  │  └─────────────────────────────────────────┘   │ │
        │  └──────────────────────────────────────────────────┘ │
        │           ↓  ↓  ↓  (All return)                       │
        │  ┌──────────────────────────────────────────────────┐ │
        │  │  Search Response (JSON)                         │ │
        │  │  {                                              │ │
        │  │    count: 5,                                   │ │
        │  │    results: [                                 │ │
        │  │      {                                         │ │
        │  │        file_id: 123,                          │ │
        │  │        filename: "doc.pdf",                   │ │
        │  │        page_number: 1,                        │ │
        │  │        text_snippet: "...",                   │ │
        │  │        score: 0.85,                           │ │
        │  │        search_type: "hybrid"                  │ │
        │  │      },                                        │ │
        │  │      ...                                       │ │
        │  │    ]                                           │ │
        │  │  }                                              │ │
        │  └──────────────────────────────────────────────────┘ │
        │                                                        │
        └────────────────────────────────────────────────────────┘
                                     │
                                     │ Response JSON
                                     │
        ┌────────────────────────────┴──────────────────────────┐
        │                                                        │
        ▼                                                        ▼
    SearchResults Component                              Error Handler
    (Display Results)                                  (Show Error Alert)
        │
        ├─ Loading Spinner (while fetching)
        │
        ├─ Result Cards (when ready)
        │  ├─ Filename + Page Number
        │  ├─ Text Snippet
        │  ├─ Match Score
        │  └─ onClick → onResultClick(result)
        │
        ├─ Empty State (no results)
        │
        └─ Error Alert (if failed)
                   │
                   ▼
         User Clicks Result
                   │
                   ▼
         handleChatSearchResult()
                   │
                   ├─ Find file in state
                   ├─ OR create new FileItem
                   │
                   ▼
         openPreview(file)
                   │
                   ├─ fetchFileContent()
                   │  ├─ GET /api/{file_id}
                   │  └─ Decode base64
                   │
                   ▼
         FilePreviewDialog
         (Shows file content)
```

---

## Component Dependencies

```
ChatSearch.tsx (Main Component)
│
├── Imports from:
│   ├── React
│   ├── UI Components
│   │   ├── Button
│   │   ├── Input
│   │   ├── Card
│   │   ├── Alert
│   │   └── Icons (Lucide)
│   │
│   ├── Child Components
│   │   ├── SearchModeToggle
│   │   ├── SearchResults
│   │   └── SearchSettings
│   │
│   ├── API Layer
│   │   └── searchAPI (from search-api.ts)
│   │
│   └── Types (from search.ts)
│       ├── SearchMode
│       ├── SearchResult
│       ├── SearchResponse
│       └── SearchParams
│
└── Used By:
    └── App.tsx
        ├── Conditional rendering
        ├── Props: onResultClick
        └── Handler: handleChatSearchResult
```

---

## Data Flow - Complete Journey

```
1. USER INTERACTION
   └─ Click "Search" in Sidebar
      └─ MySidebar.tsx: onClick={() => onSelectView('chat-search')}
         └─ Updates App.tsx: activeView = 'chat-search'

2. VIEW RENDERING
   └─ App.tsx conditional render
      └─ Shows <ChatSearch onResultClick={handler} />
         └─ ChatSearch component mounts

3. USER TYPES & SEARCHES
   └─ User types query in input
      └─ onChange={e => setQuery(e.target.value)}
   └─ User presses Enter or clicks Search
      └─ handleKeyPress() or onClick()
         └─ Both call performSearch(query)

4. SEARCH EXECUTION
   └─ performSearch(query)
      ├─ Validate query (not empty)
      ├─ Set loading = true
      ├─ Build SearchParams
      └─ Call searchAPI.search(mode, params)

5. API CALL
   └─ searchAPI.search(mode, params)
      ├─ Route to endpoint based on mode
      │  ├─ 'semantic' → searchAPI.semantic()
      │  ├─ 'keyword' → searchAPI.keyword()
      │  └─ 'hybrid' → searchAPI.hybrid()
      │
      └─ Each endpoint:
         ├─ Build URLSearchParams
         ├─ fetch(${API_BASE}/search/${mode}?params)
         ├─ Check response.ok
         ├─ Return response.json()
         └─ OR throw error with details

6. RESPONSE HANDLING
   └─ Back in performSearch()
      ├─ Success branch:
      │  ├─ setResults(response.results)
      │  ├─ saveToHistory(query)
      │  ├─ Check if count === 0
      │  └─ Show "No results" if empty
      │
      └─ Error branch:
         ├─ Catch error
         ├─ setError(message)
         ├─ setResults([])
         └─ Show error alert

7. DISPLAY RESULTS
   └─ SearchResults component
      ├─ If loading: Show spinner
      ├─ If no results: Show empty state
      ├─ If error: handled in ChatSearch alert
      └─ If results: Show cards
         └─ Each card:
            ├─ Filename + Page number
            ├─ Text snippet
            ├─ Score badge
            ├─ Search type badge
            └─ onClick handler

8. USER CLICKS RESULT
   └─ onClick on result card
      └─ onResultClick(result)
         └─ Calls handleChatSearchResult() from App.tsx

9. PREVIEW OPENS
   └─ handleChatSearchResult(result)
      ├─ Extract file_id
      ├─ Find file in files[] state
      ├─ If found: use it
      ├─ If not: create FileItem
      └─ Call openPreview(file)

10. FILE LOADED
    └─ openPreview(file)
       ├─ Set previewFile state
       ├─ Set previewLoading = true
       ├─ Call fetchFileContent(file)
       │  └─ GET /api/{file_id}
       └─ Parse response based on file type:
          ├─ Text → Decode & display
          ├─ Image → Show image
          ├─ PDF → Embed PDF viewer
          ├─ Spreadsheet → Convert to HTML
          └─ Document → Convert from DOCX

11. PREVIEW DISPLAY
    └─ FilePreviewDialog renders
       ├─ File content displayed
       ├─ Download button available
       ├─ Tag management button
       └─ Close button
```

---

## State Management Map

### ChatSearch Component State
```javascript
// Search State
const [query, setQuery] = useState<string>('')
const [searchMode, setSearchMode] = useState<SearchMode>('hybrid')
const [results, setResults] = useState<SearchResult[]>([])
const [loading, setLoading] = useState<boolean>(false)
const [error, setError] = useState<string | null>(null)

// Settings State
const [threshold, setThreshold] = useState<number>(0.5)
const [limit, setLimit] = useState<number>(10)
const [semanticWeight, setSemanticWeight] = useState<number>(0.7)
const [keywordWeight, setKeywordWeight] = useState<number>(0.3)

// History State
const [searchHistory, setSearchHistory] = useState<string[]>([])
```

### App Component Relevant State
```javascript
const [activeView, setActiveView] = useState<'recent' | 'search' | 'tag' | 'date' | 'chat-search'>('recent')
const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
const [previewContent, setPreviewContent] = useState<PreviewContent | null>(null)
const [previewLoading, setPreviewLoading] = useState<boolean>(false)
```

---

## API Endpoints Reference

### Semantic Search
```
GET /search/semantic?q=test&limit=10&threshold=0.5

Response:
{
  "count": 5,
  "results": [
    {
      "file_id": 123,
      "filename": "document.pdf",
      "page_number": 1,
      "text_snippet": "...",
      "score": 0.85,
      "search_type": "semantic"
    }
  ]
}
```

### Keyword Search
```
GET /search/keyword?q=test&limit=10&threshold=0.2

Response: (same format as semantic)
```

### Hybrid Search
```
GET /search/hybrid?q=test&limit=10&threshold=0.5&semantic_weight=0.7&keyword_weight=0.3

Response: (same format as semantic)
```

---

## Technology Stack

### Frontend
- **React 19.2.0** - UI framework
- **TypeScript 5.9.3** - Type safety
- **Tailwind CSS 4.1.17** - Styling
- **Radix UI** - UI components
- **Lucide React** - Icons
- **Vite** - Build tool

### API Integration
- **Fetch API** - HTTP requests
- **URLSearchParams** - Query string building
- **Environment Variables** - Configuration

### State Management
- **React Hooks** - useState, useCallback, useEffect
- **localStorage** - Search history persistence

### No External Dependencies Added
✅ Zero new npm packages  
✅ Uses only existing project dependencies  
✅ Pure React/TypeScript solution

---

## Deployment Architecture

```
Development Environment          Production Environment
├─ localhost:5173                ├─ https://example.com
│  (Frontend Dev Server)         │  (Frontend CDN/Static)
│                                │
├─ localhost:8000                ├─ https://api.example.com:8000
│  (Backend API)                 │  (Backend API Server)
│                                │
└─ Node.js dev environment       └─ Production Build
   (npm run dev)                    (npm run build)
```

### Environment Variables
```
Development:
VITE_API_BASE=http://localhost:8000

Production:
VITE_API_BASE=https://api.example.com:8000
```

---

## Error Handling Architecture

```
ChatSearch Component
│
├─ performSearch()
│  │
│  ├─ try {
│  │  ├─ Validate query
│  │  ├─ Call searchAPI.search()
│  │  ├─ Process response
│  │  └─ Update state
│  │
│  └─ catch (error) {
│     ├─ Log error
│     ├─ Set error message
│     ├─ Show alert
│     └─ Clear results
│
├─ search-api.ts
│  │
│  ├─ try {
│  │  ├─ Build URL
│  │  ├─ fetch()
│  │  ├─ Check response.ok
│  │  └─ Return JSON
│  │
│  └─ catch (error) {
│     ├─ console.error()
│     ├─ Throw detailed error
│     └─ Include status code
│
└─ UI Error Display
   ├─ Red alert box
   ├─ Error message text
   ├─ User can dismiss
   └─ Can retry search
```

---

This architecture provides a robust, scalable, and maintainable chat search implementation integrated seamlessly with your existing file manager application.


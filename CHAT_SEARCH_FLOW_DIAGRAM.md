# Chat Search Integration Flow Diagram

## 🔄 Complete Flow: From Click to Display

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   main.tsx       │  Entry point - renders App component
│  (index entry)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           App.tsx                                        │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ State: activeView = 'chat-search' | 'recent' | 'search' | ...     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Handler: handleChatSearchResult(result)                          │  │
│  │   - Opens file preview                                           │  │
│  │   - Passes result data to FilePreviewDialog                      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Conditional Rendering:                                           │  │
│  │  if (activeView === 'chat-search')                               │  │
│  │    → render <ChatSearch onResultClick={handleChatSearchResult} />│  │
│  │  else                                                            │  │
│  │    → render <FilterBar/> + <FileList/>                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
         ▲                                    ▲
         │                                    │
    ┌────┴──────────────┐           ┌────────┴─────────────┐
    │                   │           │                      │
    │                   ▼           ▼                      │
┌──────────────────────────────────────┐  ┌────────────────────────┐
│     MySidebar.tsx                    │  │  ChatSearch.tsx        │
│  ┌──────────────────────────────────┐│  │                        │
│  │ Button: "Search"                 ││  │ ┌──────────────────────┤
│  │ onClick={() => onSelectView(     ││  │ │ States:              │
│  │   'chat-search'                  ││  │ │ • query              │
│  │ )}                               ││  │ │ • searchMode         │
│  │                                  ││  │ │ • results            │
│  │ → Sets App.activeView to         ││  │ │ • loading            │
│  │   'chat-search'                  ││  │ │ • error              │
│  │                                  ││  │ │ • threshold          │
│  │ → App shows ChatSearch instead   ││  │ │ • limit              │
│  │   of FilterBar/FileList          ││  │ │ • searchHistory      │
│  └──────────────────────────────────┘│  │ └──────────────────────┤
└──────────────────────────────────────┘  │                        │
                                           │ ┌──────────────────────┤
                                           │ │ Search Components:   │
                                           │ │ 1. SearchModeToggle  │
                                           │ │ 2. SearchSettings    │
                                           │ │ 3. SearchResults     │
                                           │ └──────────────────────┤
                                           │                        │
                                           └────────────────────────┘
```

---

## 🔍 Search Execution Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                    ChatSearch User Actions                           │
└──────────────────────────────────────────────────────────────────────┘

User Types Query    User Presses Enter     User Clicks Search Button
       │                    │                        │
       │                    ▼                        │
       │            handleKeyPress()                │
       │                    │                        │
       │                    ▼                        │
       │            e.preventDefault()  ◄────────────┘
       │                    │                      (also here)
       │                    ▼
       └──────────► performSearch(query)
                            │
                            ▼
              ┌─────────────────────────────┐
              │ Validate & Prepare Search   │
              │ • Check query not empty     │
              │ • Set loading = true        │
              │ • Clear error               │
              └──────────┬──────────────────┘
                         │
                         ▼
              ┌─────────────────────────────┐
              │ Build SearchParams          │
              │ • q: query                  │
              │ • limit: from settings      │
              │ • threshold: from settings  │
              │ • weights: from settings    │
              └──────────┬──────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────────┐
         │ Call searchAPI.search(mode, params)   │
         │                                       │
         │ Selects endpoint based on searchMode: │
         │ • 'semantic' → /search/semantic       │
         │ • 'keyword' → /search/keyword         │
         │ • 'hybrid' → /search/hybrid           │
         └───────────┬───────────────────────────┘
                     │
                     ▼
    ┌────────────────────────────────────────────┐
    │  Backend Response (http://localhost:8000)  │
    │                                            │
    │  {                                         │
    │    count: 5,                               │
    │    results: [                              │
    │      {                                     │
    │        file_id: 123,                       │
    │        filename: "doc.pdf",                │
    │        page_number: 1,                     │
    │        text_snippet: "...",                │
    │        score: 0.85,                        │
    │        search_type: "hybrid"               │
    │      },                                    │
    │      ...                                   │
    │    ]                                       │
    │  }                                         │
    └────────────┬─────────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
    Success          Error (catch)
         │                │
         ▼                ▼
    ┌─────────────┐  ┌─────────────────┐
    │ setResults  │  │ setError()      │
    │ saveHistory │  │ setResults([])  │
    │ setLoading  │  │ setLoading      │
    │ = false     │  │ = false         │
    └─────┬───────┘  └────────┬────────┘
          │                   │
          └─────────┬─────────┘
                    │
                    ▼
         ┌──────────────────────────┐
         │   SearchResults renders  │
         │                          │
         │ Shows:                   │
         │ • Loading spinner OR     │
         │ • Result cards OR        │
         │ • Empty state            │
         │ • Error alert            │
         └────────────┬─────────────┘
                      │
                      ▼
              ┌────────────────────────┐
              │ User clicks result     │
              │ onResultClick(result)  │
              │ passed to ChatSearch   │
              └──────────┬─────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │ App.handleChatSearchResult()       │
         │                                   │
         │ 1. Find file in current file list │
         │ 2. OR create new FileItem object  │
         │ 3. Call openPreview(file)         │
         └──────────────┬────────────────────┘
                        │
                        ▼
           ┌────────────────────────────┐
           │ FilePreviewDialog opens    │
           │                            │
           │ Shows:                     │
           │ • File content             │
           │ • Download button          │
           │ • Tag management button    │
           │ • Close button             │
           └────────────────────────────┘
```

---

## 📁 Component Hierarchy

```
App.tsx (Main Router)
│
├─── MySidebar.tsx
│    └─── Button: "Search" (onClick → activeView = 'chat-search')
│
└─── Conditional Rendering:
     │
     ├─── If activeView === 'chat-search':
     │    │
     │    └─── ChatSearch.tsx (Main Search Component)
     │         │
     │         ├─── Header (Title + Description)
     │         │
     │         ├─── SearchModeToggle.tsx
     │         │    └─── 3 Mode Buttons (Semantic, Keyword, Hybrid)
     │         │
     │         ├─── Search Input Card
     │         │    ├─── Input Field
     │         │    └─── Search Button (onClick handler)
     │         │
     │         ├─── SearchSettings.tsx
     │         │    ├─── Threshold Slider
     │         │    ├─── Results Limit Slider
     │         │    └─── Weights Sliders (Hybrid only)
     │         │
     │         ├─── Search History Card
     │         │    └─── Recent Search Buttons
     │         │
     │         ├─── Error Alert (if error)
     │         │
     │         ├─── Results Summary (if results)
     │         │
     │         └─── SearchResults.tsx
     │              └─── Result Cards (clickable)
     │                   └─── onClick → onResultClick(result)
     │
     └─── Else (Normal File Manager View):
          ├─── FilterBar.tsx (Tag, Date, Type filters)
          ├─── Local Search Input
          └─── FileList.tsx (File grid/list)

    FilePreviewDialog.tsx (Modal - separate from routing)
    └─── Opens when result clicked or file selected
    
    TagManagementDialog.tsx (Modal - separate from routing)
    └─── Opens for tag management
```

---

## 🔗 Data Flow: Result → Preview

```
ChatSearch.tsx
│
├─ State: results[] (from API)
│
└─ SearchResults.tsx (receives results)
   │
   ├─ Renders result cards
   │
   └─ onClick on card
       │
       ▼
   onResultClick(result) ← Passed as prop
       │
       ▼ (calls callback)
   App.handleChatSearchResult(result)
       │
       ├─ Gets file_id from result
       │
       ├─ Searches files[] for matching file_id
       │
       ├─ If found: uses file object
       │
       └─ If not found: creates new FileItem
               │
               ▼
           openPreview(file)
               │
               ├─ Sets previewFile state
               ├─ Sets previewLoading = true
               │
               └─ fetchFileContent(file)
                   │
                   ├─ Calls API: /api/{file_id}
                   │
                   ├─ Gets base64 content
                   │
                   └─ Converts based on file type:
                       ├─ Text/Code → decode & render
                       ├─ Image → data URL
                       ├─ PDF → data URL
                       ├─ Spreadsheet → convert to HTML
                       └─ Document → convert from DOCX
                           │
                           ▼
                   setPreviewContent(content)
                   setPreviewLoading = false
                           │
                           ▼
               FilePreviewDialog renders content
```

---

## ⚙️ API Integration Points

```
ChatSearch.tsx (Component)
│
├─ imports: searchAPI from '@/lib/search-api'
│
└─ performSearch()
   │
   └─ searchAPI.search(mode, params)
       │
       └─ search-api.ts (API Client)
           │
           ├─ semantic(params)
           │  └─ fetch(`${API_BASE}/search/semantic?...`)
           │
           ├─ keyword(params)
           │  └─ fetch(`${API_BASE}/search/keyword?...`)
           │
           ├─ hybrid(params)
           │  └─ fetch(`${API_BASE}/search/hybrid?...`)
           │
           └─ search(mode, params)
              └─ Routes to appropriate endpoint
                 │
                 ▼
         Backend: http://localhost:8000
         │
         ├─ GET /search/semantic
         ├─ GET /search/keyword
         └─ GET /search/hybrid
             │
             ▼
         Response: SearchResponse
         │
         ├─ count: number
         └─ results: SearchResult[]
             ├─ file_id
             ├─ filename
             ├─ page_number
             ├─ text_snippet
             ├─ score
             └─ search_type
                 │
                 ▼
         ChatSearch state: setResults(response.results)
                 │
                 ▼
         SearchResults component renders results
```

---

## 🎯 State Management Summary

### ChatSearch Component State
```
┌─ Search State
│  ├─ query: string                    (user input)
│  ├─ searchMode: 'semantic'|...       (selected search type)
│  ├─ results: SearchResult[]          (API results)
│  ├─ loading: boolean                 (API call in progress)
│  └─ error: string | null             (error message)
│
├─ Settings State
│  ├─ threshold: number                (search sensitivity)
│  ├─ limit: number                    (max results to return)
│  ├─ semanticWeight: number           (for hybrid mode)
│  └─ keywordWeight: number            (for hybrid mode)
│
└─ History State
   └─ searchHistory: string[]          (recent searches in localStorage)
```

### App Component State
```
┌─ View State
│  └─ activeView: 'recent'|...|'chat-search'
│
└─ Preview State (triggered by handleChatSearchResult)
   ├─ previewFile: FileItem | null
   ├─ previewContent: PreviewContent | null
   └─ previewLoading: boolean
```

---

## ✅ Integration Checklist

- [x] MySidebar has "Search" button
- [x] Search button calls `onSelectView('chat-search')`
- [x] App.tsx has conditional rendering for chat-search view
- [x] ChatSearch component imported and rendered
- [x] handleChatSearchResult implemented in App.tsx
- [x] onResultClick prop passed to ChatSearch
- [x] SearchModeToggle component integrated
- [x] SearchSettings component integrated
- [x] SearchResults component integrated
- [x] search-api.ts with all three endpoints
- [x] search.ts with all type definitions
- [x] Event handlers prevent page reload (preventDefault)
- [x] Loading states show spinner
- [x] Error states show alert
- [x] Empty states show helpful message
- [x] Search history saved to localStorage
- [x] Results clickable and trigger preview

---


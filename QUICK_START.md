# 🚀 Chat Search - Quick Start Guide

## Installation & Setup

### 1. No Additional Dependencies Needed ✅

The Chat Search feature uses only existing dependencies:
- React 19.2.0
- TypeScript 5.9.3
- Tailwind CSS 4.1.17
- Lucide React 0.556.0 (icons)
- Radix UI components (already installed)

### 2. Environment Configuration

Create or update your `.env` file:

```env
# Backend API base URL (adjust to your setup)
VITE_API_BASE=http://localhost:8000
```

If not set, defaults to `http://localhost:8000`

### 3. Verify Backend is Running

Make sure your FastAPI backend is running with these endpoints:

```bash
# Test semantic search endpoint
curl "http://localhost:8000/search/semantic?q=invoice&limit=5&threshold=0.5"

# Test keyword search endpoint
curl "http://localhost:8000/search/keyword?q=invoice&limit=5&threshold=0.1"

# Test hybrid search endpoint
curl "http://localhost:8000/search/hybrid?q=invoice&limit=5&semantic_weight=0.7&keyword_weight=0.3"
```

## Usage

### Accessing Chat Search

1. **From Sidebar**: Click the "Search" button in the left sidebar
2. **Navigation**: The sidebar will highlight "Search" when active
3. **Layout**: Chat Search takes the full main area

### Performing a Search

**Basic Search:**
1. Type your query in the search box
2. Press `Enter` or click the "Search" button
3. Results appear instantly below

**Example Queries:**
- Semantic: "Show me invoices about payment delays"
- Keyword: "invoice number 12345"
- Hybrid: "Q3 financial reports"

### Using Search Modes

#### 🔍 Semantic Search
- **Best for**: Conceptual, meaning-based searches
- **Examples**: 
  - "expense reimbursement"
  - "contract terms"
  - "compliance documentation"
- **Threshold**: Start with 0.5-0.7
- **Icon**: ⚡ (Lightning)

#### 🎯 Keyword Search
- **Best for**: Exact term matching
- **Examples**:
  - "invoice number Q4-2024-001"
  - "John Smith"
  - "account #12345"
- **Threshold**: Start with 0.1-0.3
- **Icon**: 🔍 (Magnifying Glass)

#### 🔀 Hybrid Search (Recommended)
- **Best for**: General use, uncertain query type
- **Examples**: Any search query
- **Default**: 70% semantic, 30% keyword
- **Icon**: 💬 (Message)
- **Adjustable**: Change weights in settings

### Customizing Search Settings

Click **"Settings"** to expand advanced options:

```
┌─────────────────────────────────┐
│ Settings         ▼              │
├─────────────────────────────────┤
│ ◇ Similarity Threshold: 0.50    │
│   ▁▂▃▄▅▆▇█ [slider]             │
│                                 │
│ ◇ Results Per Query: 10         │
│   ▁▂▃▄▅▆▇█ [slider]             │
│                                 │
│ ◇ Hybrid Search Weights:        │
│   ◇ Semantic Weight: 70%        │
│     ▁▂▃▄▅▆▇█ [slider]           │
│   ◇ Keyword Weight: 30%         │
│     ▁▂▃▄▅▆▇█ [slider]           │
└─────────────────────────────────┘
```

### Using Search History

Recent searches appear automatically when the search box is empty:

```
┌──────────────────────────────────────────┐
│ Recent Searches                          │
├──────────────────────────────────────────┤
│ [invoice processing] [q3 reports]        │
│ [compliance docs] [contract review]      │
│ [expense reimbursement]                  │
└──────────────────────────────────────────┘
```

Click any previous search to run it again instantly.

### Understanding Results

Each result shows:

```
┌────────────────────────────────────────┐
│ 📄 quarterly_report_Q3.pdf   Page 2    │ ← Filename & Page
├────────────────────────────────────────┤
│ Invoice processing involves extracting   │ ← Text Snippet
│ payment details from...                  │
├────────────────────────────────────────┤
│ [SEMANTIC] Match: 87%        →          │ ← Score & Type
└────────────────────────────────────────┘
```

**Click any result** to open the file preview in the file manager.

## Advanced Examples

### Example 1: Finding Invoices

```
Mode: Semantic
Query: "invoice processing documentation"
Threshold: 0.6
Limit: 15
```

Results: Documents discussing invoice workflows, payment processing, documentation

### Example 2: Searching by ID

```
Mode: Keyword
Query: "invoice number INV-2024-001"
Threshold: 0.1
Limit: 5
```

Results: Only documents containing exact "INV-2024-001" term

### Example 3: Balanced Search

```
Mode: Hybrid
Query: "quarterly financial statements"
Threshold: 0.5
Semantic Weight: 0.75
Keyword Weight: 0.25
Limit: 20
```

Results: Documents about quarterly financials (semantic) + exact "quarterly" matches (keyword)

## Tips & Tricks

### ⚡ Quick Tips

1. **Press Enter** while typing to search (no need to click button)
2. **Lower threshold** = more results (but less relevant)
3. **Higher threshold** = fewer results (but more precise)
4. **Hybrid mode** is best when uncertain
5. **Search history** saves automatically (last 10 searches)

### 🎯 Finding the Right Threshold

**Too many results?**
- Increase threshold slightly (+0.1)
- Try Keyword mode instead

**Too few results?**
- Decrease threshold slightly (-0.1)
- Try Hybrid mode instead

**Results not relevant?**
- Try rephrasing your query
- Switch to Keyword mode for exact terms
- Lower threshold to see more options

### 🔧 Optimal Settings by Use Case

| Use Case | Mode | Threshold | Limit | Weights |
|----------|------|-----------|-------|---------|
| Contract review | Semantic | 0.65 | 10 | N/A |
| ID lookup | Keyword | 0.15 | 5 | N/A |
| General search | Hybrid | 0.50 | 15 | 70/30 |
| Brainstorming | Semantic | 0.40 | 20 | N/A |
| Strict matching | Keyword | 0.30 | 10 | N/A |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Execute search |
| `Tab` | Focus next element |
| `Esc` | Clear search (future) |
| `Ctrl+K` | Focus search box (future) |

## Common Issues & Solutions

### ❌ "No results found"

**Solutions:**
1. Lower the threshold by 0.1-0.2
2. Try a different search mode (Hybrid if using Semantic)
3. Rephrase your query with simpler terms
4. Verify files have finished parsing: Check file upload status

### ❌ "Search failed" Error

**Solutions:**
1. Check backend is running: `curl http://localhost:8000/health`
2. Verify API base URL: Check `VITE_API_BASE` environment variable
3. Verify file has finished parsing before searching
4. Check browser console for detailed error messages

### ⏱️ Slow First Search

**Expected behavior!**
- First search takes 30-60 seconds (embedding models download)
- Subsequent searches are instant (cached)
- Normal and expected on first use

### 🎯 Wrong Results

**Try:**
1. Be more specific: "Q3 2024 financial reports" vs "reports"
2. Use Keyword mode for exact terms
3. Adjust threshold (lower for more, higher for fewer)
4. Try Hybrid mode with custom weights

## Performance Expectations

### Response Times

| Search Mode | Time (cached) | First Run |
|-------------|---------------|-----------|
| Semantic | 100-300ms | 45-60s |
| Keyword | 50-200ms | 45-60s |
| Hybrid | 150-400ms | 45-60s |

*First run includes embedding model download*

### Limits

- Max results per query: **100** (recommended ≤ 50)
- Max query length: **2000 characters**
- Max batch size: **5 concurrent searches**

## Architecture

```
Your Query
    ↓
Client Side Validation
    ↓
Build SearchParams
    ↓
HTTP Request to Backend
    ↓
Backend:
├─ Generate Embeddings
├─ Search Vector DB (Qdrant)
├─ Fetch Text from MySQL
└─ Rank & Sort Results
    ↓
Parse Response
    ↓
Display Results
```

## File Structure

```
src/
├── components/
│   ├── ChatSearch.tsx           ← Main component
│   ├── SearchModeToggle.tsx     ← Mode selector
│   ├── SearchResults.tsx        ← Results display
│   ├── SearchSettings.tsx       ← Settings panel
│   └── MySidebar.tsx            ← Updated with Search
├── lib/
│   └── search-api.ts            ← API client
├── types/
│   └── search.ts                ← TypeScript types
└── App.tsx                      ← Main app (updated)
```

## Troubleshooting Guide

### Issue: "Cannot connect to API"

**Check:**
- [ ] Backend server running: `curl http://localhost:8000/health`
- [ ] Correct URL in environment: `VITE_API_BASE=http://localhost:8000`
- [ ] CORS enabled on backend
- [ ] Firewall not blocking port 8000

### Issue: "Empty results always"

**Check:**
- [ ] Files have finished parsing
- [ ] Vector count > 0: Check `/search/files/{file_id}/vector-count`
- [ ] Try lower threshold
- [ ] Try Keyword mode

### Issue: "Browser console errors"

**Check:**
- [ ] Open DevTools (F12)
- [ ] Look for network errors in Console tab
- [ ] Check Network tab for failed requests
- [ ] Report error message

## Support

For detailed technical documentation, see:
- `CHAT_SEARCH_GUIDE.md` - Complete feature guide
- `CHAT_SEARCH_TECHNICAL.md` - Architecture & implementation

## Next Steps

1. ✅ Verify backend is running
2. ✅ Set `VITE_API_BASE` environment variable
3. ✅ Start frontend dev server: `npm run dev`
4. ✅ Click "Search" in sidebar
5. ✅ Try your first search!

Happy searching! 🎉

# Chat Search Integration Guide

## Overview

The Chat Search feature provides an intuitive interface for searching your documents using three different search modes: **Semantic**, **Keyword**, and **Hybrid** search. It integrates with your backend Qdrant vector database and MySQL text storage.

## Features

### 🔍 Three Search Modes

1. **Semantic Search**
   - Finds documents with similar meaning
   - Uses dense embeddings (384-dim)
   - Best for conversational queries ("Show me invoices about delays")
   - Recommended threshold: 0.5-0.7

2. **Keyword Search**
   - Finds documents with exact matching terms
   - Uses sparse SPLADE embeddings
   - Best for specific term searches ("invoice number 12345")
   - Recommended threshold: 0.1-0.3

3. **Hybrid Search** (Recommended)
   - Combines semantic + keyword results
   - Adjustable weights (default: 70% semantic, 30% keyword)
   - Best for production use (handles both semantic and exact matches)

### ⚙️ Configurable Settings

- **Similarity Threshold**: Adjust how strict the matching is
- **Results Per Query**: Control number of results (5-50)
- **Hybrid Weights**: Fine-tune semantic vs. keyword balance

### 💾 Search History

- Automatically saves last 10 searches
- Click to quickly re-run previous searches
- Stored in browser localStorage

## File Structure

```
src/
├── components/
│   ├── ChatSearch.tsx                 # Main chat search component
│   ├── SearchModeToggle.tsx          # Mode selector (Semantic/Keyword/Hybrid)
│   ├── SearchResults.tsx             # Results display component
│   ├── SearchSettings.tsx            # Configurable settings panel
│   └── MySidebar.tsx                 # Updated with "Search" navigation
├── lib/
│   └── search-api.ts                 # API client for search endpoints
├── types/
│   └── search.ts                     # TypeScript interfaces
└── App.tsx                            # Updated main app with routing
```

## Component API

### ChatSearch

Main search interface component.

```tsx
<ChatSearch onResultClick={(result) => handleSearchResult(result)} />
```

**Props:**
- `onResultClick`: Callback when user clicks a search result

**Search Result Object:**
```typescript
{
  file_id: number;
  page_number: number;
  filename: string;
  text_snippet: string;
  score: number;        // 0-1
  search_type: 'semantic' | 'keyword' | 'hybrid';
}
```

### SearchModeToggle

Toggle between search modes.

```tsx
<SearchModeToggle 
  currentMode={searchMode}
  onModeChange={setSearchMode}
  disabled={loading}
/>
```

### SearchResults

Display search results.

```tsx
<SearchResults 
  results={results}
  loading={loading}
  onResultClick={(result) => {}}
/>
```

### SearchSettings

Configure search parameters.

```tsx
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
```

## API Endpoints

### Semantic Search
```bash
GET /search/semantic?q=query&limit=10&threshold=0.5
```

### Keyword Search
```bash
GET /search/keyword?q=query&limit=10&threshold=0.1
```

### Hybrid Search
```bash
GET /search/hybrid?q=query&limit=10&semantic_weight=0.7&keyword_weight=0.3
```

## Usage Examples

### Basic Search

1. Click "Search" in the sidebar
2. Choose search mode
3. Enter your query
4. Press Enter or click Search button
5. Results appear instantly

### Advanced Usage

```tsx
// Use specific search mode with custom settings
const performSearch = async () => {
  const response = await searchAPI.hybrid({
    q: 'invoice processing',
    limit: 20,
    threshold: 0.6,
    semantic_weight: 0.8,
    keyword_weight: 0.2,
  });
  
  // Results include file_id, page_number, text_snippet, score
  console.log(response.results);
};
```

## Best Practices

### When to Use Each Mode

| Use Case | Mode | Threshold |
|----------|------|-----------|
| "Find similar documents" | Semantic | 0.6-0.7 |
| "Find documents with specific terms" | Keyword | 0.1-0.2 |
| "General search" | Hybrid | 0.5 |

### Performance Tips

1. **Batch Uploads**: Upload files in batches; queue limit is 5 concurrent
2. **Keep Limit ≤ 50**: Qdrant is fast, but payload size matters
3. **Monitor Parsing**: Use `/files/{file_id}/parsing-status` to check progress
4. **Threshold Tuning**: Start with defaults, adjust based on results

### Common Issues

**No results found?**
- ✅ Verify file parsing completed
- ✅ Check vectors were stored: `/search/files/{file_id}/vector-count`
- ✅ Try lower threshold value

**Slow first search?**
- ✅ FastEmbed models download on first use (30-60s)
- ✅ Subsequent searches are much faster (cached models)

## Environment Configuration

Set your API base URL in `.env` or through `import.meta.env`:

```typescript
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
```

## Keyboard Shortcuts

- **Enter**: Execute search from input field
- **Tab**: Focus on settings panel
- **Click result**: Open file preview

## Integration with File Manager

The Chat Search integrates seamlessly with the existing file manager:

- **Sidebar Navigation**: "Search" tab appears alongside "Recent Files"
- **File Preview**: Click any search result to preview the file
- **Consistent UI**: Uses same design system and components

## Future Enhancements

Potential improvements:
- [ ] Advanced filters in search UI
- [ ] Search result highlighting in file preview
- [ ] Saved searches/collections
- [ ] Multi-language support
- [ ] Search analytics/trending queries
- [ ] Voice search integration

## Troubleshooting

### Vector store not available
```bash
# Check Qdrant is running
curl http://localhost:6333/health
```

### Import errors
```bash
# Reinstall packages
pip install --force-reinstall qdrant-client fastembed
```

### API connection errors
- Verify `VITE_API_BASE` environment variable
- Check backend server is running
- Check CORS settings if cross-origin

## Code Cleanup & Maintenance

The implementation follows these principles:

✅ **Clean Architecture**
- Separation of concerns (components, API layer, types)
- Reusable components
- Type-safe with TypeScript

✅ **Performance**
- Native HTML range inputs (no external slider library)
- Efficient state management with useCallback
- LocalStorage for search history

✅ **UX**
- Keyboard shortcuts (Enter to search)
- Loading states
- Error handling
- Recent searches quick access
- Responsive design with Tailwind CSS

## Support & Documentation

For API documentation, see:
- Backend API: `/docs` endpoint (if Swagger/OpenAPI enabled)
- Vector storage: [Qdrant documentation](https://qdrant.tech/documentation/)
- Embedding models: [Sentence Transformers](https://www.sbert.net/)

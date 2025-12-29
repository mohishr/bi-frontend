# 📋 Deployment & Setup Checklist

## Pre-Deployment Checklist

### 1. Code Quality ✅
- [ ] Run TypeScript compiler: `tsc --noEmit`
- [ ] Check for TypeScript errors: `npm run lint`
- [ ] Verify no console.error or warnings
- [ ] All imports are used (no unused)
- [ ] No `any` types in new code

### 2. Testing
- [ ] Manual testing of all search modes
- [ ] Keyboard navigation (Enter key)
- [ ] Settings slider functionality
- [ ] Search history persistence
- [ ] Error state handling
- [ ] Empty results display
- [ ] Loading state animation

### 3. Environment Setup
- [ ] `.env` file created with `VITE_API_BASE`
- [ ] Backend API is running and accessible
- [ ] CORS enabled on backend (if needed)
- [ ] Database (MySQL) is running
- [ ] Qdrant vector store is running
- [ ] Embeddings models are downloaded

### 4. Backend Verification
```bash
# Test each endpoint
curl "http://localhost:8000/search/semantic?q=test&limit=5&threshold=0.5"
curl "http://localhost:8000/search/keyword?q=test&limit=5&threshold=0.1"
curl "http://localhost:8000/search/hybrid?q=test&limit=5&semantic_weight=0.7&keyword_weight=0.3"

# Check health
curl "http://localhost:8000/health"
```

### 5. Browser Compatibility
- [ ] Chrome/Chromium 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### 6. Performance
- [ ] Page loads in < 3 seconds
- [ ] Search responds in < 500ms (cached)
- [ ] No memory leaks (Chrome DevTools)
- [ ] No console errors or warnings
- [ ] localStorage working

### 7. Accessibility
- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] Color contrast OK (DevTools)
- [ ] Screen reader compatible
- [ ] Keyboard shortcuts work

## Installation Checklist

### 1. Clone/Pull Latest Code
```bash
git pull origin main
```

### 2. Install Dependencies (Already included)
```bash
npm install
# ✅ No new packages needed
```

### 3. Environment Configuration
```bash
# Create .env file
cat > .env << EOF
VITE_API_BASE=http://localhost:8000
EOF
```

### 4. Build for Production (Optional)
```bash
npm run build
# Check dist/ folder created
# Check dist/index.html exists
# Check all assets are bundled
```

### 5. Run Development Server
```bash
npm run dev
# Server should start on http://localhost:5173
# Check for TypeScript errors
```

## Pre-Launch Verification

### 1. Component Tests
```typescript
// Test each component loads
✅ ChatSearch renders
✅ SearchModeToggle renders
✅ SearchResults renders
✅ SearchSettings renders
```

### 2. API Integration Tests
```bash
# Test semantic search
curl -G "http://localhost:8000/search/semantic" \
  -d "q=test" -d "limit=5" -d "threshold=0.5"
# Expected: JSON with results array

# Test keyword search
curl -G "http://localhost:8000/search/keyword" \
  -d "q=test" -d "limit=5" -d "threshold=0.1"
# Expected: JSON with results array

# Test hybrid search
curl -G "http://localhost:8000/search/hybrid" \
  -d "q=test" -d "limit=5" \
  -d "semantic_weight=0.7" -d "keyword_weight=0.3"
# Expected: JSON with results array
```

### 3. User Interface Tests
```
Workflow 1: Basic Search
□ Click "Search" in sidebar
□ See search interface
□ Type "test" in input
□ Press Enter
□ Results appear (or error message)

Workflow 2: Mode Switching
□ Click "Semantic" mode
□ Perform search
□ Click "Keyword" mode
□ Perform search
□ Click "Hybrid" mode
□ Perform search
✅ All work correctly

Workflow 3: Settings
□ Click "Settings"
□ See collapsible panel
□ Adjust threshold slider
□ Adjust limit slider
□ If hybrid: adjust weights
□ Click "Settings" to collapse
□ Perform new search with new settings
✅ Settings applied correctly

Workflow 4: History
□ Perform 2-3 searches
□ Clear search input
□ See recent searches
□ Click a recent search
□ Search runs with that query
✅ History works correctly

Workflow 5: Results
□ Click on a result
□ File preview opens (if file exists)
□ Can view file content
□ Can download file
□ Can manage tags
✅ File preview integration works
```

### 4. Error Handling Tests
```
Test 1: Empty Query
□ Click Search with empty query
□ See "Please enter a search query" error
✅ Validation works

Test 2: No Results
□ Search for very specific term
□ Get empty results
□ See "No results found" message
✅ Empty state works

Test 3: API Error (Backend Down)
□ Stop backend server
□ Try to search
□ See "Search failed" error
□ Check browser console for details
✅ Error handling works

Test 4: Network Error
□ Simulate network failure (DevTools)
□ Try to search
□ See appropriate error
✅ Network error handling works
```

## Production Deployment

### 1. Build Optimization
```bash
# Build for production
npm run build

# Check build output
ls -lh dist/

# Expected files:
# - index.html
# - assets/index-[hash].js (minified)
# - assets/index-[hash].css (minified)
```

### 2. Environment Variables (Production)
```bash
# Set correct API base for production
VITE_API_BASE=https://your-api-domain.com
# OR
VITE_API_BASE=http://api.internal.com:8000
```

### 3. Server Configuration
```nginx
# If using Nginx, ensure CORS headers (if backend separate):
add_header 'Access-Control-Allow-Origin' '*' always;
add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS' always;
add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
```

### 4. Backend Configuration
```python
# FastAPI CORS configuration
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 5. Database Checks
```sql
-- MySQL: Verify tables exist
SHOW TABLES;
-- Should have: files, file_text, (others)

-- Verify indexes
SHOW INDEX FROM files;
-- Should have: idx_parsing_state (if created)

-- Check sample data
SELECT COUNT(*) FROM files;
SELECT COUNT(*) FROM file_text;
```

### 6. Vector Store Checks
```bash
# Qdrant health check
curl http://localhost:6333/health

# Expected response: {"status":"ok"}

# Check collection exists
curl http://localhost:6333/collections/documents
```

## Monitoring & Maintenance

### 1. Weekly Checks
- [ ] Monitor error logs
- [ ] Check API response times
- [ ] Verify search quality
- [ ] Check file parsing queue
- [ ] Monitor database disk usage

### 2. Performance Metrics
```
Expected:
- Search response: 100-400ms (cached)
- First search: 45-60s (model download)
- Results load: <100ms
- API errors: <1%
- Database size: Monitor growth
```

### 3. User Feedback
- [ ] Collect search quality feedback
- [ ] Monitor common search queries
- [ ] Track error reports
- [ ] Gather feature requests

## Rollback Plan

If issues occur:

### Quick Rollback
```bash
# Revert to previous version
git revert <commit-hash>
npm run build
npm run dev
```

### Full Rollback
```bash
# If major issues, revert entire deployment
git checkout main~1
npm install
npm run build
# Redeploy
```

## Monitoring Dashboard

Track these metrics in production:

```
Search Performance:
├─ Average response time
├─ P95 response time
├─ Error rate
├─ Results per search
├─ Search mode distribution
│  ├─ Semantic: X%
│  ├─ Keyword: X%
│  └─ Hybrid: X%
└─ Most common queries

System Health:
├─ API availability
├─ Database connections
├─ Vector store status
├─ Memory usage
├─ Disk usage
└─ Error logs

User Behavior:
├─ Daily active users
├─ Searches per user
├─ Average threshold used
├─ Settings customization
└─ Feature usage
```

## Maintenance Tasks

### Daily
- [ ] Check error logs
- [ ] Monitor API availability
- [ ] Verify backup running

### Weekly
- [ ] Review search logs
- [ ] Check database growth
- [ ] Monitor vector store size

### Monthly
- [ ] Optimize indexes
- [ ] Archive old logs
- [ ] Update dependencies
- [ ] Security audit

## Troubleshooting Guide

### Issue: "Cannot connect to API"
```
1. Check backend is running
2. Verify VITE_API_BASE environment variable
3. Check CORS configuration
4. Check firewall/network connectivity
5. Check browser console for details
```

### Issue: "Search returns no results"
```
1. Verify files have finished parsing
2. Check vector count: /search/files/{file_id}/vector-count
3. Lower threshold value
4. Try Keyword mode instead
5. Check if documents are in database
```

### Issue: "Slow search performance"
```
1. Check database indexes
2. Check Qdrant performance
3. Monitor API response times
4. Check network latency
5. Review slow query logs
```

### Issue: "Memory usage increasing"
```
1. Check for memory leaks (Chrome DevTools)
2. Clear old localStorage data
3. Restart vector store service
4. Check for stuck connections
5. Review error logs
```

## Security Checklist

- [ ] No sensitive data in localStorage
- [ ] API uses HTTPS in production
- [ ] CORS properly configured
- [ ] Input validation on client
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF tokens if modifying data
- [ ] Rate limiting on API
- [ ] Error messages don't leak data

## Documentation Links

- Quick Start: `QUICK_START.md`
- Feature Guide: `CHAT_SEARCH_GUIDE.md`
- Technical Details: `CHAT_SEARCH_TECHNICAL.md`
- Code Examples: `CODE_EXAMPLES.md`
- Visual Guide: `VISUAL_GUIDE.md`
- Implementation Summary: `IMPLEMENTATION_SUMMARY.md`

## Sign-Off

- [ ] Development complete and tested
- [ ] Code reviewed
- [ ] Documentation reviewed
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Team trained on new feature
- [ ] Ready for production deployment

**Deployed on:** _______________
**Deployed by:** ________________
**Version:** ____________________

---

✅ **Ready for production!**

For questions or issues, refer to the documentation files or check the GitHub repository.

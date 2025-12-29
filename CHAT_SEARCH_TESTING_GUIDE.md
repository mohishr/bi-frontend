# Chat Search Testing & Verification Guide

## ✅ Pre-Flight Checklist

Before testing, verify these are in place:

### Code Files Exist
```bash
# Verify all chat search components exist
ls -la src/components/ChatSearch.tsx
ls -la src/components/SearchModeToggle.tsx
ls -la src/components/SearchResults.tsx
ls -la src/components/SearchSettings.tsx
ls -la src/lib/search-api.ts
ls -la src/types/search.ts
```

### Backend Ready
```bash
# Test backend is accessible
curl -X GET "http://localhost:8000/search/hybrid?q=test&limit=5&threshold=0.5"

# Expected response (even if no results):
{
  "count": 0,
  "results": []
}
```

### Dev Server Running
```bash
# Terminal 1: Start your app
npm run dev

# Should see output like:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
```

---

## 🧪 Step-by-Step Testing

### Test 1: Navigation to Search
**Objective**: Verify clicking Search button switches to chat search view

**Steps**:
1. Open app in browser: `http://localhost:5173`
2. Look for "Search" button in left sidebar
3. Click it
4. **Expected**: 
   - Main content area changes to show "Document Search" heading
   - Search input field appears
   - Three mode buttons appear (Semantic, Keyword, Hybrid)
   - Settings panel appears

**Status**: 
- [ ] ✅ Navigation works correctly

---

### Test 2: Search Mode Toggle
**Objective**: Verify all three search modes can be selected

**Steps**:
1. Make sure you're in Chat Search view
2. Look at three buttons: ⚡ Semantic, 🔍 Keyword, 💬 Hybrid
3. Click each button
4. **Expected**:
   - Button becomes highlighted/selected when clicked
   - Settings adjust based on selected mode:
     - Semantic: Threshold 0.5-0.7
     - Keyword: Threshold 0.1-0.3
     - Hybrid: Threshold 0.1-0.7 + Weight sliders

**Status**:
- [ ] ✅ Semantic mode selectable
- [ ] ✅ Keyword mode selectable
- [ ] ✅ Hybrid mode selectable

---

### Test 3: Search Input & Button
**Objective**: Verify search input accepts text and button works

**Steps**:
1. Click on the input field labeled "Enter your search query..."
2. Type: `test` (or any word)
3. Click the "Search" button
4. **Expected**:
   - Button text changes to "Searching..."
   - Loading spinner appears
   - Search executes (no page reload!)
   - Either results appear or error message shows

**Status**:
- [ ] ✅ Input field accepts text
- [ ] ✅ Search button clickable
- [ ] ✅ Page does NOT reload

---

### Test 4: Enter Key Search
**Objective**: Verify pressing Enter executes search

**Steps**:
1. Click on the input field
2. Type: `document` 
3. Press Enter key
4. **Expected**:
   - Search executes immediately (no page reload!)
   - Loading spinner appears
   - Results appear or error message

**Status**:
- [ ] ✅ Enter key triggers search
- [ ] ✅ Page does NOT reload

---

### Test 5: Search Results Display
**Objective**: Verify results display correctly (assuming backend has data)

**Setup**: Make sure your backend has indexed documents

**Steps**:
1. Search for a term that exists in your documents
2. **Expected Results**:
   - Result cards appear showing:
     - Filename (e.g., "document.pdf")
     - Page number badge (if applicable)
     - Text snippet preview
     - Match score percentage (e.g., "85%")
     - Search type badge (semantic/keyword/hybrid)
   - Cards are clickable (hover effect shows)

**Status**:
- [ ] ✅ Results display as cards
- [ ] ✅ Each result shows filename
- [ ] ✅ Each result shows score
- [ ] ✅ Results are clickable

---

### Test 6: Click Result to Preview
**Objective**: Verify clicking result opens file preview

**Steps**:
1. Have search results displayed
2. Click on one of the result cards
3. **Expected**:
   - File preview dialog opens
   - Shows file content (text, image, PDF, etc.)
   - Shows download button
   - Shows tag management button
   - Shows close button

**Status**:
- [ ] ✅ Result click opens preview
- [ ] ✅ Preview dialog displays
- [ ] ✅ Can close preview

---

### Test 7: Settings & Sliders
**Objective**: Verify settings controls work

**Steps**:
1. Look for "Settings" section (may need to expand)
2. Find "Threshold" slider
3. Drag slider left/right
4. **Expected**:
   - Slider moves smoothly
   - Value updates in real-time
   - For Hybrid mode: weight sliders appear
   - For other modes: weight sliders hidden

**Status**:
- [ ] ✅ Threshold slider works
- [ ] ✅ Results limit slider works
- [ ] ✅ Weights sliders visible in Hybrid mode

---

### Test 8: Search History
**Objective**: Verify search history saves and works

**Steps**:
1. Perform a search (e.g., "documents")
2. Clear the input field
3. **Expected**: 
   - "Recent Searches" section appears with your search
4. Click on the history item
5. **Expected**:
   - Input field gets filled with that search
   - You can press Enter to search again

**Status**:
- [ ] ✅ History saves after search
- [ ] ✅ History shows when input empty
- [ ] ✅ Clicking history item fills input

---

### Test 9: Error Handling - Empty Query
**Objective**: Verify error message for empty search

**Steps**:
1. Leave input field empty
2. Click Search button
3. **Expected**:
   - Error alert appears: "Please enter a search query"
   - Page does NOT reload

**Status**:
- [ ] ✅ Empty query shows error

---

### Test 10: Error Handling - Backend Down
**Objective**: Verify error handling when backend unavailable

**Setup**: Stop backend service (Ctrl+C)

**Steps**:
1. Type a search query
2. Click Search button
3. **Expected**:
   - Error alert appears with message like:
     - "Semantic search failed: Network error"
     - Or "Failed to connect to server"
   - Page does NOT reload
   - Can keep using the UI

**Status**:
- [ ] ✅ Backend down error shows gracefully

---

### Test 11: No Results Message
**Objective**: Verify friendly message when no results

**Steps**:
1. Search for a very specific or rare term
2. **Expected**:
   - Empty state shows with message:
     - "No results found. Try a different query."
   - No error alert (this is normal, not an error)

**Status**:
- [ ] ✅ Empty state displays correctly

---

### Test 12: Page Reload Prevention
**Objective**: Verify no page reload occurs on any search

**Steps**:
1. Open DevTools: F12
2. Go to Network tab
3. Look for any page reloads:
   - You should see only API calls (localhost:8000/search/...)
   - You should NOT see HTML page loads
4. Search multiple times
5. **Expected**: 
   - Only API requests to backend
   - No page reloads in Network tab
   - App state persists (query, history, etc.)

**Status**:
- [ ] ✅ No page reloads observed
- [ ] ✅ Only API calls made

---

### Test 13: Browser Console Check
**Objective**: Verify no errors in browser console

**Steps**:
1. Open DevTools: F12
2. Go to Console tab
3. Look for red error messages
4. Perform a search
5. **Expected**:
   - No red error messages
   - You may see info logs like "Fetching: http://..."
   - No TypeScript errors

**Status**:
- [ ] ✅ Console clean (no red errors)

---

### Test 14: Back to Recent Files
**Objective**: Verify can switch back from search

**Steps**:
1. In Chat Search view, click "Recent Files" button in sidebar
2. **Expected**:
   - Switches back to normal file manager view
   - Shows file grid/list with filters
   - Chat search disappears

**Status**:
- [ ] ✅ Can switch back to Recent Files

---

## 🔍 Debugging: If Something's Not Working

### Issue: "Page reloads when I click Search"

**Check 1**: Look at button element
```tsx
<Button
  type="button"      // ← Must have this
  onClick={(e) => {
    e.preventDefault();  // ← Must have this
    handleSearch();
  }}
>
```

**Check 2**: Look at Enter key handler
```tsx
if (e.key === 'Enter' && !loading) {
  e.preventDefault();  // ← Must have this
  handleSearch();
}
```

**Check 3**: Open DevTools (F12) → Network tab
- Click Search button
- Look for page reload (HTML request)
- If you see it, the event handlers need fixing

---

### Issue: "Search doesn't execute / nothing happens"

**Check 1**: Backend running?
```bash
curl "http://localhost:8000/search/hybrid?q=test&limit=5&threshold=0.5"
# Should return JSON, not error
```

**Check 2**: Browser console errors?
- Open DevTools: F12 → Console
- Look for red error messages
- Common: "CORS error" or "Network error"

**Check 3**: API Base URL
```javascript
// In browser console, type:
console.log(import.meta.env.VITE_API_BASE)
// Should show: http://localhost:8000 or your backend URL
```

---

### Issue: "Results don't show up"

**Check 1**: Backend returning results?
```bash
curl "http://localhost:8000/search/hybrid?q=test&limit=5&threshold=0.5"
# Check if "count" is > 0
```

**Check 2**: Threshold too high?
- Lower the threshold slider
- Try threshold 0.1 to see if any results appear

**Check 3**: Are documents indexed?
- Check backend logs for indexing completion
- Make sure documents were uploaded and processed

---

### Issue: "Can't click results to open preview"

**Check 1**: Is onResultClick prop working?
- Open DevTools Console
- Click a result
- Should see no errors

**Check 2**: FilePreviewDialog component exists?
```bash
ls -la src/components/FilePreviewDialog.tsx
# Should exist
```

---

## 📋 Final Verification

### Code Quality Check
```bash
# Run TypeScript check
npm run build  # or tsc --noEmit

# Should see NO errors related to:
# - ChatSearch.tsx
# - SearchModeToggle.tsx
# - SearchResults.tsx
# - SearchSettings.tsx
# - search-api.ts
# - search.ts
```

### Browser Compatibility
- [ ] ✅ Works in Chrome
- [ ] ✅ Works in Firefox
- [ ] ✅ Works in Safari
- [ ] ✅ Works in Edge

### Performance
- [ ] ✅ Search completes in < 5 seconds
- [ ] ✅ Results render smoothly
- [ ] ✅ No UI freezing or lag
- [ ] ✅ Memory usage stable

---

## ✅ Success Criteria

Chat Search is **WORKING** when:

1. ✅ Clicking "Search" in sidebar shows chat search interface
2. ✅ Search input accepts text
3. ✅ Clicking Search button executes search (no page reload!)
4. ✅ Pressing Enter executes search (no page reload!)
5. ✅ Three search modes (Semantic, Keyword, Hybrid) selectable
6. ✅ Settings sliders adjust search behavior
7. ✅ Results display as clickable cards (if backend has data)
8. ✅ Clicking result opens file preview
9. ✅ Error messages show gracefully
10. ✅ Search history saves and works
11. ✅ No page reloads occur
12. ✅ No console errors
13. ✅ Can switch back to Recent Files

---

## 📞 Quick Reference

### Common Commands
```bash
# Start development server
npm run dev

# Check for TypeScript errors
npm run build

# Start backend (adjust based on your backend)
python main.py
# or
java -jar backend.jar
# or
npm run server
```

### API Endpoints to Test
```bash
# Semantic Search
curl "http://localhost:8000/search/semantic?q=test&limit=5&threshold=0.5"

# Keyword Search
curl "http://localhost:8000/search/keyword?q=test&limit=5&threshold=0.2"

# Hybrid Search
curl "http://localhost:8000/search/hybrid?q=test&limit=5&threshold=0.5&semantic_weight=0.7&keyword_weight=0.3"
```

### Default Values
- API Base: `http://localhost:8000`
- Default Threshold: `0.5`
- Default Limit: `10`
- Semantic Weight (Hybrid): `0.7`
- Keyword Weight (Hybrid): `0.3`
- Search History: Last `10` searches

---

## 📚 Documentation
- Full Setup: See `QUICK_START.md`
- Architecture: See `CHAT_SEARCH_TECHNICAL.md`
- Code Examples: See `CODE_EXAMPLES.md`
- Integration Details: See `CHAT_SEARCH_INTEGRATION_CHECK.md`
- Flow Diagram: See `CHAT_SEARCH_FLOW_DIAGRAM.md`

---

**Last Updated**: December 15, 2025  
**Status**: ✅ Ready for Testing  
**Support**: Check browser console (F12) for detailed error messages


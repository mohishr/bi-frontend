# Search Fix Guide - Page Reload Issue

## ✅ Issues Fixed

### 1. **Page Reload on Search Click**
**Problem:** Clicking the Search button was causing a page reload.

**Root Causes Fixed:**
- Missing `type="button"` attribute on button element
- Missing `e.preventDefault()` on click handler
- Missing `e.preventDefault()` on Enter key handler

**Changes Made:**
```tsx
// BEFORE - Could cause form submission
<Button onClick={handleSearch}>Search</Button>

// AFTER - Prevents default behavior
<Button 
  onClick={(e) => {
    e.preventDefault();
    handleSearch();
  }}
  type="button"
>
  Search
</Button>
```

---

### 2. **Better Error Handling in API Calls**
**Problem:** If backend is down or unreachable, errors weren't being logged properly.

**Changes Made:**
- Added try-catch blocks to all three search endpoints (semantic, keyword, hybrid)
- Added console.error() logging for debugging
- Improved error messages with HTTP status codes
- Better network error detection

**Example:**
```typescript
// BEFORE
const response = await fetch(`${API_BASE}/search/semantic?${queryParams}`);
if (!response.ok) throw new Error('Semantic search failed');

// AFTER
try {
  const response = await fetch(`${API_BASE}/search/semantic?${queryParams}`);
  if (!response.ok) throw new Error(`Semantic search failed: ${response.status}`);
  return response.json();
} catch (error) {
  console.error('Semantic search error:', error);
  throw new Error(`Semantic search failed: ${error instanceof Error ? error.message : 'Network error'}`);
}
```

---

### 3. **Enter Key Handling**
**Problem:** Pressing Enter might not trigger search properly without preventDefault.

**Changes Made:**
```tsx
// BEFORE
const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter' && !loading) {
    handleSearch();
  }
};

// AFTER
const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter' && !loading) {
    e.preventDefault();  // ← Added this
    handleSearch();
  }
};
```

---

## 🔍 How to Test & Debug

### Step 1: Verify Backend is Running
```bash
curl -X GET "http://localhost:8000/search/hybrid?q=test&limit=5&threshold=0.5&semantic_weight=0.7&keyword_weight=0.3"
```

**Expected Response:**
```json
{
  "count": 5,
  "results": [
    {
      "filename": "document.pdf",
      "page_number": 1,
      "snippet": "...",
      "score": 0.85
    }
  ]
}
```

**If Backend is Down:**
You'll see error in browser console: `Semantic search failed: Network error`

---

### Step 2: Check Browser Console for Errors
1. Open Developer Tools: `F12`
2. Go to **Console** tab
3. Try searching
4. Look for any error messages

**Common Issues:**
- ❌ `Semantic search failed: Network error` → Backend not running
- ❌ `CORS error` → Backend CORS not configured
- ❌ `404 Not Found` → Wrong endpoint path
- ✅ No errors + results shown → Working correctly

---

### Step 3: Verify Environment Variable
**Check if API base URL is set correctly:**

```bash
# In your .env or .env.local file
VITE_API_BASE=http://localhost:8000
```

If not set, it defaults to `http://localhost:8000`

---

## 📋 Checklist to Get Search Working

- [ ] Backend search service is running on `http://localhost:8000`
- [ ] All three endpoints respond to GET requests:
  - [ ] `/search/semantic`
  - [ ] `/search/keyword`
  - [ ] `/search/hybrid`
- [ ] `VITE_API_BASE` environment variable is set (or using default localhost:8000)
- [ ] Dev server is running (`npm run dev`)
- [ ] Browser console shows no CORS or network errors
- [ ] Page does NOT reload when clicking Search button
- [ ] Results display correctly when search succeeds
- [ ] Error message shows when search fails

---

## 🚀 Quick Test

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Make sure backend is running:**
   ```bash
   # In another terminal, test the backend
   curl "http://localhost:8000/search/hybrid?q=test&limit=5&threshold=0.5"
   ```

3. **Open the app:**
   - Click "Search" button in sidebar
   - Type "test" in search box
   - Press Enter or click "Search" button
   - You should see results (or an error message in red)

4. **If still reloading:**
   - Check browser console (F12) for errors
   - Check that backend is responding to search requests
   - Look for CORS errors in Network tab

---

## 📝 Files Modified

1. **`src/components/ChatSearch.tsx`**
   - Added `type="button"` to Search button
   - Added `e.preventDefault()` in click and key handlers

2. **`src/lib/search-api.ts`**
   - Added try-catch blocks to all three search methods
   - Added console.error() for debugging
   - Improved error messages with status codes

---

## 💡 Additional Tips

**Enable Detailed Logging:**
Edit `src/lib/search-api.ts` to log requests:

```typescript
semantic: async (params: SearchParams): Promise<SearchResponse> => {
  const queryParams = new URLSearchParams({
    q: params.q,
    limit: params.limit.toString(),
    threshold: params.threshold.toString(),
  });
  const url = `${API_BASE}/search/semantic?${queryParams}`;
  console.log('Fetching:', url);  // ← Add this
  try {
    // ... rest of code
  }
}
```

Then check the Console tab to see which URLs are being requested.

---

**Still Having Issues?**

1. ✅ Restart dev server: `npm run dev`
2. ✅ Clear browser cache: Ctrl+Shift+Delete
3. ✅ Check browser console: F12 → Console tab
4. ✅ Verify backend is accessible: `curl http://localhost:8000/search/hybrid?q=test&limit=5`
5. ✅ Check CORS headers in Network tab: F12 → Network tab → search request


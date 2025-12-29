# 🎨 Chat Search - Visual Guide & UI Overview

## Overall Layout

```
┌────────────────────────────────────────────────────────────────┐
│                         Application                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  SIDEBAR                    MAIN CONTENT AREA                 │
│  ┌─────────────┐  ┌──────────────────────────────────────┐   │
│  │ File Manager│  │        Document Search               │   │
│  ├─────────────┤  ├──────────────────────────────────────┤   │
│  │ Navigation  │  │ Search across your documents using   │   │
│  │             │  │ semantic, keyword, or hybrid search  │   │
│  │ [Recent ●]  │  │                                      │   │
│  │ [Search  ]  │  │ ┌────────────────────────────────┐  │   │
│  │             │  │ │ ⚡ Semantic │ 🔍 Keyword │ 💬 Hybrid │ │ ← Mode Toggle
│  │             │  │ └────────────────────────────────┘  │   │
│  │             │  │                                      │   │
│  │             │  │ ┌────────────────────────────────┐  │   │
│  │             │  │ │ Search Query        │  [Send] │  │   │ ← Search Input
│  │             │  │ └────────────────────────────────┘  │   │
│  │             │  │                                      │   │
│  │             │  │ ◇ Settings              ▼            │   │ ← Settings
│  │             │  │                                      │   │
│  │             │  │ [Recent Searches]                    │   │
│  │             │  │ [invoice processing] [q3 reports]   │   │
│  │             │  │                                      │   │
│  │             │  │ Found 5 results                      │   │ ← Results Summary
│  │             │  │ Mode: hybrid • Threshold: 0.50      │   │
│  │             │  │                                      │   │
│  │             │  │ ┌──────────────────────────────────┐ │   │
│  │             │  │ │ 📄 document.pdf    Page 2        │ │   │ ← Result Cards
│  │             │  │ │ Invoice processing involves...   │ │   │
│  │             │  │ │ [SEMANTIC] Match: 87%         → │ │   │
│  │             │  │ ├──────────────────────────────────┤ │   │
│  │             │  │ │ 📄 report_Q3.xlsx    Page 1      │ │   │
│  │             │  │ │ Q3 processing and analytics...   │ │   │
│  │             │  │ │ [HYBRID] Match: 82%           → │ │   │
│  │             │  │ └──────────────────────────────────┘ │   │
│  │             │  │                                      │   │
│  └─────────────┘  └──────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Search Mode Toggle

```
┌────────────────────────────────────────────┐
│ Search Mode Selection                      │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ ⚡        │ │ 🔍        │ │ 💬        │  │
│  │ Semantic │ │ Keyword  │ │ Hybrid   │  │
│  ├──────────┤ └──────────┘ └──────────┘  │
│  │Similar   │                            │
│  │ meaning  │                            │
│  └──────────┘                            │
│                                            │
│  Active Mode Styling:                     │
│  ☑ Background: Primary color             │
│  ☑ Text: Primary foreground              │
│  ☑ Border: Primary                       │
│                                            │
│  Inactive Mode Styling:                   │
│  ☑ Background: Background                │
│  ☑ Text: Foreground                      │
│  ☑ Border: Input border                  │
│                                            │
└────────────────────────────────────────────┘
```

## Search Input Area

```
┌──────────────────────────────────────────────────┐
│ Search Card                                      │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────────────────────────┐ ┌────────┐ │
│  │ Enter your search query...     │ │ 📤 Srch│ │
│  └────────────────────────────────┘ └────────┘ │
│                                                  │
│  Features:                                      │
│  ☑ Placeholder text showing hint               │
│  ☑ Auto-focus on mount                         │
│  ☑ Enter key triggers search                   │
│  ☑ Disabled while searching                    │
│  ☑ Button shows loading state                  │
│                                                  │
│  States:                                        │
│  • Idle: "Search" button enabled               │
│  • Loading: "Searching..." disabled            │
│  • Success: Shows results                      │
│  • Error: Shows error message                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Settings Panel

```
┌─────────────────────────────────────────────┐
│ Settings                        ▼            │
└─────────────────────────────────────────────┘

[EXPANDED]

┌─────────────────────────────────────────────┐
│ Settings                        ▲            │
├─────────────────────────────────────────────┤
│                                             │
│ ◇ Similarity Threshold                      │
│   Value: 0.50                               │
│   ▁▂▃▄▅▆▇█                                  │
│                                             │
│   Semantic: 0.3 - 0.95 (0.05 step)         │
│   Keyword: 0.1 - 0.5 (0.05 step)           │
│   Hybrid: 0.1 - 0.95 (0.05 step)           │
│                                             │
│   Description:                              │
│   "Higher = stricter similarity             │
│    (0.5-0.7 recommended)"                   │
│                                             │
│ ◇ Results Per Query                         │
│   Value: 10                                 │
│   ▁▂▃▄▅▆▇█                                  │
│   Range: 5 - 50 (5 step)                    │
│                                             │
│ [IF HYBRID MODE]                            │
│ ◇ Hybrid Search Weights                     │
│   ────────────────────                      │
│   ◇ Semantic Weight: 70%                    │
│     ▁▂▃▄▅▆▇█                                │
│                                             │
│   ◇ Keyword Weight: 30%                     │
│     ▁▂▃▄▅▆▇█                                │
│                                             │
│   Auto-Sync:                                │
│   • Weights always sum to 100%              │
│   • Changing one updates other              │
│                                             │
└─────────────────────────────────────────────┘
```

## Search History

```
┌──────────────────────────────────────────────┐
│ Search History                               │
├──────────────────────────────────────────────┤
│                                              │
│ Shows only when: query is EMPTY              │
│                                              │
│ [invoice processing] [q3 reports]           │
│ [compliance docs] [contract review]         │
│ [expense reimbursement]                     │
│                                              │
│ Features:                                    │
│ ☑ Displays last 10 searches                 │
│ ☑ Click to re-run                           │
│ ☑ Most recent first                         │
│ ☑ Hover effects on pills                    │
│ ☑ Auto-saved in localStorage                │
│                                              │
│ Styling:                                     │
│ ☑ Pills with border                         │
│ ☑ Background: background color              │
│ ☑ Hover: accent background                  │
│ ☑ Padding: small (3-8px)                    │
│                                              │
└──────────────────────────────────────────────┘
```

## Results Display

```
┌────────────────────────────────────────────────────┐
│ Results Summary                                    │
├────────────────────────────────────────────────────┤
│ Found 5 results         Mode: hybrid • 0.50       │
└────────────────────────────────────────────────────┘

[LOADING STATE]
┌────────────────────────────────────────────────────┐
│                                                    │
│              ⟳ (spinning loader)                   │
│                                                    │
│        Searching your documents...                │
│                                                    │
└────────────────────────────────────────────────────┘

[EMPTY STATE]
┌────────────────────────────────────────────────────┐
│                                                    │
│              📄                                    │
│                                                    │
│  No results found. Try adjusting your query       │
│  or threshold.                                     │
│                                                    │
└────────────────────────────────────────────────────┘

[RESULTS STATE]
┌────────────────────────────────────────────────────┐
│ ScrollArea (max height: 384px)                     │
├────────────────────────────────────────────────────┤
│                                                    │
│ ┌─────────────────────────────────────────────┐  │
│ │ 📄 quarterly_report_Q3.pdf   [Page 2]       │  │
│ │                                              │  │
│ │ Invoice processing involves extracting...   │  │
│ │                                              │  │
│ │ [SEMANTIC] Match: 87%                    →  │  │
│ └─────────────────────────────────────────────┘  │
│                                                    │
│ ┌─────────────────────────────────────────────┐  │
│ │ 📄 payment_docs.pdf          [Page 1]       │  │
│ │                                              │  │
│ │ Processing payment requests and tracking... │  │
│ │                                              │  │
│ │ [HYBRID] Match: 82%                      →  │  │
│ └─────────────────────────────────────────────┘  │
│                                                    │
│ ┌─────────────────────────────────────────────┐  │
│ │ 📄 invoice_template.docx     [Page 0]       │  │
│ │                                              │  │
│ │ Standard invoice format and processing...   │  │
│ │                                              │  │
│ │ [KEYWORD] Match: 75%                     →  │  │
│ └─────────────────────────────────────────────┘  │
│                                                    │
└────────────────────────────────────────────────────┘
```

## Result Card Details

```
┌──────────────────────────────────────────────────┐
│ Result Card                                      │
├──────────────────────────────────────────────────┤
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ Left Side:                Right Side:       │  │
│ │                                             │  │
│ │ 📄 filename.pdf  [Page 2]  Match: 87%  →   │  │
│ │ (with truncation if long)                  │  │
│ │                                             │  │
│ │ Text snippet preview (max 2 lines)...      │  │
│ │ Lorem ipsum dolor sit amet consectetur... │  │
│ │                                             │  │
│ │ Badges:                                    │  │
│ │ [SEMANTIC]        Match: 87%              │  │
│ │                                             │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ Styling:                                         │
│ ☑ Border: 1px border                           │
│ ☑ Padding: 3 units (12px)                      │
│ ☑ Hover: accent background                     │
│ ☑ Cursor: pointer                              │
│ ☑ Rounded: lg (8px)                            │
│                                                  │
│ Badges:                                          │
│ ☑ Search Type: secondary variant                │
│ ☑ Score: secondary variant                      │
│ ☑ Page: outline variant                         │
│                                                  │
│ Interaction:                                     │
│ ☑ Click opens file preview                      │
│ ☑ Shows loading while fetching file             │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Error States

```
[API ERROR]
┌──────────────────────────────────────────────────┐
│ ✕ Search failed                                  │
│ Semantic search failed                           │
└──────────────────────────────────────────────────┘

[EMPTY RESULTS]
┌──────────────────────────────────────────────────┐
│ ⚠ Search failed                                  │
│ No results found. Try adjusting your query or    │
│ threshold.                                        │
└──────────────────────────────────────────────────┘

[VALIDATION ERROR]
┌──────────────────────────────────────────────────┐
│ ✕ Error                                          │
│ Please enter a search query                      │
└──────────────────────────────────────────────────┘

Styling:
☑ Background: destructive/10
☑ Border: destructive
☑ Icon: AlertCircle (lucide)
☑ Text: destructive variant
```

## Color Scheme

```
┌────────────────────────────────────────────────┐
│ Colors Used (Tailwind CSS)                     │
├────────────────────────────────────────────────┤
│                                                │
│ Primary (Active):        ███ (current theme)  │
│ Secondary (Badge):       ░░░ (muted)          │
│ Accent (Hover):          ▓▓▓ (lighter)        │
│ Foreground (Text):       ███ (dark)           │
│ Muted Foreground:        ░░░ (light gray)     │
│ Background (Card):       ▒▒▒ (white/light)    │
│ Destructive (Error):     ███ (red)            │
│                                                │
│ Component-specific:                            │
│ • Semantic Weight: blue-100, blue-900         │
│ • Keyword Weight: orange-100, orange-900      │
│ • Threshold bg: primary/10                    │
│                                                │
└────────────────────────────────────────────────┘
```

## Responsive Behavior

```
DESKTOP (≥1024px)
┌─────────────────────────────────────────────┐
│ Sidebar    │ Main Content Area (Full)      │
│            │ - All features visible         │
│            │ - Results: 3+ columns         │
│            │ - Settings expanded           │
└─────────────────────────────────────────────┘

TABLET (768px - 1023px)
┌─────────────────────────────────────────────┐
│ Sidebar   │ Main Content (Adjusted)        │
│ (smaller) │ - Single column results        │
│           │ - Settings collapsible         │
└─────────────────────────────────────────────┘

MOBILE (< 768px)
┌─────────────────────────────────────────────┐
│ ≡ Menu│ Main Content (Full Width)          │
│       │ - Single column                    │
│       │ - Touch-friendly spacing          │
│       │ - Settings always collapsed       │
└─────────────────────────────────────────────┘

Changes:
• SearchResults: Auto-sized container
• Settings: Always collapsible on mobile
• Input: Full width
• Buttons: Larger touch targets
```

## Animation & Transitions

```
LOADING SPINNER
┌────────────────────┐
│                    │
│     ⟳  ⟲  ⟱  ↻    │
│     ↘  ↙  ↖  ↗    │ (rotates continuously)
│                    │
└────────────────────┘

HOVER EFFECTS
• Buttons: Scale 0.98 on click
• Result cards: Background fade-in
• Settings icon: Rotate 180° when expanded
• Pills: bg-accent on hover

TRANSITIONS
• All 200ms cubic-bezier ease
• Smooth theme switching
• Lazy result loading
• Fade in/out for cards
```

## Accessibility Features

```
KEYBOARD NAVIGATION
┌──────────────────────────────────────┐
│ Tab Order:                           │
│ 1. Search Input                      │
│ 2. Search Button                     │
│ 3. Mode Toggle (buttons)             │
│ 4. Settings Button                   │
│ 5. Settings Sliders (if expanded)    │
│ 6. Results (if any)                  │
└──────────────────────────────────────┘

FOCUS INDICATORS
• Ring: 2px solid ring-ring color
• Offset: 2px offset from element
• Visible on all interactive elements

ARIA LABELS
☑ Buttons: descriptive labels
☑ Icons: title attributes
☑ Regions: role="main"
☑ Loading: aria-busy="true"
☑ Results: aria-live="polite"
```

## Icon Guide

```
┌─────────────────────────────────────────────┐
│ Icons Used (Lucide React)                  │
├─────────────────────────────────────────────┤
│                                             │
│ 📤 Send         - Search button             │
│ ⚡ Zap          - Semantic mode             │
│ 🔍 Search      - Keyword mode              │
│ 💬 MessageSquare - Hybrid mode              │
│ 📄 FileText    - File indicator            │
│ 🔗 ExternalLink - Open file action         │
│ ⚠️  AlertCircle - Error indicator          │
│ ▼ ChevronDown  - Settings expand/collapse  │
│                                             │
│ Size: All 16-24px depending on context    │
│ Color: Inherited from text color           │
│                                             │
└─────────────────────────────────────────────┘
```

## Complete User Journey

```
┌─────────────────────────────────────────────────────────┐
│ User Journey: Searching Documents                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 1. Click "Search" in sidebar                           │
│    └─ View switches to ChatSearch component            │
│                                                         │
│ 2. See search interface                                │
│    └─ Search input, mode toggle, results area          │
│                                                         │
│ 3. Choose search mode (optional)                        │
│    └─ Default is Hybrid (safest choice)                │
│                                                         │
│ 4. Type search query                                   │
│    └─ Real-time input (no validation error)            │
│                                                         │
│ 5. Press Enter or click Search                         │
│    └─ Button shows "Searching..." state                │
│    └─ Spinner appears in results area                  │
│                                                         │
│ 6. Results appear                                      │
│    └─ Cards with file name, snippet, score            │
│    └─ Sorted by score (highest first)                  │
│                                                         │
│ 7. Click a result (optional)                           │
│    └─ File preview opens in modal                      │
│    └─ Can download or manage tags                      │
│                                                         │
│ 8. Try new search                                      │
│    └─ Click search input again                         │
│    └─ Recent searches appear if empty                  │
│    └─ Select from history or type new                  │
│                                                         │
│ 9. Refine settings (optional)                          │
│    └─ Click "Settings" to expand                       │
│    └─ Adjust threshold, limit, weights                │
│    └─ Click Settings again to collapse                │
│                                                         │
│ 10. New search with adjusted settings                 │
│     └─ Settings persist for next search               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

This visual guide should help you understand exactly how the Chat Search interface looks, behaves, and flows!

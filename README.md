# RecipeMethods — Kitchen Companion (RM-001)

A precise editorial web application that turns any dish name or food photograph into a trusted, reliable cooking method without clutter, chat, or guesswork.

Based faithfully on the provided UI design references (Screenshots 1–5).

---

## 🚀 How to Run the Website

### Option 1: Live Server with Gemini AI Backend (Recommended)
From PowerShell / Command Prompt:
```bash
node "D:\Abhinav\recipe-methods\server.js"
```
Or directly from `D:\Abhinav`:
```bash
node "D:\Abhinav\server.js"
```
Then open your browser to:
👉 **[http://localhost:3000](http://localhost:3000)**

### Option 2: Standalone Local File
Double-click or open directly in your browser:
👉 `D:\Abhinav\index.html` (or `D:\Abhinav\recipe-methods\public\index.html`)

---

## 🎨 UI Architecture & Exact Screen Match

### 1. Section 01: "What are you making?" (`START HERE`)
- **Brand & Header**: Stylized 4-diamond motif with `RecipeMethods` + `● KITCHEN COMPANION / 01`.
- **Display Typography**: High-contrast editorial display serif font (*Fraunces*) paired with clean body (*Plus Jakarta Sans*) and technical monospace (*JetBrains Mono*).
- **Hero Title**: "What are you making?" with "making?" highlighted in signature saffron gold (`#D4A23A`).
- **Input Card (RM-001)**:
  - Saffron vertical accent bar on left edge.
  - Interactive Dish Name field with chef toque hat icon, clear button (`✕`), and helper hint.
  - Quick-preset pills (`Golden Chickpea Skillet`, `Tomato Shakshuka`, `Garlic Pasta`).
  - Dotted photo dropzone with drag-and-drop & file picker.
  - Burgundy camera button (`#5F2525`) with interactive live camera reticle modal.
  - Full-width action button (`Analyze again →` or `Reveal the recipe →`).

### 2. Section 02: "THE FIRST READ"
- **State A ("Waiting on your clue")**:
  - Focus viewfinder icon, "Waiting on your clue.", and explanation.
  - Cutting board visual with `● A USEFUL FIRST MOVE`.
- **State B ("A method, not a guess")**:
  - `● JUST ANALYZED` + `KITCHEN CONFIDENCE HIGH` badge.
  - High-impact title: "Golden chickpea skillet".
  - Detected ingredients in order with gold badges (`✓ chickpeas`, `✓ tomato`, `✓ red onion`, `✓ lemon`, `✓ turmeric`) and neutral badges (`○ cumin`, `○ parsley`).
  - Cooking meta tags: `⏱ 25 MIN`, `🍳 ONE PAN`, `👨‍🍳 EASY`.
  - Cutting board visual with `● HOUSE METHOD · READY`.
- **Start Over**: One-click reset button (`↺ START OVER`).

### 3. Section 03: "THE METHOD"
- Rich cream/parchment background (`#EBE7DE`) with crisp editorial divider.
- Massive serif heading + key metric cards (`10 INGREDIENTS`, `25 MINUTES`, `2–3 SERVINGS`).
- **Left Column (`Gather`)**:
  - Interactive custom checkboxes for every ingredient.
  - Optional ingredient badges and right-aligned quantities.
  - Footnote: `❶ Optional ingredients add lift, but the method works beautifully without them.`
- **Right Column (`Do this`)**:
  - 4 numbered editorial steps (`Wake the aromatics`, `Bloom the spice`, `Build the pan`, `Balance and finish`).

---

## 🤖 Gemini AI Integration
Configured with the user's Gemini API key:
- **Model**: `gemini-3.8-flash` (with automated resilient fallback to `gemini-flash-latest` and `gemini-3.5-flash-lite`).
- **Multimodal**: Accepts both text dish names and uploaded food images via camera or file drop.
- **Structured JSON output**: Formulates the exact RecipeMethods data schema dynamically for any food submitted!

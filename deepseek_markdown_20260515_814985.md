# ARCHITECTURE.md – Personal Quote / Affirmation Card Maker

## High-Level Architecture

This is a **pure client-side single-page application (SPA)** with no build step, no frameworks, and no backend.  
All logic runs in the browser, with `localStorage` as the sole persistence layer.

**Three-file structure:**
- `index.html` – DOM skeleton, meta tags, Font Awesome CDN, links to CSS/JS.
- `styles.css` – all visual design, responsive layout, dark/light mode styles.
- `app.js` – state management, DOM rendering, event handling, localStorage sync.

---

## Data Layer (State Management)

### State Store (in `app.js`)
```javascript
let appState = {
  cards: [],           // array of card objects
  editingId: null,    // id of card being edited, or null
  filters: {
    searchTerm: "",
    category: "all",
    showFavoritesOnly: false
  },
  darkMode: false      // bonus feature
};
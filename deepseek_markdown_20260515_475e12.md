# AGENTS.md – Personal Quote / Affirmation Card Maker

## Project Overview
Build a standalone HTML/CSS/JS frontend app called "Personal Quote / Affirmation Card Maker".  
Users can create, view, edit, delete, and favorite personal quotes or affirmations.  
The app must work entirely client-side and save data in the browser (localStorage or IndexedDB).  
Hosted on GitHub Pages (static site).

## Core Requirements

### 1. Data Model
- Each card has:
  - `id` (unique, e.g., timestamp + random)
  - `text` (string, the quote/affirmation)
  - `author` (optional string, e.g., "Unknown" or user name)
  - `category` (string: e.g., "Quote", "Affirmation", "Motivation")
  - `favorite` (boolean)
  - `createdAt` (ISO date string)
  - `tags` (array of strings, optional)
- Store all cards in `localStorage` under key `quoteCards`.
- Provide a default set of 3–5 example cards on first load.

### 2. User Interface Layout
- **Left panel (20-30% width)** – Form to add/edit a card.
- **Right panel** – Gallery/grid of cards.
- Fully responsive (mobile: stacked panels).
- Clean, calm, uplifting color scheme (pastel, soft shadows, rounded corners).

### 3. Features (Must Have)
- **Create**: Form with textarea (required), author input, category dropdown, tags input (comma separated). Submit adds new card.
- **Read**: Display all cards as individual cards. Each card shows text, author, category, favorite star.
- **Update**: Edit button on each card → populates form with existing data; save updates the card.
- **Delete**: Delete button with confirmation.
- **Favorite**: Toggle favorite (star icon). Favorite cards appear at the top of the list or have visual priority.
- **Filter/Search**: Search by text/author; filter by category and favorite status.
- **Persist**: All changes saved immediately to localStorage.

### 4. Bonus (Nice to Have)
- Export/Import all cards as JSON.
- Dark/light mode toggle.
- Drag to reorder cards (store order in localStorage).
- Random card display widget on top.

## Technical Constraints
- **No build step** – pure HTML, CSS, vanilla JavaScript (ES6+).
- Use **CSS Grid/Flexbox** for layout.
- Use **Font Awesome** (or similar) for icons (star, edit, delete, search).
- No external UI libraries (Bootstrap etc.) – custom CSS.
- Must work on latest Chrome/Firefox/Safari.
- Handle empty states (no cards → show friendly message).

## File Structure (single folder)
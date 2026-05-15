// ==================== STATE MANAGEMENT ====================
let appState = {
    cards: [],
    editingId: null,
    filters: {
        searchTerm: '',
        category: 'all',
        showFavoritesOnly: false
    },
    darkMode: false
};

// ==================== CONSTANTS ====================
const STORAGE_KEY = 'quoteCards';
const DARK_MODE_KEY = 'darkMode';
const DEFAULT_CARDS = [
    {
        id: 'default-1',
        text: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs',
        category: 'Motivation',
        favorite: false,
        createdAt: new Date().toISOString(),
        tags: ['work', 'passion']
    },
    {
        id: 'default-2',
        text: 'You are braver than you believe, stronger than you seem, and smarter than you think.',
        author: 'A.A. Milne',
        category: 'Affirmation',
        favorite: false,
        createdAt: new Date().toISOString(),
        tags: ['courage', 'strength']
    },
    {
        id: 'default-3',
        text: 'The best time to plant a tree was 20 years ago. The second best time is now.',
        author: 'Chinese Proverb',
        category: 'Wisdom',
        favorite: false,
        createdAt: new Date().toISOString(),
        tags: ['growth', 'action']
    },
    {
        id: 'default-4',
        text: 'I am worthy of love, respect, and success.',
        author: 'Unknown',
        category: 'Affirmation',
        favorite: false,
        createdAt: new Date().toISOString(),
        tags: ['self-love', 'confidence']
    }
];

// ==================== DOM ELEMENTS ====================
const form = document.getElementById('cardForm');
const cardText = document.getElementById('cardText');
const cardAuthor = document.getElementById('cardAuthor');
const cardCategory = document.getElementById('cardCategory');
const cardTags = document.getElementById('cardTags');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const favoritesFilter = document.getElementById('favoritesFilter');
const gallery = document.getElementById('cardsGallery');
const emptyState = document.getElementById('emptyState');
const cardCount = document.getElementById('cardCount');
const darkModeToggle = document.getElementById('darkModeToggle');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const resetFormBtn = document.getElementById('resetFormBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const randomCardBtn = document.getElementById('randomCardBtn');
const randomModal = document.getElementById('randomModal');
const randomCardDisplay = document.getElementById('randomCardDisplay');
const modalClose = document.querySelector('.modal-close');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadAppState();
    loadDarkMode();
    setupEventListeners();
    renderCards();
});

function setupEventListeners() {
    form.addEventListener('submit', handleFormSubmit);
    resetFormBtn.addEventListener('click', resetForm);
    cancelEditBtn.addEventListener('click', cancelEdit);
    searchInput.addEventListener('input', handleFilterChange);
    categoryFilter.addEventListener('change', handleFilterChange);
    favoritesFilter.addEventListener('change', handleFilterChange);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    exportBtn.addEventListener('click', exportCards);
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', handleImportCards);
    randomCardBtn.addEventListener('click', showRandomCard);
    modalClose.addEventListener('click', closeModal);
    randomModal.addEventListener('click', (e) => {
        if (e.target === randomModal) closeModal();
    });
}

// ==================== FORM HANDLING ====================
function handleFormSubmit(e) {
    e.preventDefault();

    const text = cardText.value.trim();
    const author = cardAuthor.value.trim() || 'Unknown';
    const category = cardCategory.value;
    const tags = cardTags.value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

    if (!text) {
        alert('Please enter a quote or affirmation.');
        return;
    }

    if (appState.editingId) {
        // Update existing card
        const cardIndex = appState.cards.findIndex(c => c.id === appState.editingId);
        if (cardIndex !== -1) {
            appState.cards[cardIndex] = {
                ...appState.cards[cardIndex],
                text,
                author,
                category,
                tags
            };
        }
        cancelEdit();
    } else {
        // Create new card
        const newCard = {
            id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text,
            author,
            category,
            favorite: false,
            createdAt: new Date().toISOString(),
            tags
        };
        appState.cards.unshift(newCard); // Add to top
    }

    saveAppState();
    renderCards();
    resetForm();
}

function resetForm() {
    form.reset();
    cardAuthor.value = '';
    cardTags.value = '';
    cardCategory.value = 'Quote';
}

function cancelEdit() {
    appState.editingId = null;
    cancelEditBtn.style.display = 'none';
    resetForm();
}

// ==================== CARD RENDERING ====================
function renderCards() {
    const filteredCards = getFilteredCards();
    
    if (filteredCards.length === 0) {
        gallery.classList.add('hidden');
        emptyState.classList.remove('hidden');
        cardCount.textContent = '0 cards';
        return;
    }

    gallery.classList.remove('hidden');
    emptyState.classList.add('hidden');
    cardCount.textContent = `${filteredCards.length} card${filteredCards.length !== 1 ? 's' : ''}`;

    gallery.innerHTML = filteredCards.map(card => createCardElement(card)).join('');

    // Add event listeners to cards
    document.querySelectorAll('.card-favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const cardId = btn.closest('.card').dataset.cardId;
            toggleFavorite(cardId);
        });
    });

    document.querySelectorAll('.btn-card.edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const cardId = btn.closest('.card').dataset.cardId;
            editCard(cardId);
        });
    });

    document.querySelectorAll('.btn-card.delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const cardId = btn.closest('.card').dataset.cardId;
            deleteCard(cardId);
        });
    });
}

function createCardElement(card) {
    const favoriteClass = card.favorite ? 'favorite' : '';
    const starIcon = card.favorite ? 'fas fa-star' : 'far fa-star';
    const tagsHTML = card.tags.length > 0
        ? `<div class="card-tags">${card.tags.map(tag => `<span class="card-tag">#${tag}</span>`).join('')}</div>`
        : '';
    const formattedDate = new Date(card.createdAt).toLocaleDateString();

    return `
        <div class="card ${favoriteClass}" data-card-id="${card.id}">
            <div class="card-header">
                <span class="card-category">${card.category}</span>
                <button class="card-favorite-btn ${card.favorite ? 'active' : ''}" title="Toggle favorite">
                    <i class="${starIcon}"></i>
                </button>
            </div>
            <div class="card-text">"${card.text}"</div>
            <div class="card-author">${card.author}</div>
            ${tagsHTML}
            <div class="card-actions">
                <button class="btn-card edit" title="Edit card">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-card delete" title="Delete card">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
            <div class="card-date">${formattedDate}</div>
        </div>
    `;
}

function getFilteredCards() {
    return appState.cards.filter(card => {
        const matchesSearch = !appState.filters.searchTerm ||
            card.text.toLowerCase().includes(appState.filters.searchTerm.toLowerCase()) ||
            card.author.toLowerCase().includes(appState.filters.searchTerm.toLowerCase());

        const matchesCategory = appState.filters.category === 'all' ||
            card.category === appState.filters.category;

        const matchesFavorite = !appState.filters.showFavoritesOnly ||
            card.favorite;

        return matchesSearch && matchesCategory && matchesFavorite;
    });
}

// ==================== CARD OPERATIONS ====================
function toggleFavorite(cardId) {
    const card = appState.cards.find(c => c.id === cardId);
    if (card) {
        card.favorite = !card.favorite;
        // Move favorite cards to top
        appState.cards = appState.cards.sort((a, b) => b.favorite - a.favorite);
        saveAppState();
        renderCards();
    }
}

function editCard(cardId) {
    const card = appState.cards.find(c => c.id === cardId);
    if (card) {
        cardText.value = card.text;
        cardAuthor.value = card.author;
        cardCategory.value = card.category;
        cardTags.value = card.tags.join(', ');
        appState.editingId = cardId;
        cancelEditBtn.style.display = 'block';
        cardText.focus();
        window.scrollTo(0, 0);
    }
}

function deleteCard(cardId) {
    if (confirm('Are you sure you want to delete this card?')) {
        appState.cards = appState.cards.filter(c => c.id !== cardId);
        saveAppState();
        renderCards();
    }
}

// ==================== FILTERING ====================
function handleFilterChange() {
    appState.filters.searchTerm = searchInput.value;
    appState.filters.category = categoryFilter.value;
    appState.filters.showFavoritesOnly = favoritesFilter.checked;
    renderCards();
}

// ==================== STORAGE ====================
function saveAppState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.cards));
}

function loadAppState() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            appState.cards = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading cards:', e);
            appState.cards = DEFAULT_CARDS;
        }
    } else {
        appState.cards = DEFAULT_CARDS;
        saveAppState();
    }
}

// ==================== DARK MODE ====================
function toggleDarkMode() {
    appState.darkMode = !appState.darkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(appState.darkMode));
}

function loadDarkMode() {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored) {
        appState.darkMode = JSON.parse(stored);
        if (appState.darkMode) {
            document.body.classList.add('dark-mode');
        }
    }
}

// ==================== IMPORT/EXPORT ====================
function exportCards() {
    const dataStr = JSON.stringify(appState.cards, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quote-cards-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function handleImportCards(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            if (Array.isArray(imported)) {
                const merge = confirm('Merge with existing cards? (Cancel to replace)');
                if (merge) {
                    appState.cards = [...appState.cards, ...imported];
                } else {
                    appState.cards = imported;
                }
                saveAppState();
                renderCards();
                alert('Cards imported successfully!');
            } else {
                alert('Invalid format. Please import a JSON file with an array of cards.');
            }
        } catch (err) {
            alert('Error reading file:', err);
        }
    };
    reader.readAsText(file);
    importFile.value = '';
}

// ==================== RANDOM CARD (BONUS) ====================
function showRandomCard() {
    if (appState.cards.length === 0) {
        alert('No cards to display!');
        return;
    }

    const randomCard = appState.cards[Math.floor(Math.random() * appState.cards.length)];
    randomCardDisplay.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-category">${randomCard.category}</span>
            </div>
            <div class="card-text">"${randomCard.text}"</div>
            <div class="card-author">${randomCard.author}</div>
        </div>
    `;

    randomModal.classList.add('active');
}

function closeModal() {
    randomModal.classList.remove('active');
}

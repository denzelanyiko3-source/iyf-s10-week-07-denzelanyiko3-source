/**
 * ============================================
 * NOTE APP WITH LOCALSTORAGE PERSISTENCE
 * ============================================
 *
 * Features:
 * - Create, read, update, delete notes
 * - Automatic localStorage persistence
 * - Search/filter notes
 * - Timestamps for each note
 * - Colorful note cards
 *
 * ============================================
 */

// =============================================
// CONFIGURATION
// =============================================

const STORAGE_KEY = 'noteAppNotes';
const COLORS = ['#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B', '#FF8E72'];

// =============================================
// STATE MANAGEMENT
// =============================================

// All notes stored in memory
let notes = [];

// Current search term
let searchTerm = '';

// =============================================
// DOM ELEMENT REFERENCES
// =============================================

const noteTitle = document.getElementById('noteTitle');
const noteBody = document.getElementById('noteBody');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesGrid = document.getElementById('notesGrid');
const emptyState = document.getElementById('emptyState');
const noteCount = document.getElementById('noteCount');
const searchInput = document.getElementById('searchInput');

// =============================================
// EVENT LISTENERS - INPUT & BUTTONS
// =============================================

// Add note button
addNoteBtn.addEventListener('click', handleAddNote);

// Allow Ctrl+Enter or Cmd+Enter to save note
noteBody.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        handleAddNote();
    }
});

// Search functionality
searchInput.addEventListener('input', (event) => {
    searchTerm = event.target.value.toLowerCase();
    render();
});

// =============================================
// EVENT DELEGATION - NOTES GRID
// =============================================

/**
 * DELEGATION PATTERN:
 * Instead of adding listeners to each note, we add ONE listener
 * to the container. When user clicks anything inside, we check
 * what was clicked and act accordingly.
 */
notesGrid.addEventListener('click', (event) => {
    // Delete button clicked
    if (event.target.closest('.delete-note-btn')) {
        const noteId = event.target.closest('.note-card').dataset.noteId;
        deleteNote(noteId);
    }

    // Edit button clicked
    if (event.target.closest('.edit-note-btn')) {
        const noteId = event.target.closest('.note-card').dataset.noteId;
        loadNoteForEditing(noteId);
    }
});

// =============================================
// LOCALSTORAGE FUNCTIONS
// =============================================

/**
 * Load notes from localStorage
 */
function loadNotesFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        notes = stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading notes:', error);
        notes = [];
    }
}

/**
 * Save notes to localStorage
 */
function saveNotesToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
        console.error('Error saving notes:', error);
    }
}

// =============================================
// CORE FUNCTIONS
// =============================================

/**
 * Add a new note
 */
function handleAddNote() {
    const title = noteTitle.value.trim();
    const body = noteBody.value.trim();

    // Validate - need at least title or body
    if (!title && !body) {
        alert('Please enter a title or note content');
        return;
    }

    const note = {
        id: Date.now().toString(),
        title: title || 'Untitled',
        body: body,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Add to notes array
    notes.unshift(note); // Add to beginning

    // Save to localStorage
    saveNotesToStorage();

    // Clear input fields
    noteTitle.value = '';
    noteBody.value = '';
    noteTitle.focus();

    // Update UI
    render();
}

/**
 * Delete a note
 */
function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(note => note.id !== noteId);
        saveNotesToStorage();
        render();
    }
}

/**
 * Load note into edit fields
 */
function loadNoteForEditing(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        noteTitle.value = note.title === 'Untitled' ? '' : note.title;
        noteBody.value = note.body;
        deleteNote(noteId); // Remove the old note
        noteTitle.focus();
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Filter notes based on search term
 */
function getFilteredNotes() {
    if (!searchTerm) {
        return notes;
    }

    return notes.filter(note => {
        return (
            note.title.toLowerCase().includes(searchTerm) ||
            note.body.toLowerCase().includes(searchTerm)
        );
    });
}

/**
 * Format date/time for display
 */
function formatDate(isoString) {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
}

// =============================================
// RENDERING (UPDATE THE DOM)
// =============================================

/**
 * THE MAIN RENDER FUNCTION
 *
 * This is called whenever our state changes. It:
 * 1. Clears the notes grid
 * 2. Gets filtered notes
 * 3. Creates DOM elements for each note
 * 4. Updates note count
 * 5. Shows/hides empty state
 */
function render() {
    // Step 1: Clear the current grid
    notesGrid.innerHTML = '';

    // Step 2: Get notes to display based on search
    const filteredNotes = getFilteredNotes();

    // Step 3: Create a card for each note and add to grid
    filteredNotes.forEach(note => {
        const card = createNoteCard(note);
        notesGrid.appendChild(card);
    });

    // Step 4: Update note count
    noteCount.textContent = notes.length;

    // Step 5: Show empty state if no notes at all
    if (notes.length === 0) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
    }
}

/**
 * Create a single note card element
 */
function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.dataset.noteId = note.id;
    card.style.backgroundColor = note.color;

    const preview = note.body.substring(0, 100);
    const hasMore = note.body.length > 100;

    card.innerHTML = `
        <div class="note-header">
            <h3 class="note-title">${escapeHtml(note.title)}</h3>
            <div class="note-actions">
                <button class="edit-note-btn" title="Edit">Edit</button>
                <button class="delete-note-btn" title="Delete">Delete</button>
            </div>
        </div>
        <div class="note-body">${escapeHtml(preview)}${hasMore ? '...' : ''}</div>
        <div class="note-footer">
            <span class="note-date">${formatDate(note.createdAt)}</span>
        </div>
    `;

    return card;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =============================================
// INITIALIZATION
// =============================================

/**
 * When page first loads, load notes from storage and render
 */
window.addEventListener('load', () => {
    loadNotesFromStorage();
    render();
    noteTitle.focus();
});


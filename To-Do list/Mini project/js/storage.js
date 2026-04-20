// storage.js - Handles localStorage operations
const STORAGE_KEY = "todos";
const FILTER_KEY = "todoFilter";

function getFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadTodos() {
  return getFromStorage(STORAGE_KEY, []);
}

export function saveTodos(todos) {
  saveToStorage(STORAGE_KEY, todos);
}

export function saveFilter(filter) {
  saveToStorage(FILTER_KEY, filter);
}

export function loadFilter() {
  return getFromStorage(FILTER_KEY, "all");
}
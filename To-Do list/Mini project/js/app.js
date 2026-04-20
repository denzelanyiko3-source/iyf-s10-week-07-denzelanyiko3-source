import {
  addTodo,
  clearCompletedTodos,
  deleteTodo,
  getCurrentFilter,
  getTodos,
  setCurrentFilter,
  setTodos,
  toggleTodo,
  updateTodoText,
} from "./state.js";
import { loadFilter, loadTodos, saveFilter, saveTodos } from "./storage.js";
import {
  applyFilter,
  renderTodos,
  setActiveFilterButton,
  startEdit,
  updateUI,
} from "./ui.js";

// app.js - Main entry point, initialization
function handleFormSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("todo-input");
  const text = input.value.trim();
  if (!text) return;

  setTodos(addTodo(text));
  saveTodos(getTodos());
  renderAndUpdate();
  input.value = "";
}

function handleFilterClick(button) {
  const filter = button.dataset.filter;
  setCurrentFilter(filter);
  setActiveFilterButton(filter);
  saveFilter(filter);
  applyFilter(getTodos(), filter);
}

function handleClearCompleted() {
  setTodos(clearCompletedTodos());
  saveTodos(getTodos());
  renderAndUpdate();
}

function handleToggleTodo(id) {
  setTodos(toggleTodo(id));
  saveTodos(getTodos());
  renderAndUpdate();
}

function handleDeleteTodo(id) {
  setTodos(deleteTodo(id));
  saveTodos(getTodos());
  renderAndUpdate();
}

function handleEditTodo(id, text) {
  setTodos(updateTodoText(id, text));
  saveTodos(getTodos());
  renderAndUpdate();
}

function renderAndUpdate() {
  renderTodos(getTodos(), handleToggleTodo, handleDeleteTodo, (todo, li) => startEdit(todo, li, handleEditTodo));
  updateUI(getTodos());
  applyFilter(getTodos(), getCurrentFilter());
}

function init() {
  // Load data
  setTodos(loadTodos());
  setCurrentFilter(loadFilter());

  // Set up event listeners
  document.getElementById("todo-form").addEventListener("submit", handleFormSubmit);

  document.querySelectorAll(".filter").forEach((button) => {
    button.addEventListener("click", () => handleFilterClick(button));
  });

  const clearCompletedBtn = document.getElementById("clearCompletedBtn");
  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener("click", handleClearCompleted);
  }

  // Initial render
  setActiveFilterButton(getCurrentFilter());
  renderAndUpdate();
}

window.addEventListener("DOMContentLoaded", init);
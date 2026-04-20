// state.js - State management for todos
export let todos = [];
export let currentFilter = "all";

export function getTodos() {
  return todos;
  }
  
export function setTodos(newTodos) {
  todos = newTodos;
  }
  
export function getCurrentFilter() {
  return currentFilter;
  }
  
export function setCurrentFilter(filter) {
  currentFilter = filter;
  }
  
export function addTodo(text) {
  todos.push({
      id: Date.now(),
          text,
              completed: false,
                  createdAt: new Date().toISOString(),
                    });
                      return todos;
                      }
                      
export function toggleTodo(id) {
  const todo = todos.find((item) => item.id === id);
    if (!todo) return todos;
    
  todo.completed = !todo.completed;
    return todos;
    }
    
export function deleteTodo(id) {
  return todos.filter((item) => item.id !== id);
  }
  
export function updateTodoText(id, text) {
  const todo = todos.find((item) => item.id === id);
    if (!todo) return todos;
    
  todo.text = text;
    return todos;
    }
    
export function clearCompletedTodos() {
  return todos.filter((todo) => !todo.completed);
  }
  
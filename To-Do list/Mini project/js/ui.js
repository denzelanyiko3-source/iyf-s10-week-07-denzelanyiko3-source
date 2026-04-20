// ui.js - Handles UI rendering and interactions
function createTodoElement(todo, toggleCallback, deleteCallback, editCallback) {
  const li = document.createElement("li");
    li.dataset.id = todo.id;
      if (todo.completed) {
          li.classList.add("completed");
            }
            
  const span = document.createElement("span");
    span.textContent = todo.text;
      span.addEventListener("click", () => toggleCallback(todo.id));
        span.addEventListener("dblclick", () => editCallback(todo, li));
        
  const btn = document.createElement("button");
    btn.textContent = "";
      btn.classList.add("delete");
        btn.setAttribute("aria-label", `Delete ${todo.text}`);
          btn.addEventListener("click", (e) => {
              e.stopPropagation();
                  deleteCallback(todo.id);
                    });
                    
  li.appendChild(span);
    li.appendChild(btn);
      return li;
      }
      
export function startEdit(todo, li, updateCallback) {
  const editInput = document.createElement("input");
    editInput.type = "text";
      editInput.value = todo.text;
      
  li.innerHTML = "";
    li.appendChild(editInput);
      editInput.focus();
      
  const finish = (newText) => {
      if (!newText.trim()) {
            return;
                }
                    updateCallback(todo.id, newText.trim());
                      };
                      
  editInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
            finish(editInput.value);
                }
                    if (e.key === "Escape") {
                          // Re-render will happen in the callback
                              }
                                });
                                
  editInput.addEventListener("blur", () => finish(editInput.value));
  }
  
export function applyFilter(todos, currentFilter) {
  document.querySelectorAll("#todo-list li").forEach((li) => {
      const todoId = Number(li.dataset.id);
          const todo = todos.find((item) => item.id === todoId);
              if (!todo) return;
              
    if (currentFilter === "active") {
          li.style.display = todo.completed ? "none" : "flex";
              } else if (currentFilter === "completed") {
                    li.style.display = todo.completed ? "flex" : "none";
                        } else {
                              li.style.display = "flex";
                                  }
                                    });
                                    }
                                    
export function updateUI(todos) {
  const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
      const active = total - completed;
      
  document.getElementById("totalCount").textContent = total;
    document.getElementById("activeCount").textContent = active;
      document.getElementById("completedCount").textContent = completed;
        document.getElementById("emptyState").classList.toggle("show", total === 0);
        
  const clearCompletedBtn = document.getElementById("clearCompletedBtn");
    if (clearCompletedBtn) {
        clearCompletedBtn.disabled = completed === 0;
          }
          }
          
export function setActiveFilterButton(currentFilter) {
  document.querySelectorAll(".filter").forEach((filterBtn) => {
      filterBtn.classList.toggle(
            "active",
                  filterBtn.dataset.filter === currentFilter
                      );
                        });
                        }
                        
export function renderTodos(todos, toggleCallback, deleteCallback, editCallback) {
  const list = document.getElementById("todo-list");
    list.innerHTML = "";
      todos.forEach((todo) => list.appendChild(createTodoElement(todo, toggleCallback, deleteCallback, editCallback)));
      }
      
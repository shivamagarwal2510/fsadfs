/**
   * @typedef {Object} Todo
   * @property {string} text - The todo text.
   * @property {boolean} completed - Whether the todo is completed.
   * @property {string} id - Unique identifier for the todo.
   */

  const TODO_STORAGE_KEY = 'simple_todo_list';

  /** @type {Todo[]} */
  let todos = [];

  /**
   * Saves the current todos array to localStorage.
   */
  const saveTodos = () => {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  };

  /**
   * Loads todos from localStorage.
   */
  const loadTodos = () => {
    const storedTodos = localStorage.getItem(TODO_STORAGE_KEY);
    if (storedTodos) {
      try {
        todos = JSON.parse(storedTodos);
      } catch (e) {
        console.error('Failed to parse todos from localStorage:', e);
        todos = []; // Reset if parsing fails
      }
    } else {
      todos = [];
    }
  };

  /**
   * Renders the todo list to the DOM.
   */
  const renderTodos = () => {
    const todoListElement = document.getElementById('todo-list');
    if (!todoListElement) return;

    todoListElement.innerHTML = ''; // Clear current list

    todos.forEach(todo => {
      const listItem = document.createElement('li');
      listItem.classList.toggle('completed', todo.completed);
      listItem.dataset.id = todo.id;

      const todoTextSpan = document.createElement('span');
      todoTextSpan.classList.add('todo-text');
      todoTextSpan.textContent = todo.text;

      const actionsDiv = document.createElement('div');
      actionsDiv.classList.add('todo-actions');

      const completeButton = document.createElement('button');
      completeButton.classList.add('complete-button');
      completeButton.textContent = todo.completed ? 'Uncomplete' : 'Complete';
      completeButton.addEventListener('click', () => toggleComplete(todo.id));

      const removeButton = document.createElement('button');
      removeButton.classList.add('remove-button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => removeTodo(todo.id));

      actionsDiv.appendChild(completeButton);
      actionsDiv.appendChild(removeButton);

      listItem.appendChild(todoTextSpan);
      listItem.appendChild(actionsDiv);

      todoListElement.appendChild(listItem);
    });
  };

  /**
   * Adds a new todo.
   * @param {string} text - The text for the new todo.
   */
  const addTodo = (text) => {
    if (!text.trim()) return;

    /** @type {Todo} */
    const newTodo = {
      text: text.trim(),
      completed: false,
      id: Date.now().toString() // Simple unique ID
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();
  };

  /**
   * Toggles the completed status of a todo.
   * @param {string} id - The ID of the todo to toggle.
   */
  const toggleComplete = (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    }
  };

  /**
   * Removes a todo.
   * @param {string} id - The ID of the todo to remove.
   */
  const removeTodo = (id) => {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
  };

  /**
   * Initializes the todo application.
   */
  export const initTodoApp = () => {
    loadTodos();
    renderTodos();

    const newTodoInput = document.getElementById('new-todo-input');
    const addTodoButton = document.getElementById('add-todo-button');

    if (addTodoButton && newTodoInput) {
      addTodoButton.addEventListener('click', () => {
        addTodo(newTodoInput.value);
        newTodoInput.value = ''; // Clear input after adding
      });

      newTodoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          addTodo(newTodoInput.value);
          newTodoInput.value = ''; // Clear input after adding
        }
      });
    }
  };

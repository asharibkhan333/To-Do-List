// DOM ELEMENTS
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');

// STATE MANAGEMENT
let tasks = [];


// LOCAL STORAGE FUNCTIONS
/**
 * Load tasks from localStorage
 * @returns {Array} 
 */
function loadTasks() {
  try {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
}


//   Save tasks to localStorage
 
function saveTasks() {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}

// TASK CRUD OPERATIONS
//   Add a new task

function addTask() {
  const text = taskInput.value.trim();
  
  // Prevent empty task submissions
  if (!text) return;
  
  // Create new task object
  const newTask = {
    id: Date.now().toString(),
    text: text,
    completed: false,
    createdAt: Date.now()
  };
  
  // Add to tasks array
  tasks.push(newTask);
  
  // Save and render
  saveTasks();
  renderTasks();
  
  // Clear input
  taskInput.value = '';
  updateAddButtonState();
  
  taskInput.focus();
}

/**
 * Toggle task completion status
 * @param {string} id - 
 */
function toggleTask(id) {
  tasks = tasks.map(task => 
    task.id === id 
      ? { ...task, completed: !task.completed } 
      : task
  );
  
  saveTasks();
  renderTasks();
}

/**
 * Delete a task
 * @param {string} id - 
 */
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  
  saveTasks();
  renderTasks();
}

// UI RENDERING FUNCTIONS

function renderTasks() {
  // Clear current list
  taskList.innerHTML = '';
  
  // Toggle empty state visibility
  if (tasks.length === 0) {
    emptyState.classList.remove('hidden');
    taskList.classList.add('hidden');
  } else {
    emptyState.classList.add('hidden');
    taskList.classList.remove('hidden');
    
    // Render each task
    tasks.forEach(task => {
      const li = createTaskElement(task);
      taskList.appendChild(li);
    });
  }
  
  // Update counters
  updateCounters();
}

/**
 * @param {Object} task - 
 * @returns {HTMLElement} 
 */
function createTaskElement(task) {
  // Create list item
  const li = document.createElement('li');
  li.className = `task-item${task.completed ? ' completed' : ''}`;
  li.dataset.id = task.id;
  
  // Create checkbox button
  const checkboxBtn = document.createElement('button');
  checkboxBtn.className = `checkbox-btn${task.completed ? ' checked' : ''}`;
  checkboxBtn.setAttribute('aria-label', task.completed ? 'Mark as incomplete' : 'Mark as complete');
  checkboxBtn.setAttribute('aria-pressed', task.completed);
  checkboxBtn.innerHTML = `
    <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  `;
  checkboxBtn.addEventListener('click', () => toggleTask(task.id));
  
  // Create task text
  const taskText = document.createElement('span');
  taskText.className = 'task-text';
  taskText.textContent = task.text;
  
  // Create delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
  deleteBtn.innerHTML = `
    <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  `;
  deleteBtn.addEventListener('click', () => deleteTask(task.id));
  
  // Assemble task item
  li.appendChild(checkboxBtn);
  li.appendChild(taskText);
  li.appendChild(deleteBtn);
  
  return li;
}

//   Update task counters

function updateCounters() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  
  totalCount.textContent = total;
  completedCount.textContent = completed;
  pendingCount.textContent = pending;
}


//   Update add button disabled state based on input
 
function updateAddButtonState() {
  addBtn.disabled = !taskInput.value.trim();
}

// EVENT LISTENERS
taskInput.addEventListener('input', updateAddButtonState);

// Keyboard event - add task on Enter
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Click event - add task button
addBtn.addEventListener('click', addTask);

// INITIALIZATION
 
function init() {
  // Load tasks from localStorage
  tasks = loadTasks();
  
  // Render tasks
  renderTasks();
  
  // Set initial button state
  updateAddButtonState();
  
  // Focus input for quick entry
  taskInput.focus();
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', init);

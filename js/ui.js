/**
 * UI Controller
 * Handles UI rendering and user interactions
 */
class UIController {
    constructor(taskManager) {
      this.taskManager = taskManager;
      this.currentEditingTask = null;
      
      // DOM Elements
      this.taskList = document.getElementById('task-list');
      this.taskForm = document.getElementById('task-form');
      this.taskInput = document.getElementById('task-input');
      this.filterBtns = document.querySelectorAll('.filter-btn');
      this.clearCompletedBtn = document.getElementById('clear-completed');
      this.tasksCountEl = document.getElementById('tasks-count');
      this.emptyState = document.getElementById('empty-state');
      this.priorityBtn = document.getElementById('priority-btn');
      this.priorityDropdown = document.getElementById('priority-dropdown');
      this.dateBtn = document.getElementById('date-btn');
      this.datePicker = document.getElementById('date-picker');
      this.dueDateInput = document.getElementById('due-date-input');
      this.selectedPriority = document.getElementById('selected-priority');
      this.selectedDate = document.getElementById('selected-date');
      
      // Templates
      this.taskTemplate = document.getElementById('task-template');
      this.editTemplate = document.getElementById('edit-template');
      
      // State
      this.currentPriority = 'low';
      this.currentDueDate = null;
      
      // Event Bindings
      this.bindEvents();
    }
    
    /**
     * Bind all event listeners
     */
    bindEvents() {
      // Form submission
      this.taskForm.addEventListener('submit', this.handleSubmit.bind(this));
      
      // Priority dropdown
      this.priorityBtn.addEventListener('click', this.togglePriorityDropdown.bind(this));
      document.querySelectorAll('.priority-option').forEach(option => {
        option.addEventListener('click', this.setPriority.bind(this));
      });
      
      // Date picker
      this.dateBtn.addEventListener('click', this.toggleDatePicker.bind(this));
      this.dueDateInput.addEventListener('change', this.setDueDate.bind(this));
      
      // Filter buttons
      this.filterBtns.forEach(btn => {
        btn.addEventListener('click', this.handleFilterChange.bind(this));
      });
      
      // Clear completed
      this.clearCompletedBtn.addEventListener('click', this.handleClearCompleted.bind(this));
      
      // Close dropdowns when clicking outside
      document.addEventListener('click', this.handleOutsideClick.bind(this));
    }
    
    /**
     * Initialize UI
     */
    init() {
      // Set initial filter
      this.setActiveFilter(this.taskManager.currentFilter);
      
      // Render tasks
      this.renderTasks();
      
      // Update tasks count
      this.updateTasksCount();
    }
    
    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    handleSubmit(e) {
      e.preventDefault();
      const text = this.taskInput.value.trim();
      if (text) {
        const newTask = this.taskManager.addTask(text, this.currentPriority, this.currentDueDate);
        this.renderTask(newTask);
        this.updateTasksCount();
        this.updateEmptyState();
        
        // Reset form
        this.taskInput.value = '';
        this.resetPriority();
        this.resetDueDate();
        this.taskInput.focus();
      }
    }
    
    /**
     * Toggle priority dropdown
     * @param {Event} e - Click event
     */
    togglePriorityDropdown(e) {
      e.stopPropagation();
      this.priorityDropdown.classList.toggle('hidden');
      this.datePicker.classList.add('hidden');
    }
    
    /**
     * Set task priority
     * @param {Event} e - Click event
     */
    setPriority(e) {
      const priority = e.target.dataset.priority;
      this.currentPriority = priority;
      this.selectedPriority.classList.remove('hidden');
      this.selectedPriority.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 12 5.25 5 2.625-5H8c0-3.75 3-7.5 7.5-7.5 2.25 0 4.125.75 5.25 2.25.75 1.5 1.5 3 1.5 4.5 0 3.75-2.625 7.5-6.75 8.25-1.5.375-3 .375-4.125.375"></path></svg>
        ${priority.charAt(0).toUpperCase() + priority.slice(1)}
      `;
      this.selectedPriority.className = `selected-priority priority-${priority}`;
      this.priorityDropdown.classList.add('hidden');
    }
    
    /**
     * Reset priority selection
     */
    resetPriority() {
      this.currentPriority = 'low';
      this.selectedPriority.classList.add('hidden');
    }
    
    /**
     * Toggle date picker
     * @param {Event} e - Click event
     */
    toggleDatePicker(e) {
      e.stopPropagation();
      this.datePicker.classList.toggle('hidden');
      this.priorityDropdown.classList.add('hidden');
    }
    
    /**
     * Set due date
     */
    setDueDate() {
      const date = this.dueDateInput.value;
      if (date) {
        this.currentDueDate = date;
        this.selectedDate.classList.remove('hidden');
        
        // Format date for display
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        
        this.selectedDate.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
          ${formattedDate}
        `;
      } else {
        this.resetDueDate();
      }
      this.datePicker.classList.add('hidden');
    }
    
    /**
     * Reset due date selection
     */
    resetDueDate() {
      this.currentDueDate = null;
      this.dueDateInput.value = '';
      this.selectedDate.classList.add('hidden');
    }
    
    /**
     * Handle clicking outside dropdowns
     * @param {Event} e - Click event
     */
    handleOutsideClick(e) {
      // Close priority dropdown if clicking outside
      if (!this.priorityBtn.contains(e.target) && !this.priorityDropdown.contains(e.target)) {
        this.priorityDropdown.classList.add('hidden');
      }
      
      // Close date picker if clicking outside
      if (!this.dateBtn.contains(e.target) && !this.datePicker.contains(e.target)) {
        this.datePicker.classList.add('hidden');
      }
    }
    
    /**
     * Handle filter change
     * @param {Event} e - Click event
     */
    handleFilterChange(e) {
      const filter = e.target.dataset.filter;
      this.taskManager.setFilter(filter);
      this.setActiveFilter(filter);
      this.renderTasks();
    }
    
    /**
     * Set active filter button
     * @param {String} filter - Filter name
     */
    setActiveFilter(filter) {
      this.filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
    
    /**
     * Handle clear completed button
     */
    handleClearCompleted() {
      const clearedCount = this.taskManager.clearCompleted();
      if (clearedCount > 0) {
        this.renderTasks();
        this.updateTasksCount();
      }
    }
    
    /**
     * Render all tasks
     */
    renderTasks() {
      const filteredTasks = this.taskManager.getFilteredTasks();
      this.taskList.innerHTML = '';
      
      filteredTasks.forEach(task => {
        this.renderTask(task);
      });
      
      this.updateEmptyState();
    }
    
    /**
     * Render a single task
     * @param {Object} task - Task to render
     */
    renderTask(task) {
      const taskEl = document.importNode(this.taskTemplate.content, true);
      const li = taskEl.querySelector('.task-item');
      
      // Set task ID
      li.dataset.id = task.id;
      
      // Set task text
      li.querySelector('.task-text').textContent = task.text;
      
      // Set task priority class
      li.classList.add(`priority-${task.priority}`);
      
      // Set task completion state
      const checkbox = li.querySelector('.task-complete');
      checkbox.checked = task.completed;
      if (task.completed) {
        li.classList.add('completed');
      }
      
      // Set due date if exists
      if (task.dueDate) {
        const dueDateEl = li.querySelector('.task-due-date');
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const formattedDate = dueDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        
        dueDateEl.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
          ${formattedDate}
        `;
        
        // Add classes based on due date
        if (dueDate < today) {
          dueDateEl.classList.add('overdue');
        } else if (dueDate.getTime() === today.getTime()) {
          dueDateEl.classList.add('today');
        } else {
          dueDateEl.classList.add('future');
        }
      }
      
      // Event listeners
      checkbox.addEventListener('change', () => {
        this.toggleTaskComplete(task.id);
      });
      
      li.querySelector('.delete-btn').addEventListener('click', () => {
        this.deleteTask(task.id);
      });
      
      li.querySelector('.edit-btn').addEventListener('click', () => {
        this.startEditing(task.id);
      });
      
      // Add to list
      this.taskList.appendChild(li);
    }
    
    /**
     * Toggle task completion
     * @param {String} id - Task ID
     */
    toggleTaskComplete(id) {
      const task = this.taskManager.toggleTask(id);
      const taskEl = this.taskList.querySelector(`[data-id="${id}"]`);
      
      if (taskEl) {
        if (task.completed) {
          taskEl.classList.add('completed');
          taskEl.classList.add('checked');
          setTimeout(() => {
            taskEl.classList.remove('checked');
          }, 500);
        } else {
          taskEl.classList.remove('completed');
        }
        
        this.updateTasksCount();
        
        // If current filter would hide this task, re-render after a delay
        if ((this.taskManager.currentFilter === 'active' && task.completed) ||
            (this.taskManager.currentFilter === 'completed' && !task.completed)) {
          setTimeout(() => {
            this.renderTasks();
          }, 500);
        }
      }
    }
    
    /**
     * Delete task
     * @param {String} id - Task ID
     */
    deleteTask(id) {
      const taskEl = this.taskList.querySelector(`[data-id="${id}"]`);
      
      if (taskEl) {
        // Add animation class
        taskEl.style.opacity = '0';
        taskEl.style.transform = 'translateX(30px)';
        
        // Remove after animation
        setTimeout(() => {
          this.taskManager.deleteTask(id);
          taskEl.remove();
          this.updateTasksCount();
          this.updateEmptyState();
        }, 300);
      }
    }
    
    /**
     * Start editing task
     * @param {String} id - Task ID
     */
    startEditing(id) {
      // Find task in data
      const task = this.taskManager.tasks.find(t => t.id === id);
      if (!task) return;
      
      this.currentEditingTask = task;
      
      // Find task element
      const taskEl = this.taskList.querySelector(`[data-id="${id}"]`);
      if (!taskEl) return;
      
      // Clone edit template
      const editEl = document.importNode(this.editTemplate.content, true);
      const form = editEl.querySelector('.edit-form');
      const input = editEl.querySelector('.edit-input');
      
      // Set current text
      input.value = task.text;
      
      // Replace task content with edit form
      const taskContent = taskEl.querySelector('.task-content');
      const taskActions = taskEl.querySelector('.task-actions');
      taskContent.style.display = 'none';
      taskActions.style.display = 'none';
      taskEl.appendChild(form);
      
      // Focus input
      setTimeout(() => {
        input.focus();
        input.select();
      }, 10);
      
      // Event listeners
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveEdit(id, input.value);
      });
      
      form.querySelector('.cancel-btn').addEventListener('click', () => {
        this.cancelEdit(id);
      });
      
      // Priority button
      form.querySelector('.edit-priority-btn').addEventListener('click', (e) => {
        const priorityContainer = document.createElement('div');
        priorityContainer.className = 'priority-dropdown';
        priorityContainer.style.position = 'absolute';
        priorityContainer.style.zIndex = '100';
        priorityContainer.style.background = 'var(--color-bg-primary)';
        priorityContainer.style.boxShadow = 'var(--shadow-lg)';
        priorityContainer.style.borderRadius = 'var(--radius-md)';
        priorityContainer.style.padding = 'var(--space-2)';
        
        const priorities = ['low', 'medium', 'high'];
        priorities.forEach(priority => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'priority-option';
          btn.dataset.priority = priority;
          btn.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
          btn.addEventListener('click', () => {
            task.priority = priority;
            priorityContainer.remove();
            // Update task element class
            taskEl.className = taskEl.className.replace(/priority-\w+/, `priority-${priority}`);
          });
          priorityContainer.appendChild(btn);
        });
        
        // Position dropdown under button
        const rect = e.target.getBoundingClientRect();
        priorityContainer.style.top = rect.bottom + 'px';
        priorityContainer.style.left = rect.left + 'px';
        
        // Add to document
        document.body.appendChild(priorityContainer);
        
        // Close when clicking outside
        const clickHandler = (event) => {
          if (!priorityContainer.contains(event.target) && event.target !== e.target) {
            priorityContainer.remove();
            document.removeEventListener('click', clickHandler);
          }
        };
        document.addEventListener('click', clickHandler);
      });
      
      // Date button
      form.querySelector('.edit-date-btn').addEventListener('click', (e) => {
        const dateContainer = document.createElement('div');
        dateContainer.className = 'date-picker';
        dateContainer.style.position = 'absolute';
        dateContainer.style.zIndex = '100';
        dateContainer.style.background = 'var(--color-bg-primary)';
        dateContainer.style.boxShadow = 'var(--shadow-lg)';
        dateContainer.style.borderRadius = 'var(--radius-md)';
        dateContainer.style.padding = 'var(--space-2)';
        
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'due-date-input';
        dateInput.value = task.dueDate || '';
        dateInput.addEventListener('change', () => {
          task.dueDate = dateInput.value || null;
          dateContainer.remove();
        });
        dateContainer.appendChild(dateInput);
        
        // Position dropdown under button
        const rect = e.target.getBoundingClientRect();
        dateContainer.style.top = rect.bottom + 'px';
        dateContainer.style.left = rect.left + 'px';
        
        // Add to document
        document.body.appendChild(dateContainer);
        
        // Close when clicking outside
        const clickHandler = (event) => {
          if (!dateContainer.contains(event.target) && event.target !== e.target) {
            dateContainer.remove();
            document.removeEventListener('click', clickHandler);
          }
        };
        document.addEventListener('click', clickHandler);
      });
    }
    
    /**
     * Save task edit
     * @param {String} id - Task ID
     * @param {String} text - New task text
     */
    saveEdit(id, text) {
      if (text.trim() === '') return this.cancelEdit(id);
      
      const task = this.currentEditingTask;
      if (!task) return;
      
      // Update task in data manager
      this.taskManager.updateTask(id, {
        text: text.trim(),
        priority: task.priority,
        dueDate: task.dueDate
      });
      
      // Remove edit form and show task content
      this.cancelEdit(id);
      
      // Re-render task
      const taskEl = this.taskList.querySelector(`[data-id="${id}"]`);
      const oldTaskEl = taskEl;
      if (taskEl) {
        // Create new task element
        const newTaskItem = this.createTaskElement(task);
        
        // Replace old element with new one
        oldTaskEl.parentNode.replaceChild(newTaskItem, oldTaskEl);
      }
    }
    
    /**
     * Create a task element
     * @param {Object} task - Task data
     * @returns {HTMLElement} - New task element
     */
    createTaskElement(task) {
      const taskEl = document.importNode(this.taskTemplate.content, true).querySelector('.task-item');
      
      // Set task ID
      taskEl.dataset.id = task.id;
      
      // Set task text
      taskEl.querySelector('.task-text').textContent = task.text;
      
      // Set task priority class
      taskEl.classList.add(`priority-${task.priority}`);
      
      // Set task completion state
      const checkbox = taskEl.querySelector('.task-complete');
      checkbox.checked = task.completed;
      if (task.completed) {
        taskEl.classList.add('completed');
      }
      
      // Set due date if exists
      if (task.dueDate) {
        const dueDateEl = taskEl.querySelector('.task-due-date');
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const formattedDate = dueDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        
        dueDateEl.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
          ${formattedDate}
        `;
        
        // Add classes based on due date
        if (dueDate < today) {
          dueDateEl.classList.add('overdue');
        } else if (dueDate.getTime() === today.getTime()) {
          dueDateEl.classList.add('today');
        } else {
          dueDateEl.classList.add('future');
        }
      }
      
      // Event listeners
      checkbox.addEventListener('change', () => {
        this.toggleTaskComplete(task.id);
      });
      
      taskEl.querySelector('.delete-btn').addEventListener('click', () => {
        this.deleteTask(task.id);
      });
      
      taskEl.querySelector('.edit-btn').addEventListener('click', () => {
        this.startEditing(task.id);
      });
      
      return taskEl;
    }
    
    /**
     * Cancel task edit
     * @param {String} id - Task ID
     */
    cancelEdit(id) {
      const taskEl = this.taskList.querySelector(`[data-id="${id}"]`);
      if (!taskEl) return;
      
      // Remove edit form
      const form = taskEl.querySelector('.edit-form');
      if (form) form.remove();
      
      // Show task content
      const taskContent = taskEl.querySelector('.task-content');
      const taskActions = taskEl.querySelector('.task-actions');
      taskContent.style.display = '';
      taskActions.style.display = '';
      
      this.currentEditingTask = null;
    }
    
    /**
     * Update tasks count in footer
     */
    updateTasksCount() {
      const activeCount = this.taskManager.getActiveCount();
      const text = activeCount === 1 ? '1 task left' : `${activeCount} tasks left`;
      this.tasksCountEl.textContent = text;
    }
    
    /**
     * Update empty state visibility
     */
    updateEmptyState() {
      const filteredTasks = this.taskManager.getFilteredTasks();
      if (filteredTasks.length === 0) {
        this.emptyState.style.display = 'flex';
      } else {
        this.emptyState.style.display = 'none';
      }
    }
  }
  
  // Create and initialize UI controller
  const uiController = new UIController(taskManager);
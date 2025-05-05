/**
 * Task Manager
 * Handles task data and operations
 */
class TaskManager {
    constructor(storageManager) {
      this.storageManager = storageManager;
      this.tasks = this.storageManager.getTasks();
      this.currentFilter = this.storageManager.getFilter();
    }
    
    /**
     * Generate a unique ID for a task
     * @returns {String} - Unique ID
     */
    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    /**
     * Add a new task
     * @param {String} text - Task text
     * @param {String} priority - Task priority (low, medium, high)
     * @param {String} dueDate - Task due date
     * @returns {Object} - Newly created task
     */
    addTask(text, priority = 'low', dueDate = null) {
      const newTask = {
        id: this.generateId(),
        text: text.trim(),
        completed: false,
        createdAt: Date.now(),
        priority: priority,
        dueDate: dueDate
      };
      
      this.tasks.unshift(newTask);
      this.storageManager.saveTasks(this.tasks);
      return newTask;
    }
    
    /**
     * Toggle task completion status
     * @param {String} id - Task ID
     * @returns {Object} - Updated task
     */
    toggleTask(id) {
      const task = this.tasks.find(task => task.id === id);
      if (task) {
        task.completed = !task.completed;
        this.storageManager.saveTasks(this.tasks);
      }
      return task;
    }
    
    /**
     * Update a task
     * @param {String} id - Task ID
     * @param {Object} updates - Object with task properties to update
     * @returns {Object} - Updated task
     */
    updateTask(id, updates) {
      const taskIndex = this.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
        this.storageManager.saveTasks(this.tasks);
        return this.tasks[taskIndex];
      }
      return null;
    }
    
    /**
     * Delete a task
     * @param {String} id - Task ID
     * @returns {Boolean} - Success status
     */
    deleteTask(id) {
      const initialLength = this.tasks.length;
      this.tasks = this.tasks.filter(task => task.id !== id);
      
      if (initialLength !== this.tasks.length) {
        this.storageManager.saveTasks(this.tasks);
        return true;
      }
      return false;
    }
    
    /**
     * Clear all completed tasks
     * @returns {Number} - Number of tasks cleared
     */
    clearCompleted() {
      const initialLength = this.tasks.length;
      this.tasks = this.tasks.filter(task => !task.completed);
      
      this.storageManager.saveTasks(this.tasks);
      return initialLength - this.tasks.length;
    }
    
    /**
     * Set current filter
     * @param {String} filter - 'all', 'active', or 'completed'
     */
    setFilter(filter) {
      this.currentFilter = filter;
      this.storageManager.saveFilter(filter);
    }
    
    /**
     * Get tasks filtered by current filter
     * @returns {Array} - Filtered tasks
     */
    getFilteredTasks() {
      switch(this.currentFilter) {
        case 'active':
          return this.tasks.filter(task => !task.completed);
        case 'completed':
          return this.tasks.filter(task => task.completed);
        default:
          return this.tasks;
      }
    }
    
    /**
     * Get the number of active tasks
     * @returns {Number} - Active task count
     */
    getActiveCount() {
      return this.tasks.filter(task => !task.completed).length;
    }
    
    /**
     * Get the number of completed tasks
     * @returns {Number} - Completed task count
     */
    getCompletedCount() {
      return this.tasks.filter(task => task.completed).length;
    }
    
    /**
     * Reorder tasks
     * @param {Number} oldIndex - Original position
     * @param {Number} newIndex - New position
     */
    reorderTasks(oldIndex, newIndex) {
      if (oldIndex === newIndex) return;
      
      const filteredTasks = this.getFilteredTasks();
      const task = filteredTasks[oldIndex];
      
      // Remove from original position in filtered list
      filteredTasks.splice(oldIndex, 1);
      
      // Insert at new position in filtered list
      filteredTasks.splice(newIndex, 0, task);
      
      // Map back to full list
      if (this.currentFilter !== 'all') {
        const newTasks = [];
        let filteredIndex = 0;
        
        for (let i = 0; i < this.tasks.length; i++) {
          const current = this.tasks[i];
          const isFiltered = (this.currentFilter === 'active' && !current.completed) || 
                             (this.currentFilter === 'completed' && current.completed);
          
          if (isFiltered) {
            newTasks.push(filteredTasks[filteredIndex]);
            filteredIndex++;
          } else {
            newTasks.push(current);
          }
        }
        
        this.tasks = newTasks;
      } else {
        this.tasks = filteredTasks;
      }
      
      this.storageManager.saveTasks(this.tasks);
    }
  }
  
  // Create a task manager instance
  const taskManager = new TaskManager(storageManager);
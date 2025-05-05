/**
 * Local Storage Manager
 * Handles saving and retrieving task data from localStorage
 */
class StorageManager {
    constructor() {
      this.storageKey = 'taskflow-tasks';
      this.themeKey = 'taskflow-theme';
      this.filterKey = 'taskflow-filter';
    }
    
    /**
     * Save tasks to localStorage
     * @param {Array} tasks - Array of task objects
     */
    saveTasks(tasks) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
      } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
      }
    }
    
    /**
     * Get tasks from localStorage
     * @returns {Array} - Array of task objects
     */
    getTasks() {
      try {
        const tasks = localStorage.getItem(this.storageKey);
        return tasks ? JSON.parse(tasks) : [];
      } catch (error) {
        console.error('Error getting tasks from localStorage:', error);
        return [];
      }
    }
    
    /**
     * Save current theme to localStorage
     * @param {String} theme - 'light' or 'dark'
     */
    saveTheme(theme) {
      try {
        localStorage.setItem(this.themeKey, theme);
      } catch (error) {
        console.error('Error saving theme to localStorage:', error);
      }
    }
    
    /**
     * Get saved theme from localStorage
     * @returns {String} - 'light' or 'dark'
     */
    getTheme() {
      try {
        return localStorage.getItem(this.themeKey) || this.getPreferredTheme();
      } catch (error) {
        console.error('Error getting theme from localStorage:', error);
        return 'light';
      }
    }
    
    /**
     * Get user's preferred color scheme
     * @returns {String} - 'light' or 'dark'
     */
    getPreferredTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    /**
     * Save current filter to localStorage
     * @param {String} filter - 'all', 'active', or 'completed'
     */
    saveFilter(filter) {
      try {
        localStorage.setItem(this.filterKey, filter);
      } catch (error) {
        console.error('Error saving filter to localStorage:', error);
      }
    }
    
    /**
     * Get saved filter from localStorage
     * @returns {String} - 'all', 'active', or 'completed'
     */
    getFilter() {
      try {
        return localStorage.getItem(this.filterKey) || 'all';
      } catch (error) {
        console.error('Error getting filter from localStorage:', error);
        return 'all';
      }
    }
  }
  
  // Create and export a storage manager instance
  const storageManager = new StorageManager();
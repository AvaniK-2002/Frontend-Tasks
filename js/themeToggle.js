/**
 * Theme Toggle
 * Handles switching between light and dark themes
 */
class ThemeToggle {
    constructor(storageManager) {
      this.storageManager = storageManager;
      this.toggleBtn = document.getElementById('theme-toggle');
      this.currentTheme = this.storageManager.getTheme();
      
      this.init();
    }
    
    /**
     * Initialize theme toggle
     */
    init() {
      // Set initial theme
      this.applyTheme(this.currentTheme);
      
      // Add click event listener
      this.toggleBtn.addEventListener('click', this.toggleTheme.bind(this));
      
      // Add system preference change listener
      this.addSystemPreferenceListener();
    }
    
    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.applyTheme(newTheme);
      this.storageManager.saveTheme(newTheme);
      this.currentTheme = newTheme;
      
      // Add animation class to button
      this.toggleBtn.classList.add('theme-toggled');
      setTimeout(() => {
        this.toggleBtn.classList.remove('theme-toggled');
      }, 500);
    }
    
    /**
     * Apply theme to document
     * @param {String} theme - 'light' or 'dark'
     */
    applyTheme(theme) {
      if (theme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }
    
    /**
     * Add system color scheme preference listener
     */
    addSystemPreferenceListener() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Only listen for changes if no user preference is saved
      if (!localStorage.getItem(this.storageManager.themeKey)) {
        mediaQuery.addEventListener('change', e => {
          const newTheme = e.matches ? 'dark' : 'light';
          this.applyTheme(newTheme);
          this.currentTheme = newTheme;
        });
      }
    }
  }
  
  // Initialize theme toggle
  const themeToggle = new ThemeToggle(storageManager);
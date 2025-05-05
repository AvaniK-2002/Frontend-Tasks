/**
 * Main Application
 * The entry point that initializes all components
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI (already done in ui.js)
    uiController.init();
    
    // Log welcome message
    console.log('TaskFlow To-Do App initialized successfully!');
    
    // Add service worker registration for PWA functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
          console.log('ServiceWorker registration successful');
        }).catch(error => {
          console.log('ServiceWorker registration failed:', error);
        });
      });
    }
  });
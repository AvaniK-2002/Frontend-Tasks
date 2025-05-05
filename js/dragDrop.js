/**
 * Drag and Drop Handler
 * Manages task reordering via drag and drop
 */
class DragDropHandler {
    constructor(taskManager, uiController) {
      this.taskManager = taskManager;
      this.uiController = uiController;
      this.draggedItem = null;
      this.draggedIndex = null;
      this.taskList = document.getElementById('task-list');
      
      this.init();
    }
    
    /**
     * Initialize drag and drop functionality
     */
    init() {
      this.taskList.addEventListener('dragstart', this.handleDragStart.bind(this));
      this.taskList.addEventListener('dragover', this.handleDragOver.bind(this));
      this.taskList.addEventListener('dragenter', this.handleDragEnter.bind(this));
      this.taskList.addEventListener('dragleave', this.handleDragLeave.bind(this));
      this.taskList.addEventListener('drop', this.handleDrop.bind(this));
      this.taskList.addEventListener('dragend', this.handleDragEnd.bind(this));
    }
    
    /**
     * Handle drag start event
     * @param {DragEvent} e - Drag start event
     */
    handleDragStart(e) {
      if (!e.target.classList.contains('task-item')) return;
      
      // Don't allow dragging while editing
      if (e.target.querySelector('.edit-form')) {
        e.preventDefault();
        return;
      }
      
      this.draggedItem = e.target;
      this.draggedIndex = Array.from(this.taskList.children).indexOf(this.draggedItem);
      
      // Add dragging class for styling
      setTimeout(() => {
        this.draggedItem.classList.add('dragging');
      }, 0);
      
      // Set drag image and data
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', this.draggedItem.dataset.id);
      
      // Set drag ghost image
      if (e.dataTransfer.setDragImage) {
        const ghostEl = this.draggedItem.cloneNode(true);
        ghostEl.style.opacity = '0.7';
        ghostEl.style.position = 'absolute';
        ghostEl.style.top = '-1000px';
        document.body.appendChild(ghostEl);
        e.dataTransfer.setDragImage(ghostEl, 20, 20);
        setTimeout(() => {
          document.body.removeChild(ghostEl);
        }, 0);
      }
    }
    
    /**
     * Handle drag over event
     * @param {DragEvent} e - Drag over event
     */
    handleDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      return false;
    }
    
    /**
     * Handle drag enter event
     * @param {DragEvent} e - Drag enter event
     */
    handleDragEnter(e) {
      const target = this.findTaskItem(e.target);
      if (!target || target === this.draggedItem) return;
      
      // Add indicator class
      target.classList.add('drag-over');
    }
    
    /**
     * Handle drag leave event
     * @param {DragEvent} e - Drag leave event
     */
    handleDragLeave(e) {
      const target = this.findTaskItem(e.target);
      if (!target) return;
      
      // Remove indicator class
      target.classList.remove('drag-over');
    }
    
    /**
     * Handle drop event
     * @param {DragEvent} e - Drop event
     */
    handleDrop(e) {
      e.stopPropagation();
      
      const target = this.findTaskItem(e.target);
      if (!target || target === this.draggedItem) return false;
      
      // Remove indicator class
      target.classList.remove('drag-over');
      
      // Get target index
      const targetIndex = Array.from(this.taskList.children).indexOf(target);
      
      // Reorder tasks in data manager
      this.taskManager.reorderTasks(this.draggedIndex, targetIndex);
      
      // Rerender tasks
      this.uiController.renderTasks();
      
      return false;
    }
    
    /**
     * Handle drag end event
     */
    handleDragEnd() {
      if (this.draggedItem) {
        this.draggedItem.classList.remove('dragging');
        this.draggedItem = null;
        this.draggedIndex = null;
      }
      
      // Remove any remaining drag-over classes
      const dragOverItems = this.taskList.querySelectorAll('.drag-over');
      dragOverItems.forEach(item => {
        item.classList.remove('drag-over');
      });
    }
    
    /**
     * Find the closest task item element
     * @param {HTMLElement} el - Element to start from
     * @returns {HTMLElement|null} - Task item element or null
     */
    findTaskItem(el) {
      if (!el) return null;
      if (el.classList && el.classList.contains('task-item')) {
        return el;
      }
      return this.findTaskItem(el.parentElement);
    }
  }
  
  // Initialize drag and drop handler
  const dragDropHandler = new DragDropHandler(taskManager, uiController);
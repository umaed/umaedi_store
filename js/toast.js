// toast.js - Toast Notification System
class Toast {
  constructor() {
    this.container = this.createContainer();
  }

  createContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    this.container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    if (duration > 0) {
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    return toast;
  }

  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 3000) {
    return this.show(message, 'error', duration);
  }

  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }

  warning(message, duration = 3000) {
    return this.show(message, 'warning', duration);
  }
}

const toast = new Toast();
window.toast = toast;

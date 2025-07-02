import { Injectable } from '@angular/core';

declare var bootstrap: any; // Declare bootstrap variable

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackbarContainerId = 'snackbarContainer';

  constructor() {
    this.ensureSnackbarContainer();
  }

  private ensureSnackbarContainer(): void {
    if (document.getElementById(this.snackbarContainerId)) {
      return;
    }
    const container = document.createElement('div');
    container.id = this.snackbarContainerId;
    // Position the container at the bottom right, for example
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '1056'; // Higher than most elements, adjust as needed
    document.body.appendChild(container);
  }

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
    const container = document.getElementById(this.snackbarContainerId);
    if (!container) {
      console.error('Snackbar container not found!');
      return;
    }

    const toastId = `toast-${new Date().getTime()}`;
    const toastHTML = `
      <div id="${toastId}" class="toast align-items-center text-white bg-${this.getBootstrapColor(type)} border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="5000">
        <div class="d-flex">
          <div class="toast-body">
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHTML);

    const toastElement = document.getElementById(toastId);
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement);
      toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove(); // Clean up the DOM after toast is hidden
      });
      toast.show();
    }
  }

  private getBootstrapColor(type: 'success' | 'error' | 'info' | 'warning'): string {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'danger'; // Bootstrap uses 'danger' for error
      case 'info': return 'info';
      case 'warning': return 'warning';
      default: return 'secondary';
    }
  }
}

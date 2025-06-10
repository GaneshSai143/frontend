import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  handleError(error: Error | HttpErrorResponse): void {
    let errorMessage: string;

    if (error instanceof HttpErrorResponse) {
      // Server or connection error
      if (!navigator.onLine) {
        errorMessage = 'No Internet Connection';
      } else {
        // Handle different HTTP error codes
        switch (error.status) {
          case 401:
            errorMessage = 'Unauthorized access';
            break;
          case 403:
            errorMessage = 'Access forbidden';
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 500:
            errorMessage = 'Internal server error';
            break;
          default:
            errorMessage = `Error: ${error.message}`;
        }
      }
    } else {
      // Client Error
      errorMessage = error.message ? error.message : error.toString();
    }

    // Log the error
    console.error('An error occurred:', errorMessage);
    
    // Here you can add code to show the error message to the user
    // For example, using a toast notification service
  }
} 
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentAppliedColor: string | null = null;
  private readonly DEFAULT_THEME_COLOR = '#2c3e50'; // Default fallback color

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.applyUserTheme(user);
    });
  }

  private applyUserTheme(user: User | null): void {
    const themeColor = user?.preferredTheme || this.DEFAULT_THEME_COLOR;
    this.applyColorToCssVariables(themeColor);
  }

  // Called by UI components (e.g., Super Admin theme selector)
  public setTheme(themeColor: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.authService.updateCurrentUserProfile({ preferredTheme: themeColor }).subscribe({
        next: () => {
          // The currentUser$ subscription in constructor will handle applying the theme
          // once the user object is updated.
          // For immediate visual feedback, can also call applyColorToCssVariables here:
          // this.applyColorToCssVariables(themeColor);
          console.log('Theme preference update sent to AuthService.');
        },
        error: (err) => {
          console.error('Failed to save theme preference', err);
          // Optionally revert UI or show error to user
        }
      });
    } else {
      // For non-logged-in users, or if theme change is allowed without saving to profile
      this.applyColorToCssVariables(themeColor);
    }
  }

  private applyColorToCssVariables(color: string | null | undefined): void {
    const validColor = color || this.DEFAULT_THEME_COLOR;

    if (this.currentAppliedColor === validColor) {
      return; // Avoid redundant CSS updates
    }

    // Define which CSS variables are affected by this single color
    // More sophisticated logic can be added here to derive related colors (e.g., darker/lighter shades)
    document.documentElement.style.setProperty('--sidebar-bg', validColor);
    document.documentElement.style.setProperty('--sidebar-link-active-bg', this.adjustColor(validColor, -20)); // Example: darker shade
    document.documentElement.style.setProperty('--button-primary-bg', validColor);
    document.documentElement.style.setProperty('--button-primary-border', validColor);
    document.documentElement.style.setProperty('--button-primary-hover-bg', this.adjustColor(validColor, -20));
    document.documentElement.style.setProperty('--button-primary-hover-border', this.adjustColor(validColor, -20));
    document.documentElement.style.setProperty('--navbar-link-hover-color', validColor);
    // For stat card decoration, use the color with some opacity
    const [r, g, b] = this.hexToRgb(validColor);
    document.documentElement.style.setProperty('--stat-card-decoration-bg', `rgba(${r}, ${g}, ${b}, 0.1)`);

    this.currentAppliedColor = validColor;
    console.log(`Theme color applied: ${validColor}`);
  }

  // Called by AppComponent on logout or when user becomes unauthenticated
  public applyDefaultTheme(): void {
    this.applyColorToCssVariables(this.DEFAULT_THEME_COLOR);
  }


  // Helper function to darken/lighten a hex color
  // Basic version, for more advanced needs, a library might be better
  private adjustColor(color: string, amount: number): string {
    let usePound = false;
    if (color[0] === '#') {
      color = color.slice(1);
      usePound = true;
    }
    const num = parseInt(color, 16);
    let r = (num >> 16) + amount;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amount;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amount;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  }

  private hexToRgb(hex: string): [number, number, number] {
    let r = 0, g = 0, b = 0;
    // 3 digits
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 digits
    else if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    return [r, g, b];
  }
}

import { Injectable } from '@angular/core';
import { AuthService } from './auth.service'; // To get user role

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private currentTheme = '';

  // Define role-based themes
  private themes: { [key: string]: { [key: string]: string } } = {
    SUPER_ADMIN: {
      '--sidebar-bg': '#000080', // Navy Blue
      '--sidebar-link-active-bg': '#0000CD', // MediumBlue as active link
      '--button-primary-bg': '#000080',
      '--button-primary-border': '#000080',
      '--button-primary-hover-bg': '#000050',
      '--button-primary-hover-border': '#000050',
      '--navbar-link-hover-color': '#000080',
      '--stat-card-decoration-bg': 'rgba(0, 0, 128, 0.1)'
      // Add other CSS variables as needed
    },
    ADMIN: { // Principal
      '--sidebar-bg': '#006400', // Deep Green
      '--sidebar-link-active-bg': '#008000', // Green as active link
      '--button-primary-bg': '#006400',
      '--button-primary-border': '#006400',
      '--button-primary-hover-bg': '#004400',
      '--button-primary-hover-border': '#004400',
      '--navbar-link-hover-color': '#006400',
      '--stat-card-decoration-bg': 'rgba(0, 100, 0, 0.1)'
    },
    TEACHER: {
      '--sidebar-bg': '#4B0082', // Indigo
      '--sidebar-link-active-bg': '#8A2BE2', // BlueViolet as active link
      '--button-primary-bg': '#4B0082',
      '--button-primary-border': '#4B0082',
      '--button-primary-hover-bg': '#3A0062',
      '--button-primary-hover-border': '#3A0062',
      '--navbar-link-hover-color': '#4B0082',
      '--stat-card-decoration-bg': 'rgba(75, 0, 130, 0.1)'
    },
    STUDENT: {
      '--sidebar-bg': '#008080', // Teal
      '--sidebar-link-active-bg': '#20B2AA', // LightSeaGreen as active link
      '--button-primary-bg': '#008080',
      '--button-primary-border': '#008080',
      '--button-primary-hover-bg': '#006060',
      '--button-primary-hover-border': '#006060',
      '--navbar-link-hover-color': '#008080',
      '--stat-card-decoration-bg': 'rgba(0, 128, 128, 0.1)'
    },
    DEFAULT: { // Fallback theme
      '--sidebar-bg': '#2c3e50', // Default dark blue/grey
      '--sidebar-link-active-bg': '#3498db', // Default primary blue
      '--button-primary-bg': '#3498db',
      '--button-primary-border': '#3498db',
      '--button-primary-hover-bg': '#2980b9',
      '--button-primary-hover-border': '#2980b9',
      '--navbar-link-hover-color': '#3498db',
      '--stat-card-decoration-bg': 'rgba(52, 152, 219, 0.1)'
    }
  };

  private readonly themeStorageKey = 'user_selected_theme';

  constructor(private authService: AuthService) {
    this.loadAndApplyPersistedTheme();
  }

  private loadAndApplyPersistedTheme(): void {
    const persistedTheme = localStorage.getItem(this.themeStorageKey);
    if (persistedTheme) {
      this.applyTheme(persistedTheme, false); // Apply without saving again
    } else {
      // If no persisted theme, apply based on role (e.g., on initial login)
      this.applyThemeForCurrentUser(false);
    }
  }

  applyThemeForCurrentUser(savePreference: boolean = true): void {
    // Check if a user-selected theme is already overriding this
    const persistedTheme = localStorage.getItem(this.themeStorageKey);
    if (persistedTheme && this.themes[persistedTheme]) {
      this.applyTheme(persistedTheme, false); // Don't re-save if it's already the persisted one
      return;
    }

    const role = this.authService.getUserRole();
    const themeToApply = role && this.themes[role] ? role : 'DEFAULT';
    this.applyTheme(themeToApply, savePreference && role ? false : savePreference);
    // Don't save role-based theme as a "preference" unless it's default or no role
  }

  setTheme(themeName: string): void { // Called by SuperAdmin to select a theme
    this.applyTheme(themeName, true);
  }

  private applyTheme(themeName: string, saveToLocalStorage: boolean): void {
    if (this.currentTheme === themeName && !saveToLocalStorage) { // Avoid re-applying if already current unless saving
        // If saveToLocalStorage is true, we might be re-applying the same theme but ensuring it's saved.
        if(this.currentTheme === themeName && localStorage.getItem(this.themeStorageKey) === themeName) return;
    }

    const theme = this.themes[themeName] || this.themes['DEFAULT'];
    Object.keys(theme).forEach(key => {
      document.documentElement.style.setProperty(key, theme[key]);
    });
    this.currentTheme = themeName;

    if (saveToLocalStorage) {
      localStorage.setItem(this.themeStorageKey, themeName);
    }
  }

  clearTheme(): void { // Clears current styles and persisted preference
    localStorage.removeItem(this.themeStorageKey);
    const themeToClear = this.themes[this.currentTheme] || this.themes['DEFAULT'];
    Object.keys(themeToClear).forEach(key => {
      document.documentElement.style.removeProperty(key);
    });
    this.currentTheme = '';
  }
}

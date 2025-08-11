export class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
  }

  init() {
    this.applyTheme();
  }

  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    localStorage.setItem('theme', this.theme);
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  getCurrentTheme() {
    return this.theme;
  }
}

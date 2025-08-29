import { AppState } from './js/state/AppState.js';
import { Router } from './js/router/Router.js';
import { ThemeManager } from './js/utils/ThemeManager.js';
import { DataGenerator } from './js/data/DataGenerator.js';

// Initialize app
class App {
  constructor() {
    this.appState = new AppState();
    this.router = new Router(this.appState);
    this.themeManager = new ThemeManager();
    this.dataGenerator = new DataGenerator();
    
    this.init();
  }

  async init() {
    try {
      // Initialize authentication first
      await this.appState.initializeAuth();
      
      // Generate initial data
      this.appState.setPitches(this.dataGenerator.generatePitches());
      this.appState.setProducts(this.dataGenerator.generateProducts());
      this.appState.setAnalyticsData(this.dataGenerator.generateAnalyticsData());
      this.appState.setPlayerListings(this.dataGenerator.generatePlayerListings());
      
      // Initialize theme
      this.themeManager.init();
      
      // Initialize router
      this.router.init();
      
      // Set up global event listeners
      this.setupGlobalEventListeners();
    } catch (error) {
      console.error('App initialization error:', error);
      // Continue with app initialization even if auth fails
      this.continueInitWithoutAuth();
    }
  }

  continueInitWithoutAuth() {
    // Generate initial data
    this.appState.setPitches(this.dataGenerator.generatePitches());
    this.appState.setProducts(this.dataGenerator.generateProducts());
    this.appState.setAnalyticsData(this.dataGenerator.generateAnalyticsData());
    this.appState.setPlayerListings(this.dataGenerator.generatePlayerListings());
    
    // Initialize theme
    this.themeManager.init();
    
    // Initialize router
    this.router.init();
    
    // Set up global event listeners
    this.setupGlobalEventListeners();
  }

  setupGlobalEventListeners() {
    // Handle mobile menu
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-mobile-menu-btn]')) {
        const menu = document.querySelector('[data-mobile-menu]');
        if (menu) {
          menu.classList.add('active');
        }
      }
      
      if (e.target.matches('[data-mobile-menu-close]')) {
        const menu = document.querySelector('[data-mobile-menu]');
        if (menu) {
          menu.classList.remove('active');
        }
      }
    });

    // Handle theme toggle
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-theme-toggle]')) {
        this.themeManager.toggle();
      }
    });

    // Close mobile menu when clicking nav links
    document.addEventListener('click', (e) => {
      if (e.target.matches('.mobile-nav-link')) {
        const menu = document.querySelector('[data-mobile-menu]');
        if (menu) {
          menu.classList.remove('active');
        }
      }
    });
  }
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});

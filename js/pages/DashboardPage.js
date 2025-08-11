import { Header } from '../components/Header.js';
import { SearchFilters } from '../components/SearchFilters.js';
import { PitchCard } from '../components/PitchCard.js';

export class DashboardPage {
  constructor(appState, router) {
    this.appState = appState;
    this.header = new Header(appState, router);
    this.searchFilters = new SearchFilters(appState);
  }

  render() {
    const { name } = this.appState.state.user;
    return `
      ${this.header.render()}
      
      <main class="py-8">
        <div class="container">
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold mb-2">Welcome back, ${name.split(' ')[0]}!</h1>
            <p class="text-lg text-secondary">Ready to find your next game? Let's get you on a pitch.</p>
          </div>
          
          ${this.searchFilters.render()}
          
          <div class="pitch-grid grid grid-cols-3 gap-6" data-pitch-grid>
            ${this.renderPitches()}
          </div>
        </div>
      </main>
    `;
  }

  renderPitches() {
    const pitches = this.appState.getFilteredPitches();
    
    if (pitches.length === 0) {
      return `
        <div class="col-span-3 text-center py-12">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-xl font-semibold mb-2">No pitches found</h3>
          <p class="text-secondary mb-4">Try adjusting your search filters</p>
          <button class="btn btn-secondary" data-clear-filters>Clear Filters</button>
        </div>
      `;
    }
    
    return pitches.map(pitch => {
      const pitchCard = new PitchCard(pitch, this.appState);
      return pitchCard.render();
    }).join('');
  }

  mount() {
    this.header.mount();
    this.searchFilters.mount();
    
    // Listen for filter changes
    const pitchGrid = document.querySelector('[data-pitch-grid]');
    if (pitchGrid) {
      pitchGrid.addEventListener('filtersChanged', () => {
        pitchGrid.innerHTML = this.renderPitches();
      });
    }

    // Subscribe to state changes
    this.unsubscribe = this.appState.subscribe((event, data) => {
      if (event === 'stateChange') {
        const pitchGrid = document.querySelector('[data-pitch-grid]');
        if (pitchGrid) {
          pitchGrid.innerHTML = this.renderPitches();
        }
      }
    });
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

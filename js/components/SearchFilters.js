export class SearchFilters {
  constructor(appState) {
    this.appState = appState;
  }

  render() {
    const filters = this.appState.getFilters();
    const pitches = this.appState.getFilteredPitches();
    
    return `
      <div class="search-filters">
        <div class="search-row">
          <div class="form-group">
            <input 
              type="text" 
              class="form-input" 
              placeholder="Search pitches by name or location..." 
              value="${filters.search}"
              data-filter="search"
            >
          </div>
          <button class="btn btn-secondary" data-clear-filters>
            Clear Filters
          </button>
        </div>
        
        <div class="filters-row">
          <div class="form-group">
            <label class="form-label">Pitch Size</label>
            <select class="form-select" data-filter="pitchSize">
              <option value="">All Sizes</option>
              <option value="5-a-side" ${filters.pitchSize === '5-a-side' ? 'selected' : ''}>5-a-side</option>
              <option value="7-a-side" ${filters.pitchSize === '7-a-side' ? 'selected' : ''}>7-a-side</option>
              <option value="11-a-side" ${filters.pitchSize === '11-a-side' ? 'selected' : ''}>11-a-side</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Sort By</label>
            <select class="form-select" data-filter="sort">
              <option value="">Default</option>
              <option value="price-low" ${filters.sort === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-high" ${filters.sort === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
              <option value="rating" ${filters.sort === 'rating' ? 'selected' : ''}>Highest Rated</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Amenities</label>
            <div class="amenity-checkboxes" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
              ${this.renderAmenityCheckboxes()}
            </div>
          </div>
        </div>
        
        <div class="results-info" style="margin-top: 1rem; color: var(--text-secondary);">
          Found ${pitches.length} pitch${pitches.length !== 1 ? 'es' : ''}
        </div>
      </div>
    `;
  }

  renderAmenityCheckboxes() {
    const allAmenities = ['Parking', 'Lighting', 'Seating', 'Changing Rooms', 'Shower', 'Snack Bar'];
    const selectedAmenities = this.appState.getFilters().amenities;
    
    return allAmenities.map(amenity => `
      <label style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem;">
        <input 
          type="checkbox" 
          value="${amenity}"
          ${selectedAmenities.includes(amenity) ? 'checked' : ''}
          data-amenity-filter
        >
        ${amenity}
      </label>
    `).join('');
  }

  mount() {
    // Search input
    const searchInput = document.querySelector('[data-filter="search"]');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.appState.updateFilters({ search: e.target.value });
        this.updateResults();
      });
    }

    // Filter selects
    document.querySelectorAll('[data-filter]').forEach(select => {
      if (select.tagName === 'SELECT') {
        select.addEventListener('change', (e) => {
          this.appState.updateFilters({ [e.target.dataset.filter]: e.target.value });
          this.updateResults();
        });
      }
    });

    // Amenity checkboxes
    document.querySelectorAll('[data-amenity-filter]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const selectedAmenities = Array.from(
          document.querySelectorAll('[data-amenity-filter]:checked')
        ).map(cb => cb.value);
        
        this.appState.updateFilters({ amenities: selectedAmenities });
        this.updateResults();
      });
    });

    // Clear filters
    const clearButton = document.querySelector('[data-clear-filters]');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        this.appState.clearFilters();
        this.refreshComponent();
      });
    }
  }

  updateResults() {
    // Update results count
    const resultsInfo = document.querySelector('.results-info');
    const pitches = this.appState.getFilteredPitches();
    if (resultsInfo) {
      resultsInfo.textContent = `Found ${pitches.length} pitch${pitches.length !== 1 ? 'es' : ''}`;
    }

    // Trigger re-render of pitch grid
    const pitchGrid = document.querySelector('[data-pitch-grid]');
    if (pitchGrid) {
      const event = new CustomEvent('filtersChanged');
      pitchGrid.dispatchEvent(event);
    }
  }

  refreshComponent() {
    const container = document.querySelector('.search-filters');
    if (container) {
      container.outerHTML = this.render();
      this.mount();
      this.updateResults();
    }
  }
}

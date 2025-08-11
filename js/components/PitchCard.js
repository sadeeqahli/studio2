export class PitchCard {
  constructor(pitch, appState) {
    this.pitch = pitch;
    this.appState = appState;
  }

  render() {
    const formattedPrice = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(this.pitch.price);

    return `
      <div class="pitch-card">
        <img src="${this.pitch.image}" alt="${this.pitch.name}" class="pitch-image">
        <div class="pitch-content">
          <div class="pitch-header">
            <div>
              <h3 class="pitch-name">${this.pitch.name}</h3>
              <p class="pitch-location">📍 ${this.pitch.location}</p>
            </div>
            <div class="pitch-rating">
              ⭐ ${this.pitch.rating}
            </div>
          </div>
          
          <div class="pitch-details">
            <div class="flex gap-2 mb-2">
              <span class="pitch-sport">${this.pitch.sport}</span>
              <span class="pitch-size-tag">${this.pitch.pitchSize}</span>
            </div>
            <div class="pitch-amenities">
              ${this.pitch.amenities.slice(0, 3).map(amenity => 
                `<span class="amenity-tag">${amenity}</span>`
              ).join('')}
              ${this.pitch.amenities.length > 3 ? 
                `<span class="amenity-tag">+${this.pitch.amenities.length - 3} more</span>` : ''
              }
            </div>
          </div>
          
          <div class="pitch-footer">
            <div class="pitch-price">
              ${formattedPrice}<span class="price-unit">/hour</span>
            </div>
            <a href="/dashboard/book/${this.pitch.id}" class="btn btn-primary">
              Book Now
            </a>
          </div>
        </div>
      </div>
      <style>
        .pitch-size-tag {
          display: inline-block;
          background-color: var(--light-blue);
          color: var(--dark-blue);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
        }
        [data-theme="dark"] .pitch-size-tag {
          background-color: var(--primary-blue);
          color: white;
        }
      </style>
    `;
  }
}

import { Header } from '../components/Header.js';
import { BookingForm } from '../components/BookingForm.js';

export class BookingPage {
  constructor(appState, router) {
    this.appState = appState;
    this.header = new Header(appState, router);
    this.bookingForm = new BookingForm(appState);
  }

  render() {
    const pitch = this.appState.getSelectedPitch();
    
    if (!pitch) {
      return `
        ${this.header.render()}
        <main class="py-8">
          <div class="container text-center">
            <h1 class="text-2xl font-bold mb-4">Pitch Not Found</h1>
            <a href="/dashboard" class="btn btn-primary">Browse Pitches</a>
          </div>
        </main>
      `;
    }

    const formattedPrice = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(pitch.price);

    return `
      ${this.header.render()}
      
      <main class="py-8">
        <div class="container">
          <!-- Breadcrumb -->
          <nav class="mb-6">
            <div class="flex items-center gap-2 text-sm text-secondary">
              <a href="/dashboard" class="hover:text-primary">Pitches</a>
              <span>›</span>
              <span class="text-primary">${pitch.name}</span>
            </div>
          </nav>
          
          <!-- Pitch Details -->
          <div class="grid grid-cols-3 gap-8 mb-8">
            <div class="col-span-2">
              <img src="${pitch.image}" alt="${pitch.name}" class="w-full h-64 object-cover rounded-lg mb-4">
              <h1 class="text-3xl font-bold mb-2">${pitch.name}</h1>
              <p class="text-secondary mb-4">📍 ${pitch.location}</p>
              <p class="mb-4">${pitch.description}</p>
              
              <div class="flex gap-4 mb-4">
                <span class="pitch-sport">${pitch.sport}</span>
                <span class="bg-secondary px-3 py-1 rounded text-sm">Capacity: ${pitch.capacity} players</span>
                <span class="bg-secondary px-3 py-1 rounded text-sm">${pitch.surface}</span>
              </div>
              
              <div class="amenities mb-6">
                <h3 class="font-semibold mb-2">Amenities</h3>
                <div class="flex flex-wrap gap-2">
                  ${pitch.amenities.map(amenity => 
                    `<span class="amenity-tag">${amenity}</span>`
                  ).join('')}
                </div>
              </div>
            </div>
            
            <div class="pitch-info-card card">
              <div class="card-body">
                <div class="flex justify-between items-center mb-4">
                  <span class="text-2xl font-bold text-green">${formattedPrice}</span>
                  <span class="text-secondary">/hour</span>
                </div>
                <div class="flex items-center gap-2 mb-4">
                  <span class="text-yellow-500">⭐ ${pitch.rating}</span>
                  <span class="text-secondary text-sm">(Based on reviews)</span>
                </div>
                <div class="text-sm text-secondary">
                  <p>✅ Instant confirmation</p>
                  <p>✅ Free cancellation up to 2 hours before</p>
                  <p>✅ 24/7 customer support</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Booking Form -->
          <div class="booking-form-container">
            <h2 class="text-2xl font-bold mb-6">Book This Pitch</h2>
            ${this.bookingForm.render()}
          </div>
        </div>
      </main>
    `;
  }

  mount() {
    this.header.mount();
    this.bookingForm.mount();
  }
}

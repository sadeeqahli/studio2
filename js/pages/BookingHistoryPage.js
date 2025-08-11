import { Header } from '../components/Header.js';

export class BookingHistoryPage {
  constructor(appState, router) {
    this.appState = appState;
    this.header = new Header(appState, router);
  }

  render() {
    const bookings = this.appState.getBookings().sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return `
      ${this.header.render()}
      
      <main class="py-8">
        <div class="container">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-3xl font-bold mb-2">Booking History</h1>
              <p class="text-secondary">View and manage all your bookings</p>
            </div>
            <a href="/dashboard" class="btn btn-primary">Book New Pitch</a>
          </div>

          ${bookings.length === 0 ? this.renderEmptyState() : this.renderBookings(bookings)}
        </div>
      </main>
    `;
  }

  renderEmptyState() {
    return `
      <div class="text-center py-16">
        <div class="text-6xl mb-4">📅</div>
        <h2 class="text-2xl font-bold mb-4">No Bookings Yet</h2>
        <p class="text-secondary mb-8">Start booking your favorite pitches and they'll appear here</p>
        <a href="/dashboard" class="btn btn-primary btn-lg">Browse Pitches</a>
      </div>
    `;
  }

  renderBookings(bookings) {
    const upcomingBookings = bookings.filter(booking => 
      new Date(booking.date + 'T' + booking.time) > new Date()
    );
    const pastBookings = bookings.filter(booking => 
      new Date(booking.date + 'T' + booking.time) <= new Date()
    );

    return `
      ${upcomingBookings.length > 0 ? `
        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-6">Upcoming Bookings (${upcomingBookings.length})</h2>
          <div class="grid gap-4">
            ${upcomingBookings.map(booking => this.renderBookingCard(booking, true)).join('')}
          </div>
        </section>
      ` : ''}

      ${pastBookings.length > 0 ? `
        <section>
          <h2 class="text-2xl font-bold mb-6">Past Bookings (${pastBookings.length})</h2>
          <div class="grid gap-4">
            ${pastBookings.map(booking => this.renderBookingCard(booking, false)).join('')}
          </div>
        </section>
      ` : ''}
    `;
  }

  renderBookingCard(booking, isUpcoming) {
    const bookingDate = new Date(booking.date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const createdDate = new Date(booking.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <div class="card booking-card ${isUpcoming ? 'upcoming' : 'past'}">
        <div class="card-body">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold mb-1">${booking.pitchName}</h3>
              <p class="text-secondary text-sm">Booking ID: ${booking.id}</p>
            </div>
            <div class="text-right">
              <span class="status-badge ${booking.status}">${booking.status}</span>
              <div class="text-sm text-secondary mt-1">Booked: ${createdDate}</div>
            </div>
          </div>
          
          <div class="grid grid-cols-4 gap-4 mb-4">
            <div>
              <div class="text-sm text-secondary">Date</div>
              <div class="font-medium">${bookingDate}</div>
            </div>
            <div>
              <div class="text-sm text-secondary">Time</div>
              <div class="font-medium">${booking.time}</div>
            </div>
            <div>
              <div class="text-sm text-secondary">Players</div>
              <div class="font-medium">${booking.playerCount}</div>
            </div>
            <div>
              <div class="text-sm text-secondary">Total</div>
              <div class="font-medium text-green">₦${booking.total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
            </div>
          </div>
          
          <div class="flex justify-between items-center">
            <div class="text-sm text-secondary">
              Payment: <span class="capitalize">${booking.paymentMethod.replace('-', ' ')}</span>
            </div>
            <div class="flex gap-2">
              <a href="/dashboard/receipt/${booking.id}" class="btn btn-secondary btn-sm">
                View Receipt
              </a>
              ${isUpcoming ? `
                <button class="btn btn-ghost btn-sm" data-cancel-booking="${booking.id}">
                  Cancel
                </button>
              ` : ''}
              ${!isUpcoming ? `
                <button class="btn btn-primary btn-sm" data-rebook="${booking.pitchId}">
                  Book Again
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  mount() {
    this.header.mount();
    // Cancel booking
    document.querySelectorAll('[data-cancel-booking]').forEach(button => {
      button.addEventListener('click', () => {
        const bookingId = button.dataset.cancelBooking;
        this.handleCancelBooking(bookingId);
      });
    });

    // Rebook
    document.querySelectorAll('[data-rebook]').forEach(button => {
      button.addEventListener('click', () => {
        const pitchId = button.dataset.rebook;
        window.location.href = `/dashboard/book/${pitchId}`;
      });
    });
  }

  handleCancelBooking(bookingId) {
    const booking = this.appState.getBookings().find(b => b.id === bookingId);
    if (!booking) return;

    const bookingDateTime = new Date(booking.date + 'T' + booking.time);
    const now = new Date();
    const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);

    if (hoursUntilBooking < 2) {
      this.showToast('Cannot cancel booking less than 2 hours before scheduled time', 'error');
      return;
    }

    if (confirm(`Are you sure you want to cancel your booking for ${booking.pitchName} on ${booking.date} at ${booking.time}?`)) {
      // Remove booking from state
      const bookings = this.appState.getBookings().filter(b => b.id !== bookingId);
      this.appState.setState({ bookings });
      
      this.showToast('Booking cancelled successfully', 'success');
      
      // Refresh the page
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

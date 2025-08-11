import { DataGenerator } from '../data/DataGenerator.js';

export class BookingForm {
  constructor(appState) {
    this.appState = appState;
    this.dataGenerator = new DataGenerator();
  }

  render() {
    const pitch = this.appState.getSelectedPitch();
    const bookingForm = this.appState.getBookingForm();
    const timeSlots = this.dataGenerator.generateTimeSlots();
    
    if (!pitch) return '<div>Pitch not found</div>';

    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    const maxDate = new Date(today.setDate(today.getDate() + 14)).toISOString().split('T')[0];

    return `
      <div class="booking-container">
        <div class="booking-section">
          <h3>Select Date</h3>
          <div class="form-group">
            <input 
              type="date" 
              class="form-input" 
              data-date-picker
              min="${minDate}"
              max="${maxDate}"
              value="${bookingForm.selectedDate || ''}"
            >
          </div>
        </div>

        ${bookingForm.selectedDate ? `
          <div class="booking-section">
            <h3>Select Time</h3>
            <div class="time-grid">
              ${timeSlots.map(time => {
                const isBooked = !this.appState.isTimeSlotAvailable(pitch.id, bookingForm.selectedDate, time);
                const isSelected = bookingForm.selectedTime === time;
                
                return `
                  <div class="time-slot ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}" 
                       data-time="${time}" ${isBooked ? 'data-booked="true"' : ''}>
                    ${time}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        ${bookingForm.selectedDate && bookingForm.selectedTime ? `
          <div class="booking-section">
            <h3>Booking Details</h3>
            <form class="booking-form">
              <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                  <label class="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    class="form-input" 
                    name="name"
                    value="${bookingForm.customerInfo.name}"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label class="form-label">Email *</label>
                  <input 
                    type="email" 
                    class="form-input" 
                    name="email"
                    value="${bookingForm.customerInfo.email}"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label class="form-label">Phone Number *</label>
                  <input 
                    type="tel" 
                    class="form-input" 
                    name="phone"
                    value="${bookingForm.customerInfo.phone}"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label class="form-label">Number of Players</label>
                  <select class="form-select" name="playerCount">
                    ${Array.from({ length: pitch.capacity || 22 }, (_, i) => i + 1).map(num => `
                      <option value="${num}" ${bookingForm.playerCount === num ? 'selected' : ''}>${num}</option>
                    `).join('')}
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Special Requests</label>
                <textarea 
                  class="form-textarea" 
                  name="specialRequests"
                  placeholder="Any special requirements or notes..."
                >${bookingForm.specialRequests}</textarea>
              </div>
              
              <div class="form-group">
                <label class="form-label">Payment Method</label>
                <div class="payment-options">
                  <label class="payment-option">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="bank-transfer"
                      ${bookingForm.paymentMethod === 'bank-transfer' ? 'checked' : ''}
                    >
                    <span>Bank Transfer</span>
                  </label>
                  <label class="payment-option">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="card"
                      ${bookingForm.paymentMethod === 'card' ? 'checked' : ''}
                    >
                    <span>Add to Card (Pay Later)</span>
                  </label>
                </div>
              </div>
            </form>
          </div>
          
          ${this.renderBookingSummary()}
          
          <div class="booking-actions">
            <button class="btn btn-primary btn-lg w-full" data-confirm-booking>
              Confirm Booking
            </button>
          </div>
        ` : ''}
      </div>
      
      <style>
        .payment-options {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        
        .payment-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .payment-option:hover {
          border-color: var(--primary-green);
        }
        
        .payment-option input[type="radio"]:checked + span {
          color: var(--primary-green);
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
          
          .payment-options {
            flex-direction: column;
          }
        }
      </style>
    `;
  }

  renderBookingSummary() {
    const pitch = this.appState.getSelectedPitch();
    const bookingForm = this.appState.getBookingForm();
    
    if (!pitch || !bookingForm.selectedDate || !bookingForm.selectedTime) {
      return '';
    }

    const selectedDateObj = new Date(bookingForm.selectedDate + 'T00:00:00');
    const fullDateString = selectedDateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const subtotal = pitch.price;
    const tax = subtotal * 0.075; // 7.5% VAT
    const total = subtotal + tax;

    return `
      <div class="booking-summary">
        <h4 style="margin-bottom: 1rem;">Booking Summary</h4>
        
        <div class="summary-row">
          <span>Pitch:</span>
          <span>${pitch.name}</span>
        </div>
        
        <div class="summary-row">
          <span>Date:</span>
          <span>${fullDateString}</span>
        </div>
        
        <div class="summary-row">
          <span>Time:</span>
          <span>${bookingForm.selectedTime}</span>
        </div>
        
        <div class="summary-row">
          <span>Duration:</span>
          <span>1 hour</span>
        </div>
        
        <div class="summary-row">
          <span>Players:</span>
          <span>${bookingForm.playerCount}</span>
        </div>
        
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>₦${subtotal.toLocaleString()}</span>
        </div>
        
        <div class="summary-row">
          <span>VAT (7.5%):</span>
          <span>₦${tax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
        </div>
        
        <div class="summary-row summary-total">
          <span>Total:</span>
          <span>₦${total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
        </div>
      </div>
    `;
  }

  mount() {
    // Date selection
    const datePicker = document.querySelector('[data-date-picker]');
    if (datePicker) {
      datePicker.addEventListener('change', (e) => {
        const date = e.target.value;
        this.appState.updateBookingForm({ selectedDate: date, selectedTime: null });
        this.refreshBookingForm();
      });
    }

    // Time selection
    document.querySelectorAll('.time-slot:not([data-booked])').forEach(slot => {
      slot.addEventListener('click', () => {
        const time = slot.dataset.time;
        this.appState.updateBookingForm({ selectedTime: time });
        this.refreshBookingForm();
      });
    });

    // Form inputs
    const form = document.querySelector('.booking-form');
    if (form) {
      form.addEventListener('input', (e) => {
        const { name, value, type } = e.target;
        
        if (name === 'name' || name === 'email' || name === 'phone') {
          this.appState.updateCustomerInfo({ [name]: value });
        } else if (name === 'playerCount') {
          this.appState.updateBookingForm({ playerCount: parseInt(value) });
        } else if (name === 'specialRequests') {
          this.appState.updateBookingForm({ specialRequests: value });
        } else if (name === 'paymentMethod') {
          this.appState.updateBookingForm({ paymentMethod: value });
        }
        
        // Update summary if needed
        if (name === 'playerCount') {
          this.updateBookingSummary();
        }
      });
    }

    // Confirm booking
    const confirmButton = document.querySelector('[data-confirm-booking]');
    if (confirmButton) {
      confirmButton.addEventListener('click', () => {
        this.handleBookingConfirmation();
      });
    }
  }

  handleBookingConfirmation() {
    const pitch = this.appState.getSelectedPitch();
    const bookingForm = this.appState.getBookingForm();
    
    // Validate form
    const requiredFields = ['name', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => 
      !bookingForm.customerInfo[field]?.trim()
    );
    
    if (missingFields.length > 0) {
      this.showToast('Please fill in all required fields', 'error');
      return;
    }
    
    if (!bookingForm.selectedDate || !bookingForm.selectedTime) {
      this.showToast('Please select date and time', 'error');
      return;
    }

    // Check availability one more time
    if (!this.appState.isTimeSlotAvailable(pitch.id, bookingForm.selectedDate, bookingForm.selectedTime)) {
      this.showToast('This time slot is no longer available', 'error');
      this.refreshBookingForm();
      return;
    }

    // Create booking
    const booking = {
      id: `booking-${Date.now()}`,
      pitchId: pitch.id,
      pitchName: pitch.name,
      date: bookingForm.selectedDate,
      time: bookingForm.selectedTime,
      playerCount: bookingForm.playerCount,
      customerInfo: { ...bookingForm.customerInfo },
      specialRequests: bookingForm.specialRequests,
      paymentMethod: bookingForm.paymentMethod,
      total: pitch.price * 1.075, // Including VAT
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    this.appState.addBooking(booking);
    
    // Navigate to confirmation
    window.history.pushState({}, '', `/dashboard/receipt/${booking.id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  refreshBookingForm() {
    const container = document.querySelector('.booking-container');
    if (container) {
      container.innerHTML = this.render().replace('<div class="booking-container">', '').replace('</div>', '');
      this.mount();
    }
  }

  updateBookingSummary() {
    const summaryContainer = document.querySelector('.booking-summary');
    if (summaryContainer) {
      summaryContainer.outerHTML = this.renderBookingSummary();
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

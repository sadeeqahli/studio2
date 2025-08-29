import { DataGenerator } from '../data/DataGenerator.js';

export class BookingForm {
  constructor(appState) {
    this.appState = appState;
    this.dataGenerator = new DataGenerator();
  }

  render() {
    const pitch = this.appState.getSelectedPitch();
    const bookingForm = this.appState.getBookingForm();
    const timeSlots = this.dataGenerator.generateTimeSlots(); // This will be replaced by a more dynamic method

    if (!pitch) return '<div>Pitch not found</div>';

    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    const maxDate = new Date(today.setDate(today.getDate() + 14)).toISOString().split('T')[0];

    const duration = bookingForm.duration || 1; // Default to 1 hour

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
            <h3>Select Duration</h3>
            <div class="form-group">
              <select class="form-select" name="duration" data-duration-picker>
                ${Array.from({ length: 8 }, (_, i) => i + 1).map(h => `
                  <option value="${h}" ${duration === h ? 'selected' : ''}>
                    ${h} hour${h > 1 ? 's' : ''}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
        ` : ''}

        ${bookingForm.selectedDate && bookingForm.selectedTime ? `
          <div class="booking-section">
            <h3>Select Time</h3>
            <div class="time-grid">
              ${this.renderTimeSlots()}
            </div>
          </div>
        ` : ''}

        ${bookingForm.selectedDate && bookingForm.selectedTime && duration > 0 ? `
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
                    value="${bookingForm.customerInfo.name || ''}"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Email *</label>
                  <input 
                    type="email" 
                    class="form-input" 
                    name="email"
                    value="${bookingForm.customerInfo.email || ''}"
                    required
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Phone Number *</label>
                  <input 
                    type="tel" 
                    class="form-input" 
                    name="phone"
                    value="${bookingForm.customerInfo.phone || ''}"
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
                >${bookingForm.specialRequests || ''}</textarea>
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
        .booking-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 1.5rem;
          background-color: var(--background-light);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        .booking-section {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .booking-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background-color: var(--background-input);
          color: var(--text-primary);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--primary-green);
          box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .time-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 0.75rem;
        }

        .time-slot {
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background-color: var(--background-light);
        }

        .time-slot:hover {
          background-color: var(--background-hover);
          border-color: var(--primary-green);
        }

        .time-slot.selected {
          background-color: var(--primary-green);
          color: white;
          border-color: var(--primary-green);
          font-weight: 500;
        }

        .time-slot.booked {
          background-color: var(--background-disabled);
          color: var(--text-disabled);
          cursor: not-allowed;
          border-color: var(--border-color-disabled);
        }

        .time-slot.booked:hover {
          background-color: var(--background-disabled);
          border-color: var(--border-color-disabled);
        }

        .booking-summary {
          margin-top: 1.5rem;
          padding: 1rem;
          background-color: var(--background-input);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          color: var(--text-secondary);
        }

        .summary-row span:first-child {
          font-weight: 500;
          color: var(--text-primary);
        }

        .summary-total {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px dashed var(--border-color);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary-green);
        }

        .summary-total span:first-child {
          color: var(--primary-green);
        }

        .booking-actions {
          margin-top: 2rem;
          text-align: center;
        }

        .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background-color: var(--primary-green);
          color: white;
        }

        .btn-primary:hover {
          background-color: var(--primary-green-dark);
          box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
        }

        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }

        .w-full {
          width: 100%;
        }

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

        /* Toasts */
        .toast {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-md);
          font-weight: 500;
          z-index: 1000;
          box-shadow: var(--shadow-lg);
        }

        .toast.info {
          background-color: var(--primary-green);
          color: white;
        }

        .toast.error {
          background-color: var(--danger-red);
          color: white;
        }

        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }

          .payment-options {
            flex-direction: column;
          }

          .booking-container {
            margin: 1rem auto;
            padding: 1rem;
          }
        }
      </style>
    `;
  }

  renderBookingSummary() {
    const pitch = this.appState.getSelectedPitch();
    const bookingForm = this.appState.getBookingForm();

    if (!pitch || !bookingForm.selectedDate || !bookingForm.selectedTime || !bookingForm.duration) {
      return '';
    }

    const selectedDateObj = new Date(bookingForm.selectedDate + 'T00:00:00');
    const fullDateString = selectedDateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const duration = bookingForm.duration;
    const pricePerHour = pitch.price;
    const calculatedPrice = bookingForm.calculatedPrice || (pricePerHour * duration);

    const subtotal = calculatedPrice;
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
          <span>${duration} hour${duration > 1 ? 's' : ''}</span>
        </div>

        <div class="summary-row">
          <span>Players:</span>
          <span>${bookingForm.playerCount}</span>
        </div>

        <div class="summary-row">
          <span>Subtotal:</span>
          <span>₦${subtotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
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
    // Date picker
    const datePicker = document.querySelector('[data-date-picker]');
    if (datePicker) {
      datePicker.addEventListener('change', (e) => {
        this.appState.updateBookingForm({ selectedDate: e.target.value, selectedTime: null, duration: 1 }); // Reset time and duration on date change
        this.refreshBookingForm();
      });
    }

    // Duration picker
    const durationPicker = document.querySelector('[data-duration-picker]');
    if (durationPicker) {
      durationPicker.addEventListener('change', (e) => {
        const duration = parseInt(e.target.value);
        this.appState.updateBookingForm({ duration: duration, selectedTime: null }); // Reset time on duration change
        this.updatePricing();
        this.updateTimeSlots(); // Refresh to show unavailable slots based on duration
      });
    }

    // Time slot selection
    this.attachTimeSlotListeners();

    // Form inputs
    const form = document.querySelector('.booking-form');
    if (form) {
      form.addEventListener('input', (e) => {
        const { name, value, type } = e.target;

        if (name === 'name' || name === 'email' || name === 'phone') {
          this.appState.updateBookingForm({ customerInfo: { ...this.appState.getBookingForm().customerInfo, [name]: value } });
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

  attachTimeSlotListeners() {
    document.querySelectorAll('.time-slot:not(.booked)').forEach(slot => {
      slot.addEventListener('click', () => {
        const time = slot.dataset.time;
        this.appState.updateBookingForm({ selectedTime: time });
        this.updatePricing(); // Update pricing based on selected time for confirmation
        this.refreshBookingForm();
      });
    });
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
      this.showToast(`Please fill in: ${missingFields.join(', ')}`, 'error');
      return;
    }

    if (!bookingForm.selectedDate || !bookingForm.selectedTime || !bookingForm.duration) {
      this.showToast('Please select date, duration, and time', 'error');
      return;
    }

    // Check availability one more time
    if (!this.isTimeSlotAvailableForDuration(bookingForm.selectedTime, bookingForm.duration)) {
      this.showToast('This time slot or consecutive duration is no longer available', 'error');
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
      duration: bookingForm.duration,
      playerCount: bookingForm.playerCount,
      customerInfo: { ...bookingForm.customerInfo },
      specialRequests: bookingForm.specialRequests,
      paymentMethod: bookingForm.paymentMethod,
      total: bookingForm.calculatedPrice * 1.075, // Including VAT
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
      container.innerHTML = this.render();
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
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.getElementById('toast-container').appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // --- New methods for duration and pricing ---

  updateTimeSlots() {
    const timeSlotsContainer = document.querySelector('.time-grid');
    if (timeSlotsContainer) {
      timeSlotsContainer.innerHTML = this.renderTimeSlots();
      this.attachTimeSlotListeners();
    }
  }

  updatePricing() {
    const pitch = this.appState.getSelectedPitch();
    const bookingForm = this.appState.getBookingForm();
    const duration = bookingForm.duration || 1;

    let price = pitch.price * duration;

    // Apply discounts for longer durations
    if (duration >= 6) {
      price *= 0.9; // 10% discount for 6+ hours
    }
    if (duration >= 8) {
      price *= 0.85; // 15% discount for 8+ hours
    }

    // Update pricing display in summary
    this.appState.updateBookingForm({ calculatedPrice: price });
    this.updateBookingSummary();
  }

  renderTimeSlots() {
    const timeSlots = this.dataGenerator.generateTimeSlots(); // Assume this returns an array of time objects like { time: '9:00 AM', isBooked: false }
    const bookingForm = this.appState.getBookingForm();
    const duration = bookingForm.duration || 1;
    const selectedDate = bookingForm.selectedDate;

    if (!selectedDate) return ''; // Don't render time slots if no date is selected

    return timeSlots.map(slot => {
      // Check if this slot conflicts with duration
      const isAvailable = this.isTimeSlotAvailableForDuration(slot.time, duration);
      const isSelected = slot.time === bookingForm.selectedTime;
      const isBooked = slot.isBooked; // Assuming this comes from DataGenerator or API

      return `
        <div class="time-slot ${isBooked ? 'booked' : ''} ${!isAvailable ? 'booked' : ''} ${isSelected ? 'selected' : ''}" 
             data-time="${slot.time}" 
             ${isBooked ? 'data-booked="true"' : ''}
             ${!isAvailable ? 'title="Not enough consecutive time available"' : ''}>
          ${slot.time}
          ${duration > 1 ? `<br><small>+${duration-1}h</small>` : ''}
        </div>
      `;
    }).join('');
  }

  isTimeSlotAvailableForDuration(startTime, duration) {
    const allTimeSlots = this.dataGenerator.generateTimeSlots(); // Get all possible slots
    const startTimeIndex = allTimeSlots.findIndex(s => s.time === startTime);

    if (startTimeIndex === -1) return false; // Start time not found

    // Check if there are enough consecutive slots
    if (startTimeIndex + duration > allTimeSlots.length) {
      return false; // Not enough slots remaining from the start time
    }

    // Check if any of the required consecutive slots are marked as booked
    for (let i = 0; i < duration; i++) {
      const checkSlot = allTimeSlots[startTimeIndex + i];
      // If a slot is booked, or if it's not available due to other reasons (e.g., maintenance), return false
      if (!checkSlot || checkSlot.isBooked) { 
        return false;
      }
    }

    return true; // All required consecutive slots are available
  }
}
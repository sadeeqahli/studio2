import { Header } from '../components/Header.js';

export class ReceiptPage {
  constructor(appState, router) {
    this.appState = appState;
    this.header = new Header(appState, router);
  }

  render() {
    const booking = this.appState.getSelectedBooking();
    
    if (!booking) {
      return `
        ${this.header.render()}
        <main class="py-8">
          <div class="container text-center">
            <h1 class="text-2xl font-bold mb-4">Booking Not Found</h1>
            <a href="/dashboard/history" class="btn btn-primary">View Booking History</a>
          </div>
        </main>
      `;
    }

    const pitch = this.appState.getPitches().find(p => p.id === booking.pitchId);
    const bookingDate = new Date(booking.date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `
      ${this.header.render()}
      
      <main class="py-8">
        <div class="container">
          <!-- Success Message -->
          <div class="success-message">
            <div class="success-icon">✅</div>
            <h1 class="text-2xl font-bold mb-2">Booking Confirmed!</h1>
            <p class="text-lg">Your booking has been successfully confirmed</p>
            <p class="text-sm mt-2">Booking ID: <strong>${booking.id}</strong></p>
          </div>
          
          <!-- Booking Receipt -->
          <div class="card receipt-card">
            <div class="card-header">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold">Booking Receipt</h2>
                <button class="btn btn-secondary print-btn" onclick="window.print()">
                  🖨️ Print Receipt
                </button>
              </div>
            </div>
            
            <div class="card-body">
              <div class="grid grid-cols-2 gap-8">
                <div>
                  <h3 class="font-semibold mb-4">Booking Details</h3>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-secondary">Booking ID:</span>
                      <span class="font-mono">${booking.id}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-secondary">Pitch:</span>
                      <span>${booking.pitchName}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-secondary">Date:</span>
                      <span>${bookingDate}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-secondary">Time:</span>
                      <span>${booking.time}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-secondary">Duration:</span>
                      <span>1 hour</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-secondary">Players:</span>
                      <span>${booking.playerCount}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-secondary">Status:</span>
                      <span class="text-green font-semibold">Confirmed</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 class="font-semibold mb-4">Customer Information</h3>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-secondary">Name:</span>
                      <span>${booking.customerInfo.name}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-secondary">Email:</span>
                      <span>${booking.customerInfo.email}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-secondary">Phone:</span>
                      <span>${booking.customerInfo.phone}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-secondary">Payment:</span>
                      <span class="capitalize">${booking.paymentMethod.replace('-', ' ')}</span>
                    </div>
                  </div>
                  
                  ${booking.specialRequests ? `
                    <div class="mt-4">
                      <h4 class="font-semibold mb-2">Special Requests</h4>
                      <p class="text-sm text-secondary bg-secondary p-3 rounded">${booking.specialRequests}</p>
                    </div>
                  ` : ''}
                </div>
              </div>
              
              <div class="mt-8 pt-6 border-t border-color">
                <div class="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span class="text-green">₦${booking.total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                </div>
                <p class="text-sm text-secondary mt-1">*Includes 7.5% VAT</p>
              </div>
              
              ${booking.paymentMethod === 'bank-transfer' ? this.renderBankDetails() : ''}
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-4 justify-center mt-8">
            <a href="/dashboard" class="btn btn-primary">Book Another Pitch</a>
            <a href="/dashboard/history" class="btn btn-secondary">View All Bookings</a>
            <a href="/" class="btn btn-ghost">Back to Home</a>
          </div>
          
          <!-- Important Information -->
          <div class="card mt-8">
            <div class="card-body">
              <h3 class="font-semibold mb-4">Important Information</h3>
              <ul class="list-disc list-inside space-y-2 text-sm text-secondary">
                <li>Please arrive 15 minutes before your scheduled time</li>
                <li>Bring valid ID for verification</li>
                <li>Free cancellation up to 2 hours before booking time</li>
                <li>Contact customer support for any changes: +234 800 SPORT HUB</li>
                <li>Follow facility rules and regulations</li>
                <li>Keep this receipt for your records</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <style>
        .space-y-2 > * + * {
          margin-top: 0.5rem;
        }
        
        .receipt-card {
          background: var(--bg-primary);
          border: 2px solid var(--border-color);
        }
        
        @media print {
          .success-message,
          .print-btn {
            display: none !important;
          }
          
          .receipt-card {
            border: 2px solid #000;
            break-inside: avoid;
          }
        }
      </style>
    `;
  }

  renderBankDetails() {
    return `
      <div class="mt-6 pt-6 border-t border-color">
        <h4 class="font-semibold mb-4">💳 Bank Transfer Details</h4>
        <div class="bg-light-blue p-4 rounded-lg">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-secondary">Bank Name:</span>
              <div class="font-semibold">First Bank Nigeria</div>
            </div>
            <div>
              <span class="text-secondary">Account Name:</span>
              <div class="font-semibold">SportHub Limited</div>
            </div>
            <div>
              <span class="text-secondary">Account Number:</span>
              <div class="font-semibold font-mono">2025551234</div>
            </div>
            <div>
              <span class="text-secondary">Reference:</span>
              <div class="font-semibold font-mono">${this.appState.getSelectedBooking().id}</div>
            </div>
          </div>
          <p class="text-xs text-secondary mt-3">
            ⚠️ Please use the booking ID as your transfer reference and send payment confirmation to payments@sporthub.ng
          </p>
        </div>
      </div>
    `;
  }

  mount() {
    this.header.mount();
  }
}

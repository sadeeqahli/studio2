import { Header } from '../components/Header.js';

export class DVABookingPage {
  constructor(appState, router) {
    this.appState = appState;
    this.router = router;
    this.header = new Header(appState, router);
    this.booking = null;
    this.dvaDetails = null;
    
    // Subscribe to state changes
    this.unsubscribe = this.appState.subscribe((event, data, state) => {
      if (event === 'apiBookingCreated') {
        this.booking = data.booking;
        this.dvaDetails = data.dvaDetails;
        this.updateDisplay();
      }
    });
  }

  render() {
    const pitch = this.appState.getSelectedPitch();
    const bookingForm = this.appState.getBookingForm();
    const referralBalance = this.appState.getReferralWalletBalance();
    
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
              <a href="/dashboard/book/${pitch.id}" class="hover:text-primary">${pitch.name}</a>
              <span>›</span>
              <span class="text-primary">DVA Payment</span>
            </div>
          </nav>
          
          <div class="grid grid-cols-3 gap-8">
            <!-- Payment Instructions -->
            <div class="col-span-2 space-y-6">
              ${!this.booking ? `
                <!-- Booking Setup -->
                <div class="card">
                  <div class="card-body">
                    <h1 class="text-2xl font-bold mb-6">Complete Your Booking</h1>
                    
                    <div class="mb-6">
                      <h3 class="font-semibold mb-4">Referral Wallet</h3>
                      <div class="p-4 bg-gray-50 rounded-lg">
                        <div class="flex justify-between items-center mb-2">
                          <span>Available Balance:</span>
                          <span class="font-bold text-green">${new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                            minimumFractionDigits: 0
                          }).format(referralBalance)}</span>
                        </div>
                        ${referralBalance >= 100 ? `
                          <div class="flex items-center gap-2 mt-3">
                            <input type="checkbox" id="apply-discount" class="rounded">
                            <label for="apply-discount" class="text-sm">
                              Apply ₦100 referral discount
                            </label>
                          </div>
                        ` : `
                          <p class="text-sm text-secondary">You need ₦100 minimum to apply a discount</p>
                        `}
                      </div>
                    </div>
                    
                    <div class="mb-6">
                      <label for="referral-code" class="block text-sm font-medium mb-2">
                        Referral Code (Optional)
                      </label>
                      <input 
                        type="text" 
                        id="referral-code" 
                        class="w-full p-3 border rounded-lg" 
                        placeholder="Enter referral code to earn ₦100 for the referrer"
                      >
                    </div>
                    
                    <button 
                      onclick="createDVABooking()" 
                      class="btn btn-primary btn-lg w-full"
                    >
                      Create Booking & Get Payment Details
                    </button>
                  </div>
                </div>
              ` : `
                <!-- DVA Payment Details -->
                <div class="card">
                  <div class="card-body">
                    <h1 class="text-2xl font-bold mb-6">Complete Your Payment</h1>
                    
                    <div class="alert-info mb-6">
                      <h3 class="font-semibold mb-2">Payment Instructions:</h3>
                      <ol class="text-sm space-y-1">
                        <li>1. Use your banking app or visit any bank</li>
                        <li>2. Transfer the exact amount to the account below</li>
                        <li>3. Your booking will be confirmed automatically</li>
                        <li>4. Keep your receipt for reference</li>
                      </ol>
                    </div>
                    
                    ${this.dvaDetails ? `
                      <div class="payment-details-card mb-6">
                        <h3 class="font-semibold mb-4 text-center">Transfer To:</h3>
                        
                        <div class="space-y-4">
                          <div class="text-center">
                            <label class="block text-sm font-medium mb-1">Account Number</label>
                            <div class="flex items-center justify-center gap-2">
                              <span class="text-2xl font-bold font-mono">${this.dvaDetails.accountNumber}</span>
                              <button onclick="copyToClipboard('${this.dvaDetails.accountNumber}')" class="btn btn-sm btn-secondary">
                                Copy
                              </button>
                            </div>
                          </div>
                          
                          <div class="text-center">
                            <label class="block text-sm font-medium mb-1">Bank Name</label>
                            <span class="text-lg font-semibold">${this.dvaDetails.bankName}</span>
                          </div>
                          
                          <div class="text-center">
                            <label class="block text-sm font-medium mb-1">Account Name</label>
                            <span class="text-lg">${this.dvaDetails.accountName}</span>
                          </div>
                          
                          <div class="text-center bg-green-50 p-4 rounded-lg">
                            <label class="block text-sm font-medium mb-1">Amount to Transfer</label>
                            <span class="text-3xl font-bold text-green">${new Intl.NumberFormat('en-NG', {
                              style: 'currency',
                              currency: 'NGN',
                              minimumFractionDigits: 0
                            }).format(this.booking.paymentAmount)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="alert-warning">
                        <p class="text-sm">
                          <strong>Important:</strong> Transfer the exact amount shown above. 
                          Any difference may delay your booking confirmation.
                        </p>
                      </div>
                    ` : `
                      <div class="text-center">
                        <div class="loading-spinner mb-4"></div>
                        <p>Loading payment details...</p>
                      </div>
                    `}
                  </div>
                </div>
                
                <!-- Booking Status -->
                <div class="card">
                  <div class="card-body">
                    <h3 class="font-semibold mb-4">Booking Status</h3>
                    <div class="flex items-center gap-3">
                      <div class="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span>Waiting for payment confirmation...</span>
                    </div>
                    <p class="text-sm text-secondary mt-2">
                      Your booking will be automatically confirmed once payment is received.
                    </p>
                  </div>
                </div>
              `}
            </div>
            
            <!-- Booking Summary -->
            <div class="booking-summary-card card">
              <div class="card-body">
                <h3 class="font-semibold mb-4">Booking Summary</h3>
                
                <div class="mb-4">
                  <img src="${pitch.image}" alt="${pitch.name}" class="w-full h-32 object-cover rounded-lg mb-2">
                  <h4 class="font-semibold">${pitch.name}</h4>
                  <p class="text-sm text-secondary">📍 ${pitch.location}</p>
                </div>
                
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>Date:</span>
                    <span class="font-semibold">${this.formatDate(bookingForm.selectedDate)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Time:</span>
                    <span class="font-semibold">${bookingForm.selectedTime}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Duration:</span>
                    <span class="font-semibold">1 hour</span>
                  </div>
                  <hr class="my-2">
                  <div class="flex justify-between">
                    <span>Base Cost:</span>
                    <span>${formattedPrice}</span>
                  </div>
                  ${this.booking && this.booking.discountApplied ? `
                    <div class="flex justify-between text-green">
                      <span>Referral Discount:</span>
                      <span>-₦100</span>
                    </div>
                  ` : ''}
                  <div class="flex justify-between">
                    <span>Platform Fee:</span>
                    <span>₦${Math.ceil(pitch.price * 0.1)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Payment Processing:</span>
                    <span>₦${this.booking ? Math.ceil(this.booking.split?.paystackFee || 0) : '~50'}</span>
                  </div>
                  <hr class="my-2">
                  <div class="flex justify-between text-lg font-semibold">
                    <span>Total Payment:</span>
                    <span class="text-green">
                      ${this.booking ? 
                        new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                          minimumFractionDigits: 0
                        }).format(this.booking.paymentAmount) : 
                        formattedPrice
                      }
                    </span>
                  </div>
                </div>
                
                <div class="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                  <p class="font-semibold text-blue-800 mb-1">How DVA Payment Works:</p>
                  <ul class="text-blue-700 space-y-1">
                    <li>• Virtual account created instantly</li>
                    <li>• Transfer from any bank or app</li>
                    <li>• Automatic booking confirmation</li>
                    <li>• Secure and trackable payments</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    `;
  }

  formatDate(dateString) {
    if (!dateString) return 'Not selected';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  mount() {
    this.header.mount();
    this.setupGlobalFunctions();
  }

  setupGlobalFunctions() {
    window.createDVABooking = async () => {
      try {
        const pitch = this.appState.getSelectedPitch();
        const referralCode = document.getElementById('referral-code')?.value || null;
        const applyDiscount = document.getElementById('apply-discount')?.checked || false;
        
        // Create API booking
        const response = await this.appState.createApiBooking({
          ownerId: 'owner_pitch_' + pitch.id, // Map pitch to owner
          amount: pitch.price,
          referralCode
        });
        
        this.booking = response.booking;
        this.dvaDetails = response.dvaDetails;
        
        // Apply discount if requested
        if (applyDiscount && this.appState.getReferralWalletBalance() >= 100) {
          try {
            await this.appState.applyReferralDiscount(response.bookingId);
            this.booking.discountApplied = true;
            this.booking.paymentAmount -= 100;
          } catch (error) {
            console.error('Failed to apply discount:', error);
          }
        }
        
        this.updateDisplay();
      } catch (error) {
        console.error('Failed to create DVA booking:', error);
        alert('Failed to create booking. Please try again.');
      }
    };
    
    window.copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Copied to clipboard!');
      });
    };
  }

  updateDisplay() {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = this.render();
      this.setupGlobalFunctions();
    }
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    delete window.createDVABooking;
    delete window.copyToClipboard;
  }
}
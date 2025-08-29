import { Header } from '../components/Header.js';

export class TeamCreationPage {
  constructor(appState, router) {
    this.appState = appState;
    this.router = router;
    this.header = new Header(appState, router);
    
    // Get pitch and booking details from query params or state
    const urlParams = new URLSearchParams(window.location.search);
    this.pitchId = urlParams.get('pitchId');
    this.bookingDate = urlParams.get('date');
    this.bookingTime = urlParams.get('time');
    
    this.pitch = this.pitchId ? this.appState.getPitches().find(p => p.id === this.pitchId) : null;
  }

  render() {
    if (!this.pitch) {
      return `
        ${this.header.render()}
        <main class="py-8">
          <div class="container text-center">
            <h1 class="text-2xl font-bold mb-4">Pitch Not Found</h1>
            <p class="mb-4">Please select a pitch first before creating a team.</p>
            <a href="/dashboard" class="btn btn-primary">Browse Pitches</a>
          </div>
        </main>
      `;
    }

    const formattedPrice = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(this.pitch.price);

    return `
      ${this.header.render()}
      
      <main class="py-8">
        <div class="container">
          <!-- Breadcrumb -->
          <nav class="mb-6">
            <div class="flex items-center gap-2 text-sm text-secondary">
              <a href="/dashboard" class="hover:text-primary">Pitches</a>
              <span>›</span>
              <a href="/dashboard/book/${this.pitch.id}" class="hover:text-primary">${this.pitch.name}</a>
              <span>›</span>
              <span class="text-primary">Create Team</span>
            </div>
          </nav>
          
          <div class="grid grid-cols-3 gap-8">
            <!-- Team Creation Form -->
            <div class="col-span-2">
              <div class="card">
                <div class="card-body">
                  <h1 class="text-2xl font-bold mb-6">Create a Team</h1>
                  <p class="text-secondary mb-6">Split the cost with your teammates and book together!</p>
                  
                  <form id="team-creation-form">
                    <div class="mb-4">
                      <label for="team-name" class="block text-sm font-medium mb-2">Team Name *</label>
                      <input type="text" id="team-name" name="teamName" required 
                             class="w-full p-3 border rounded-lg" 
                             placeholder="e.g., Weekend Warriors, The Legends">
                    </div>
                    
                    <div class="mb-4">
                      <label for="max-players" class="block text-sm font-medium mb-2">Number of Players *</label>
                      <select id="max-players" name="maxPlayers" required class="w-full p-3 border rounded-lg">
                        <option value="">Select number of players</option>
                        <option value="2">2 players</option>
                        <option value="4">4 players</option>
                        <option value="6">6 players</option>
                        <option value="8">8 players</option>
                        <option value="10">10 players</option>
                        <option value="12">12 players</option>
                        <option value="14">14 players</option>
                        <option value="16">16 players</option>
                        <option value="18">18 players</option>
                        <option value="20">20 players</option>
                        <option value="22">22 players</option>
                      </select>
                    </div>
                    
                    <div id="split-calculation" class="mb-4 p-4 bg-gray-50 rounded-lg" style="display: none;">
                      <h3 class="font-semibold mb-2">Split Calculation</h3>
                      <div class="text-sm text-secondary">
                        <p>Total cost: <span class="font-semibold text-primary">${formattedPrice}</span></p>
                        <p>Per player: <span id="per-player-amount" class="font-semibold text-green"></span></p>
                      </div>
                    </div>
                    
                    <div class="mb-4">
                      <label for="deadline" class="block text-sm font-medium mb-2">Payment Deadline *</label>
                      <input type="datetime-local" id="deadline" name="deadline" required 
                             class="w-full p-3 border rounded-lg">
                    </div>
                    
                    <div class="mb-6">
                      <label for="payment-details" class="block text-sm font-medium mb-2">Your Payment Details (for receiving contributions)</label>
                      <textarea id="payment-details" name="paymentDetails" rows="3" 
                                class="w-full p-3 border rounded-lg" 
                                placeholder="e.g., Account: John Doe, Zenith Bank, 1234567890 or Mobile Money: 08012345678"></textarea>
                      <p class="text-xs text-secondary mt-1">Teammates will send their contributions to these details</p>
                    </div>
                    
                    <div class="flex gap-4">
                      <button type="button" onclick="history.back()" class="btn btn-secondary flex-1">
                        Cancel
                      </button>
                      <button type="submit" class="btn btn-primary flex-1">
                        Create Team & Generate Link
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            <!-- Booking Summary -->
            <div class="booking-summary-card card">
              <div class="card-body">
                <h3 class="font-semibold mb-4">Booking Summary</h3>
                
                <div class="mb-4">
                  <img src="${this.pitch.image}" alt="${this.pitch.name}" class="w-full h-32 object-cover rounded-lg mb-2">
                  <h4 class="font-semibold">${this.pitch.name}</h4>
                  <p class="text-sm text-secondary">📍 ${this.pitch.location}</p>
                </div>
                
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>Date:</span>
                    <span class="font-semibold">${this.formatDate(this.bookingDate)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Time:</span>
                    <span class="font-semibold">${this.bookingTime}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Duration:</span>
                    <span class="font-semibold">1 hour</span>
                  </div>
                  <hr class="my-2">
                  <div class="flex justify-between text-lg font-semibold">
                    <span>Total Cost:</span>
                    <span class="text-green">${formattedPrice}</span>
                  </div>
                </div>
                
                <div class="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                  <p class="font-semibold text-blue-800 mb-1">How Split Payment Works:</p>
                  <ul class="text-blue-700 space-y-1">
                    <li>• Create team with player count</li>
                    <li>• Share link with teammates</li>
                    <li>• Collect contributions externally</li>
                    <li>• Confirm payments in the app</li>
                    <li>• Complete booking via Paystack</li>
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
    this.setupEventListeners();
    this.setMinDeadline();
  }

  setMinDeadline() {
    const deadlineInput = document.getElementById('deadline');
    if (deadlineInput) {
      // Set minimum deadline to 1 hour from now
      const now = new Date();
      now.setHours(now.getHours() + 1);
      deadlineInput.min = now.toISOString().slice(0, 16);
      
      // Set default deadline to 24 hours before booking
      if (this.bookingDate && this.bookingTime) {
        const bookingDateTime = new Date(`${this.bookingDate}T${this.bookingTime}`);
        bookingDateTime.setHours(bookingDateTime.getHours() - 24);
        if (bookingDateTime > now) {
          deadlineInput.value = bookingDateTime.toISOString().slice(0, 16);
        }
      }
    }
  }

  setupEventListeners() {
    const form = document.getElementById('team-creation-form');
    const maxPlayersSelect = document.getElementById('max-players');
    const splitCalculation = document.getElementById('split-calculation');
    const perPlayerAmount = document.getElementById('per-player-amount');

    // Update split calculation when player count changes
    maxPlayersSelect?.addEventListener('change', (e) => {
      const playerCount = parseInt(e.target.value);
      if (playerCount && this.pitch) {
        const splitAmount = Math.ceil(this.pitch.price / playerCount);
        const formattedSplit = new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0
        }).format(splitAmount);
        
        perPlayerAmount.textContent = formattedSplit;
        splitCalculation.style.display = 'block';
      } else {
        splitCalculation.style.display = 'none';
      }
    });

    // Handle form submission
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleCreateTeam(e);
    });
  }

  handleCreateTeam(e) {
    const formData = new FormData(e.target);
    const teamData = {
      name: formData.get('teamName'),
      pitchId: this.pitch.id,
      pitchName: this.pitch.name,
      bookingDate: this.bookingDate,
      bookingTime: this.bookingTime,
      totalCost: this.pitch.price,
      maxPlayers: parseInt(formData.get('maxPlayers')),
      deadline: formData.get('deadline'),
      collectorPaymentDetails: formData.get('paymentDetails')
    };

    // Validate required fields
    if (!teamData.name || !teamData.maxPlayers || !teamData.deadline) {
      alert('Please fill in all required fields.');
      return;
    }

    // Validate deadline is in the future
    const deadlineDate = new Date(teamData.deadline);
    const now = new Date();
    if (deadlineDate <= now) {
      alert('Deadline must be in the future.');
      return;
    }

    try {
      // Create team in app state
      const team = this.appState.createTeam(teamData);
      
      // Create split payment
      const splitPayment = this.appState.createSplitPayment(team.id);
      
      // Navigate to team management page
      this.router.navigate(`/team/${team.id}`);
      
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team. Please try again.');
    }
  }
}
import { Header } from '../components/Header.js';

export class TeamJoinPage {
  constructor(appState, router, teamId) {
    this.appState = appState;
    this.router = router;
    this.header = new Header(appState, router);
    this.teamId = teamId;
  }

  render() {
    const team = this.appState.getTeam(this.teamId);
    const currentUser = this.appState.state.user;
    
    if (!team) {
      return `
        ${this.header.render()}
        <main class="py-8">
          <div class="container text-center">
            <h1 class="text-2xl font-bold mb-4">Team Not Found</h1>
            <p class="mb-4">This team invitation may be invalid or expired.</p>
            <a href="/dashboard" class="btn btn-primary">Browse Pitches</a>
          </div>
        </main>
      `;
    }

    // Check if user is already a member
    const isAlreadyMember = team.members.some(member => member.email === currentUser.email);
    if (isAlreadyMember) {
      return `
        ${this.header.render()}
        <main class="py-8">
          <div class="container text-center">
            <h1 class="text-2xl font-bold mb-4">Already a Team Member</h1>
            <p class="mb-4">You're already part of this team!</p>
            <a href="/team/${team.id}" class="btn btn-primary">View Team</a>
          </div>
        </main>
      `;
    }

    // Check if team is full
    const isFull = team.members.length >= team.maxPlayers;
    if (isFull) {
      return `
        ${this.header.render()}
        <main class="py-8">
          <div class="container text-center">
            <h1 class="text-2xl font-bold mb-4">Team is Full</h1>
            <p class="mb-4">This team already has the maximum number of players.</p>
            <a href="/dashboard" class="btn btn-primary">Browse Other Pitches</a>
          </div>
        </main>
      `;
    }

    const formattedTotalCost = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(team.totalCost);

    const splitAmount = Math.ceil(team.totalCost / team.maxPlayers);
    const formattedSplitAmount = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(splitAmount);

    return `
      ${this.header.render()}
      
      <main class="py-8">
        <div class="container max-w-2xl mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold mb-2">Join Team</h1>
            <p class="text-secondary">You've been invited to join a football team!</p>
          </div>
          
          <div class="card">
            <div class="card-body">
              <div class="text-center mb-6">
                <h2 class="text-2xl font-bold text-primary mb-2">${team.name}</h2>
                <p class="text-secondary">Created by ${team.creatorName}</p>
              </div>
              
              <div class="grid grid-cols-2 gap-6 mb-6">
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 class="font-semibold mb-2">Booking Details</h3>
                  <p class="text-sm"><strong>Pitch:</strong> ${team.pitchName}</p>
                  <p class="text-sm"><strong>Date:</strong> ${this.formatDate(team.bookingDate)}</p>
                  <p class="text-sm"><strong>Time:</strong> ${team.bookingTime}</p>
                </div>
                
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 class="font-semibold mb-2">Payment Info</h3>
                  <p class="text-sm"><strong>Total Cost:</strong> ${formattedTotalCost}</p>
                  <p class="text-sm"><strong>Your Share:</strong> ${formattedSplitAmount}</p>
                  <p class="text-sm"><strong>Players:</strong> ${team.members.length + 1}/${team.maxPlayers}</p>
                </div>
              </div>
              
              <div class="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 class="font-semibold text-blue-800 mb-2">How it works:</h3>
                <ul class="text-sm text-blue-700 space-y-1">
                  <li>• Join the team by providing your details</li>
                  <li>• Send your share (${formattedSplitAmount}) to the team creator</li>
                  <li>• Team creator confirms your payment</li>
                  <li>• Once everyone pays, the pitch gets booked!</li>
                </ul>
              </div>
              
              ${team.collectorPaymentDetails ? `
                <div class="mb-6 p-4 bg-yellow-50 rounded-lg">
                  <h3 class="font-semibold text-yellow-800 mb-2">Payment Details:</h3>
                  <p class="text-sm text-yellow-700 whitespace-pre-wrap">${team.collectorPaymentDetails}</p>
                </div>
              ` : ''}
              
              <form id="join-team-form" class="space-y-4">
                <div>
                  <label for="player-name" class="block text-sm font-medium mb-2">Your Name *</label>
                  <input type="text" id="player-name" name="playerName" required 
                         value="${currentUser.name}" 
                         class="w-full p-3 border rounded-lg">
                </div>
                
                <div>
                  <label for="player-email" class="block text-sm font-medium mb-2">Email Address *</label>
                  <input type="email" id="player-email" name="playerEmail" required 
                         value="${currentUser.email}" readonly
                         class="w-full p-3 border rounded-lg bg-gray-50">
                  <p class="text-xs text-secondary mt-1">This is your registered email address</p>
                </div>
                
                <div class="flex items-center gap-2">
                  <input type="checkbox" id="payment-agreement" name="paymentAgreement" required class="rounded">
                  <label for="payment-agreement" class="text-sm">
                    I agree to send ${formattedSplitAmount} to the team creator for this booking
                  </label>
                </div>
                
                <div class="flex gap-4 pt-4">
                  <button type="button" onclick="history.back()" class="btn btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary flex-1">
                    Join Team
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div class="text-center mt-6">
            <p class="text-xs text-secondary">
              Payment deadline: ${this.formatDeadline(team.deadline)}
            </p>
          </div>
        </div>
      </main>
    `;
  }

  formatDate(dateString) {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDeadline(dateString) {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  mount() {
    this.header.mount();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = document.getElementById('join-team-form');
    
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleJoinTeam(e);
    });
  }

  handleJoinTeam(e) {
    const formData = new FormData(e.target);
    const memberData = {
      name: formData.get('playerName'),
      email: formData.get('playerEmail')
    };

    // Validate required fields
    if (!memberData.name || !memberData.email) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      // Join team in app state
      const updatedTeam = this.appState.joinTeam(this.teamId, memberData);
      
      if (updatedTeam) {
        // Navigate to team management page
        this.router.navigate(`/team/${this.teamId}`);
        alert('Welcome to the team! Please send your contribution as shown in the payment details.');
      } else {
        alert('Failed to join team. The team might be full.');
      }
      
    } catch (error) {
      console.error('Error joining team:', error);
      alert('Failed to join team. Please try again.');
    }
  }
}
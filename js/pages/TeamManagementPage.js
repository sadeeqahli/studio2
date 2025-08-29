import { Header } from '../components/Header.js';
import { PaystackPayment } from '../components/PaystackPayment.js';

export class TeamManagementPage {
  constructor(appState, router, teamId) {
    this.appState = appState;
    this.router = router;
    this.header = new Header(appState, router);
    this.teamId = teamId;
    this.paystackPayment = new PaystackPayment(appState);
    
    // Subscribe to state changes
    this.unsubscribe = this.appState.subscribe((event, data, state) => {
      if (event === 'contributionConfirmed' || event === 'teamJoined' || event === 'teamStatusUpdated') {
        this.updateDisplay();
      }
    });
  }

  render() {
    const team = this.appState.getTeam(this.teamId);
    const splitPayment = this.appState.getSplitPaymentByTeam(this.teamId);
    
    if (!team) {
      return `
        ${this.header.render()}
        <main class="py-8">
          <div class="container text-center">
            <h1 class="text-2xl font-bold mb-4">Team Not Found</h1>
            <a href="/dashboard" class="btn btn-primary">Browse Pitches</a>
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

    const isCreator = team.creatorId === this.appState.state.user.email;
    const confirmedCount = splitPayment ? splitPayment.contributions.filter(c => c.status === 'confirmed').length : 0;
    const progressPercentage = Math.round((confirmedCount / team.maxPlayers) * 100);
    const canCompletePayment = splitPayment && splitPayment.status === 'ready_for_payment' && isCreator;

    return `
      ${this.header.render()}
      
      <main class="py-8">
        <div class="container">
          <!-- Breadcrumb -->
          <nav class="mb-6">
            <div class="flex items-center gap-2 text-sm text-secondary">
              <a href="/dashboard" class="hover:text-primary">Dashboard</a>
              <span>›</span>
              <span class="text-primary">Team: ${team.name}</span>
            </div>
          </nav>
          
          <div class="grid grid-cols-3 gap-8">
            <!-- Team Details -->
            <div class="col-span-2 space-y-6">
              <!-- Team Info Card -->
              <div class="card">
                <div class="card-body">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <h1 class="text-2xl font-bold mb-2">${team.name}</h1>
                      <p class="text-secondary">Created by ${team.creatorName}</p>
                    </div>
                    <span class="status-badge status-${team.status}">${this.getStatusLabel(team.status)}</span>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 class="font-semibold mb-2">Booking Details</h3>
                      <p class="text-sm"><strong>Pitch:</strong> ${team.pitchName}</p>
                      <p class="text-sm"><strong>Date:</strong> ${this.formatDate(team.bookingDate)}</p>
                      <p class="text-sm"><strong>Time:</strong> ${team.bookingTime}</p>
                    </div>
                    <div>
                      <h3 class="font-semibold mb-2">Payment Info</h3>
                      <p class="text-sm"><strong>Total Cost:</strong> ${formattedTotalCost}</p>
                      <p class="text-sm"><strong>Per Player:</strong> ${formattedSplitAmount}</p>
                      <p class="text-sm"><strong>Players:</strong> ${team.members.length}/${team.maxPlayers}</p>
                    </div>
                  </div>
                  
                  ${team.members.length < team.maxPlayers ? `
                    <div class="mb-4 p-3 bg-blue-50 rounded-lg">
                      <h3 class="font-semibold text-blue-800 mb-2">Invite More Players</h3>
                      <p class="text-sm text-blue-700 mb-2">Share this link with your teammates:</p>
                      <div class="flex gap-2">
                        <input type="text" id="invite-link" readonly 
                               value="${window.location.origin}/team/${team.id}/join" 
                               class="flex-1 p-2 border rounded text-sm">
                        <button onclick="copyInviteLink()" class="btn btn-sm btn-primary">Copy</button>
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>
              
              <!-- Team Members -->
              <div class="card">
                <div class="card-body">
                  <h2 class="text-xl font-bold mb-4">Team Members (${team.members.length}/${team.maxPlayers})</h2>
                  
                  <div class="space-y-3">
                    ${team.members.map(member => {
                      const contribution = splitPayment ? splitPayment.contributions.find(c => c.memberId === member.id) : null;
                      const contributionStatus = contribution ? contribution.status : 'pending';
                      
                      return `
                        <div class="flex items-center justify-between p-3 border rounded-lg">
                          <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                              ${member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p class="font-semibold">${member.name} ${member.isCreator ? '(Creator)' : ''}</p>
                              <p class="text-sm text-secondary">${member.email}</p>
                            </div>
                          </div>
                          
                          <div class="flex items-center gap-3">
                            <span class="text-sm font-semibold">${formattedSplitAmount}</span>
                            ${contributionStatus === 'confirmed' ? 
                              `<span class="status-badge status-confirmed">✓ Paid</span>` :
                              isCreator && contributionStatus === 'pending' ? 
                                `<button onclick="confirmContribution('${member.id}')" class="btn btn-sm btn-primary">Mark as Paid</button>` :
                                `<span class="status-badge status-pending">Pending</span>`
                            }
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>
              
              ${team.collectorPaymentDetails ? `
                <!-- Payment Details -->
                <div class="card">
                  <div class="card-body">
                    <h2 class="text-xl font-bold mb-4">Payment Details</h2>
                    <div class="p-3 bg-gray-50 rounded-lg">
                      <p class="text-sm font-semibold mb-1">Send your contribution to:</p>
                      <p class="text-sm whitespace-pre-wrap">${team.collectorPaymentDetails}</p>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>
            
            <!-- Payment Progress -->
            <div class="space-y-6">
              <!-- Progress Card -->
              <div class="card">
                <div class="card-body">
                  <h3 class="font-semibold mb-4">Payment Progress</h3>
                  
                  <div class="mb-4">
                    <div class="flex justify-between text-sm mb-2">
                      <span>Contributions</span>
                      <span>${confirmedCount}/${team.maxPlayers}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-green-500 h-2 rounded-full transition-all duration-300" 
                           style="width: ${progressPercentage}%"></div>
                    </div>
                    <p class="text-xs text-secondary mt-1">${progressPercentage}% complete</p>
                  </div>
                  
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span>Total Cost:</span>
                      <span class="font-semibold">${formattedTotalCost}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>Per Player:</span>
                      <span class="font-semibold">${formattedSplitAmount}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>Deadline:</span>
                      <span class="font-semibold">${this.formatDeadline(team.deadline)}</span>
                    </div>
                  </div>
                  
                  ${canCompletePayment ? `
                    <div class="mt-4 pt-4 border-t">
                      <button onclick="completePayment()" class="btn btn-primary w-full">
                        Complete Payment via Paystack
                      </button>
                    </div>
                  ` : progressPercentage === 100 && !isCreator ? `
                    <div class="mt-4 p-3 bg-green-50 rounded-lg">
                      <p class="text-sm text-green-800">✓ All contributions received! Waiting for ${team.creatorName} to complete the booking.</p>
                    </div>
                  ` : `
                    <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p class="text-sm text-gray-700">Waiting for all contributions to be confirmed before payment can be completed.</p>
                    </div>
                  `}
                </div>
              </div>
              
              <!-- Instructions -->
              <div class="card">
                <div class="card-body">
                  <h3 class="font-semibold mb-3">Next Steps</h3>
                  <div class="space-y-2 text-sm">
                    ${team.members.length < team.maxPlayers ? `
                      <div class="flex items-start gap-2">
                        <span class="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">1</span>
                        <p>Invite ${team.maxPlayers - team.members.length} more player${team.maxPlayers - team.members.length > 1 ? 's' : ''} to join the team</p>
                      </div>
                    ` : ''}
                    <div class="flex items-start gap-2">
                      <span class="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">${team.members.length < team.maxPlayers ? '2' : '1'}</span>
                      <p>Players send ${formattedSplitAmount} to the payment details</p>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">${team.members.length < team.maxPlayers ? '3' : '2'}</span>
                      <p>${isCreator ? 'You confirm' : 'Team creator confirms'} each payment received</p>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">${team.members.length < team.maxPlayers ? '4' : '3'}</span>
                      <p>${isCreator ? 'You complete' : 'Team creator completes'} the booking via Paystack</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
    return date.toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusLabel(status) {
    const labels = {
      'recruiting': 'Recruiting',
      'ready_to_pay': 'Ready to Pay',
      'paid': 'Paid',
      'completed': 'Completed'
    };
    return labels[status] || status;
  }

  mount() {
    this.header.mount();
    this.setupGlobalFunctions();
    this.updateDisplay();
  }

  setupGlobalFunctions() {
    // Make functions available globally for onclick handlers
    window.copyInviteLink = () => {
      const input = document.getElementById('invite-link');
      if (input) {
        input.select();
        document.execCommand('copy');
        alert('Invite link copied to clipboard!');
      }
    };

    window.confirmContribution = (memberId) => {
      const splitPayment = this.appState.getSplitPaymentByTeam(this.teamId);
      if (splitPayment && confirm('Confirm that this player has sent their contribution?')) {
        this.appState.confirmContribution(splitPayment.id, memberId, this.appState.state.user.email);
      }
    };

    window.completePayment = () => {
      const splitPayment = this.appState.getSplitPaymentByTeam(this.teamId);
      if (splitPayment && splitPayment.status === 'ready_for_payment') {
        this.initiatePaystackPayment(splitPayment);
      }
    };
  }

  initiatePaystackPayment(splitPayment) {
    this.paystackPayment.initializePayment(
      splitPayment,
      (transactionData) => {
        // Payment successful
        this.appState.processPaystackPayment(splitPayment.id, transactionData);
        
        // Navigate to receipt page
        setTimeout(() => {
          const team = this.appState.getTeam(this.teamId);
          const booking = this.appState.getBookings().find(b => b.teamId === team.id);
          if (booking) {
            this.router.navigate(`/dashboard/receipt/${booking.id}`);
          }
        }, 1000);
        
        alert('Payment completed successfully! Your pitch is booked.');
      },
      (error) => {
        // Payment failed or cancelled
        console.error('Payment failed:', error);
        alert('Payment failed or was cancelled. Please try again.');
      }
    );
  }

  updateDisplay() {
    // Re-render the page content
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
    // Clean up global functions
    delete window.copyInviteLink;
    delete window.confirmContribution;
    delete window.completePayment;
  }
}
import { ApiService } from '../services/ApiService.js';
import { initializeClerk } from '../config/clerk.js';

export class AppState {
  constructor() {
    this.apiService = new ApiService();
    this.clerk = null;
    this.isClerkInitialized = false;
    this.state = {
      currentRoute: '/',
      pitches: [],
      products: [],
      playerListings: [],
      bookings: [],
      user: {
        isAuthenticated: false,
        name: '',
        email: '',
        userType: null,
        businessName: '',
        ownerName: '',
        phone: '',
        address: ''
      },
      filters: {
        search: '',
        pitchSize: '',
        sort: '',
        amenities: []
      },
      selectedPitch: null,
      selectedBooking: null,
      bookingForm: {
        selectedDate: null,
        selectedTime: null,
        playerCount: 1,
        customerInfo: {
          name: '',
          email: '',
          phone: ''
        },
        specialRequests: '',
        paymentMethod: 'bank-transfer'
      },
      cart: [],
      analytics: null,
      theme: 'light',
      teams: [],
      splitPayments: [],
      currentTeam: null,
      apiUserId: null,
      apiOwnerId: null,
      referralWalletBalance: 0,
      dvaDetails: null
    };
    
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data, this.state);
      } catch (error) {
        console.error('State listener error:', error);
      }
    });
  }

  setState(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };
    this.emit('stateChange', { prevState, newState: this.state });
  }

  // Initialize Clerk
  async initializeAuth() {
    try {
      this.clerk = await initializeClerk();
      this.isClerkInitialized = true;
      
      // Check if user is already signed in
      if (this.clerk.user) {
        this.updateUserFromClerk();
      }
      
      // Listen for auth changes
      this.clerk.addListener(({ user }) => {
        if (user) {
          this.updateUserFromClerk();
        } else {
          this.logout();
        }
      });
      
      return this.clerk;
    } catch (error) {
      console.error('Failed to initialize authentication:', error);
      throw error;
    }
  }

  // Update user state from Clerk user object
  updateUserFromClerk() {
    if (!this.clerk?.user) return;
    
    const clerkUser = this.clerk.user;
    const userType = clerkUser.publicMetadata?.userType || 'player';
    
    this.setState({
      user: {
        isAuthenticated: true,
        name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        userType: userType,
        businessName: clerkUser.publicMetadata?.businessName || '',
        ownerName: clerkUser.publicMetadata?.ownerName || '',
        phone: clerkUser.phoneNumbers[0]?.phoneNumber || '',
        address: clerkUser.publicMetadata?.address || ''
      }
    });
    this.emit('authChange', this.state.user);
  }

  // Auth Methods
  async login(email, password) {
    try {
      if (!this.isClerkInitialized) {
        await this.initializeAuth();
      }
      
      const signInAttempt = await this.clerk.signIn.create({
        identifier: email,
        password: password,
      });

      if (signInAttempt.status === 'complete') {
        await this.clerk.setActive({ session: signInAttempt.createdSessionId });
        this.updateUserFromClerk();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async signup(userData) {
    try {
      if (!this.isClerkInitialized) {
        await this.initializeAuth();
      }
      
      const signUpAttempt = await this.clerk.signUp.create({
        emailAddress: userData.email,
        password: userData.password,
        firstName: userData.name.split(' ')[0] || userData.name,
        lastName: userData.name.split(' ').slice(1).join(' ') || '',
      });

      // If email verification is required
      if (signUpAttempt.status === 'missing_requirements') {
        // Send verification email
        await signUpAttempt.prepareEmailAddressVerification({ strategy: 'email_code' });
        return { requiresVerification: true, signUpAttempt };
      }

      if (signUpAttempt.status === 'complete') {
        // Set user metadata
        await this.clerk.user.update({
          publicMetadata: {
            userType: 'player'
          }
        });
        
        // Create user in backend
        const response = await this.apiService.createUser({
          email: userData.email,
          firstName: userData.name.split(' ')[0] || userData.name,
          lastName: userData.name.split(' ').slice(1).join(' ') || '',
          phone: userData.phone || '',
          referredBy: userData.referralCode || null
        });
        
        this.setState({
          apiUserId: response.userId,
          referralWalletBalance: response.user.referralWalletBalance || 0
        });
        
        await this.clerk.setActive({ session: signUpAttempt.createdSessionId });
        this.updateUserFromClerk();
        return { success: true };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  }

  async verifyEmail(code, signUpAttempt) {
    try {
      const completeSignUp = await signUpAttempt.attemptEmailAddressVerification({
        code: code,
      });

      if (completeSignUp.status === 'complete') {
        await this.clerk.setActive({ session: completeSignUp.createdSessionId });
        this.updateUserFromClerk();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Email verification error:', error);
      return false;
    }
  }

  async ownerLogin(email, password) {
    try {
      if (!this.isClerkInitialized) {
        await this.initializeAuth();
      }
      
      const signInAttempt = await this.clerk.signIn.create({
        identifier: email,
        password: password,
      });

      if (signInAttempt.status === 'complete') {
        await this.clerk.setActive({ session: signInAttempt.createdSessionId });
        
        // Verify this is an owner account
        if (this.clerk.user.publicMetadata?.userType === 'owner') {
          this.updateUserFromClerk();
          return true;
        } else {
          // This is not an owner account
          await this.clerk.signOut();
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Owner login error:', error);
      return false;
    }
  }

  async ownerSignup(userData) {
    try {
      if (!this.isClerkInitialized) {
        await this.initializeAuth();
      }
      
      const signUpAttempt = await this.clerk.signUp.create({
        emailAddress: userData.email,
        password: userData.password,
        firstName: userData.ownerName.split(' ')[0] || userData.ownerName,
        lastName: userData.ownerName.split(' ').slice(1).join(' ') || '',
      });

      // If email verification is required
      if (signUpAttempt.status === 'missing_requirements') {
        await signUpAttempt.prepareEmailAddressVerification({ strategy: 'email_code' });
        return { requiresVerification: true, signUpAttempt };
      }

      if (signUpAttempt.status === 'complete') {
        // Set owner metadata
        await this.clerk.user.update({
          publicMetadata: {
            userType: 'owner',
            businessName: userData.businessName,
            ownerName: userData.ownerName,
            address: userData.address
          }
        });
        
        // Create owner in backend
        const response = await this.apiService.createOwner({
          email: userData.email,
          firstName: userData.ownerName.split(' ')[0] || userData.ownerName,
          lastName: userData.ownerName.split(' ').slice(1).join(' ') || '',
          phone: userData.phone || ''
        });
        
        this.setState({
          apiOwnerId: response.ownerId
        });
        
        await this.clerk.setActive({ session: signUpAttempt.createdSessionId });
        this.updateUserFromClerk();
        return { success: true };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Owner signup error:', error);
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      if (this.clerk) {
        await this.clerk.signOut();
      }
      
      this.setState({
        user: {
          isAuthenticated: false,
          name: '',
          email: '',
          userType: null,
          businessName: '',
          ownerName: '',
          phone: '',
          address: ''
        },
        apiUserId: null,
        apiOwnerId: null,
        referralWalletBalance: 0
      });
      this.emit('authChange', this.state.user);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }


  // Getters
  getCurrentRoute() {
    return this.state.currentRoute;
  }

  getPitches() {
    return this.state.pitches;
  }

  getFilteredPitches() {
    let pitches = [...this.state.pitches];
    const { search, pitchSize, sort, amenities } = this.state.filters;

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      pitches = pitches.filter(pitch => 
        pitch.name.toLowerCase().includes(searchLower) ||
        pitch.location.toLowerCase().includes(searchLower)
      );
    }

    // Filter by pitch size
    if (pitchSize) {
      pitches = pitches.filter(pitch => pitch.pitchSize === pitchSize);
    }

    // Filter by amenities
    if (amenities.length > 0) {
      pitches = pitches.filter(pitch => 
        amenities.every(amenity => pitch.amenities.includes(amenity))
      );
    }

    // Sort
    switch (sort) {
      case 'price-low':
        pitches.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        pitches.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        pitches.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return pitches;
  }

  getProducts() {
    return this.state.products;
  }
  
  getPlayerListings() {
    return this.state.playerListings;
  }

  getBookings() {
    return this.state.bookings;
  }

  getSelectedPitch() {
    return this.state.selectedPitch;
  }

  getSelectedBooking() {
    return this.state.selectedBooking;
  }

  getBookingForm() {
    return this.state.bookingForm;
  }

  getCart() {
    return this.state.cart;
  }

  getAnalyticsData() {
    return this.state.analytics;
  }

  getFilters() {
    return this.state.filters;
  }

  // Setters
  setCurrentRoute(route) {
    this.setState({ currentRoute: route });
  }

  setPitches(pitches) {
    this.setState({ pitches });
  }

  setProducts(products) {
    this.setState({ products });
  }
  
  setPlayerListings(listings) {
    this.setState({ playerListings: listings });
  }

  setSelectedPitch(pitch) {
    this.setState({ selectedPitch: pitch });
  }

  setSelectedBooking(booking) {
    this.setState({ selectedBooking: booking });
  }

  setAnalyticsData(analytics) {
    this.setState({ analytics });
  }

  updateFilters(filters) {
    this.setState({ 
      filters: { ...this.state.filters, ...filters }
    });
  }

  clearFilters() {
    this.setState({
      filters: {
        search: '',
        pitchSize: '',
        sort: '',
        amenities: []
      }
    });
  }

  updateBookingForm(updates) {
    this.setState({
      bookingForm: { ...this.state.bookingForm, ...updates }
    });
  }

  updateCustomerInfo(customerInfo) {
    this.setState({
      bookingForm: {
        ...this.state.bookingForm,
        customerInfo: { ...this.state.bookingForm.customerInfo, ...customerInfo }
      }
    });
  }

  addBooking(booking) {
    const bookings = [...this.state.bookings, booking];
    this.setState({ bookings });
    
    // Reset booking form
    this.setState({
      bookingForm: {
        selectedDate: null,
        selectedTime: null,
        playerCount: 1,
        customerInfo: {
          name: '',
          email: '',
          phone: ''
        },
        specialRequests: '',
        paymentMethod: 'bank-transfer'
      }
    });
  }

  addToCart(product) {
    const cart = [...this.state.cart];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    this.setState({ cart });
  }

  removeFromCart(productId) {
    const cart = this.state.cart.filter(item => item.id !== productId);
    this.setState({ cart });
  }

  updateCartItemQuantity(productId, quantity) {
    const cart = this.state.cart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    );
    this.setState({ cart });
  }

  getCartTotal() {
    return this.state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItemCount() {
    return this.state.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Check if a time slot is available for a specific pitch and date
  isTimeSlotAvailable(pitchId, date, time) {
    return !this.state.bookings.some(booking => 
      booking.pitchId === pitchId &&
      booking.date === date &&
      booking.time === time
    );
  }

  // Get booked time slots for a specific pitch and date
  getBookedTimeSlots(pitchId, date) {
    return this.state.bookings
      .filter(booking => booking.pitchId === pitchId && booking.date === date)
      .map(booking => booking.time);
  }

  // Team Management Methods
  createTeam(teamData) {
    const team = {
      id: 'team_' + Date.now() + Math.random().toString(36).substr(2, 9),
      name: teamData.name,
      creatorId: this.state.user.email,
      creatorName: this.state.user.name,
      pitchId: teamData.pitchId,
      pitchName: teamData.pitchName,
      bookingDate: teamData.bookingDate,
      bookingTime: teamData.bookingTime,
      totalCost: teamData.totalCost,
      maxPlayers: teamData.maxPlayers,
      members: [{
        id: this.state.user.email,
        name: this.state.user.name,
        email: this.state.user.email,
        isCreator: true,
        hasPaid: false,
        joinedAt: new Date().toISOString()
      }],
      status: 'recruiting', // recruiting, ready_to_pay, paid, completed
      createdAt: new Date().toISOString(),
      deadline: teamData.deadline,
      shareableLink: null,
      collectorPaymentDetails: teamData.collectorPaymentDetails || null
    };
    
    const teams = [...this.state.teams, team];
    this.setState({ teams, currentTeam: team });
    this.emit('teamCreated', team);
    return team;
  }

  joinTeam(teamId, memberData) {
    const teams = this.state.teams.map(team => {
      if (team.id === teamId && team.members.length < team.maxPlayers) {
        const newMember = {
          id: memberData.email,
          name: memberData.name,
          email: memberData.email,
          isCreator: false,
          hasPaid: false,
          joinedAt: new Date().toISOString()
        };
        return {
          ...team,
          members: [...team.members, newMember]
        };
      }
      return team;
    });
    
    this.setState({ teams });
    const updatedTeam = teams.find(t => t.id === teamId);
    this.emit('teamJoined', { teamId, member: memberData, team: updatedTeam });
    return updatedTeam;
  }

  getTeam(teamId) {
    return this.state.teams.find(team => team.id === teamId);
  }

  getTeams() {
    return this.state.teams;
  }

  getCurrentTeam() {
    return this.state.currentTeam;
  }

  setCurrentTeam(team) {
    this.setState({ currentTeam: team });
  }

  // Split Payment Methods
  createSplitPayment(teamId) {
    const team = this.getTeam(teamId);
    if (!team) return null;

    const splitAmount = Math.ceil(team.totalCost / team.members.length);
    const splitPayment = {
      id: 'split_' + Date.now() + Math.random().toString(36).substr(2, 9),
      teamId: teamId,
      totalAmount: team.totalCost,
      splitAmount: splitAmount,
      contributions: team.members.map(member => ({
        memberId: member.id,
        memberName: member.name,
        memberEmail: member.email,
        amount: splitAmount,
        status: 'pending', // pending, confirmed, overdue
        confirmedAt: null,
        confirmedBy: null
      })),
      collectorId: team.creatorId,
      collectorName: team.creatorName,
      status: 'collecting', // collecting, ready_for_payment, completed
      createdAt: new Date().toISOString(),
      deadline: team.deadline,
      paystackTransactionId: null,
      shareableLink: this.generateSplitPaymentLink(teamId)
    };

    const splitPayments = [...this.state.splitPayments, splitPayment];
    this.setState({ splitPayments });
    this.emit('splitPaymentCreated', splitPayment);
    return splitPayment;
  }

  confirmContribution(splitPaymentId, memberId, confirmerId) {
    const splitPayments = this.state.splitPayments.map(split => {
      if (split.id === splitPaymentId) {
        const updatedContributions = split.contributions.map(contribution => {
          if (contribution.memberId === memberId) {
            return {
              ...contribution,
              status: 'confirmed',
              confirmedAt: new Date().toISOString(),
              confirmedBy: confirmerId
            };
          }
          return contribution;
        });

        const allConfirmed = updatedContributions.every(c => c.status === 'confirmed');
        
        return {
          ...split,
          contributions: updatedContributions,
          status: allConfirmed ? 'ready_for_payment' : 'collecting'
        };
      }
      return split;
    });

    this.setState({ splitPayments });
    const updatedSplit = splitPayments.find(s => s.id === splitPaymentId);
    this.emit('contributionConfirmed', { splitPaymentId, memberId, split: updatedSplit });
    return updatedSplit;
  }

  getSplitPayment(splitPaymentId) {
    return this.state.splitPayments.find(split => split.id === splitPaymentId);
  }

  getSplitPayments() {
    return this.state.splitPayments;
  }

  getSplitPaymentByTeam(teamId) {
    return this.state.splitPayments.find(split => split.teamId === teamId);
  }

  generateSplitPaymentLink(teamId) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/team/${teamId}/split`;
  }

  updateTeamStatus(teamId, status) {
    const teams = this.state.teams.map(team => 
      team.id === teamId ? { ...team, status } : team
    );
    this.setState({ teams });
    this.emit('teamStatusUpdated', { teamId, status });
  }

  processPaystackPayment(splitPaymentId, transactionData) {
    const splitPayments = this.state.splitPayments.map(split => {
      if (split.id === splitPaymentId) {
        return {
          ...split,
          status: 'completed',
          paystackTransactionId: transactionData.reference,
          completedAt: new Date().toISOString()
        };
      }
      return split;
    });

    this.setState({ splitPayments });
    
    // Update team status and create booking
    const split = splitPayments.find(s => s.id === splitPaymentId);
    const team = this.getTeam(split.teamId);
    
    if (team) {
      this.updateTeamStatus(team.id, 'completed');
      
      // Create booking for the team
      const booking = {
        id: 'booking_' + Date.now() + Math.random().toString(36).substr(2, 9),
        pitchId: team.pitchId,
        pitchName: team.pitchName,
        date: team.bookingDate,
        time: team.bookingTime,
        price: team.totalCost,
        customerInfo: {
          name: team.name,
          email: team.creatorId,
          phone: ''
        },
        specialRequests: `Team booking for ${team.members.length} players`,
        paymentMethod: 'paystack',
        teamId: team.id,
        splitPaymentId: splitPaymentId,
        paystackTransactionId: transactionData.reference,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      this.addBooking(booking);
    }

    this.emit('paystackPaymentCompleted', { splitPaymentId, transactionData, team });
    return split;
  }

  // API Integration Methods
  async createApiBooking(bookingData) {
    try {
      const response = await this.apiService.createBooking({
        userId: this.state.apiUserId,
        ownerId: bookingData.ownerId,
        amount: bookingData.amount,
        referralCode: bookingData.referralCode
      });
      
      this.emit('apiBookingCreated', response);
      return response;
    } catch (error) {
      console.error('API booking creation error:', error);
      throw error;
    }
  }

  async loadOwnerDVA(ownerId) {
    try {
      const response = await this.apiService.getOwnerDVA(ownerId);
      this.setState({ dvaDetails: response.dvaDetails });
      return response.dvaDetails;
    } catch (error) {
      if (error.message.includes('DVA not found')) {
        // Try to create DVA
        try {
          const createResponse = await this.apiService.createOwnerDVA(ownerId);
          this.setState({ dvaDetails: createResponse.dvaDetails });
          return createResponse.dvaDetails;
        } catch (createError) {
          console.error('DVA creation error:', createError);
          throw createError;
        }
      }
      throw error;
    }
  }

  async applyReferralDiscount(bookingId) {
    try {
      const response = await this.apiService.applyReferralDiscount(this.state.apiUserId, bookingId);
      this.setState({ referralWalletBalance: response.user.referralWalletBalance });
      this.emit('referralDiscountApplied', response);
      return response;
    } catch (error) {
      console.error('Apply referral discount error:', error);
      throw error;
    }
  }

  async loadUserData() {
    try {
      if (this.state.apiUserId) {
        const response = await this.apiService.getUser(this.state.apiUserId);
        this.setState({ referralWalletBalance: response.user.referralWalletBalance });
      }
    } catch (error) {
      console.error('Load user data error:', error);
    }
  }

  // Getters for API data
  getDVADetails() {
    return this.state.dvaDetails;
  }

  getReferralWalletBalance() {
    return this.state.referralWalletBalance;
  }

  getApiUserId() {
    return this.state.apiUserId;
  }

  getApiOwnerId() {
    return this.state.apiOwnerId;
  }
}

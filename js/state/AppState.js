export class AppState {
  constructor() {
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
      theme: 'light'
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

  // Auth Methods
  login(email, password) {
    // Mock login logic
    if (email === 'player@sporthub.ng' && password === 'password123') {
      this.setState({
        user: {
          isAuthenticated: true,
          name: 'Alex Iwobi',
          email: email,
          userType: 'player'
        }
      });
      this.emit('authChange', this.state.user);
      return true;
    }
    return false;
  }

  signup(userData) {
    this.setState({
      user: {
        isAuthenticated: true,
        name: userData.name,
        email: userData.email,
        userType: 'player'
      }
    });
    this.emit('authChange', this.state.user);
  }

  ownerLogin(email, password) {
    // Mock owner login logic
    if (email === 'owner@sporthub.ng' && password === 'owner123') {
      this.setState({
        user: {
          isAuthenticated: true,
          name: 'SportHub Complex',
          email: email,
          userType: 'owner',
          businessName: 'SportHub Complex',
          ownerName: 'John Smith',
          phone: '+234 803 123 4567',
          address: '123 Sports Avenue, Lagos, Nigeria'
        }
      });
      this.emit('authChange', this.state.user);
      return true;
    }
    return false;
  }

  ownerSignup(userData) {
    this.setState({
      user: {
        isAuthenticated: true,
        name: userData.businessName,
        email: userData.email,
        userType: 'owner',
        businessName: userData.businessName,
        ownerName: userData.ownerName,
        phone: userData.phone,
        address: userData.address
      }
    });
    this.emit('authChange', this.state.user);
  }

  logout() {
    this.setState({
      user: {
        isAuthenticated: false,
        name: '',
        email: '',
        userType: null
      }
    });
    this.emit('authChange', this.state.user);
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
}

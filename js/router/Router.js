import { WelcomePage } from '../pages/WelcomePage.js';
import { SignUpPage } from '../pages/SignUpPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { AboutPage } from '../pages/AboutPage.js';
import { CarePage } from '../pages/CarePage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { BookingPage } from '../pages/BookingPage.js';
import { BookingHistoryPage } from '../pages/BookingHistoryPage.js';
import { ReceiptPage } from '../pages/ReceiptPage.js';
import { ProfilePage } from '../pages/ProfilePage.js';
import { ShopPage } from '../pages/ShopPage.js';
import { CommunityPage } from '../pages/CommunityPage.js';
import { AnalyticsPage } from '../pages/AnalyticsPage.js';
import { OwnerDashboardPage } from '../pages/OwnerDashboardPage.js';
import { OwnerLoginPage } from '../pages/OwnerLoginPage.js';
import { OwnerSignUpPage } from '../pages/OwnerSignUpPage.js';
import { TeamCreationPage } from '../pages/TeamCreationPage.js';
import { TeamManagementPage } from '../pages/TeamManagementPage.js';
import { TeamJoinPage } from '../pages/TeamJoinPage.js';
import { DVABookingPage } from '../pages/DVABookingPage.js';

export class Router {
  constructor(appState) {
    this.appState = appState;
    this.routes = new Map();
    this.currentPage = null;
    
    this.setupRoutes();
  }

  setupRoutes() {
    this.routes.set('/', () => new WelcomePage());
    this.routes.set('/signup', () => new SignUpPage(this.appState, this));
    this.routes.set('/login', () => new LoginPage(this.appState, this));
    this.routes.set('/about', () => new AboutPage(this.appState, this));
    this.routes.set('/care', () => new CarePage(this.appState, this));
    this.routes.set('/dashboard', () => new DashboardPage(this.appState, this));
    this.routes.set(/^\/dashboard\/book\/(.+)$/, (matches) => {
      const pitchId = matches[1];
      const pitch = this.appState.getPitches().find(p => p.id === pitchId);
      if (!pitch) {
        this.navigate('/dashboard');
        return null;
      }
      this.appState.setSelectedPitch(pitch);
      return new BookingPage(this.appState, this);
    });
    this.routes.set(/^\/dashboard\/dva-book\/(.+)$/, (matches) => {
      const pitchId = matches[1];
      const pitch = this.appState.getPitches().find(p => p.id === pitchId);
      if (!pitch) {
        this.navigate('/dashboard');
        return null;
      }
      this.appState.setSelectedPitch(pitch);
      return new DVABookingPage(this.appState, this);
    });
    this.routes.set('/dashboard/history', () => new BookingHistoryPage(this.appState, this));
    this.routes.set(/^\/dashboard\/receipt\/(.+)$/, (matches) => {
      const bookingId = matches[1];
      const booking = this.appState.getBookings().find(b => b.id === bookingId);
      if (!booking) {
        this.navigate('/dashboard/history');
        return null;
      }
      this.appState.setSelectedBooking(booking);
      return new ReceiptPage(this.appState, this);
    });
    this.routes.set('/dashboard/profile', () => new ProfilePage(this.appState, this));
    this.routes.set('/shop', () => new ShopPage(this.appState, this));
    this.routes.set('/community', () => new CommunityPage(this.appState, this));
    this.routes.set('/dashboard/analytics', () => new AnalyticsPage(this.appState, this));
    this.routes.set('/owner/dashboard', () => new OwnerDashboardPage(this.appState, this));
    this.routes.set('/owner/login', () => new OwnerLoginPage(this.appState, this));
    this.routes.set('/owner/signup', () => new OwnerSignUpPage(this.appState, this));
    
    // Team and Split Payment Routes
    this.routes.set('/team/create', () => new TeamCreationPage(this.appState, this));
    this.routes.set(/^\/team\/(.+)\/join$/, (matches) => {
      const teamId = matches[1];
      return new TeamJoinPage(this.appState, this, teamId);
    });
    this.routes.set(/^\/team\/(.+)$/, (matches) => {
      const teamId = matches[1];
      const team = this.appState.getTeam(teamId);
      if (!team) {
        this.navigate('/dashboard');
        return null;
      }
      return new TeamManagementPage(this.appState, this, teamId);
    });
  }

  init() {
    // Handle browser navigation
    window.addEventListener('popstate', () => this.handleRoute());
    
    // Handle link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.getAttribute('href')?.startsWith('/')) {
        e.preventDefault();
        this.navigate(link.getAttribute('href'));
      }
    });

    // Initial route
    this.handleRoute();
  }

  navigate(path) {
    if (path !== window.location.pathname) {
      window.history.pushState({}, '', path);
    }
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
    const isAuthenticated = this.appState.state.user.isAuthenticated;
    const userType = this.appState.state.user.userType;

    const playerRoutes = [
      '/dashboard', 
      '/dashboard/history', 
      '/dashboard/profile', 
      '/dashboard/analytics',
      '/shop',
      '/community',
      '/team'
    ];
    const ownerRoutes = ['/owner/dashboard'];
    const playerAuthRoutes = ['/login', '/signup'];
    const ownerAuthRoutes = ['/owner/login', '/owner/signup'];
    const publicRoutes = ['/', '/about', '/care'];

    // Block any cross-access attempts first (highest priority)
    if (isAuthenticated) {
      // Block owners from accessing ANY player routes
      if (userType === 'owner' && (playerRoutes.some(p => path.startsWith(p)) || playerAuthRoutes.includes(path))) {
        this.navigate('/owner/dashboard');
        return;
      }
      
      // Block players from accessing ANY owner routes
      if (userType === 'player' && (ownerRoutes.some(p => path.startsWith(p)) || ownerAuthRoutes.includes(path))) {
        this.navigate('/dashboard');
        return;
      }
    }

    // Redirect unauthenticated users from protected routes
    if (playerRoutes.some(p => path.startsWith(p)) && !isAuthenticated) {
      this.navigate('/login');
      return;
    }

    if (ownerRoutes.some(p => path.startsWith(p)) && !isAuthenticated) {
      this.navigate('/owner/login');
      return;
    }

    // Redirect authenticated users from auth routes to their respective dashboards
    if (playerAuthRoutes.includes(path) && isAuthenticated && userType === 'player') {
      this.navigate('/dashboard');
      return;
    }

    if (ownerAuthRoutes.includes(path) && isAuthenticated && userType === 'owner') {
      this.navigate('/owner/dashboard');
      return;
    }
    
    this.appState.setCurrentRoute(path);
    
    let page = null;
    
    // Check exact matches first
    if (this.routes.has(path)) {
      page = this.routes.get(path)();
    } else {
      // Check regex matches
      for (const [route, handler] of this.routes.entries()) {
        if (route instanceof RegExp) {
          const matches = path.match(route);
          if (matches) {
            page = handler(matches);
            break;
          }
        }
      }
    }
    
    // Default to welcome page if no route matches
    if (!page) {
      page = this.routes.get('/')();
    }
    
    if (page) {
      this.renderPage(page);
    }
  }

  renderPage(page) {
    if (this.currentPage && this.currentPage.destroy) {
      this.currentPage.destroy();
    }
    
    this.currentPage = page;
    const app = document.getElementById('app');
    app.innerHTML = page.render();
    
    // Call mount after render
    if (page.mount) {
      page.mount();
    }
  }
}


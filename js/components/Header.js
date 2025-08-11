export class Header {
  constructor(appState, router) {
    this.appState = appState;
    this.router = router;
  }

  render() {
    const { isAuthenticated, name } = this.appState.state.user;
    const currentRoute = this.appState.getCurrentRoute();
    const cartItemCount = this.appState.getCartItemCount();

    const navLinks = isAuthenticated ? this.renderAuthenticatedNav(currentRoute, name) : this.renderGuestNav(currentRoute);
    const mobileNavLinks = isAuthenticated ? this.renderAuthenticatedMobileNav(name) : this.renderGuestMobileNav();
    
    return `
      <header class="header">
        <div class="header-content">
          <a href="${isAuthenticated ? '/dashboard' : '/'}" class="logo">SportHub</a>
          
          <nav class="nav-menu">
            ${navLinks}
          </nav>
          
          <button class="mobile-menu-btn" data-mobile-menu-btn aria-label="Open menu">
            ☰
          </button>
        </div>
        
        <div class="mobile-menu" data-mobile-menu>
          <div class="mobile-menu-header">
            <span class="logo">SportHub</span>
            <button class="mobile-menu-close" data-mobile-menu-close aria-label="Close menu">
              ✕
            </button>
          </div>
          <nav class="mobile-nav-menu">
            ${mobileNavLinks}
          </nav>
        </div>
      </header>
      
      <style>
        .cart-badge {
          background-color: var(--primary-green);
          color: white;
          border-radius: 50%;
          padding: 0.125rem 0.375rem;
          font-size: 0.75rem;
          margin-left: 0.25rem;
        }
        .profile-dropdown {
          position: relative;
        }
        .profile-dropdown-content {
          display: none;
          position: absolute;
          right: 0;
          top: 100%;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          min-width: 160px;
          z-index: 10;
        }
        .profile-dropdown:hover .profile-dropdown-content {
          display: block;
        }
        .dropdown-link {
          display: block;
          padding: 0.75rem 1rem;
          color: var(--text-secondary);
          text-decoration: none;
        }
        .dropdown-link:hover {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }
      </style>
    `;
  }

  renderGuestNav(currentRoute) {
    return `
      <a href="/about" class="nav-link ${currentRoute === '/about' ? 'active' : ''}">About</a>
      <a href="/care" class="nav-link ${currentRoute === '/care' ? 'active' : ''}">Support</a>
      <div class="flex items-center gap-2 ml-4">
        <a href="/login" class="btn btn-secondary btn-sm">Log In</a>
        <a href="/signup" class="btn btn-primary btn-sm">Sign Up</a>
      </div>
    `;
  }

  renderAuthenticatedNav(currentRoute, name) {
    return `
      <a href="/dashboard" class="nav-link ${currentRoute.startsWith('/dashboard') ? 'active' : ''}">Dashboard</a>
      <a href="/shop" class="nav-link ${currentRoute === '/shop' ? 'active' : ''}">Shop</a>
      <a href="/community" class="nav-link ${currentRoute === '/community' ? 'active' : ''}">Community</a>
      
      <div class="profile-dropdown ml-4">
        <button class="btn btn-ghost">
          ${name} ⌄
        </button>
        <div class="profile-dropdown-content">
          <a href="/dashboard/profile" class="dropdown-link">Profile</a>
          <a href="/dashboard/history" class="dropdown-link">Booking History</a>
          <a href="/dashboard/analytics" class="dropdown-link">Analytics</a>
          <hr class="border-t border-color my-1">
          <a href="#" class="dropdown-link" data-logout>Logout</a>
        </div>
      </div>
      <button class="theme-toggle" data-theme-toggle aria-label="Toggle theme">
        🌙
      </button>
    `;
  }

  renderGuestMobileNav() {
    return `
      <a href="/about" class="mobile-nav-link">About</a>
      <a href="/care" class="mobile-nav-link">Support</a>
      <div class="flex gap-2 mt-4">
        <a href="/login" class="btn btn-secondary w-full">Log In</a>
        <a href="/signup" class="btn btn-primary w-full">Sign Up</a>
      </div>
    `;
  }

  renderAuthenticatedMobileNav(name) {
    return `
      <a href="/dashboard" class="mobile-nav-link">Dashboard</a>
      <a href="/dashboard/profile" class="mobile-nav-link">Profile</a>
      <a href="/dashboard/history" class="mobile-nav-link">Booking History</a>
      <a href="/shop" class="mobile-nav-link">Shop</a>
      <a href="/community" class="mobile-nav-link">Community</a>
      <a href="#" class="mobile-nav-link" data-logout>Logout</a>
      <div style="padding: 1rem 0;">
        <button class="btn btn-ghost w-full" data-theme-toggle>
          🌙 Toggle Theme
        </button>
      </div>
    `;
  }

  mount() {
    const logoutButton = document.querySelector('[data-logout]');
    if (logoutButton) {
      logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.appState.logout();
        this.router.navigate('/login');
      });
    }
  }
}

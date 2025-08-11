import { Header } from '../components/Header.js';

export class ProfilePage {
  constructor(appState, router) {
    this.appState = appState;
    this.header = new Header(appState, router);
  }

  render() {
    const { name, email } = this.appState.state.user;
    const bookings = this.appState.getBookings();
    const totalSpent = bookings.reduce((sum, booking) => sum + booking.total, 0);
    const upcomingBookings = bookings.filter(booking => 
      new Date(booking.date + 'T' + booking.time) > new Date()
    ).length;

    return `
      ${this.header.render()}
      
      <main class="py-8">
        <div class="container">
          <div class="grid grid-cols-3 gap-8">
            <!-- Sidebar -->
            <div class="profile-sidebar">
              <div class="card">
                <div class="card-body text-center">
                  <div class="profile-avatar">
                    <div class="w-24 h-24 bg-green rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                      ${name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <h3 class="text-lg font-semibold mb-1">${name}</h3>
                  <p class="text-secondary text-sm">${email}</p>
                </div>
              </div>
              
              <nav class="profile-nav mt-6">
                <div class="card">
                  <div class="card-body p-0">
                    <a href="#profile" class="nav-item active" data-tab="profile">
                      👤 Profile Settings
                    </a>
                    <a href="#preferences" class="nav-item" data-tab="preferences">
                      ⚙️ Preferences
                    </a>
                    <a href="#notifications" class="nav-item" data-tab="notifications">
                      🔔 Notifications
                    </a>
                    <a href="#security" class="nav-item" data-tab="security">
                      🔒 Security
                    </a>
                  </div>
                </div>
              </nav>
            </div>
            
            <!-- Main Content -->
            <div class="profile-content col-span-2">
              <!-- Profile Stats -->
              <div class="grid grid-cols-3 gap-4 mb-8">
                <div class="stat-card text-center p-4 bg-secondary rounded-lg">
                  <div class="text-2xl font-bold text-green">${bookings.length}</div>
                  <div class="text-sm text-secondary">Total Bookings</div>
                </div>
                <div class="stat-card text-center p-4 bg-secondary rounded-lg">
                  <div class="text-2xl font-bold text-green">${upcomingBookings}</div>
                  <div class="text-sm text-secondary">Upcoming</div>
                </div>
                <div class="stat-card text-center p-4 bg-secondary rounded-lg">
                  <div class="text-2xl font-bold text-green">₦${totalSpent.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                  <div class="text-sm text-secondary">Total Spent</div>
                </div>
              </div>
              
              <!-- Tab Content -->
              <div class="tab-content">
                <div class="tab-pane active" data-tab-content="profile">
                  ${this.renderProfileTab()}
                </div>
                <div class="tab-pane" data-tab-content="preferences">
                  ${this.renderPreferencesTab()}
                </div>
                <div class="tab-pane" data-tab-content="notifications">
                  ${this.renderNotificationsTab()}
                </div>
                <div class="tab-pane" data-tab-content="security">
                  ${this.renderSecurityTab()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <style>
        .profile-nav .nav-item {
          display: block;
          padding: 1rem 1.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          border-bottom: 1px solid var(--border-color);
          transition: all 0.2s ease;
        }
        
        .profile-nav .nav-item:hover,
        .profile-nav .nav-item.active {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        
        .profile-nav .nav-item:first-child {
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        }
        
        .profile-nav .nav-item:last-child {
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
          border-bottom: none;
        }
        
        .tab-pane {
          display: none;
        }
        
        .tab-pane.active {
          display: block;
        }
        
        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-color);
        }
        
        .setting-item:last-child {
          border-bottom: none;
        }
        
        .toggle-switch {
          position: relative;
          width: 48px;
          height: 24px;
          background: var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .toggle-switch.active {
          background: var(--primary-green);
        }
        
        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: transform 0.3s ease;
        }
        
        .toggle-switch.active::after {
          transform: translateX(24px);
        }
      </style>
    `;
  }

  renderProfileTab() {
    const { name, email } = this.appState.state.user;
    const firstName = name.split(' ')[0] || '';
    const lastName = name.split(' ').slice(1).join(' ') || '';

    return `
      <div class="card">
        <div class="card-header">
          <h2 class="text-xl font-bold">Profile Information</h2>
        </div>
        <div class="card-body">
          <form class="profile-form">
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">First Name</label>
                <input type="text" class="form-input" name="firstName" value="${firstName}">
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <input type="text" class="form-input" name="lastName" value="${lastName}">
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" name="email" value="${email}" readonly>
            </div>
            
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input type="tel" class="form-input" name="phone" value="+234 802 123 4567">
            </div>
            
            <div class="form-group">
              <label class="form-label">Date of Birth</label>
              <input type="date" class="form-input" name="dateOfBirth" value="1990-01-01">
            </div>
            
            <div class="form-group">
              <label class="form-label">Bio</label>
              <textarea class="form-textarea" name="bio" placeholder="Tell us about yourself...">Football enthusiast and weekend warrior. Love playing with friends and meeting new players.</textarea>
            </div>
            
            <div class="flex gap-4">
              <button type="submit" class="btn btn-primary">Save Changes</button>
              <button type="button" class="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  renderPreferencesTab() {
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="text-xl font-bold">Preferences</h2>
        </div>
        <div class="card-body">
          <div class="setting-item">
            <div>
              <div class="font-medium">Dark Mode</div>
              <div class="text-sm text-secondary">Switch between light and dark themes</div>
            </div>
            <div class="toggle-switch" data-theme-toggle>
            </div>
          </div>
          
          <div class="setting-item">
            <div>
              <div class="font-medium">Default Location</div>
              <div class="text-sm text-secondary">Preferred area for pitch recommendations</div>
            </div>
            <select class="form-select" style="width: auto;">
              <option value="">All Areas</option>
              <option value="Victoria Island" selected>Victoria Island</option>
              <option value="Lekki">Lekki</option>
              <option value="Ikeja">Ikeja</option>
              <option value="Surulere">Surulere</option>
            </select>
          </div>
          
          <div class="setting-item">
            <div>
              <div class="font-medium">Auto-book Same Time</div>
              <div class="text-sm text-secondary">Remember preferred time slots</div>
            </div>
            <div class="toggle-switch active">
            </div>
          </div>
          
          <div class="setting-item">
            <div>
              <div class="font-medium">Show Availability Calendar</div>
              <div class="text-sm text-secondary">Display calendar view in booking flow</div>
            </div>
            <div class="toggle-switch active">
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderNotificationsTab() {
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="text-xl font-bold">Notification Settings</h2>
        </div>
        <div class="card-body">
          <div class="setting-item">
            <div>
              <div class="font-medium">Email Notifications</div>
              <div class="text-sm text-secondary">Receive booking confirmations and updates via email</div>
            </div>
            <div class="toggle-switch active">
            </div>
          </div>
          
          <div class="setting-item">
            <div>
              <div class="font-medium">SMS Notifications</div>
              <div class="text-sm text-secondary">Get text messages for important booking updates</div>
            </div>
            <div class="toggle-switch active">
            </div>
          </div>
          
          <div class="setting-item">
            <div>
              <div class="font-medium">Reminder Notifications</div>
              <div class="text-sm text-secondary">Get reminded 1 hour before your booking</div>
            </div>
            <div class="toggle-switch active">
            </div>
          </div>
          
          <div class="setting-item">
            <div>
              <div class="font-medium">Promotional Emails</div>
              <div class="text-sm text-secondary">Receive deals and special offers</div>
            </div>
            <div class="toggle-switch">
            </div>
          </div>
          
          <div class="setting-item">
            <div>
              <div class="font-medium">Weekly Summary</div>
              <div class="text-sm text-secondary">Get a weekly summary of your activity</div>
            </div>
            <div class="toggle-switch">
            </div>
          </div>
          
          <div class="setting-item">
            <div>
              <div class="font-medium">New Pitch Alerts</div>
              <div class="text-sm text-secondary">Be notified when new pitches are added near you</div>
            </div>
            <div class="toggle-switch active">
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderSecurityTab() {
    return `
      <div class="space-y-6">
        <div class="card">
          <div class="card-header">
            <h2 class="text-xl font-bold">Change Password</h2>
          </div>
          <div class="card-body">
            <form class="password-form">
              <div class="form-group">
                <label class="form-label">Current Password</label>
                <input type="password" class="form-input" name="currentPassword">
              </div>
              
              <div class="form-group">
                <label class="form-label">New Password</label>
                <input type="password" class="form-input" name="newPassword">
              </div>
              
              <div class="form-group">
                <label class="form-label">Confirm New Password</label>
                <input type="password" class="form-input" name="confirmPassword">
              </div>
              
              <button type="submit" class="btn btn-primary">Update Password</button>
            </form>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2 class="text-xl font-bold">Two-Factor Authentication</h2>
          </div>
          <div class="card-body">
            <div class="setting-item">
              <div>
                <div class="font-medium">SMS Authentication</div>
                <div class="text-sm text-secondary">Add an extra layer of security to your account</div>
              </div>
              <button class="btn btn-secondary">Enable 2FA</button>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2 class="text-xl font-bold">Account Actions</h2>
          </div>
          <div class="card-body">
            <div class="setting-item">
              <div>
                <div class="font-medium">Download Data</div>
                <div class="text-sm text-secondary">Download a copy of your account data</div>
              </div>
              <button class="btn btn-secondary">Download</button>
            </div>
            
            <div class="setting-item">
              <div>
                <div class="font-medium text-red-600">Delete Account</div>
                <div class="text-sm text-secondary">Permanently delete your account and all data</div>
              </div>
              <button class="btn" style="background: #ef4444; color: white;">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        .space-y-6 > * + * {
          margin-top: 1.5rem;
        }
      </style>
    `;
  }

  mount() {
    this.header.mount();
    // Tab switching
    document.querySelectorAll('[data-tab]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = tab.dataset.tab;
        
        // Update active tab
        document.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active content
        document.querySelectorAll('[data-tab-content]').forEach(content => {
          content.classList.remove('active');
        });
        document.querySelector(`[data-tab-content="${tabName}"]`).classList.add('active');
      });
    });

    // Toggle switches
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
      });
    });

    // Forms
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.showToast('Profile updated successfully!', 'success');
      });
    }

    const passwordForm = document.querySelector('.password-form');
    if (passwordForm) {
      passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.showToast('Password updated successfully!', 'success');
        passwordForm.reset();
      });
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}


import { Header } from '../components/Header.js';

export class OwnerDashboardPage {
  constructor(appState, router) {
    this.appState = appState;
    this.header = new Header(appState, router);
    this.activeTab = 'overview';
  }

  render() {
    return `
      ${this.header.render()}
      
      <main class="py-8">
        <div class="container">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-3xl font-bold mb-2">Owner Dashboard</h1>
              <p class="text-secondary">Manage your sports facilities and bookings</p>
            </div>
            <div class="flex gap-3">
              <button class="btn btn-secondary" data-export-report>
                📊 Export Report
              </button>
              <button class="btn btn-primary" data-add-pitch>
                ➕ Add New Pitch
              </button>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="owner-nav-tabs mb-8">
            <button class="nav-tab ${this.activeTab === 'overview' ? 'active' : ''}" data-tab="overview">
              📊 Overview
            </button>
            <button class="nav-tab ${this.activeTab === 'bookings' ? 'active' : ''}" data-tab="bookings">
              📅 Bookings
            </button>
            <button class="nav-tab ${this.activeTab === 'availability' ? 'active' : ''}" data-tab="availability">
              🕒 Availability
            </button>
            <button class="nav-tab ${this.activeTab === 'wallet' ? 'active' : ''}" data-tab="wallet">
              💰 Wallet
            </button>
            <button class="nav-tab ${this.activeTab === 'receipts' ? 'active' : ''}" data-tab="receipts">
              🧾 Receipts
            </button>
            <button class="nav-tab ${this.activeTab === 'analytics' ? 'active' : ''}" data-tab="analytics">
              📈 Analytics
            </button>
            <button class="nav-tab ${this.activeTab === 'uploads' ? 'active' : ''}" data-tab="uploads">
              📤 Uploads
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            ${this.renderTabContent()}
          </div>
        </div>
      </main>
    `;
  }

  renderTabContent() {
    switch (this.activeTab) {
      case 'overview':
        return this.renderOverview();
      case 'bookings':
        return this.renderBookings();
      case 'availability':
        return this.renderAvailability();
      case 'wallet':
        return this.renderWallet();
      case 'receipts':
        return this.renderReceipts();
      case 'analytics':
        return this.renderAnalytics();
      case 'uploads':
        return this.renderUploads();
      default:
        return this.renderOverview();
    }
  }

  renderOverview() {
    const analytics = this.appState.getAnalyticsData() || {};
    const bookings = this.appState.getBookings() || [];
    const todayBookings = bookings.filter(b => b.date === new Date().toISOString().split('T')[0]);
    
    return `
      <div class="overview-grid">
        <!-- Quick Stats -->
        <div class="stats-row grid grid-cols-4 gap-6 mb-8">
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-value">${todayBookings.length}</div>
            <div class="stat-label">Today's Bookings</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-value">₦${(analytics.totalRevenue || 0).toLocaleString()}</div>
            <div class="stat-label">Total Revenue</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⚽</div>
            <div class="stat-value">${this.appState.getPitches().length}</div>
            <div class="stat-label">Active Pitches</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-value">${analytics.occupancyRate || 0}%</div>
            <div class="stat-label">Occupancy Rate</div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="grid grid-cols-2 gap-8">
          <div class="card">
            <div class="card-header">
              <h3 class="text-xl font-bold">Recent Bookings</h3>
            </div>
            <div class="card-body">
              ${bookings.slice(0, 5).map(booking => `
                <div class="booking-item flex justify-between items-center py-3 border-b">
                  <div>
                    <div class="font-medium">${booking.pitchName}</div>
                    <div class="text-sm text-secondary">${booking.customerInfo.name} • ${booking.date} ${booking.time}</div>
                  </div>
                  <div class="text-green font-medium">₦${booking.total.toLocaleString()}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="text-xl font-bold">Quick Actions</h3>
            </div>
            <div class="card-body">
              <div class="quick-actions grid grid-cols-2 gap-4">
                <button class="action-btn" data-action="add-availability">
                  🕒 Set Availability
                </button>
                <button class="action-btn" data-action="view-payments">
                  💳 View Payments
                </button>
                <button class="action-btn" data-action="export-data">
                  📊 Export Data
                </button>
                <button class="action-btn" data-action="manage-rates">
                  💰 Manage Rates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderBookings() {
    const bookings = this.appState.getBookings() || [];
    const today = new Date().toISOString().split('T')[0];
    
    return `
      <div class="bookings-management">
        <!-- Filters -->
        <div class="booking-filters bg-secondary p-4 rounded-lg mb-6">
          <div class="grid grid-cols-4 gap-4">
            <div>
              <label class="form-label">Date Range</label>
              <select class="form-select" data-date-filter>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div>
              <label class="form-label">Status</label>
              <select class="form-select" data-status-filter>
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label class="form-label">Pitch</label>
              <select class="form-select" data-pitch-filter>
                <option value="all">All Pitches</option>
                ${this.appState.getPitches().map(pitch => `
                  <option value="${pitch.id}">${pitch.name}</option>
                `).join('')}
              </select>
            </div>
            <div class="flex items-end">
              <button class="btn btn-secondary w-full" data-refresh-bookings>
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        <!-- Bookings Table -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-xl font-bold">Booking Management</h3>
          </div>
          <div class="card-body p-0">
            <div class="bookings-table">
              <div class="table-header grid grid-cols-7 gap-4 p-4 bg-tertiary font-medium">
                <div>Booking ID</div>
                <div>Customer</div>
                <div>Pitch</div>
                <div>Date & Time</div>
                <div>Duration</div>
                <div>Amount</div>
                <div>Actions</div>
              </div>
              ${bookings.map(booking => `
                <div class="table-row grid grid-cols-7 gap-4 p-4 border-b hover:bg-secondary">
                  <div class="font-mono text-sm">${booking.id}</div>
                  <div>
                    <div class="font-medium">${booking.customerInfo.name}</div>
                    <div class="text-sm text-secondary">${booking.customerInfo.phone}</div>
                  </div>
                  <div>${booking.pitchName}</div>
                  <div>
                    <div>${booking.date}</div>
                    <div class="text-sm text-secondary">${booking.time} (${booking.duration || 1}h)</div>
                  </div>
                  <div class="text-center">${booking.duration || 1} hour(s)</div>
                  <div class="font-medium text-green">₦${booking.total.toLocaleString()}</div>
                  <div class="flex gap-2">
                    <button class="btn btn-sm btn-secondary" data-view-booking="${booking.id}">View</button>
                    <button class="btn btn-sm btn-ghost" data-cancel-booking="${booking.id}">Cancel</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderAvailability() {
    const pitches = this.appState.getPitches();
    
    return `
      <div class="availability-management">
        <div class="grid grid-cols-3 gap-8">
          <!-- Pitch Selection -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-bold">Select Pitch</h3>
            </div>
            <div class="card-body">
              <div class="pitch-list">
                ${pitches.map(pitch => `
                  <div class="pitch-item p-3 rounded border cursor-pointer hover:bg-secondary" data-select-pitch="${pitch.id}">
                    <div class="font-medium">${pitch.name}</div>
                    <div class="text-sm text-secondary">${pitch.location}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Calendar View -->
          <div class="card col-span-2">
            <div class="card-header">
              <h3 class="text-lg font-bold">Availability Calendar</h3>
              <div class="flex gap-2">
                <button class="btn btn-sm btn-secondary" data-prev-week>← Prev</button>
                <button class="btn btn-sm btn-secondary" data-next-week">Next →</button>
              </div>
            </div>
            <div class="card-body">
              <div class="calendar-grid">
                ${this.renderCalendarGrid()}
              </div>
            </div>
          </div>
        </div>

        <!-- Bulk Availability Settings -->
        <div class="card mt-8">
          <div class="card-header">
            <h3 class="text-lg font-bold">Bulk Availability Settings</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-3 gap-6">
              <div>
                <label class="form-label">Operating Hours</label>
                <div class="grid grid-cols-2 gap-2">
                  <input type="time" class="form-input" value="06:00" data-open-time>
                  <input type="time" class="form-input" value="22:00" data-close-time>
                </div>
              </div>
              <div>
                <label class="form-label">Operating Days</label>
                <div class="checkbox-group">
                  ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => `
                    <label class="checkbox-item">
                      <input type="checkbox" checked data-day="${day}">
                      <span>${day}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
              <div>
                <label class="form-label">Holiday Settings</label>
                <button class="btn btn-secondary w-full" data-manage-holidays>
                  Manage Holidays
                </button>
              </div>
            </div>
            <div class="mt-4">
              <button class="btn btn-primary" data-save-availability>
                Save Availability Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderWallet() {
    const transactions = this.generateMockTransactions();
    const balance = transactions.reduce((total, t) => total + (t.type === 'credit' ? t.amount : -t.amount), 0);
    
    return `
      <div class="wallet-management">
        <!-- Wallet Overview -->
        <div class="grid grid-cols-3 gap-6 mb-8">
          <div class="wallet-card">
            <div class="wallet-icon">💰</div>
            <div class="wallet-balance">₦${balance.toLocaleString()}</div>
            <div class="wallet-label">Available Balance</div>
          </div>
          <div class="wallet-card">
            <div class="wallet-icon">📈</div>
            <div class="wallet-balance">₦${(balance * 0.15).toLocaleString()}</div>
            <div class="wallet-label">This Month</div>
          </div>
          <div class="wallet-card">
            <div class="wallet-icon">🏦</div>
            <div class="wallet-balance">₦${(balance * 0.05).toLocaleString()}</div>
            <div class="wallet-label">Pending</div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="wallet-actions grid grid-cols-4 gap-4 mb-8">
          <button class="action-card" data-action="withdraw">
            <div class="action-icon">💸</div>
            <div class="action-text">Withdraw</div>
          </button>
          <button class="action-card" data-action="transfer">
            <div class="action-icon">🔄</div>
            <div class="action-text">Transfer</div>
          </button>
          <button class="action-card" data-action="add-account">
            <div class="action-icon">🏦</div>
            <div class="action-text">Add Account</div>
          </button>
          <button class="action-card" data-action="view-statement">
            <div class="action-icon">📄</div>
            <div class="action-text">Statement</div>
          </button>
        </div>

        <!-- Transaction History -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-xl font-bold">Transaction History</h3>
            <div class="flex gap-2">
              <select class="form-select">
                <option>All Transactions</option>
                <option>Credits</option>
                <option>Debits</option>
              </select>
              <button class="btn btn-secondary">Export</button>
            </div>
          </div>
          <div class="card-body p-0">
            <div class="transactions-table">
              ${transactions.map(transaction => `
                <div class="transaction-row flex justify-between items-center p-4 border-b hover:bg-secondary">
                  <div class="flex items-center gap-4">
                    <div class="transaction-icon ${transaction.type}">
                      ${transaction.type === 'credit' ? '↗️' : '↙️'}
                    </div>
                    <div>
                      <div class="font-medium">${transaction.description}</div>
                      <div class="text-sm text-secondary">${transaction.date}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-medium ${transaction.type === 'credit' ? 'text-green' : 'text-red'}">
                      ${transaction.type === 'credit' ? '+' : '-'}₦${transaction.amount.toLocaleString()}
                    </div>
                    <div class="text-sm text-secondary">${transaction.status}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderReceipts() {
    const bookings = this.appState.getBookings() || [];
    
    return `
      <div class="receipts-management">
        <!-- Receipt Summary -->
        <div class="grid grid-cols-4 gap-6 mb-8">
          <div class="stat-card">
            <div class="stat-value">${bookings.length}</div>
            <div class="stat-label">Total Receipts</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">₦${bookings.reduce((total, b) => total + b.total, 0).toLocaleString()}</div>
            <div class="stat-label">Total Amount</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length}</div>
            <div class="stat-label">Today's Receipts</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">₦${(bookings.reduce((total, b) => total + b.total, 0) * 0.075).toLocaleString()}</div>
            <div class="stat-label">VAT Collected</div>
          </div>
        </div>

        <!-- Receipt Filters -->
        <div class="receipt-filters bg-secondary p-4 rounded-lg mb-6">
          <div class="grid grid-cols-4 gap-4">
            <input type="date" class="form-input" placeholder="From Date" data-from-date>
            <input type="date" class="form-input" placeholder="To Date" data-to-date>
            <select class="form-select" data-receipt-status>
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
            <button class="btn btn-primary" data-filter-receipts>Filter</button>
          </div>
        </div>

        <!-- Receipts Table -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-xl font-bold">Receipt Management</h3>
            <button class="btn btn-secondary" data-bulk-export>
              📊 Bulk Export
            </button>
          </div>
          <div class="card-body p-0">
            <div class="receipts-table">
              <div class="table-header grid grid-cols-6 gap-4 p-4 bg-tertiary font-medium">
                <div>Receipt #</div>
                <div>Customer</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              ${bookings.map(booking => `
                <div class="table-row grid grid-cols-6 gap-4 p-4 border-b hover:bg-secondary">
                  <div class="font-mono">#RCP-${booking.id.substring(0, 8)}</div>
                  <div>
                    <div class="font-medium">${booking.customerInfo.name}</div>
                    <div class="text-sm text-secondary">${booking.customerInfo.email}</div>
                  </div>
                  <div>${new Date(booking.createdAt).toLocaleDateString()}</div>
                  <div class="font-medium text-green">₦${booking.total.toLocaleString()}</div>
                  <div>
                    <span class="status-badge paid">Paid</span>
                  </div>
                  <div class="flex gap-2">
                    <button class="btn btn-sm btn-secondary" data-view-receipt="${booking.id}">View</button>
                    <button class="btn btn-sm btn-ghost" data-download-receipt="${booking.id}">Download</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderAnalytics() {
    const analytics = this.appState.getAnalyticsData() || {};
    
    return `
      <div class="analytics-management">
        <!-- Analytics Header -->
        <div class="analytics-controls flex justify-between items-center mb-8">
          <div>
            <h2 class="text-2xl font-bold">Business Analytics</h2>
            <p class="text-secondary">Detailed insights into your business performance</p>
          </div>
          <div class="flex gap-3">
            <select class="form-select" data-time-period>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button class="btn btn-secondary" data-export-analytics>
              📊 Export Report
            </button>
          </div>
        </div>

        <!-- KPI Cards -->
        <div class="kpi-grid grid grid-cols-4 gap-6 mb-8">
          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Revenue Growth</span>
              <span class="kpi-trend up">+23%</span>
            </div>
            <div class="kpi-value">₦${(analytics.totalRevenue || 0).toLocaleString()}</div>
            <div class="kpi-subtitle">vs last month</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Booking Rate</span>
              <span class="kpi-trend up">+15%</span>
            </div>
            <div class="kpi-value">${analytics.occupancyRate || 0}%</div>
            <div class="kpi-subtitle">occupancy rate</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Avg. Booking</span>
              <span class="kpi-trend down">-5%</span>
            </div>
            <div class="kpi-value">₦${(analytics.averageBookingValue || 0).toLocaleString()}</div>
            <div class="kpi-subtitle">per session</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Customer Retention</span>
              <span class="kpi-trend up">+8%</span>
            </div>
            <div class="kpi-value">68%</div>
            <div class="kpi-subtitle">returning customers</div>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="charts-grid grid grid-cols-2 gap-8">
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">Revenue Trend</h3>
              <select class="chart-filter">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <canvas class="chart-canvas" data-chart="revenue-trend"></canvas>
          </div>
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">Booking Distribution</h3>
            </div>
            <canvas class="chart-canvas" data-chart="booking-distribution"></canvas>
          </div>
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">Peak Hours Analysis</h3>
            </div>
            <canvas class="chart-canvas" data-chart="peak-hours"></canvas>
          </div>
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">Pitch Performance</h3>
            </div>
            <canvas class="chart-canvas" data-chart="pitch-performance"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  renderUploads() {
    return `
      <div class="uploads-management">
        <!-- Upload Options -->
        <div class="upload-options grid grid-cols-3 gap-6 mb-8">
          <div class="upload-card" data-upload-type="pitch-images">
            <div class="upload-icon">🏟️</div>
            <h3 class="upload-title">Pitch Images</h3>
            <p class="upload-description">Upload photos of your sports facilities</p>
            <button class="btn btn-primary w-full mt-4">Upload Images</button>
          </div>
          <div class="upload-card" data-upload-type="documents">
            <div class="upload-icon">📄</div>
            <h3 class="upload-title">Documents</h3>
            <p class="upload-description">Upload certificates, licenses, and policies</p>
            <button class="btn btn-primary w-full mt-4">Upload Documents</button>
          </div>
          <div class="upload-card" data-upload-type="bulk-data">
            <div class="upload-icon">📊</div>
            <h3 class="upload-title">Bulk Data</h3>
            <p class="upload-description">Import bookings, pricing, and availability</p>
            <button class="btn btn-primary w-full mt-4">Import Data</button>
          </div>
        </div>

        <!-- File Manager -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-xl font-bold">File Manager</h3>
            <div class="flex gap-2">
              <button class="btn btn-secondary" data-create-folder>
                📁 New Folder
              </button>
              <button class="btn btn-secondary" data-upload-multiple>
                📤 Upload Multiple
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="file-grid grid grid-cols-4 gap-4">
              ${this.renderFileItems()}
            </div>
          </div>
        </div>

        <!-- Upload Progress -->
        <div class="upload-progress-container" style="display: none;">
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-bold">Upload Progress</h3>
            </div>
            <div class="card-body">
              <div class="upload-items"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderFileItems() {
    const mockFiles = [
      { name: 'Pitch A Photos', type: 'folder', count: '12 items' },
      { name: 'facility-license.pdf', type: 'pdf', size: '2.3 MB' },
      { name: 'safety-certificate.jpg', type: 'image', size: '1.8 MB' },
      { name: 'pricing-template.xlsx', type: 'excel', size: '245 KB' },
      { name: 'Pitch B Photos', type: 'folder', count: '8 items' },
      { name: 'insurance-policy.pdf', type: 'pdf', size: '3.1 MB' }
    ];

    return mockFiles.map(file => `
      <div class="file-item" data-file="${file.name}">
        <div class="file-icon ${file.type}">
          ${this.getFileIcon(file.type)}
        </div>
        <div class="file-name">${file.name}</div>
        <div class="file-meta">${file.size || file.count}</div>
        <div class="file-actions">
          <button class="btn btn-sm btn-ghost" data-download>⬇️</button>
          <button class="btn btn-sm btn-ghost" data-delete>🗑️</button>
        </div>
      </div>
    `).join('');
  }

  renderCalendarGrid() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 10 PM
    
    return `
      <div class="calendar-header grid grid-cols-8 gap-1 mb-2">
        <div class="calendar-cell header">Time</div>
        ${days.map(day => `<div class="calendar-cell header">${day}</div>`).join('')}
      </div>
      ${hours.map(hour => `
        <div class="calendar-row grid grid-cols-8 gap-1 mb-1">
          <div class="calendar-cell time">${hour}:00</div>
          ${days.map(day => `
            <div class="calendar-cell slot available" data-time="${hour}:00" data-day="${day}">
              <div class="slot-status"></div>
            </div>
          `).join('')}
        </div>
      `).join('')}
    `;
  }

  generateMockTransactions() {
    return [
      { id: 1, description: 'Booking Payment - Pitch A', amount: 15000, type: 'credit', date: '2024-01-15', status: 'Completed' },
      { id: 2, description: 'Withdrawal to Bank', amount: 50000, type: 'debit', date: '2024-01-14', status: 'Completed' },
      { id: 3, description: 'Booking Payment - Pitch B', amount: 12000, type: 'credit', date: '2024-01-13', status: 'Completed' },
      { id: 4, description: 'Platform Fee', amount: 2500, type: 'debit', date: '2024-01-12', status: 'Completed' },
      { id: 5, description: 'Booking Payment - Pitch C', amount: 18000, type: 'credit', date: '2024-01-11', status: 'Pending' }
    ];
  }

  getFileIcon(type) {
    const icons = {
      folder: '📁',
      pdf: '📄',
      image: '🖼️',
      excel: '📊',
      word: '📝',
      video: '🎥'
    };
    return icons[type] || '📄';
  }

  mount() {
    this.header.mount();
    this.setupTabNavigation();
    this.setupEventListeners();
  }

  setupTabNavigation() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        this.activeTab = tabName;
        
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update content
        document.querySelector('.tab-content').innerHTML = this.renderTabContent();
        this.setupEventListeners();
      });
    });
  }

  setupEventListeners() {
    // File upload handlers
    document.querySelectorAll('[data-upload-type]').forEach(card => {
      card.addEventListener('click', () => {
        this.handleFileUpload(card.dataset.uploadType);
      });
    });

    // Booking actions
    document.querySelectorAll('[data-view-booking]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const bookingId = e.target.dataset.viewBooking;
        this.viewBookingDetails(bookingId);
      });
    });

    // Availability management
    document.querySelectorAll('[data-select-pitch]').forEach(item => {
      item.addEventListener('click', (e) => {
        document.querySelectorAll('.pitch-item').forEach(p => p.classList.remove('selected'));
        e.target.closest('.pitch-item').classList.add('selected');
      });
    });

    // Calendar slot clicks
    document.querySelectorAll('.calendar-cell.slot').forEach(slot => {
      slot.addEventListener('click', (e) => {
        e.target.classList.toggle('booked');
        e.target.classList.toggle('available');
      });
    });
  }

  handleFileUpload(type) {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    
    if (type === 'pitch-images') {
      input.accept = 'image/*';
    } else if (type === 'documents') {
      input.accept = '.pdf,.doc,.docx';
    } else if (type === 'bulk-data') {
      input.accept = '.csv,.xlsx,.json';
    }
    
    input.addEventListener('change', (e) => {
      this.processFileUpload(e.target.files, type);
    });
    
    input.click();
  }

  processFileUpload(files, type) {
    const progressContainer = document.querySelector('.upload-progress-container');
    progressContainer.style.display = 'block';
    
    Array.from(files).forEach(file => {
      this.uploadFile(file, type);
    });
  }

  uploadFile(file, type) {
    // Simulate file upload progress
    const uploadItem = document.createElement('div');
    uploadItem.className = 'upload-item';
    uploadItem.innerHTML = `
      <div class="upload-info">
        <div class="upload-filename">${file.name}</div>
        <div class="upload-size">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
      </div>
      <div class="upload-progress">
        <div class="upload-bar" style="width: 0%"></div>
      </div>
    `;
    
    document.querySelector('.upload-items').appendChild(uploadItem);
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        uploadItem.classList.add('completed');
      }
      uploadItem.querySelector('.upload-bar').style.width = progress + '%';
    }, 200);
  }

  viewBookingDetails(bookingId) {
    const booking = this.appState.getBookings().find(b => b.id === bookingId);
    if (booking) {
      // Navigate to receipt page or show modal
      window.location.href = `/dashboard/receipt/${bookingId}`;
    }
  }
}

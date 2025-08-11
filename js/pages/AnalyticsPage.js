import { Header } from '../components/Header.js';

export class AnalyticsPage {
  constructor(appState, router) {
    this.appState = appState;
    this.header = new Header(appState, router);
  }

  render() {
    const analytics = this.appState.getAnalyticsData();
    
    if (!analytics) {
      return `
        ${this.header.render()}
        <main class="py-8">
          <div class="container text-center">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p>Loading analytics data...</p>
          </div>
        </main>
      `;
    }

    return `
      ${this.header.render()}
      
      <main class="py-8">
        <div class="container">
          <div class="analytics-header">
            <div>
              <h1 class="text-3xl font-bold mb-2">Analytics Dashboard</h1>
              <p class="text-secondary">Overview of platform performance and insights</p>
            </div>
            <div class="flex gap-2">
              <select class="form-select" data-time-filter>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button class="btn btn-secondary" data-export-data>
                📊 Export Data
              </button>
            </div>
          </div>

          <!-- Summary Stats -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${analytics.totalBookings.toLocaleString()}</div>
              <div class="stat-label">Total Bookings</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">₦${(analytics.totalRevenue / 1000000).toFixed(1)}M</div>
              <div class="stat-label">Total Revenue</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">₦${analytics.averageBookingValue.toLocaleString()}</div>
              <div class="stat-label">Avg Booking Value</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${analytics.occupancyRate}%</div>
              <div class="stat-label">Occupancy Rate</div>
            </div>
          </div>

          <!-- Charts -->
          <div class="charts-grid">
            <div class="chart-card">
              <h3 class="chart-title">Weekly Revenue Trend</h3>
              <canvas class="chart-canvas" data-chart="weekly-revenue"></canvas>
            </div>
            
            <div class="chart-card">
              <h3 class="chart-title">Popular Booking Hours</h3>
              <canvas class="chart-canvas" data-chart="popular-hours"></canvas>
            </div>
            
            <div class="chart-card">
              <h3 class="chart-title">Monthly Revenue Trend</h3>
              <canvas class="chart-canvas" data-chart="monthly-revenue"></canvas>
            </div>
            
            <div class="chart-card">
              <h3 class="chart-title">Pitch Performance</h3>
              <canvas class="chart-canvas" data-chart="pitch-performance"></canvas>
            </div>
          </div>

          <!-- Detailed Insights -->
          <div class="grid grid-cols-2 gap-8">
            <div class="card">
              <div class="card-header">
                <h3 class="text-xl font-bold">Key Insights</h3>
              </div>
              <div class="card-body">
                <div class="space-y-4">
                  <div class="insight-item">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="text-2xl">📈</span>
                      <span class="font-semibold">Peak Hours</span>
                    </div>
                    <p class="text-secondary text-sm">
                      Most bookings occur between 6 PM - 8 PM on weekdays and 10 AM - 2 PM on weekends.
                    </p>
                  </div>
                  
                  <div class="insight-item">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="text-2xl">🏆</span>
                      <span class="font-semibold">Top Performer</span>
                    </div>
                    <p class="text-secondary text-sm">
                      ${analytics.pitchPerformance[0]?.name || 'Lekki Sports Center'} generates the highest revenue with consistent bookings.
                    </p>
                  </div>
                  
                  <div class="insight-item">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="text-2xl">📊</span>
                      <span class="font-semibold">Growth Trend</span>
                    </div>
                    <p class="text-secondary text-sm">
                      Revenue has grown by 23% compared to last month, with increasing repeat customers.
                    </p>
                  </div>
                  
                  <div class="insight-item">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="text-2xl">⚽</span>
                      <span class="font-semibold">Customer Behavior</span>
                    </div>
                    <p class="text-secondary text-sm">
                      Average session duration is 1.2 hours, with 68% of customers booking the same time slot weekly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card">
              <div class="card-header">
                <h3 class="text-xl font-bold">Top Performing Pitches</h3>
              </div>
              <div class="card-body">
                <div class="space-y-3">
                  ${analytics.pitchPerformance.slice(0, 5).map((pitch, index) => `
                    <div class="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div class="flex items-center gap-3">
                        <span class="w-6 h-6 bg-green text-white rounded-full flex items-center justify-center text-sm font-bold">
                          ${index + 1}
                        </span>
                        <div>
                          <div class="font-semibold text-sm">${pitch.name}</div>
                          <div class="text-xs text-secondary">${pitch.bookings} bookings</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="font-semibold text-green">₦${(pitch.revenue / 1000).toFixed(0)}K</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <style>
        .space-y-3 > * + * {
          margin-top: 0.75rem;
        }
        .space-y-4 > * + * {
          margin-top: 1rem;
        }
        
        .insight-item {
          padding: 1rem;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }
      </style>
    `;
  }

  mount() {
    this.header.mount();
    const analytics = this.appState.getAnalyticsData();
    if (!analytics) return;

    // Draw charts
    this.drawWeeklyRevenueChart(analytics.weeklyRevenue);
    this.drawPopularHoursChart(analytics.popularHours);
    this.drawMonthlyRevenueChart(analytics.monthlyRevenue);
    this.drawPitchPerformanceChart(analytics.pitchPerformance);

    // Export data functionality
    const exportButton = document.querySelector('[data-export-data]');
    if (exportButton) {
      exportButton.addEventListener('click', () => {
        this.exportAnalyticsData(analytics);
      });
    }

    // Time filter
    const timeFilter = document.querySelector('[data-time-filter]');
    if (timeFilter) {
      timeFilter.addEventListener('change', () => {
        this.showToast('Filter updated - data refreshed', 'info');
      });
    }
  }

  drawWeeklyRevenueChart(data) {
    const canvas = document.querySelector('[data-chart="weekly-revenue"]');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Chart settings
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data.map(d => d.revenue));
    const barWidth = chartWidth / data.length;

    // Draw bars
    data.forEach((item, index) => {
      const barHeight = (item.revenue / maxValue) * chartHeight;
      const x = padding + index * barWidth + barWidth * 0.2;
      const y = height - padding - barHeight;
      const width = barWidth * 0.6;

      // Bar
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(x, y, width, barHeight);

      // Value label
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(
        `₦${(item.revenue / 1000).toFixed(0)}K`,
        x + width / 2,
        y - 5
      );

      // Date label
      ctx.fillText(
        new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        x + width / 2,
        height - padding + 20
      );
    });

    // Y-axis
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
  }

  drawPopularHoursChart(data) {
    const canvas = document.querySelector('[data-chart="popular-hours"]');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    const total = data.reduce((sum, item) => sum + item.bookings, 0);

    let currentAngle = -Math.PI / 2;
    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

    data.forEach((item, index) => {
      const sliceAngle = (item.bookings / total) * 2 * Math.PI;
      const color = colors[index % colors.length];

      // Draw slice
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(item.time, labelX, labelY);

      currentAngle += sliceAngle;
    });

    // Legend
    const legendY = height - 100;
    data.slice(0, 4).forEach((item, index) => {
      const x = 20 + (index % 2) * 120;
      const y = legendY + Math.floor(index / 2) * 20;

      ctx.fillStyle = colors[index];
      ctx.fillRect(x, y, 12, 12);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter';
      ctx.textAlign = 'left';
      ctx.fillText(`${item.time} (${item.bookings})`, x + 18, y + 9);
    });
  }

  drawMonthlyRevenueChart(data) {
    const canvas = document.querySelector('[data-chart="monthly-revenue"]');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, width, height);

    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data.map(d => d.revenue));

    // Draw grid lines
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw line
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((item, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - (item.revenue / maxValue) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw points
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Month labels
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(item.month, x, height - padding + 20);
    });

    ctx.stroke();

    // Axes
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
  }

  drawPitchPerformanceChart(data) {
    const canvas = document.querySelector('[data-chart="pitch-performance"]');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, width, height);

    const padding = 80;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data.slice(0, 6).map(d => d.revenue));
    const barHeight = chartHeight / data.slice(0, 6).length;

    data.slice(0, 6).forEach((item, index) => {
      const barWidth = (item.revenue / maxValue) * chartWidth;
      const x = padding;
      const y = padding + index * barHeight + barHeight * 0.2;
      const height = barHeight * 0.6;

      // Bar
      ctx.fillStyle = index < 3 ? '#22c55e' : '#3b82f6';
      ctx.fillRect(x, y, barWidth, height);

      // Pitch name
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(
        item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
        padding - 10,
        y + height / 2 + 4
      );

      // Value
      ctx.textAlign = 'left';
      ctx.fillText(
        `₦${(item.revenue / 1000).toFixed(0)}K`,
        x + barWidth + 10,
        y + height / 2 + 4
      );
    });
  }

  exportAnalyticsData(analytics) {
    const data = {
      summary: {
        totalBookings: analytics.totalBookings,
        totalRevenue: analytics.totalRevenue,
        averageBookingValue: analytics.averageBookingValue,
        occupancyRate: analytics.occupancyRate
      },
      weeklyRevenue: analytics.weeklyRevenue,
      monthlyRevenue: analytics.monthlyRevenue,
      popularHours: analytics.popularHours,
      pitchPerformance: analytics.pitchPerformance,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sporthub-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.showToast('Analytics data exported successfully!', 'success');
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

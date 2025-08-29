
export class OwnerLoginPage {
  constructor(appState, router) {
    this.appState = appState;
    this.router = router;
  }

  render() {
    return `
      <div class="auth-container">
        <div class="auth-card card">
          <div class="card-body">
            <a href="/" class="logo text-center block mb-6">SportHub</a>
            <h2 class="text-2xl font-bold text-center mb-2">Owner Login</h2>
            <p class="text-secondary text-center mb-8">Access your pitch management dashboard</p>
            
            <form class="owner-login-form">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" name="email" required>
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" class="form-input" name="password" required>
              </div>
              <div class="flex justify-between items-center mb-4">
                <label class="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked>
                  Remember me
                </label>
                <a href="#" class="text-sm text-green">Forgot password?</a>
              </div>
              <button type="submit" class="btn btn-primary w-full btn-lg">Log In to Dashboard</button>
            </form>
            
            <p class="text-center text-sm text-secondary mt-6">
              Don't have an owner account? <a href="/owner/signup" class="text-green font-medium">Sign Up</a>
            </p>
            <p class="text-center text-sm text-secondary mt-2">
              Are you a player? <a href="/login" class="text-green font-medium">Player Login</a>
            </p>
          </div>
        </div>
      </div>
      <style>
        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: var(--bg-secondary);
        }
        .auth-card {
          width: 100%;
          max-width: 450px;
        }
      </style>
    `;
  }

  mount() {
    const form = document.querySelector('.owner-login-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const email = formData.get('email');
      const password = formData.get('password');
      
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in...';

      try {
        const success = await this.appState.ownerLogin(email, password);

        if (success) {
          this.showToast('Login successful! Welcome to your dashboard.', 'success');
          setTimeout(() => {
            this.router.navigate('/owner/dashboard');
          }, 1000);
        } else {
          this.showToast('Invalid credentials or not an owner account.', 'error');
        }
      } catch (error) {
        console.error('Owner login error:', error);
        this.showToast('An error occurred. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Log In to Dashboard';
      }
    });
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

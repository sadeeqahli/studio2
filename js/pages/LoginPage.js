export class LoginPage {
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
            <h2 class="text-2xl font-bold text-center mb-2">Welcome Back!</h2>
            <p class="text-secondary text-center mb-8">Log in to continue your journey.</p>
            
            <form class="login-form">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" name="email" value="player@sporthub.ng" required>
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" class="form-input" name="password" value="password123" required>
              </div>
              <div class="flex justify-between items-center mb-4">
                <label class="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked>
                  Remember me
                </label>
                <a href="#" class="text-sm text-green">Forgot password?</a>
              </div>
              <button type="submit" class="btn btn-primary w-full btn-lg">Log In</button>
            </form>
            
            <p class="text-center text-sm text-secondary mt-6">
              Don't have an account? <a href="/signup" class="text-green font-medium">Sign Up</a>
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
    const form = document.querySelector('.login-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const email = formData.get('email');
      const password = formData.get('password');

      const success = this.appState.login(email, password);

      if (success) {
        this.showToast('Login successful! Welcome back.', 'success');
        setTimeout(() => {
          this.router.navigate('/dashboard');
        }, 1000);
      } else {
        this.showToast('Invalid credentials. Please try again.', 'error');
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

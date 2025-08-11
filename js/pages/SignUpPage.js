export class SignUpPage {
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
            <h2 class="text-2xl font-bold text-center mb-2">Create Your Account</h2>
            <p class="text-secondary text-center mb-8">Let's get you started!</p>
            
            <form class="signup-form">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-input" name="name" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" name="email" required>
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" class="form-input" name="password" required>
              </div>
              <div class="form-group">
                <label class="form-label">Confirm Password</label>
                <input type="password" class="form-input" name="confirmPassword" required>
              </div>
              <button type="submit" class="btn btn-primary w-full btn-lg mt-4">Create Account</button>
            </form>
            
            <p class="text-center text-sm text-secondary mt-6">
              Already have an account? <a href="/login" class="text-green font-medium">Log In</a>
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
    const form = document.querySelector('.signup-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name');
      const email = formData.get('email');
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');

      if (password !== confirmPassword) {
        this.showToast('Passwords do not match.', 'error');
        return;
      }
      
      if (!name || !email || !password) {
        this.showToast('Please fill all fields.', 'error');
        return;
      }

      this.appState.signup({ name, email });
      this.showToast('Account created successfully! Welcome!', 'success');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        this.router.navigate('/dashboard');
      }, 1000);
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

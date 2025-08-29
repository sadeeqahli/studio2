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
              <div class="form-group">
                <label class="form-label">Referral Code (Optional)</label>
                <input type="text" class="form-input" name="referralCode" placeholder="Enter referral code to earn ₦100">
                <p class="text-xs text-secondary mt-1">If you were referred by someone, enter their code here</p>
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
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name');
      const email = formData.get('email');
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');
      const referralCode = formData.get('referralCode');

      if (password !== confirmPassword) {
        this.showToast('Passwords do not match.', 'error');
        return;
      }
      
      if (!name || !email || !password) {
        this.showToast('Please fill all fields.', 'error');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';

      try {
        // Create account with Clerk integration
        const result = await this.appState.signup({ name, email, password, referralCode });
        
        if (result.requiresVerification) {
          this.showVerificationForm(result.signUpAttempt);
        } else if (result.success) {
          this.showToast('Account created successfully! Welcome!', 'success');
          setTimeout(() => {
            this.router.navigate('/dashboard');
          }, 1000);
        } else {
          this.showToast(result.error || 'Failed to create account. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Signup error:', error);
        this.showToast('An error occurred. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    });
  }

  showVerificationForm(signUpAttempt) {
    const authCard = document.querySelector('.auth-card .card-body');
    authCard.innerHTML = `
      <a href="/" class="logo text-center block mb-6">SportHub</a>
      <h2 class="text-2xl font-bold text-center mb-2">Verify Your Email</h2>
      <p class="text-secondary text-center mb-8">We've sent a verification code to your email address.</p>
      
      <form class="verification-form">
        <div class="form-group">
          <label class="form-label">Verification Code</label>
          <input type="text" class="form-input" name="code" placeholder="Enter 6-digit code" required>
        </div>
        <button type="submit" class="btn btn-primary w-full btn-lg">Verify Email</button>
      </form>
      
      <p class="text-center text-sm text-secondary mt-6">
        Didn't receive the code? <a href="#" class="text-green font-medium resend-code">Resend</a>
      </p>
    `;

    const verificationForm = document.querySelector('.verification-form');
    verificationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(verificationForm);
      const code = formData.get('code');
      
      const submitBtn = verificationForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Verifying...';

      try {
        const success = await this.appState.verifyEmail(code, signUpAttempt);
        
        if (success) {
          this.showToast('Email verified successfully! Welcome!', 'success');
          setTimeout(() => {
            this.router.navigate('/dashboard');
          }, 1000);
        } else {
          this.showToast('Invalid verification code. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        this.showToast('Verification failed. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Verify Email';
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

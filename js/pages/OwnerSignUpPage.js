
export class OwnerSignUpPage {
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
            <h2 class="text-2xl font-bold text-center mb-2">Register as Pitch Owner</h2>
            <p class="text-secondary text-center mb-8">Start managing your sports facilities today!</p>
            
            <form class="owner-signup-form">
              <div class="form-group">
                <label class="form-label">Business Name</label>
                <input type="text" class="form-input" name="businessName" placeholder="Your Sports Complex Name" required>
              </div>
              <div class="form-group">
                <label class="form-label">Owner Full Name</label>
                <input type="text" class="form-input" name="ownerName" placeholder="John Doe" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" name="email" placeholder="owner@example.com" required>
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" class="form-input" name="phone" placeholder="+234 xxx xxx xxxx" required>
              </div>
              <div class="form-group">
                <label class="form-label">Business Address</label>
                <textarea class="form-input" name="address" rows="3" placeholder="Complete business address" required></textarea>
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
                <label class="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="terms" required>
                  I agree to the <a href="#" class="text-green">Terms of Service</a> and <a href="#" class="text-green">Privacy Policy</a>
                </label>
              </div>
              <button type="submit" class="btn btn-primary w-full btn-lg mt-4">Create Owner Account</button>
            </form>
            
            <p class="text-center text-sm text-secondary mt-6">
              Already have an owner account? <a href="/owner/login" class="text-green font-medium">Log In</a>
            </p>
            <p class="text-center text-sm text-secondary mt-2">
              Are you a player? <a href="/signup" class="text-green font-medium">Player Sign Up</a>
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
          max-width: 500px;
        }
      </style>
    `;
  }

  mount() {
    const form = document.querySelector('.owner-signup-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const businessName = formData.get('businessName');
      const ownerName = formData.get('ownerName');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const address = formData.get('address');
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');
      const terms = formData.get('terms');

      if (password !== confirmPassword) {
        this.showToast('Passwords do not match.', 'error');
        return;
      }
      
      if (!businessName || !ownerName || !email || !phone || !address || !password) {
        this.showToast('Please fill all fields.', 'error');
        return;
      }

      if (!terms) {
        this.showToast('Please accept the terms and conditions.', 'error');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';

      try {
        const result = await this.appState.ownerSignup({ 
          businessName, 
          ownerName, 
          email, 
          phone, 
          address,
          password
        });
        
        if (result.requiresVerification) {
          this.showVerificationForm(result.signUpAttempt);
        } else if (result.success) {
          this.showToast('Owner account created successfully! Welcome!', 'success');
          setTimeout(() => {
            this.router.navigate('/owner/dashboard');
          }, 1000);
        } else {
          this.showToast(result.error || 'Failed to create account. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Owner signup error:', error);
        this.showToast('An error occurred. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Owner Account';
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
          this.showToast('Email verified successfully! Welcome to your dashboard!', 'success');
          setTimeout(() => {
            this.router.navigate('/owner/dashboard');
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

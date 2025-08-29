export class WelcomePage {
  render() {
    // This page won't have the standard header to provide a more immersive, app-like entry.
    return `
      <div class="welcome-container">
        <div class="welcome-content">
          <h1 class="logo">SportHub</h1>
          <h2 class="welcome-title">The Ultimate Football Experience</h2>
          <p class="welcome-subtitle">Book pitches, find teammates, and manage your games—all in one place.</p>
          <div class="welcome-actions">
            <a href="/signup" class="btn btn-primary btn-lg">Join as Player</a>
            <a href="/owner/signup" class="btn btn-secondary btn-lg">List Your Pitch</a>
            <a href="/about" class="btn btn-ghost btn-lg">Learn More</a>
          </div>
          <div class="mt-4 text-center">
            <p class="text-sm text-secondary">
              Own a sports facility? 
              <a href="/owner/signup" class="text-green font-medium">Register as Owner</a>
            </p>
          </div>
        </div>
        <div class="welcome-bg"></div>
      </div>

      <style>
        .welcome-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 100vh;
          overflow: hidden;
        }
        .welcome-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 4rem;
          background-color: var(--bg-primary);
        }
        .welcome-content .logo {
          position: absolute;
          top: 2rem;
          left: 2rem;
          font-size: 1.8rem;
        }
        .welcome-title {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        .welcome-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 500px;
          margin-bottom: 2.5rem;
        }
        .welcome-actions {
          display: flex;
          gap: 1rem;
        }
        .welcome-bg {
          background-image: url('https://img-wrapper.vercel.app/image?url=https://images.unsplash.com/photo-1551958214-2d59cc7a2a3a?q=80&w=1887');
          background-size: cover;
          background-position: center;
        }

        @media (max-width: 768px) {
          .welcome-container {
            grid-template-columns: 1fr;
          }
          .welcome-bg {
            display: none;
          }
          .welcome-content {
            text-align: center;
            align-items: center;
          }
          .welcome-title {
            font-size: 2.5rem;
          }
           .welcome-actions {
            flex-direction: column;
            width: 100%;
          }
        }
      </style>
    `;
  }
}
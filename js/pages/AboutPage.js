import { Header } from '../components/Header.js';

export class AboutPage {
  constructor(appState, router) {
    this.appState = appState;
    this.header = new Header(appState, router);
  }

  render() {
    return `
      ${this.header.render()}
      
      <main class="py-8">
        <div class="container">
          <!-- Hero Section -->
          <section class="text-center mb-16">
            <h1 class="text-4xl font-bold mb-4">About SportHub</h1>
            <p class="text-lg text-secondary max-w-3xl mx-auto">
              We're passionate about making football accessible to everyone. SportHub is Nigeria's premier platform 
              for discovering and booking premium football pitches across Lagos and beyond.
            </p>
          </section>

          <!-- Mission Section -->
          <section class="grid grid-cols-2 gap-12 mb-16">
            <div>
              <h2 class="text-3xl font-bold mb-6">Our Mission</h2>
              <p class="text-secondary mb-4">
                To revolutionize how football enthusiasts find, book, and enjoy premium pitches 
                across Nigeria. We believe everyone deserves access to quality football venues.
              </p>
              <p class="text-secondary mb-4">
                Our platform connects football lovers with the best pitches, 
                making it easier than ever to organize games, tournaments, and training sessions.
              </p>
              <div class="flex gap-4 mt-6">
                <a href="/dashboard" class="btn btn-primary">Start Booking</a>
                <a href="/community" class="btn btn-secondary">Join Community</a>
              </div>
            </div>
            <div class="bg-light-green rounded-lg p-8">
              <div class="text-center">
                <div class="text-6xl mb-4">🏆</div>
                <h3 class="text-xl font-semibold mb-4">Why Choose Us?</h3>
                <ul class="text-left space-y-3">
                  <li class="flex items-center gap-3">
                    <span class="text-green">✓</span>
                    <span>Verified premium pitches</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="text-green">✓</span>
                    <span>Real-time availability</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="text-green">✓</span>
                    <span>Instant booking confirmation</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="text-green">✓</span>
                    <span>24/7 customer support</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="text-green">✓</span>
                    <span>Transparent pricing</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Stats Section -->
          <section class="bg-secondary rounded-lg p-8 mb-16">
            <h2 class="text-3xl font-bold text-center mb-8">Our Impact</h2>
            <div class="grid grid-cols-4 gap-8 text-center">
              <div>
                <div class="text-3xl font-bold text-green mb-2">50+</div>
                <div class="text-secondary">Partner Pitches</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-green mb-2">10,000+</div>
                <div class="text-secondary">Happy Players</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-green mb-2">25,000+</div>
                <div class="text-secondary">Bookings Completed</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-green mb-2">4.8⭐</div>
                <div class="text-secondary">Average Rating</div>
              </div>
            </div>
          </section>

          <!-- Team Section -->
          <section class="mb-16">
            <h2 class="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
            <div class="grid grid-cols-3 gap-8">
              ${this.renderTeamMembers()}
            </div>
          </section>

          <!-- Values Section -->
          <section class="mb-16">
            <h2 class="text-3xl font-bold text-center mb-8">Our Values</h2>
            <div class="grid grid-cols-3 gap-8">
              <div class="text-center p-6">
                <div class="text-4xl mb-4">🎯</div>
                <h3 class="text-xl font-semibold mb-3">Excellence</h3>
                <p class="text-secondary">We strive for excellence in every aspect of our service, from pitch quality to customer experience.</p>
              </div>
              <div class="text-center p-6">
                <div class="text-4xl mb-4">🤝</div>
                <h3 class="text-xl font-semibold mb-3">Community</h3>
                <p class="text-secondary">Building a vibrant football community that brings people together through shared passion for the beautiful game.</p>
              </div>
              <div class="text-4xl mb-4">
                <div class="text-4xl mb-4">⚡</div>
                <h3 class="text-xl font-semibold mb-3">Innovation</h3>
                <p class="text-secondary">Continuously improving our platform with cutting-edge technology and user-centric features.</p>
              </div>
            </div>
          </section>

          <!-- Contact CTA -->
          <section class="text-center bg-light-blue rounded-lg p-12">
            <h2 class="text-3xl font-bold mb-4">Get In Touch</h2>
            <p class="text-lg text-secondary mb-6">
              Have questions or want to partner with us? We'd love to hear from you!
            </p>
            <div class="flex gap-4 justify-center">
              <a href="/care" class="btn btn-primary">Contact Support</a>
              <a href="mailto:hello@sporthub.ng" class="btn btn-secondary">Email Us</a>
            </div>
          </section>
        </div>
      </main>
      
      <style>
        .space-y-3 > * + * {
          margin-top: 0.75rem;
        }
      </style>
    `;
  }

  renderTeamMembers() {
    const team = [
      {
        name: 'Adebayo Johnson',
        role: 'Founder & CEO',
        image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x300/22c55e/ffffff?text=AJ',
        bio: 'Football enthusiast with 10+ years in tech and sports management.'
      },
      {
        name: 'Fatima Okafor',
        role: 'Head of Operations',
        image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x300/3b82f6/ffffff?text=FO',
        bio: 'Operations expert ensuring smooth facility partnerships and bookings.'
      },
      {
        name: 'Emeka Nwosu',
        role: 'Head of Technology',
        image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x300/22c55e/ffffff?text=EN',
        bio: 'Full-stack developer passionate about creating seamless user experiences.'
      }
    ];

    return team.map(member => `
      <div class="text-center">
        <img src="${member.image}" alt="${member.name}" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover">
        <h3 class="text-lg font-semibold mb-1">${member.name}</h3>
        <p class="text-green font-medium mb-2">${member.role}</p>
        <p class="text-secondary text-sm">${member.bio}</p>
      </div>
    `).join('');
  }

  mount() {
    this.header.mount();
  }
}

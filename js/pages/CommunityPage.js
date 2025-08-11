import { Header } from '../components/Header.js';

export class CommunityPage {
  constructor(appState, router) {
    this.appState = appState;
    this.header = new Header(appState, router);
  }

  render() {
    return `
      ${this.header.render()}
      
      <main class="py-8">
        <div class="container">
          <!-- Header -->
          <section class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-4">SportHub Community</h1>
            <p class="text-lg text-secondary max-w-2xl mx-auto">
              Connect with fellow football enthusiasts, share experiences, and find your next game.
            </p>
          </section>

          <!-- New: Find Players/Teams Section -->
          <section class="mb-12">
            <h2 class="text-3xl font-bold text-center mb-8">Find Teammates & Join Games</h2>
            <div class="card">
              <div class="card-body">
                ${this.renderPlayerFinder()}
              </div>
            </div>
          </section>

          <!-- Community Features -->
          <section class="grid grid-cols-2 gap-8 mb-12">
            <div class="card">
              <div class="card-body">
                <h3 class="text-xl font-bold mb-4">🏆 Facility Reviews & Ratings</h3>
                <p class="text-secondary mb-4">Share your experiences and help others choose the best pitches.</p>
                <div class="space-y-3">
                  ${this.renderRecentReviews()}
                </div>
                <button class="btn btn-primary w-full mt-4" data-write-review>
                  Write a Review
                </button>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h3 class="text-xl font-bold mb-4">🎁 Referral Program</h3>
                <p class="text-secondary mb-4">Earn rewards by inviting friends to join SportHub!</p>
                <div class="referral-code-box bg-light-green p-4 rounded-lg mb-4">
                  <div class="text-sm text-secondary">Your Referral Code</div>
                  <div class="font-mono text-lg font-bold">SPORT2025HUB</div>
                  <button class="btn btn-sm btn-secondary mt-2" data-copy-code>
                    📋 Copy Code
                  </button>
                </div>
                <div class="text-sm text-secondary">
                  <p>• Refer a friend: Get ₦1,000 credit</p>
                  <p>• Friend gets: 20% off first booking</p>
                  <p>• Your earnings: ₦12,500 (25 referrals)</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Community Feed -->
          <section class="mb-12">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold">Community Feed</h2>
              <button class="btn btn-primary" data-share-experience>
                Share Experience
              </button>
            </div>
            
            <div class="community-feed space-y-6">
              ${this.renderCommunityPosts()}
            </div>
          </section>

          <!-- Join Groups -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold text-center mb-8">Join Local Groups</h2>
            <div class="grid grid-cols-3 gap-6">
              ${this.renderLocalGroups()}
            </div>
          </section>

          <!-- Upcoming Events -->
          <section>
            <h2 class="text-2xl font-bold text-center mb-8">Upcoming Community Events</h2>
            <div class="grid grid-cols-2 gap-6">
              ${this.renderUpcomingEvents()}
            </div>
          </section>
        </div>
      </main>
      
      <style>
        .space-y-3 > * + * {
          margin-top: 0.75rem;
        }
        .space-y-6 > * + * {
          margin-top: 1.5rem;
        }
        
        .review-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }
        
        .review-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary-green);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          flex-shrink: 0;
        }
        
        .post-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }
        
        .post-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .post-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--primary-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }
        
        .post-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }
        
        .post-action {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
        }
        
        .post-action:hover,
        .post-action.active {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        
        .group-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all 0.2s ease;
        }
        
        .group-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        
        .event-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          transition: all 0.2s ease;
        }
        
        .event-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        
        .event-date {
          background: var(--primary-green);
          color: white;
          padding: 0.5rem;
          border-radius: var(--radius-md);
          text-align: center;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        .player-card {
            display: flex;
            gap: 1rem;
            padding: 1rem;
            background: var(--bg-secondary);
            border-radius: var(--radius-md);
            border: 1px solid var(--border-color);
        }
        .player-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--primary-blue);
            color: white;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
      </style>
    `;
  }

  renderPlayerFinder() {
    const players = this.appState.getPlayerListings();
    return `
      <div class="player-finder">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Players Looking for a Team</h3>
            <button class="btn btn-secondary" data-list-yourself>+ List Yourself</button>
        </div>
        <div class="grid grid-cols-3 gap-4">
            ${players.slice(0, 6).map(player => `
                <div class="player-card">
                    <div class="player-avatar">${player.avatar}</div>
                    <div class="flex-1">
                        <h4 class="font-semibold">${player.name}</h4>
                        <p class="text-sm text-secondary">${player.location}</p>
                        <div class="flex gap-2 mt-2">
                            <span class="amenity-tag">${player.preferredPosition}</span>
                            <span class="amenity-tag">${player.skillLevel}</span>
                        </div>
                        <p class="text-xs text-secondary mt-2">${player.lookingFor}</p>
                        <button class="btn btn-primary btn-sm w-full mt-3" data-contact-player>Contact Player</button>
                    </div>
                </div>
            `).join('')}
        </div>
      </div>
    `;
  }

  renderRecentReviews() {
    const reviews = [
      {
        user: 'Adebayo K.',
        rating: 5,
        pitch: 'Lekki Sports Center',
        comment: 'Amazing facilities and great lighting!'
      },
      {
        user: 'Fatima O.',
        rating: 4,
        pitch: 'VI Football Hub',
        comment: 'Good pitch, but parking could be better.'
      },
      {
        user: 'Emeka N.',
        rating: 5,
        pitch: 'Mainland Sports Arena',
        comment: 'Perfect for weekend games with friends!'
      }
    ];

    return reviews.map(review => `
      <div class="review-item">
        <div class="review-avatar">${review.user.charAt(0)}</div>
        <div class="flex-1">
          <div class="flex justify-between items-start mb-1">
            <div class="font-semibold text-sm">${review.user}</div>
            <div class="text-yellow-500 text-sm">${'⭐'.repeat(review.rating)}</div>
          </div>
          <div class="text-sm text-secondary mb-1">${review.pitch}</div>
          <div class="text-sm">${review.comment}</div>
        </div>
      </div>
    `).join('');
  }

  renderCommunityPosts() {
    const posts = [
      {
        user: 'John Okafor',
        avatar: 'JO',
        time: '2 hours ago',
        content: 'Just finished an amazing game at SportHub Lekki! The new artificial turf is incredible. Looking for regular teammates for weekly games. Who\'s interested? ⚽',
        likes: 12,
        comments: 5,
        image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/500x300/22c55e/ffffff?text=Football+Game'
      },
      {
        user: 'Sarah Ahmed',
        avatar: 'SA',
        time: '5 hours ago',
        content: 'Shoutout to the amazing facilities at Victoria Island Sports Complex! Clean changing rooms, great lighting, and excellent customer service. Highly recommend! 🏆',
        likes: 8,
        comments: 3
      },
      {
        user: 'Mike Johnson',
        avatar: 'MJ',
        time: '1 day ago',
        content: 'Organizing a weekend tournament for beginners. Registration opens tomorrow at 10 AM. Prizes for top 3 teams! Who\'s ready to showcase their skills? 🎯',
        likes: 25,
        comments: 12,
        image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/500x300/3b82f6/ffffff?text=Tournament'
      }
    ];

    return posts.map(post => `
      <div class="post-card">
        <div class="post-header">
          <div class="post-avatar">${post.avatar}</div>
          <div>
            <div class="font-semibold">${post.user}</div>
            <div class="text-sm text-secondary">${post.time}</div>
          </div>
        </div>
        
        <div class="post-content">
          <p class="mb-3">${post.content}</p>
          ${post.image ? `<img src="${post.image}" alt="Post image" class="w-full h-48 object-cover rounded-lg mb-3">` : ''}
        </div>
        
        <div class="post-actions">
          <button class="post-action" data-like-post>
            👍 Like (${post.likes})
          </button>
          <button class="post-action" data-comment-post>
            💬 Comment (${post.comments})
          </button>
          <button class="post-action" data-share-post>
            📤 Share
          </button>
        </div>
      </div>
    `).join('');
  }

  renderLocalGroups() {
    const groups = [
      {
        name: 'Lekki Weekend Warriors',
        members: 156,
        image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/22c55e/ffffff?text=Lekki+Warriors',
        description: 'Saturday morning football sessions at Lekki Sports Center'
      },
      {
        name: 'VI Corporate League',
        members: 89,
        image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/3b82f6/ffffff?text=VI+Corporate',
        description: 'After-work games for corporate professionals'
      },
      {
        name: 'Lagos Ladies Football',
        members: 67,
        image: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/ec4899/ffffff?text=Ladies+Football',
        description: 'Empowering women through football in Lagos'
      }
    ];

    return groups.map(group => `
      <div class="group-card">
        <img src="${group.image}" alt="${group.name}" class="w-full h-32 object-cover">
        <div class="p-4">
          <h3 class="font-semibold mb-2">${group.name}</h3>
          <p class="text-sm text-secondary mb-3">${group.description}</p>
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm text-secondary">${group.members} members</span>
            <span class="text-sm text-green">Active</span>
          </div>
          <button class="btn btn-primary w-full" data-join-group="${group.name}">
            Join Group
          </button>
        </div>
      </div>
    `).join('');
  }

  renderUpcomingEvents() {
    const events = [
      {
        title: 'Lagos Football Championship',
        date: 'Mar 15',
        time: '10:00 AM',
        location: 'Teslim Balogun Stadium',
        participants: 128,
        price: 'Free'
      },
      {
        title: 'Youth Skills Development',
        date: 'Mar 22',
        time: '2:00 PM',
        location: 'SportHub Academy',
        participants: 45,
        price: '₦2,500'
      }
    ];

    return events.map(event => `
      <div class="event-card">
        <div class="event-date">${event.date}</div>
        <h3 class="font-semibold text-lg mb-2">${event.title}</h3>
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-sm text-secondary">
            <span>🕒</span>
            <span>${event.time}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-secondary">
            <span>📍</span>
            <span>${event.location}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-secondary">
            <span>👥</span>
            <span>${event.participants} participants</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-secondary">
            <span>💰</span>
            <span>${event.price}</span>
          </div>
        </div>
        <button class="btn btn-primary w-full" data-join-event="${event.title}">
          Join Event
        </button>
      </div>
    `).join('');
  }

  mount() {
    this.header.mount();
    // Review writing
    const writeReviewButton = document.querySelector('[data-write-review]');
    if (writeReviewButton) {
      writeReviewButton.addEventListener('click', () => {
        this.showWriteReviewModal();
      });
    }

    // Copy referral code
    const copyCodeButton = document.querySelector('[data-copy-code]');
    if (copyCodeButton) {
      copyCodeButton.addEventListener('click', () => {
        navigator.clipboard.writeText('SPORT2025HUB').then(() => {
          this.showToast('Referral code copied to clipboard!', 'success');
        });
      });
    }

    // Share experience
    const shareButton = document.querySelector('[data-share-experience]');
    if (shareButton) {
      shareButton.addEventListener('click', () => {
        this.showShareExperienceModal();
      });
    }

    // Post interactions
    document.querySelectorAll('[data-like-post]').forEach(button => {
      button.addEventListener('click', () => {
        button.classList.toggle('active');
        const currentCount = parseInt(button.textContent.match(/\d+/)[0]);
        const newCount = button.classList.contains('active') ? currentCount + 1 : currentCount - 1;
        button.innerHTML = `👍 Like (${newCount})`;
        this.showToast(button.classList.contains('active') ? 'Post liked!' : 'Like removed', 'info');
      });
    });

    document.querySelectorAll('[data-comment-post]').forEach(button => {
      button.addEventListener('click', () => {
        this.showToast('Comment feature coming soon!', 'info');
      });
    });

    document.querySelectorAll('[data-share-post]').forEach(button => {
      button.addEventListener('click', () => {
        this.showToast('Post shared!', 'success');
      });
    });

    // Join group
    document.querySelectorAll('[data-join-group]').forEach(button => {
      button.addEventListener('click', () => {
        const groupName = button.dataset.joinGroup;
        this.showToast(`Successfully joined ${groupName}!`, 'success');
        button.textContent = 'Joined ✓';
        button.disabled = true;
        button.classList.remove('btn-primary');
        button.classList.add('btn-secondary');
      });
    });

    // Join event
    document.querySelectorAll('[data-join-event]').forEach(button => {
      button.addEventListener('click', () => {
        const eventTitle = button.dataset.joinEvent;
        this.showToast(`Successfully registered for ${eventTitle}!`, 'success');
        button.textContent = 'Registered ✓';
        button.disabled = true;
        button.classList.remove('btn-primary');
        button.classList.add('btn-secondary');
      });
    });

    // Player Finder
    const listYourselfButton = document.querySelector('[data-list-yourself]');
    if(listYourselfButton) {
        listYourselfButton.addEventListener('click', () => {
            this.showToast('This feature is coming soon!', 'info');
        });
    }
    document.querySelectorAll('[data-contact-player]').forEach(button => {
        button.addEventListener('click', () => {
            this.showToast('Contact request sent!', 'success');
        });
    });
  }

  showWriteReviewModal() {
    const modal = document.createElement('div');
    modal.className = 'review-modal';
    modal.innerHTML = `
      <div class="modal-overlay" data-close-modal></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="text-xl font-bold">Write a Review</h3>
          <button class="modal-close" data-close-modal>✕</button>
        </div>
        <div class="modal-body">
          <form class="review-form">
            <div class="form-group">
              <label class="form-label">Select Pitch</label>
              <select class="form-select" name="pitch" required>
                <option value="">Choose a pitch you've visited</option>
                <option value="lekki-sports">Lekki Sports Center</option>
                <option value="vi-football">VI Football Hub</option>
                <option value="mainland-arena">Mainland Sports Arena</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Rating</label>
              <div class="rating-selector">
                <button type="button" class="star" data-rating="1">⭐</button>
                <button type="button" class="star" data-rating="2">⭐</button>
                <button type="button" class="star" data-rating="3">⭐</button>
                <button type="button" class="star" data-rating="4">⭐</button>
                <button type="button" class="star" data-rating="5">⭐</button>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Your Review</label>
              <textarea class="form-textarea" name="review" required 
                        placeholder="Share your experience with this facility..."></textarea>
            </div>
            
            <div class="flex gap-4">
              <button type="submit" class="btn btn-primary">Submit Review</button>
              <button type="button" class="btn btn-secondary" data-close-modal>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Star rating
    let selectedRating = 0;
    modal.querySelectorAll('.star').forEach((star, index) => {
      star.addEventListener('click', () => {
        selectedRating = index + 1;
        modal.querySelectorAll('.star').forEach((s, i) => {
          s.style.opacity = i < selectedRating ? '1' : '0.3';
        });
      });
    });
    
    // Form submission
    modal.querySelector('.review-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (selectedRating === 0) {
        this.showToast('Please select a rating', 'error');
        return;
      }
      this.showToast('Review submitted successfully!', 'success');
      modal.remove();
    });
    
    // Close modal
    modal.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => modal.remove());
    });
  }

  showShareExperienceModal() {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
      <div class="modal-overlay" data-close-modal></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="text-xl font-bold">Share Your Experience</h3>
          <button class="modal-close" data-close-modal>✕</button>
        </div>
        <div class="modal-body">
          <form class="share-form">
            <div class="form-group">
              <label class="form-label">What's on your mind?</label>
              <textarea class="form-textarea" name="content" required 
                        placeholder="Share your latest game, experience, or connect with fellow players..." rows="4"></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Add a Photo (Optional)</label>
              <input type="file" class="form-input" name="photo" accept="image/*">
            </div>
            
            <div class="flex gap-4">
              <button type="submit" class="btn btn-primary">Share Post</button>
              <button type="button" class="btn btn-secondary" data-close-modal>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Form submission
    modal.querySelector('.share-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.showToast('Experience shared successfully!', 'success');
      modal.remove();
    });
    
    // Close modal
    modal.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => modal.remove());
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

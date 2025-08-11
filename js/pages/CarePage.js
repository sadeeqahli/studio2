import { Header } from '../components/Header.js';

export class CarePage {
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
            <h1 class="text-4xl font-bold mb-4">Customer Support</h1>
            <p class="text-lg text-secondary">
              We're here to help! Get in touch with our support team for any questions or assistance.
            </p>
          </section>

          <!-- Support Options -->
          <section class="grid grid-cols-3 gap-8 mb-12">
            <div class="card text-center">
              <div class="card-body">
                <div class="text-4xl mb-4">📞</div>
                <h3 class="text-xl font-semibold mb-2">Phone Support</h3>
                <p class="text-secondary mb-4">Speak directly with our support team</p>
                <div class="font-semibold text-green mb-2">+234 800 SPORT HUB</div>
                <div class="font-semibold text-green">+234 801 234 5678</div>
                <p class="text-sm text-secondary mt-2">24/7 Available</p>
              </div>
            </div>

            <div class="card text-center">
              <div class="card-body">
                <div class="text-4xl mb-4">📧</div>
                <h3 class="text-xl font-semibold mb-2">Email Support</h3>
                <p class="text-secondary mb-4">Send us your questions and we'll respond quickly</p>
                <div class="font-semibold text-green mb-2">support@sporthub.ng</div>
                <div class="font-semibold text-green">hello@sporthub.ng</div>
                <p class="text-sm text-secondary mt-2">Response within 2 hours</p>
              </div>
            </div>

            <div class="card text-center">
              <div class="card-body">
                <div class="text-4xl mb-4">💬</div>
                <h3 class="text-xl font-semibold mb-2">Live Chat</h3>
                <p class="text-secondary mb-4">Get instant help through live chat</p>
                <button class="btn btn-primary w-full" data-start-chat>
                  Start Chat
                </button>
                <p class="text-sm text-secondary mt-2">Available 9AM - 10PM</p>
              </div>
            </div>
          </section>

          <!-- Office Locations -->
          <section class="mb-12">
            <h2 class="text-3xl font-bold text-center mb-8">Visit Our Offices</h2>
            <div class="grid grid-cols-2 gap-8">
              <div class="card">
                <div class="card-body">
                  <h3 class="text-xl font-semibold mb-4">Lagos Head Office</h3>
                  <div class="space-y-3 text-secondary">
                    <div class="flex items-start gap-3">
                      <span>📍</span>
                      <div>
                        <div class="font-medium text-primary">Address:</div>
                        <div>Plot 123, Admiralty Way<br>Lekki Phase 1, Lagos State</div>
                      </div>
                    </div>
                    <div class="flex items-start gap-3">
                      <span>🕒</span>
                      <div>
                        <div class="font-medium text-primary">Business Hours:</div>
                        <div>Monday - Friday: 8:00 AM - 6:00 PM<br>
                        Saturday: 9:00 AM - 4:00 PM<br>
                        Sunday: Closed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-body">
                  <h3 class="text-xl font-semibold mb-4">Abuja Branch Office</h3>
                  <div class="space-y-3 text-secondary">
                    <div class="flex items-start gap-3">
                      <span>📍</span>
                      <div>
                        <div class="font-medium text-primary">Address:</div>
                        <div>Suite 45, Central Business District<br>Abuja, FCT</div>
                      </div>
                    </div>
                    <div class="flex items-start gap-3">
                      <span>🕒</span>
                      <div>
                        <div class="font-medium text-primary">Business Hours:</div>
                        <div>Monday - Friday: 9:00 AM - 5:00 PM<br>
                        Saturday: 10:00 AM - 2:00 PM<br>
                        Sunday: Closed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- FAQ Section -->
          <section class="mb-12">
            <h2 class="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div class="space-y-4">
              ${this.renderFAQs()}
            </div>
          </section>

          <!-- Contact Form -->
          <section>
            <div class="card max-w-2xl mx-auto">
              <div class="card-header">
                <h2 class="text-2xl font-bold">Send Us a Message</h2>
              </div>
              <div class="card-body">
                <form class="contact-form">
                  <div class="grid grid-cols-2 gap-4">
                    <div class="form-group">
                      <label class="form-label">First Name *</label>
                      <input type="text" class="form-input" name="firstName" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Last Name *</label>
                      <input type="text" class="form-input" name="lastName" required>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Email *</label>
                    <input type="email" class="form-input" name="email" required>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Phone Number</label>
                    <input type="tel" class="form-input" name="phone">
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Subject *</label>
                    <select class="form-select" name="subject" required>
                      <option value="">Select a topic</option>
                      <option value="booking">Booking Issues</option>
                      <option value="payment">Payment Problems</option>
                      <option value="facility">Facility Concerns</option>
                      <option value="account">Account Questions</option>
                      <option value="partnership">Partnership Inquiries</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Message *</label>
                    <textarea class="form-textarea" name="message" required 
                              placeholder="Please describe your question or concern in detail..."></textarea>
                  </div>
                  
                  <button type="submit" class="btn btn-primary w-full">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <style>
        .space-y-3 > * + * {
          margin-top: 0.75rem;
        }
        .space-y-4 > * + * {
          margin-top: 1rem;
        }
        
        .faq-item {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        
        .faq-question {
          background: var(--bg-secondary);
          padding: 1rem 1.5rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.2s ease;
        }
        
        .faq-question:hover {
          background: var(--bg-tertiary);
        }
        
        .faq-answer {
          padding: 0 1.5rem;
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .faq-item.active .faq-answer {
          max-height: 200px;
          padding: 1rem 1.5rem;
        }
        
        .faq-item.active .faq-toggle {
          transform: rotate(180deg);
        }
        
        .faq-toggle {
          transition: transform 0.3s ease;
        }
      </style>
    `;
  }

  renderFAQs() {
    const faqs = [
      {
        question: 'How do I book a pitch?',
        answer: 'Simply browse our available pitches, select your preferred date and time, fill in your details, and confirm your booking. You\'ll receive instant confirmation.'
      },
      {
        question: 'Can I cancel or modify my booking?',
        answer: 'Yes, you can cancel or modify your booking up to 2 hours before the scheduled time. Login to your account or contact customer support for assistance.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept bank transfers and offer a "Pay Later" option where you can add bookings to your card for later payment. Credit card payments are coming soon.'
      },
      {
        question: 'How do I know if my booking is confirmed?',
        answer: 'You\'ll receive an instant confirmation email and SMS with your booking details and receipt. You can also view all your bookings in your account dashboard.'
      },
      {
        question: 'What happens if it rains on my booking day?',
        answer: 'For outdoor pitches, we offer free rescheduling if there\'s heavy rain. Indoor facilities are not affected by weather conditions.'
      },
      {
        question: 'Do you offer group discounts?',
        answer: 'Yes! We offer special rates for regular bookings and group events. Contact our sales team at hello@sporthub.ng for custom pricing.'
      }
    ];

    return faqs.map((faq, index) => `
      <div class="faq-item" data-faq-item>
        <div class="faq-question" data-faq-question>
          <span class="font-semibold">${faq.question}</span>
          <span class="faq-toggle text-xl">⌄</span>
        </div>
        <div class="faq-answer">
          <p class="text-secondary">${faq.answer}</p>
        </div>
      </div>
    `).join('');
  }

  mount() {
    this.header.mount();
    // FAQ Toggles
    document.querySelectorAll('[data-faq-question]').forEach(question => {
      question.addEventListener('click', () => {
        const faqItem = question.closest('[data-faq-item]');
        const isActive = faqItem.classList.contains('active');
        
        // Close all other FAQs
        document.querySelectorAll('[data-faq-item]').forEach(item => {
          item.classList.remove('active');
        });
        
        // Toggle current FAQ
        if (!isActive) {
          faqItem.classList.add('active');
        }
      });
    });

    // Contact Form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleContactForm(e.target);
      });
    }

    // Live Chat Button
    const chatButton = document.querySelector('[data-start-chat]');
    if (chatButton) {
      chatButton.addEventListener('click', () => {
        this.showToast('Live chat will be available soon! Please use email or phone for now.', 'info');
      });
    }
  }

  handleContactForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
      this.showToast('Please fill in all required fields', 'error');
      return;
    }

    // Simulate form submission
    this.showToast('Message sent successfully! We\'ll get back to you within 2 hours.', 'success');
    form.reset();
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
}

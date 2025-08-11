import { Header } from '../components/Header.js';

export class ShopPage {
  constructor(appState, router) {
    this.appState = appState;
    this.header = new Header(appState, router);
  }

  render() {
    const products = this.appState.getProducts();
    const cartItemCount = this.appState.getCartItemCount();

    return `
      ${this.header.render()}
      
      <main class="py-8">
        <div class="container">
          <!-- Coming Soon Banner -->
          <div class="coming-soon-banner bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg p-8 text-center mb-8">
            <h1 class="text-4xl font-bold mb-4">🚀 Shop Coming Soon!</h1>
            <p class="text-lg mb-6">We're preparing an amazing collection of sports gear and equipment just for you!</p>
            <div class="flex gap-4 justify-center">
              <button class="btn bg-white text-green-600 font-semibold" data-notify-launch>
                Notify Me When Available
              </button>
              <a href="/dashboard" class="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600">
                Book a Pitch Instead
              </a>
            </div>
          </div>

          <!-- Preview Products -->
          <section class="mb-12">
            <h2 class="text-3xl font-bold text-center mb-2">Preview Our Upcoming Collection</h2>
            <p class="text-center text-secondary mb-8">Get a sneak peek at what's coming to SportHub Shop</p>
            
            <!-- Categories Filter -->
            <div class="flex justify-center mb-8">
              <div class="flex gap-2 bg-secondary rounded-lg p-1">
                <button class="category-filter active" data-category="all">All Items</button>
                <button class="category-filter" data-category="Boots">Boots</button>
                <button class="category-filter" data-category="Jerseys">Jerseys</button>
                <button class="category-filter" data-category="Balls">Balls</button>
                <button class="category-filter" data-category="Accessories">Accessories</button>
              </div>
            </div>
            
            <!-- Product Grid -->
            <div class="product-grid grid grid-cols-4 gap-6" data-product-grid>
              ${this.renderProducts(products)}
            </div>
          </section>

          <!-- Features Section -->
          <section class="bg-secondary rounded-lg p-8 mb-12">
            <h2 class="text-2xl font-bold text-center mb-8">What to Expect</h2>
            <div class="grid grid-cols-3 gap-8">
              <div class="text-center">
                <div class="text-4xl mb-4">🏆</div>
                <h3 class="font-semibold mb-2">Premium Quality</h3>
                <p class="text-secondary">Only the best brands and highest quality sports equipment</p>
              </div>
              <div class="text-center">
                <div class="text-4xl mb-4">🚚</div>
                <h3 class="font-semibold mb-2">Fast Delivery</h3>
                <p class="text-secondary">Quick delivery across Lagos and major Nigerian cities</p>
              </div>
              <div class="text-center">
                <div class="text-4xl mb-4">💰</div>
                <h3 class="font-semibold mb-2">Best Prices</h3>
                <p class="text-secondary">Competitive pricing with exclusive member discounts</p>
              </div>
            </div>
          </section>

          <!-- Newsletter Signup -->
          <section class="text-center">
            <div class="card max-w-xl mx-auto">
              <div class="card-body">
                <h3 class="text-xl font-bold mb-4">Be the First to Know!</h3>
                <p class="text-secondary mb-6">Join our newsletter to get notified when the shop launches and receive exclusive early-bird discounts</p>
                <form class="newsletter-form">
                  <div class="flex gap-2">
                    <input type="email" class="form-input flex-1" placeholder="Enter your email" required>
                    <button type="submit" class="btn btn-primary">Subscribe</button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
        
        ${cartItemCount > 0 ? this.renderCart() : ''}
      </main>
      
      <style>
        .coming-soon-banner {
          background: linear-gradient(135deg, var(--primary-green), var(--primary-blue));
        }
        
        .category-filter {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .category-filter:hover,
        .category-filter.active {
          background: var(--bg-primary);
          color: var(--text-primary);
        }
        
        .product-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all 0.2s ease;
          opacity: 0.7;
          position: relative;
        }
        
        .product-card::after {
          content: 'Coming Soon';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          font-weight: 500;
          z-index: 2;
        }
        
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        
        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        
        .cart-widget {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 100;
        }
        
        .cart-summary {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1rem;
          box-shadow: var(--shadow-lg);
          min-width: 300px;
        }
      </style>
    `;
  }

  renderProducts(products) {
    return products.slice(0, 12).map(product => `
      <div class="product-card" data-category="${product.category}">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="p-4">
          <h3 class="font-semibold mb-2">${product.name}</h3>
          <p class="text-sm text-secondary mb-2">${product.category}</p>
          <div class="flex justify-between items-center">
            <span class="text-green font-bold">₦${product.price.toLocaleString()}</span>
            <span class="text-xs text-secondary">⭐ ${product.rating}</span>
          </div>
          <button class="btn btn-primary w-full mt-3" data-add-to-cart="${product.id}">
            Add to Cart
          </button>
        </div>
      </div>
    `).join('');
  }

  renderCart() {
    const cart = this.appState.getCart();
    const total = this.appState.getCartTotal();

    return `
      <div class="cart-widget">
        <div class="cart-summary">
          <h4 class="font-semibold mb-3">Shopping Cart (${cart.length})</h4>
          <div class="space-y-2 mb-4">
            ${cart.slice(0, 3).map(item => `
              <div class="flex justify-between text-sm">
                <span>${item.name.substring(0, 20)}...</span>
                <span>₦${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            `).join('')}
            ${cart.length > 3 ? `<div class="text-sm text-secondary">+${cart.length - 3} more items</div>` : ''}
          </div>
          <div class="border-t pt-2 mb-4">
            <div class="flex justify-between font-semibold">
              <span>Total:</span>
              <span class="text-green">₦${total.toLocaleString()}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-secondary btn-sm" data-view-cart>View Cart</button>
            <button class="btn btn-primary btn-sm" data-checkout>Checkout</button>
          </div>
        </div>
      </div>
    `;
  }

  mount() {
    this.header.mount();
    // Category filtering
    document.querySelectorAll('.category-filter').forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;
        
        // Update active button
        document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        
        // Filter products
        this.filterProducts(category);
      });
    });

    // Add to cart
    document.querySelectorAll('[data-add-to-cart]').forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.dataset.addToCart;
        const product = this.appState.getProducts().find(p => p.id === productId);
        
        if (product) {
          this.appState.addToCart(product);
          this.showToast(`${product.name} added to cart!`, 'success');
          this.updateCartWidget();
        }
      });
    });

    // Newsletter signup
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.showToast('Thanks for subscribing! We\'ll notify you when the shop launches.', 'success');
        newsletterForm.reset();
      });
    }

    // Notify me button
    const notifyButton = document.querySelector('[data-notify-launch]');
    if (notifyButton) {
      notifyButton.addEventListener('click', () => {
        this.showToast('We\'ll notify you as soon as the shop is available!', 'success');
      });
    }

    // Cart actions
    const viewCartButton = document.querySelector('[data-view-cart]');
    if (viewCartButton) {
      viewCartButton.addEventListener('click', () => {
        this.showCartModal();
      });
    }

    const checkoutButton = document.querySelector('[data-checkout]');
    if (checkoutButton) {
      checkoutButton.addEventListener('click', () => {
        this.showToast('Checkout will be available when the shop launches!', 'info');
      });
    }
  }

  filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
      if (category === 'all' || product.dataset.category === category) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });
  }

  updateCartWidget() {
    const cartWidget = document.querySelector('.cart-widget');
    const cartItemCount = this.appState.getCartItemCount();
    
    if (cartItemCount > 0 && !cartWidget) {
      // Add cart widget
      const main = document.querySelector('main');
      main.insertAdjacentHTML('beforeend', this.renderCart());
      this.mount(); // Re-bind events
    } else if (cartWidget) {
      // Update existing cart widget
      cartWidget.outerHTML = this.renderCart();
      this.mount(); // Re-bind events
    }
  }

  showCartModal() {
    const cart = this.appState.getCart();
    const total = this.appState.getCartTotal();
    
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
      <div class="modal-overlay" data-close-modal></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="text-xl font-bold">Shopping Cart</h3>
          <button class="modal-close" data-close-modal>✕</button>
        </div>
        <div class="modal-body">
          ${cart.length === 0 ? `
            <div class="text-center py-8">
              <div class="text-4xl mb-4">🛒</div>
              <p class="text-secondary">Your cart is empty</p>
            </div>
          ` : `
            <div class="space-y-4">
              ${cart.map(item => `
                <div class="flex items-center gap-4 p-4 border border-color rounded-lg">
                  <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                  <div class="flex-1">
                    <h4 class="font-semibold">${item.name}</h4>
                    <p class="text-sm text-secondary">${item.category}</p>
                    <div class="flex items-center gap-2 mt-2">
                      <button class="btn btn-sm" data-decrease-qty="${item.id}">-</button>
                      <span class="px-2">${item.quantity}</span>
                      <button class="btn btn-sm" data-increase-qty="${item.id}">+</button>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold">₦${(item.price * item.quantity).toLocaleString()}</div>
                    <button class="text-red-500 text-sm" data-remove-item="${item.id}">Remove</button>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="border-t pt-4 mt-4">
              <div class="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span class="text-green">₦${total.toLocaleString()}</span>
              </div>
            </div>
          `}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-close-modal>Continue Shopping</button>
          <button class="btn btn-primary" ${cart.length === 0 ? 'disabled' : ''}>
            Checkout (Coming Soon)
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Modal event listeners
    modal.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => modal.remove());
    });
    
    // Cart item actions
    modal.querySelectorAll('[data-increase-qty]').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.increaseQty;
        const item = cart.find(item => item.id === productId);
        if (item) {
          this.appState.updateCartItemQuantity(productId, item.quantity + 1);
          modal.remove();
          this.showCartModal();
          this.updateCartWidget();
        }
      });
    });
    
    modal.querySelectorAll('[data-decrease-qty]').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.decreaseQty;
        const item = cart.find(item => item.id === productId);
        if (item && item.quantity > 1) {
          this.appState.updateCartItemQuantity(productId, item.quantity - 1);
          modal.remove();
          this.showCartModal();
          this.updateCartWidget();
        }
      });
    });
    
    modal.querySelectorAll('[data-remove-item]').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.removeItem;
        this.appState.removeFromCart(productId);
        modal.remove();
        this.showCartModal();
        this.updateCartWidget();
      });
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

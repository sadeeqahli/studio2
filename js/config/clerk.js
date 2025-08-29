let clerk = null;

// Get Clerk publishable key from backend
async function getClerkConfig() {
  try {
    const response = await fetch('/api/config');
    const config = await response.json();
    return config.clerkPublishableKey;
  } catch (error) {
    console.error('Failed to fetch Clerk config:', error);
    throw error;
  }
}

// Load Clerk script dynamically
function loadClerkScript() {
  return new Promise((resolve, reject) => {
    if (window.Clerk) {
      resolve(window.Clerk);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@clerk/clerk-js@latest/dist/clerk.browser.js';
    script.onload = () => {
      if (window.Clerk) {
        resolve(window.Clerk);
      } else {
        reject(new Error('Clerk failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Clerk script'));
    document.head.appendChild(script);
  });
}

// Load Clerk and make it globally available
async function initializeClerk() {
  try {
    const clerkPubKey = await getClerkConfig();
    
    if (!clerkPubKey) {
      throw new Error('Missing Clerk Publishable Key. Please configure CLERK_PUBLISHABLE_KEY in your environment variables.');
    }

    // Load Clerk script
    const Clerk = await loadClerkScript();
    
    // Initialize Clerk
    clerk = new Clerk(clerkPubKey);
    await clerk.load();
    window.clerk = clerk;
    return clerk;
  } catch (error) {
    console.error('Failed to initialize Clerk:', error);
    throw error;
  }
}

export { clerk, initializeClerk };
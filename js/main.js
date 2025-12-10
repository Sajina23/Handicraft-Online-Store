/* ==================== MAIN JAVASCRIPT ==================== */
/* Global functionality: smooth navigation, analytics, utilities */

document.addEventListener('DOMContentLoaded', function() {
  // Set active navigation link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.main-nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        return;
      }
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Cart functionality (stores full cart in localStorage under 'handicraft_cart')
  const cartCountElements = document.querySelectorAll('#cart-count, #cart-count-2');

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem('handicraft_cart') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem('handicraft_cart', JSON.stringify(cart));
  }

  function getCartItemCount(cart) {
    return cart.reduce((sum, it) => sum + (it.qty || 0), 0);
  }

  function updateCartDisplay() {
    const cart = loadCart();
    const count = getCartItemCount(cart);
    cartCountElements.forEach(el => el.textContent = count);
  }

  // Initialize display
  updateCartDisplay();

  // Add-to-cart buttons
  const addCartBtns = document.querySelectorAll('.add-cart-btn');
  addCartBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      const productName = this.dataset.product || this.getAttribute('data-product') || 'Product';
      const price = parseFloat(this.dataset.price || this.getAttribute('data-price') || 0) || 0;

      // Try to find an image in the product card
      let image = '';
      const card = this.closest('.product-card');
      if (card) {
        const img = card.querySelector('img');
        if (img) image = img.getAttribute('src') || '';
      }

      const cart = loadCart();
      const existing = cart.find(i => i.name === productName);
      if (existing) {
        existing.qty = (existing.qty || 0) + 1;
      } else {
        cart.push({ name: productName, price: price, qty: 1, image: image });
      }

      saveCart(cart);
      updateCartDisplay();

      // Visual feedback on button
      const originalText = this.textContent;
      this.textContent = '✓ Added!';
      this.disabled = true;
      this.style.opacity = '0.7';

      setTimeout(() => {
        this.textContent = originalText;
        this.disabled = false;
        this.style.opacity = '1';
      }, 1500);

      console.log(`Added to cart: ${productName} - $${price}`);
    });
  });

  // Mobile menu toggle (if implemented)
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function() {
      mobileNav.classList.toggle('active');
      this.setAttribute('aria-expanded', 
        mobileNav.classList.contains('active') ? 'true' : 'false');
    });

    // Close menu when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Accessibility: Skip to main content link
  const skipLink = document.querySelector('.skip-to-main');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.tabIndex = -1;
        mainContent.focus();
      }
    });
  }

  // Log page view (for analytics tracking)
  console.log('Page loaded:', window.location.pathname);
});

// Utility function: Debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utility function: Throttle
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lazy loading fallback (if Intersection Observer is not supported)
if (!('IntersectionObserver' in window)) {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.src = img.dataset.src || img.src;
  });
}

// ==================== PRODUCT EXPAND/COLLAPSE ==================== 
// Handle "Read More" button clicks to expand product descriptions
document.addEventListener('DOMContentLoaded', function() {
  const readMoreButtons = document.querySelectorAll('.read-more-btn');
  
  readMoreButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const productCard = this.closest('.product-card');
      if (!productCard) return;
      
      const desc = productCard.querySelector('.product-desc');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      if (!isExpanded) {
        // Expand
        if (desc) desc.classList.add('expanded');
        this.setAttribute('aria-expanded', 'true');
        this.textContent = 'Read Less';
      } else {
        // Collapse
        if (desc) desc.classList.remove('expanded');
        this.setAttribute('aria-expanded', 'false');
        this.textContent = 'Read More';
      }
    });
  });
});

// Utilities are defined for internal use; no module export so this file
// can be loaded as a normal script in browsers.

/* cart.js - renders shopping cart stored in localStorage (handicraft_cart) */

function loadCart() {
  try { return JSON.parse(localStorage.getItem('handicraft_cart') || '[]'); }
  catch (e) { return []; }
}

function saveCart(cart) { localStorage.setItem('handicraft_cart', JSON.stringify(cart)); }

function formatPrice(p) { return `$${Number(p).toFixed(2)}`; }

function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  const cart = loadCart();
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    updateHeaderCount();
    return;
  }

  let total = 0;
  cart.forEach((item, idx) => {
    total += (item.price || 0) * (item.qty || 0);
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <div class="cart-item-media">
        ${item.image ? `<img src="${item.image}" alt="${escapeHtml(item.name)}" />` : ''}
      </div>
      <div class="cart-item-body">
        <h3>${escapeHtml(item.name)}</h3>
        <p class="cart-item-price">${formatPrice(item.price)}</p>
        <label>Quantity: <input type="number" min="1" value="${item.qty}" data-index="${idx}" class="cart-qty"/></label>
        <button class="btn-secondary remove-item" data-index="${idx}">Remove</button>
      </div>
    `;
    container.appendChild(itemDiv);
  });

  const summary = document.createElement('div');
  summary.className = 'cart-summary';
  summary.innerHTML = `<h3>Total: ${formatPrice(total)}</h3>`;
  container.appendChild(summary);

  // Attach handlers
  container.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = parseInt(btn.dataset.index, 10);
      const c = loadCart();
      c.splice(i, 1);
      saveCart(c);
      renderCart();
    });
  });

  container.querySelectorAll('.cart-qty').forEach(input => {
    input.addEventListener('change', (e) => {
      const i = parseInt(input.dataset.index, 10);
      let v = parseInt(input.value, 10);
      if (isNaN(v) || v < 1) v = 1;
      const c = loadCart();
      c[i].qty = v;
      saveCart(c);
      renderCart();
    });
  });

  updateHeaderCount();
}

function updateHeaderCount() {
  const els = document.querySelectorAll('#cart-count');
  const cart = loadCart();
  const count = cart.reduce((s, it) => s + (it.qty || 0), 0);
  els.forEach(el => el.textContent = count);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Clear cart button
document.addEventListener('DOMContentLoaded', function() {
  renderCart();
  const clearBtn = document.getElementById('clear-cart');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear all items from the cart?')) {
        saveCart([]);
        renderCart();
      }
    });
  }

  // Checkout flow
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutSection = document.getElementById('checkout-section');
  const checkoutForm = document.getElementById('checkout-form');
  const cancelCheckout = document.getElementById('cancel-checkout');
  const orderConfirmation = document.getElementById('order-confirmation');

  if (checkoutBtn && checkoutSection) {
    checkoutBtn.addEventListener('click', () => {
      // scroll to checkout and show
      checkoutSection.style.display = 'block';
      orderConfirmation.style.display = 'none';
      checkoutSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (cancelCheckout && checkoutSection) {
    cancelCheckout.addEventListener('click', () => {
      checkoutSection.style.display = 'none';
    });
  }

  function getCartTotal() {
    const cart = loadCart();
    return cart.reduce((s, it) => s + ((it.price || 0) * (it.qty || 0)), 0);
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cust-name').value.trim();
      const email = document.getElementById('cust-email').value.trim();
      const address = document.getElementById('cust-address').value.trim();
      const note = document.getElementById('cust-note').value.trim();

      if (!name || !email || !address) {
        alert('Please fill in name, email and shipping address.');
        return;
      }

      const cart = loadCart();
      if (cart.length === 0) {
        alert('Your cart is empty. Add items before checking out.');
        return;
      }

      const order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        customer: { name, email, address, note },
        items: cart,
        total: getCartTotal()
      };

      // Save orders list (demo)
      try {
        const orders = JSON.parse(localStorage.getItem('handicraft_orders') || '[]');
        orders.push(order);
        localStorage.setItem('handicraft_orders', JSON.stringify(orders));
      } catch (err) {
        // ignore
      }

      // Clear cart and show confirmation
      saveCart([]);
      renderCart();
      checkoutSection.style.display = 'none';
      if (orderConfirmation) {
        orderConfirmation.style.display = 'block';
        orderConfirmation.innerHTML = `\
          <div class="order-success">
            <div class="order-success-header">
              <h2>✓ Order Placed Successfully</h2>
              <p class="order-id">Order ID: <strong>${escapeHtml(order.id)}</strong></p>
            </div>
            <div class="order-summary">
              <div class="summary-row">
                <span>Order Date:</span>
                <strong>${new Date(order.date).toLocaleDateString()}</strong>
              </div>
              <div class="summary-row total-row">
                <span>Total Amount:</span>
                <strong class="amount">${formatPrice(order.total)}</strong>
              </div>
              <div class="summary-row">
                <span>Confirmation sent to:</span>
                <strong>${escapeHtml(order.customer.email)}</strong>
              </div>
            </div>
            <div class="order-details">
              <h3>Shipping Information</h3>
              <p><strong>${escapeHtml(order.customer.name)}</strong></p>
              <p>${escapeHtml(order.customer.address).replace(/\n/g, '<br>')}</p>
            </div>
            <div class="order-items">
              <h3>Items Ordered</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Unit Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map(it => `
                    <tr>
                      <td>${escapeHtml(it.name)}</td>
                      <td>${formatPrice(it.price)}</td>
                      <td>${it.qty}</td>
                      <td>${formatPrice(it.price * it.qty)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            <div class="order-actions">
              <a href="products.html" class="cta-button">Continue Shopping</a>
            </div>
          </div>`;
      }
    });
  }
});

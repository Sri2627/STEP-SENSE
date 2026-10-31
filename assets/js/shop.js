const products = {
  'pace-tee': { name: 'Everyday Pace Tee', detail: 'Relaxed fit · Black', price: 2650, category: 'tees', image: 'assets/images/shop-tee-black.png' },
  'move-tee': { name: 'Move Light Tee', detail: 'Relaxed fit · White', price: 2650, category: 'tees', image: 'assets/images/shop-tee-white.png' },
  'trail-tee': { name: 'Trail Day Tee', detail: 'Relaxed fit · Red', price: 2800, category: 'tees', image: 'assets/images/shop-tee-red.png' },
  'pace-cap': { name: 'All Routes Cap', detail: 'Adjustable · Black', price: 2150, category: 'caps', image: 'assets/images/shop-cap-black.jpg' },
  'daily-cap': { name: 'Daily Loop Cap', detail: 'Adjustable · White', price: 2150, category: 'caps', image: 'assets/images/shop-cap-white.jpg' },
  'city-sneaker': { name: 'City Pace High-Top', detail: 'High-top · White / Red', price: 7400, category: 'shoes', image: 'assets/images/shop-shoe-01.jpg' },
  'trail-sneaker': { name: 'Trail Motion Runner', detail: 'Performance · Black / Red', price: 7800, category: 'shoes', image: 'assets/images/shop-shoe-02.jpg' },
  'cloud-knit': { name: 'Cloud Knit Runner', detail: 'Knit upper · White / Red', price: 7650, category: 'shoes', image: 'assets/images/shop-shoe-03.jpg' },
  'pulse-air': { name: 'Pulse Air Trainer', detail: 'Cushioned sole · Black / Red', price: 8200, category: 'shoes', image: 'assets/images/shop-shoe-04.jpg' },
  'motion-white': { name: 'Motion White Runner', detail: 'Everyday fit · White / Red', price: 7400, category: 'shoes', image: 'assets/images/shop-shoe-05.jpg' },
  'night-run': { name: 'Night Run Trainer', detail: 'Supportive fit · Black / Red', price: 7950, category: 'shoes', image: 'assets/images/shop-shoe-06.jpg' },
  'street-knit': { name: 'Street Knit Slip-On', detail: 'Easy wear · Black / Red', price: 7150, category: 'shoes', image: 'assets/images/shop-shoe-07.jpg' },
  'cloud-sole': { name: 'Cloud Sole Trainer', detail: 'Sculpted sole · White / Red', price: 8450, category: 'shoes', image: 'assets/images/shop-shoe-08.jpg' },
  'ridge-grip': { name: 'Ridge Grip Trail Shoe', detail: 'Trail tread · Black / Red', price: 8950, category: 'shoes', image: 'assets/images/shop-shoe-09.jpg' },
};

const storageKey = 'stepsense-shop-cart';
const cartItemsElement = document.querySelector('[data-cart-items]');
const subtotalElement = document.querySelector('[data-subtotal]');
const cartCountElements = document.querySelectorAll('[data-cart-count]');
const totalCountElement = document.querySelector('[data-cart-total-count]');
const toast = document.querySelector('[data-shop-toast]');
let toastTimeout;
let cart = loadCart();

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return Object.fromEntries(
      Object.entries(saved).filter(([id, quantity]) =>
        Object.hasOwn(products, id) && Number.isInteger(quantity) && quantity > 0,
      ),
    );
  } catch (error) {
    console.warn('Could not load the saved shopping bag.', error);
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  } catch (error) {
    console.error('Could not save the shopping bag.', error);
    showToast('Your browser could not save the bag. Check storage settings.');
  }
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function renderCart() {
  const entries = Object.entries(cart);
  const itemCount = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const subtotal = entries.reduce((sum, [id, quantity]) => sum + products[id].price * quantity, 0);

  cartCountElements.forEach((element) => {
    element.textContent = itemCount;
    element.closest('.cart-link').setAttribute('aria-label', `Shopping bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`);
  });
  totalCountElement.textContent = `(${itemCount})`;
  subtotalElement.textContent = formatPrice(subtotal);

  if (entries.length === 0) {
    cartItemsElement.innerHTML = '<p class="empty-cart">Your bag is looking light. Add something you love.</p>';
    return;
  }

  cartItemsElement.innerHTML = entries.map(([id, quantity]) => {
    const product = products[id];

    return `<article class="cart-row" data-cart-row="${id}">
      <div class="cart-thumb"><img src="${product.image}" alt="" /></div>
      <div><h3>${product.name}</h3><p>${product.detail}</p>
        <div class="cart-controls">
          <button class="quantity-button" type="button" data-quantity="${id}" data-change="-1" aria-label="Remove one ${product.name}">−</button>
          <span class="quantity-value">${quantity}</span>
          <button class="quantity-button" type="button" data-quantity="${id}" data-change="1" aria-label="Add one ${product.name}">+</button>
          <button class="remove-item" type="button" data-remove="${id}">Remove</button>
        </div>
      </div>
      <span class="cart-row-price">${formatPrice(product.price * quantity)}</span>
    </article>`;
  }).join('');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

document.querySelectorAll('[data-add]').forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.dataset.add;
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    renderCart();
    showToast(`${products[id].name} added to your bag.`);
  });
});

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((filterButton) => {
      const selected = filterButton === button;
      filterButton.classList.toggle('is-selected', selected);
      filterButton.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('.product-card').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

cartItemsElement.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const { quantity: id, change, remove } = button.dataset;
  if (remove) {
    delete cart[remove];
  } else if (id) {
    cart[id] += Number(change);
    if (cart[id] <= 0) delete cart[id];
  }

  saveCart();
  renderCart();
});

document.querySelector('[data-checkout]').addEventListener('click', () => {
  document.querySelector('[data-checkout-note]').textContent = Object.keys(cart).length
    ? 'Checkout is not connected yet. Your bag is saved in this browser.'
    : 'Add an item to your bag before checking out.';
});

const loginDialog = document.querySelector('#login-dialog');
document.querySelector('.login-trigger').addEventListener('click', () => loginDialog.showModal());
document.querySelectorAll('[data-close-login]').forEach((button) => {
  button.addEventListener('click', () => loginDialog.close());
});
loginDialog.addEventListener('click', (event) => {
  if (event.target === loginDialog) loginDialog.close();
});

const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mainNav.classList.toggle('is-open', open);
});
mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    mainNav.classList.remove('is-open');
  });
});

renderCart();

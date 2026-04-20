// Constants
const IMAGE_FALLBACK_URL = 'https://via.placeholder.com/200?text=No+Image';
const INITIAL_CART_QUANTITY = 1;
const MIN_CART_QUANTITY = 0;
const QUANTITY_INCREMENT = 1;
const QUANTITY_DECREMENT = -1;
const INITIAL_SUMMARY_TOTAL = 0;
const INITIAL_SUMMARY_ITEM_COUNT = 0;

// Product prices
const PRICE_SNEAKERS = 1500;
const PRICE_HEADPHONES = 1000;
const PRICE_WATCH = 1500;
const PRICE_BACKPACK = 1000;

const products = [
  { id: 1, name: 'Sneakers', price: PRICE_SNEAKERS, image: 'Screenshot (42).png' },
  { id: 2, name: 'Headphones', price: PRICE_HEADPHONES, image: 'Screenshot (43).png' },
  { id: 3, name: 'Watch', price: PRICE_WATCH, image: 'Screenshot (44).png' },
  { id: 4, name: 'Backpack', price: PRICE_BACKPACK, image: 'Screenshot (45).png' }
];

const productsContainer = document.getElementById('products');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('total');

const appState = {
  cartItems: loadCartItems()
};

function loadCartItems() {
  const storedCart = localStorage.getItem('cart');
  return storedCart ? JSON.parse(storedCart) : [];
}

function persistCartItems() {
  localStorage.setItem('cart', JSON.stringify(appState.cartItems));
}

function findProduct(productId) {
  return products.find(product => product.id === productId);
}

function findCartItem(productId) {
  return appState.cartItems.find(item => item.id === productId);
}

// eslint-disable-next-line no-unused-vars
function addToCart(productId) {
   
  const cartItem = findCartItem(productId);
  if (cartItem) {
    cartItem.qty += QUANTITY_INCREMENT;
  } else {
    appState.cartItems.push({ id: productId, qty: INITIAL_CART_QUANTITY });
  }

  persistCartItems();
  renderCart();
}

function removeCartItem(productId) {
  appState.cartItems = appState.cartItems.filter(item => item.id !== productId);
  persistCartItems();
  renderCart();
}

// eslint-disable-next-line no-unused-vars
function updateCartItemQuantity(productId, delta) {
  const cartItem = findCartItem(productId);
  if (!cartItem) return;

  cartItem.qty += delta;
  if (cartItem.qty <= MIN_CART_QUANTITY) {
    removeCartItem(productId);
    return;
  }

  persistCartItems();
  renderCart();
}

// eslint-disable-next-line no-unused-vars
function clearCart() {
  appState.cartItems = [];
  persistCartItems();
  renderCart();
}

function calculateCartSummary() {
  return appState.cartItems.reduce(
    (summary, cartItem) => {
      const product = findProduct(cartItem.id);
      if (!product) return summary;

      summary.total += product.price * cartItem.qty;
      summary.itemCount += cartItem.qty;
      return summary;
    },
    { total: INITIAL_SUMMARY_TOTAL, itemCount: INITIAL_SUMMARY_ITEM_COUNT }
  );
}

function createProductCardMarkup(product) {
  return `
    <div class="product">
      <img
        src="${product.image}"
        alt="${product.name}"
        onerror="this.src='${IMAGE_FALLBACK_URL}'"
      />
      <h4>${product.name}</h4>
      <p>ksh.${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `;
}

function createCartItemMarkup(cartItem) {
  const product = findProduct(cartItem.id);
  if (!product) return '';

  const itemTotal = product.price * cartItem.qty;

  return `
    <div class="cart-item">
      <strong>${product.name}</strong><br>
      ksh.${product.price} x ${cartItem.qty} = ksh.${itemTotal}
      <div>
        <button class="qty-btn" onclick="updateCartItemQuantity(${cartItem.id}, ${QUANTITY_DECREMENT})">-</button>
        <button class="qty-btn" onclick="updateCartItemQuantity(${cartItem.id}, ${QUANTITY_INCREMENT})">+</button>
        <button onclick="removeCartItem(${cartItem.id})">Remove</button>
      </div>
    </div>
    <hr/>
  `;
}
function renderProducts() {
  productsContainer.innerHTML = products.map(createProductCardMarkup).join('');
}

function renderCart() {
  cartItemsContainer.innerHTML = appState.cartItems.map(createCartItemMarkup).join('');

  const cartSummary = calculateCartSummary();
  cartCountElement.textContent = cartSummary.itemCount;
  cartTotalElement.textContent = cartSummary.total;
}

function initApp() {
  renderProducts();
  renderCart();
}

initApp();


//Basic logging
console.log('App initialized with products:', products);
console.log('Initial cart items:', appState.cartItems);
console.log('Initial cart summary:', calculateCartSummary());
// Style logging
console.log('%cApp initialized with products:', 'color: green; font-weight: bold;', products);
console.log('%cInitial cart items:', 'color: blue; font-weight: bold;', appState.cartItems);
console.log('%cInitial cart summary:', 'color: purple; font-weight: bold;', calculateCartSummary());
// Warning and errors
console.warn('This is a warning message about cart functionality.');
console.error('This is an error message about cart functionality.');

// Tables for arrays and objects
console.table(products);
console.table(appState.cartItems);
console.table(calculateCartSummary());

// Grouping related logs
console.group('Cart Summary');
console.log('Total items in cart:', calculateCartSummary().itemCount);
console.log('Total price of cart:', calculateCartSummary().total);
console.groupEnd();

//Timing
console.time('Render Cart Time');
 renderCart();
console.timeEnd('Render Cart Time'); 

//conditional logging
if (appState.cartItems.length === 0) {
  console.warn('Cart is currently empty.');
}
console.assert(appState.cartItems.length >= 0, 'Cart items should be an array');
console.assert(typeof calculateCartSummary().total === 'number', 'Cart total should be a number');

// eslint-disable-next-line no-unused-vars
function logCartUpdate() {
  console.trace('Cart updated');
}

// PRODUCTS
const products = [
  { id: 1, name: "Sneakers", price: 50, image: "https://via.placeholder.com/200" },
  { id: 2, name: "Headphones", price: 80, image: "https://via.placeholder.com/200" },
  { id: 3, name: "Watch", price: 120, image: "https://via.placeholder.com/200" },
  { id: 4, name: "Backpack", price: 40, image: "https://via.placeholder.com/200" }
];

// STATE
let state = {
  cart: JSON.parse(localStorage.getItem('cart')) || []
};

// SAVE STATE
function saveState() {
  localStorage.setItem('cart', JSON.stringify(state.cart));
}

// RENDER PRODUCTS
function renderProducts() {
  const container = document.getElementById('products');
  container.innerHTML = '';

  products.forEach(p => {
    container.innerHTML += `
      <div class="product">
        <img src="${p.image}" />
        <h4>${p.name}</h4>
        <p>$${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
  });
}

// ADD TO CART
function addToCart(id) {
  const item = state.cart.find(i => i.id === id);
  if (item) {
    item.qty++;
  } else {
    state.cart.push({ id, qty: 1 });
  }
  saveState();
  renderCart();
}

// REMOVE ITEM
function removeItem(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  saveState();
  renderCart();
}

// CHANGE QTY
function changeQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) removeItem(id);

  saveState();
  renderCart();
}

// CLEAR CART
function clearCart() {
  state.cart = [];
  saveState();
  renderCart();
}

// RENDER CART
function renderCart() {
  const container = document.getElementById('cart-items');
  const count = document.getElementById('cart-count');
  const totalEl = document.getElementById('total');

  container.innerHTML = '';

  let total = 0;
  let itemCount = 0;

  state.cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    const subtotal = product.price * item.qty;

    total += subtotal;
    itemCount += item.qty;

    container.innerHTML += `
      <div>
        <strong>${product.name}</strong><br>
        $${product.price} x ${item.qty}
        <div>
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          <button onclick="removeItem(${item.id})">Remove</button>
        </div>
      </div>
      <hr/>
    `;
  });

  totalEl.textContent = total;
  count.textContent = itemCount;
}

// INIT
renderProducts();
renderCart();

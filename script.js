const products = [
  { id: 1, name: "T-shirt", price: 10, image: "tshirt.jpg" },
  { id: 2, name: "Shoes", price: 25, image: "shoes.jpg" },
  { id: 3, name: "Hat", price: 15, image: "hat.jpg" },
];

const cart = [];
let filteredProducts = [...products];
function renderProducts() {
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "";
  filteredProducts.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <label>
        Qty: 
        <input type="number" min="1" value="1" id="qty-${product.id}" style="width: 50px;" />
      </label>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productsDiv.appendChild(div);
  });
}

function login() {
  const input = document.getElementById("username-input");
  const name = input.value.trim();
  if (name.length === 0) {
    alert("Please enter your name");
    return;
  }
  localStorage.setItem("username", name);
  updateLoginUI();
}

function logout() {
  localStorage.removeItem("username");
  updateLoginUI();
}

function updateLoginUI() {
  const username = localStorage.getItem("username");
  const loginSection = document.getElementById("login-section");
  const welcomeMsg = document.getElementById("welcome-msg");
  const logoutBtn = document.getElementById("logout-btn");
  const usernameInput = document.getElementById("username-input");

  if (username) {
    usernameInput.style.display = "none";
    loginSection.querySelector("button").style.display = "none"; // hide login button
    welcomeMsg.textContent = `Welcome, ${username}!`;
    welcomeMsg.style.display = "block";
    logoutBtn.style.display = "inline-block";
  } else {
    usernameInput.style.display = "inline-block";
    loginSection.querySelector("button").style.display = "inline-block"; // show login button
    welcomeMsg.style.display = "none";
    logoutBtn.style.display = "none";
  }
}

function filterProducts() {
  const query = document.getElementById("search-input").value.toLowerCase();
  filteredProducts = products.filter(p => p.name.toLowerCase().includes(query));
  renderProducts();
}

function addToCart(productId) {
  const qtyInput = document.getElementById(`qty-${productId}`);
  const quantity = parseInt(qtyInput.value);
  if (quantity <= 0 || isNaN(quantity)) {
    alert("Please enter a valid quantity!");
    return;
  }

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, quantity });
  }
  renderCart();
  qtyInput.value = 1; // reset qty input
}

function renderCart() {
  const cartList = document.getElementById("cart");
  const totalPriceEl = document.getElementById("total-price");
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = "<li>Your cart is empty 🛒</li>";
    totalPriceEl.textContent = "Total: $0";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x ${item.quantity} — $${item.price * item.quantity}
      <button onclick="removeFromCart(${item.id})" style="margin-left: 10px; background: #e74c3c; border:none; color:white; border-radius: 4px; cursor:pointer;">Remove</button>
    `;
    cartList.appendChild(li);
  });

  totalPriceEl.textContent = `Total: $${total.toFixed(2)}`;
}

function removeFromCart(productId) {
  const index = cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
  }
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert(`🎉 Thanks for buying! Your total is $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}`);
  cart.length = 0;
  renderCart();
}
// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
  const saved = localStorage.getItem('cart');
  if (saved) {
    const parsed = JSON.parse(saved);
    cart.length = 0; // clear existing
    parsed.forEach(item => cart.push(item));
  }
}

function addToCart(productId) {
  const qtyInput = document.getElementById(`qty-${productId}`);
  const quantity = parseInt(qtyInput.value);
  if (quantity <= 0 || isNaN(quantity)) {
    alert("Please enter a valid quantity!");
    return;
  }

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, quantity });
  }
  saveCart();
  renderCart();
  qtyInput.value = 1; // reset qty input
}


loadCart();
renderProducts();
renderCart();

updateLoginUI();

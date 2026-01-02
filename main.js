// ==========================
// CONFIG (SAFE VARIABLES)
// ==========================

const CAFE_NAME = "The Litaz House";
const WHATSAPP_NUMBER = "9561918307";

// ==========================
// GLOBAL STATE
// ==========================

let cart = [];
let currentCategory = "";

// ==========================
// INIT
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderMenu(menuData[0].category);
});

// ==========================
// CATEGORY RENDER
// ==========================

function renderCategories() {
  const categoryContainer = document.getElementById("categoryContainer");
  categoryContainer.innerHTML = "";

  menuData.forEach((cat, index) => {
    const btn = document.createElement("button");
    btn.innerText = cat.category;
    btn.className = index === 0 ? "category-btn active" : "category-btn";

    btn.onclick = () => {
      document
        .querySelectorAll(".category-btn")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      renderMenu(cat.category);
    };

    categoryContainer.appendChild(btn);
  });
}

// ==========================
// MENU RENDER
// ==========================

function renderMenu(categoryName) {
  currentCategory = categoryName;
  const menuContainer = document.getElementById("menuContainer");
  menuContainer.innerHTML = "";

  const category = menuData.find(c => c.category === categoryName);
  if (!category) return;

  category.items.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-card";

    card.innerHTML = `
      <div class="menu-info">
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
        <button onclick="addToCart(${item.id})">Add</button>
      </div>
    `;

    menuContainer.appendChild(card);
  });
}

// ==========================
// CART LOGIC
// ==========================

function addToCart(itemId) {
  const item = menuData
    .flatMap(c => c.items)
    .find(i => i.id === itemId);

  if (!item) return;

  const existing = cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  renderCart();
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  renderCart();
}

function renderCart() {
  const cartContainer = document.getElementById("cartItems");
  const totalPriceEl = document.getElementById("totalPrice");

  cartContainer.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <span>${item.name} × ${item.qty}</span>
      <span>₹${item.price * item.qty}</span>
      <button onclick="removeFromCart(${item.id})">✕</button>
    `;

    cartContainer.appendChild(div);
  });

  totalPriceEl.innerText = "₹" + total;
}

// ==========================
// WHATSAPP ORDER
// ==========================

function sendWhatsAppOrder() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  let message = `Hello ${CAFE_NAME},%0A%0A`;
  message += `I want to place an order:%0A`;

  cart.forEach(item => {
    message += `• ${item.name} × ${item.qty} = ₹${item.price * item.qty}%0A`;
  });

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  message += `%0ATotal: ₹${total}%0A%0AThank you!`;

  const url = `https://wa.me/91${WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, "_blank");
}
// ==========================
// BOOKING WHATSAPP
// ==========================

function sendBookingRequest() {
  const message =
    `Hello The Litaz House,%0A%0A` +
    `I would like to book a small celebration.%0A` +
    `Occasion: Birthday / Anniversary / Friends Meet%0A` +
    `People: Up to 6%0A%0A` +
    `Please let me know available time slots.%0A%0AThank you!`;

  const url = `https://wa.me/919561918307?text=${message}`;
  window.open(url, "_blank");
}

// ================= GLOBAL STATE =================
let cart = [];
let currentCategory = "";

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
});

// ================= CATEGORY RENDER =================
function renderCategories() {
  const container = document.getElementById("categoryContainer");
  container.innerHTML = "";

  const categories = [...new Set(menuData.map(item => item.category))];
  currentCategory = categories[0];

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.innerText = cat;
    btn.onclick = () => {
      currentCategory = cat;
      renderMenu();
    };
    container.appendChild(btn);
  });

  renderMenu();
}

// ================= MENU RENDER =================
function renderMenu() {
  const menuContainer = document.getElementById("menuContainer");
  menuContainer.innerHTML = "";

  menuData
    .filter(item => item.category === currentCategory)
    .forEach(item => {
      const card = document.createElement("div");
      card.className = "menu-card";

      card.innerHTML = `
        <h3>${item.name}</h3>
        <p class="price">₹${item.price}</p>
        <button onclick="addToCart('${item.name}', ${item.price})">
          Add to Cart
        </button>
      `;

      menuContainer.appendChild(card);
    });
}

// ================= CART LOGIC =================
function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  renderCart();
}

function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.name !== name);
  }
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const totalPrice = document.getElementById("totalPrice");
  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item.name}</span>
        <div class="qty">
          <button onclick="changeQty('${item.name}', -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.name}', 1)">+</button>
        </div>
      </div>
    `;
  });

  totalPrice.innerText = `₹${total}`;
}

// ================= WHATSAPP ORDER =================
function sendWhatsAppOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  let message = `🛒 *New Order – The Litaz House*%0A%0A`;

  cart.forEach(item => {
    message += `• ${item.name} x${item.qty} = ₹${item.price * item.qty}%0A`;
  });

  message += `%0A📍 Pickup: Cafe%0A💬 Please confirm`;

  window.open(
    `https://wa.me/919561918307?text=${message}`,
    "_blank"
  );
}

// ================= BOOKING =================
function sendBookingRequest() {
  const msg = `🎉 *Celebration Booking Enquiry*%0A%0AType: Birthday / Anniversary / Friends Meet%0A👥 Guests: Up to 6%0A🕒 Please share available slots.`;

  window.open(
    `https://wa.me/919561918307?text=${msg}`,
    "_blank"
  );
}


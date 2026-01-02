// ================= GLOBAL STATE =================
let cart = [];
let currentCategory = "";

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  if (typeof menuData !== 'undefined' && menuData.length > 0) {
    currentCategory = menuData[0].category;
    renderCategories();
    renderMenu(currentCategory);
  }
});

// ================= CATEGORY RENDER =================
function renderCategories() {
  const categoryContainer = document.getElementById("categoryContainer");
  if (!categoryContainer) return;
  categoryContainer.innerHTML = "";

  menuData.forEach((cat, index) => {
    const btn = document.createElement("button");
    btn.innerText = cat.category;
    btn.className = "category-btn";

    if (cat.category === currentCategory) {
      btn.classList.add("active");
    }

    btn.onclick = () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = cat.category;
      renderMenu(currentCategory);
    };

    categoryContainer.appendChild(btn);
  });
}

// ================= MENU RENDER =================
function renderMenu(categoryName) {
  const menuContainer = document.getElementById("menuContainer");
  if (!menuContainer) return;
  menuContainer.innerHTML = "";

  const categoryObj = menuData.find(cat => cat.category === categoryName);
  if (!categoryObj) return;

  categoryObj.items.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-item";

    // Check if item is already in cart to show correct qty
    const cartItem = cart.find(i => i.id === item.id);
    const displayQty = cartItem ? cartItem.qty : 0;

    card.innerHTML = `
      <h3>${item.name}</h3>
      <p class="price">₹${item.price}</p>
      <div class="qty-controls">
        <button onclick="changeQty(${item.id}, -1)">−</button>
        <span id="qty-${item.id}">${displayQty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;
    menuContainer.appendChild(card);
  });
}

// ================= CART & QTY LOGIC =================
function changeQty(itemId, delta) {
  // Find item details from menuData
  let itemDetails = null;
  menuData.forEach(cat => {
    const found = cat.items.find(i => i.id === itemId);
    if (found) itemDetails = found;
  });

  const cartItem = cart.find(i => i.id === itemId);

  if (cartItem) {
    cartItem.qty += delta;
    if (cartItem.qty <= 0) {
      cart = cart.filter(i => i.id !== itemId);
    }
  } else if (delta > 0) {
    cart.push({ ...itemDetails, qty: 1 });
  }

  // Update UI
  const qtySpan = document.getElementById(`qty-${itemId}`);
  if (qtySpan) {
    const updatedItem = cart.find(i => i.id === itemId);
    qtySpan.innerText = updatedItem ? updatedItem.qty : 0;
  }

  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const totalPrice = document.getElementById("totalPrice");
  if (!cartItems || !totalPrice) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    cartItems.innerHTML += `
      <div class="cart-item" style="display:flex; justify-content:space-between; margin-bottom:5px;">
        <span>${item.name} x${item.qty}</span>
        <span>₹${item.price * item.qty}</span>
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
  let total = 0;

  cart.forEach(item => {
    message += `• ${item.name} x${item.qty} = ₹${item.price * item.qty}%0A`;
    total += item.price * item.qty;
  });

  message += `%0A💰 *Total: ₹${total}*%0A📍 Pickup: Cafe%0A💬 Please confirm my order!`;

  window.open(`https://wa.me/919561918307?text=${message}`, "_blank");
}

function sendBookingRequest() {
  const msg = `🎉 *Celebration Booking Enquiry*%0A%0AType: Birthday / Anniversary / Friends Meet%0A👥 Guests: Up to 6%0A🕒 Please share available slots.`;
  window.open(`https://wa.me/919561918307?text=${encodeURIComponent(msg)}`, "_blank");
}

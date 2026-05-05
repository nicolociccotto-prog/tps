document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.getElementById("products-grid");
  const favoritesGrid = document.getElementById("favorites-grid");
  const cartGrid = document.getElementById("cart-grid");

  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort");
  const darkToggle = document.getElementById("dark-toggle");

  const cartTotal = document.getElementById("cart-total");
  const clearCartBtn = document.getElementById("clear-cart");
  const checkoutBtn = document.getElementById("checkout-btn");

  // ---- TOAST ----
  const toast = document.getElementById("toast");

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove("hidden");

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(() => {
      toast.classList.add("hidden");
    }, 2200);
  }

  // ---- FORM ----
  const contactForm = document.getElementById("contact-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      let valid = true;

      // Reset errori
      nameError.textContent = "";
      emailError.textContent = "";
      messageError.textContent = "";

      const nameValue = nameInput.value.trim();
      const emailValue = emailInput.value.trim();
      const messageValue = messageInput.value.trim();

      if (!nameValue) {
        nameError.textContent = "Inserisci il tuo nome";
        valid = false;
      }

      if (!emailValue) {
        emailError.textContent = "Inserisci la tua email";
        valid = false;
      } else if (!validateEmail(emailValue)) {
        emailError.textContent = "Email non valida";
        valid = false;
      }

      if (!messageValue) {
        messageError.textContent = "Inserisci un messaggio";
        valid = false;
      }

      if (!valid) return;

      contactForm.reset();
      showToast("Messaggio inviato con successo");
    });
  }

  // ---- MODALE ----
  const modal = document.getElementById("plugin-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const modalImage = document.getElementById("modal-image");
  const modalTitle = document.getElementById("modal-title");
  const modalBrand = document.getElementById("modal-brand");
  const modalPrice = document.getElementById("modal-price");
  const modalCategory = document.getElementById("modal-category");
  const modalDescription = document.getElementById("modal-description");

  if (!productsGrid || !favoritesGrid || !cartGrid) {
    console.error("Elementi HTML mancanti");
    return;
  }

  // ---- DARK MODE ----
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }

  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    });
  }

  // ---- FAVORITI ----
  const FAVORITES_KEY = "favorites";
  let favoritesIds = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

  const isFavorite = (id) => favoritesIds.includes(id);

  function toggleFavorite(id) {
    if (isFavorite(id)) {
      favoritesIds = favoritesIds.filter((x) => x !== id);
      showToast("Rimosso dai preferiti");
    } else {
      favoritesIds.push(id);
      showToast("Aggiunto ai preferiti");
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesIds));
    renderAll();
  }

  // ---- CARRELLO ----
  const CART_KEY = "cart";
  let cartIds = JSON.parse(localStorage.getItem(CART_KEY)) || [];

  const isInCart = (id) => cartIds.includes(id);

  function toggleCart(id) {
    if (!isInCart(id)) {
      cartIds.push(id);
      localStorage.setItem(CART_KEY, JSON.stringify(cartIds));
      showToast("Aggiunto al carrello");
      renderAll();
    } else {
      showToast("Già presente nel carrello");
    }
  }

  function clearCart() {
    cartIds = [];
    localStorage.setItem(CART_KEY, JSON.stringify(cartIds));
    showToast("Carrello svuotato");
    renderAll();
  }

  // ---- DATI ----
  let products = [];

  const descriptions = {
    "Zenology": "Synth moderno ispirato all’eredità Roland",
    "Serum": "Wavetable synth iconico per sound design",
    "Xpand!2": "Preset rapidi e workflow immediato",
    "Analog Lab V": "Collezione premium di synth",
    "Nexus": "Preset commerciali radio-ready",
    "FabFilter Pro Q4": "EQ professionale",
    "Portal": "Effetto granulare creativo",
    "Thermal": "Distorsore avanzato",
    "Evermotion": "Texture cinematiche",
    "Triton": "Suoni workstation classici"
  };

  async function loadProducts() {
    try {
      const res = await fetch("products.json", { cache: "no-store" });

      if (!res.ok) throw new Error("Errore fetch");

      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("JSON non valido");

      products = data.map((p) => ({
        id: Number(p.id),
        name: String(p.name),
        brand: String(p.brand),
        category: String(p.category),
        price: Number(p.price),
        image: String(p.image)
      }));

      renderAll();

    } catch (err) {
      console.error(err);
      productsGrid.textContent = "Errore caricamento prodotti";
    }
  }

  // ---- FILTRI ----
  function getFilteredSortedProducts() {
    const q = searchInput.value.trim().toLowerCase();

    let list = products.filter((p) => {
      return `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q);
    });

    const sort = sortSelect.value;

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }

  // ---- MODALE ----
  function openModal(product) {
    modalImage.src = product.image;
    modalImage.alt = product.name;

    modalTitle.textContent = product.name;
    modalBrand.textContent = `Brand: ${product.brand}`;
    modalPrice.textContent = `Prezzo: € ${product.price}`;
    modalCategory.textContent = `Categoria: ${product.category}`;
    modalDescription.textContent =
      descriptions[product.name] ||
      "Plugin professionale per produzione musicale";

    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  closeModalBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // ---- CARD ----
  function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.brand}</p>
      <p>€ ${product.price}</p>
    `;

    const detailsBtn = document.createElement("button");
    detailsBtn.className = "details-btn";
    detailsBtn.textContent = "Dettagli";
    detailsBtn.addEventListener("click", () => openModal(product));

    const favBtn = document.createElement("button");
    favBtn.className = "fav-btn";
    favBtn.textContent = isFavorite(product.id) ? "♥" : "♡";

    if (isFavorite(product.id)) {
      favBtn.classList.add("is-fav");
    }

    favBtn.addEventListener("click", () => toggleFavorite(product.id));

    const cartBtn = document.createElement("button");
    cartBtn.className = "cart-btn";
    cartBtn.textContent = "🛒";
    cartBtn.addEventListener("click", () => toggleCart(product.id));

    card.appendChild(detailsBtn);
    card.appendChild(favBtn);
    card.appendChild(cartBtn);

    return card;
  }

  // ---- RENDER ----
  function renderProductsGrid(list) {
    productsGrid.innerHTML = "";

    if (list.length === 0) {
      productsGrid.innerHTML = "<p>Nessun risultato</p>";
      return;
    }

    list.forEach((p) => productsGrid.appendChild(createProductCard(p)));
  }

  function renderFavoritesGrid() {
    favoritesGrid.innerHTML = "";

    const favProducts = products.filter((p) => isFavorite(p.id));

    if (favProducts.length === 0) {
      favoritesGrid.innerHTML = "<p>Nessun plugin nei preferiti</p>";
      return;
    }

    favProducts.forEach((p) => favoritesGrid.appendChild(createProductCard(p)));
  }

  function renderCart() {
    cartGrid.innerHTML = "";

    const cartProducts = products.filter((p) => cartIds.includes(p.id));

    if (cartProducts.length === 0) {
      cartGrid.innerHTML = "<p>Il carrello è vuoto</p>";
      cartTotal.textContent = "Totale: € 0";
      return;
    }

    let total = 0;

    cartProducts.forEach((p) => {
      total += p.price;
      cartGrid.appendChild(createProductCard(p));
    });

    cartTotal.textContent = `Totale: € ${total}`;
  }

  function renderAll() {
    renderProductsGrid(getFilteredSortedProducts());
    renderFavoritesGrid();
    renderCart();
  }

  // ---- EVENTI ----
  searchInput.addEventListener("input", renderAll);
  sortSelect.addEventListener("change", renderAll);

  clearCartBtn.addEventListener("click", clearCart);

  checkoutBtn.addEventListener("click", () => {
    showToast("Acquisto completato con successo");
    clearCart();
  });

  // ---- START ----
  loadProducts();
});

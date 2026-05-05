document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.getElementById("products-grid");
  const favoritesGrid = document.getElementById("favorites-grid");
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort");
  const darkToggle = document.getElementById("dark-toggle");

  // ---- MODALE ----
  const modal = document.getElementById("plugin-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const modalImage = document.getElementById("modal-image");
  const modalTitle = document.getElementById("modal-title");
  const modalBrand = document.getElementById("modal-brand");
  const modalPrice = document.getElementById("modal-price");
  const modalCategory = document.getElementById("modal-category");
  const modalDescription = document.getElementById("modal-description");

  if (!productsGrid || !favoritesGrid || !searchInput || !sortSelect) {
    console.error("Manca qualche id in HTML: products-grid / favorites-grid / search / sort");
    return;
  }

  // ---- Dark mode persistente ----
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }

  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
      );
    });
  }

  // ---- Favoriti ----
  const FAVORITES_KEY = "favorites";
  let favoritesIds = [];

  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY));
    favoritesIds = Array.isArray(saved) ? saved : [];
  } catch {
    favoritesIds = [];
  }

  const isFavorite = (id) => favoritesIds.includes(id);

  const saveFavorites = () => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesIds));
  };

  const toggleFavorite = (id) => {
    if (isFavorite(id)) {
      favoritesIds = favoritesIds.filter((x) => x !== id);
    } else {
      favoritesIds.push(id);
    }

    saveFavorites();
    renderAll();
  };

  // ---- Prodotti ----
  let products = [];

  // ---- Descrizioni per modale ----
  const descriptions = {
    "Zenology": "Synth moderno ispirato all’eredità Roland, perfetto per elettronica, trap e pop",
    "Serum": "Wavetable synth tra i più usati al mondo, ideale per bassi, lead e sound design avanzato",
    "Xpand!2": "Plugin versatile con moltissimi preset pronti all’uso e workflow veloce",
    "Analog Lab V": "Raccolta premium di synth vintage e moderni con libreria enorme",
    "Nexus": "Rompler iconico per preset commerciali, trap, dance e produzioni radio-ready",
    "FabFilter Pro Q4": "Equalizzatore professionale preciso e intuitivo per mix e mastering",
    "Portal": "Effetto granulare creativo per trasformare qualsiasi suono",
    "Thermal": "Distorsore avanzato per saturazione aggressiva e sound design",
    "Evermotion": "Libreria cinematica con texture emotive e ambienti sonori",
    "Triton": "Workstation storica con timbri classici ancora amatissimi"
  };

  async function loadProducts() {
    try {
      const res = await fetch("products.json", { cache: "no-store" });

      if (!res.ok) {
        throw new Error(`Fetch products.json fallito: ${res.status}`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("products.json non è un array");
      }

      products = data
        .filter((p) => p && typeof p === "object")
        .map((p) => ({
          id: Number(p.id),
          name: String(p.name ?? ""),
          brand: String(p.brand ?? ""),
          category: String(p.category ?? ""),
          price: Number(p.price ?? 0),
          image: String(p.image ?? "")
        }))
        .filter((p) => Number.isFinite(p.id) && p.name.length > 0);

      renderAll();

    } catch (err) {
      console.error(err);
      productsGrid.textContent = "Errore nel caricamento dei prodotti";
    }
  }

  // ---- Ricerca + sort ----
  function getFilteredSortedProducts() {
    const q = searchInput.value.trim().toLowerCase();
    let list = products;

    if (q.length > 0) {
      list = list.filter((p) => {
        const haystack = `${p.name} ${p.brand} ${p.category}`.toLowerCase();
        return haystack.includes(q);
      });
    }

    const sort = sortSelect.value;
    const copy = [...list];

    if (sort === "price-asc") {
      copy.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
      copy.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      copy.sort((a, b) => a.name.localeCompare(b.name));
    }

    return copy;
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
      "Plugin professionale progettato per migliorare workflow creativo e qualità sonora";

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  // ---- Card ----
  function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;

    const title = document.createElement("h3");
    title.textContent = product.name;

    const brand = document.createElement("p");
    brand.textContent = product.brand;

    const price = document.createElement("p");
    price.textContent = `€ ${product.price}`;

    // ---- Dettagli ----
    const detailsBtn = document.createElement("button");
    detailsBtn.type = "button";
    detailsBtn.className = "details-btn";
    detailsBtn.textContent = "Dettagli";

    detailsBtn.addEventListener("click", () => {
      openModal(product);
    });

    // ---- Preferiti ----
    const favBtn = document.createElement("button");
    favBtn.type = "button";
    favBtn.className = "fav-btn";

    const favOn = isFavorite(product.id);

    favBtn.textContent = favOn ? "♥" : "♡";

    if (favOn) {
      favBtn.classList.add("is-fav");
    }

    favBtn.setAttribute(
      "aria-label",
      favOn ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"
    );

    favBtn.addEventListener("click", () => {
      toggleFavorite(product.id);
    });

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(brand);
    card.appendChild(price);
    card.appendChild(detailsBtn);
    card.appendChild(favBtn);

    return card;
  }

  function renderProductsGrid(list) {
    productsGrid.innerHTML = "";

    if (list.length === 0) {
      const msg = document.createElement("p");
      msg.textContent = "Nessun risultato";
      productsGrid.appendChild(msg);
      return;
    }

    list.forEach((product) => {
      productsGrid.appendChild(createProductCard(product));
    });
  }

  function renderFavoritesGrid() {
    favoritesGrid.innerHTML = "";

    const favProducts = products.filter((p) => isFavorite(p.id));

    if (favProducts.length === 0) {
      const msg = document.createElement("p");
      msg.textContent = "Nessun plugin nei preferiti";
      favoritesGrid.appendChild(msg);
      return;
    }

    favProducts.forEach((product) => {
      favoritesGrid.appendChild(createProductCard(product));
    });
  }

  function renderAll() {
    renderProductsGrid(getFilteredSortedProducts());
    renderFavoritesGrid();
  }

  // ---- Eventi ----
  searchInput.addEventListener("input", renderAll);
  sortSelect.addEventListener("change", renderAll);

  // ---- Start ----
  loadProducts();
});

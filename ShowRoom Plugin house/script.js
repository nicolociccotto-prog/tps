document.addEventListener("DOMContentLoaded", () => {
  // ====== DOM ======
  const productsGrid = document.getElementById("products-grid");
  const favoritesGrid = document.getElementById("favorites-grid");
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort");
  const darkToggle = document.getElementById("dark-toggle");

  // Controllo base (se manca qualcosa, non esplode tutto)
  if (!productsGrid || !favoritesGrid || !searchInput || !sortSelect) {
    console.error("Manca qualche id in HTML: products-grid / favorites-grid / search / sort");
    return;
  }

  // ====== DARK MODE (persistente) ======
  const darkSaved = localStorage.getItem("darkMode");
  if (darkSaved === "true") document.body.classList.add("dark");

  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    });
  }

  // ====== FAVORITES (persistenti) ======
  const FAVORITES_KEY = "favorites";
  let favoritesIds = [];
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY));
    favoritesIds = Array.isArray(saved) ? saved : [];
  } catch {
    favoritesIds = [];
  }

  function isFavorite(id) {
    return favoritesIds.includes(id);
  }

  function saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesIds));
  }

  function toggleFavorite(id) {
    if (isFavorite(id)) {
      favoritesIds = favoritesIds.filter(x => x !== id);
    } else {
      favoritesIds.push(id);
    }
    saveFavorites();
    renderAll();
  }

  // ====== DATA ======
  let products = [];

  async function loadProducts() {
    try {
      const res = await fetch("products.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`Fetch products.json fallito: ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("products.json non è un array");
      // Normalizziamo
      products = data
        .filter(p => p && typeof p === "object")
        .map(p => ({
          id: Number(p.id),
          name: String(p.name ?? ""),
          brand: String(p.brand ?? ""),
          category: String(p.category ?? ""),
          price: Number(p.price ?? 0),
          image: String(p.image ?? "")
        }))
        .filter(p => Number.isFinite(p.id) && p.name.length > 0);
      renderAll();
    } catch (err) {
      console.error(err);
      productsGrid.textContent = "Errore nel caricamento dei prodotti";
    }
  }

  // ====== FILTER + SORT ======
  function getFilteredSortedProducts() {
    const q = searchInput.value.trim().toLowerCase();
    let list = products;

    // filtro ricerca su name + brand + category
    if (q.length > 0) {
      list = list.filter(p => {
        const hay = `${p.name} ${p.brand} ${p.category}`.toLowerCase();
        return hay.includes(q);
      });
    }

    // ordinamento
    const sort = sortSelect.value;
    const copy = [...list];

    if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
    if (sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name));

    return copy;
  }

  // ====== RENDER (sicuro: textContent, createElement) ======
  function createProductCard(p) {
    const card = document.createElement("article");
    card.className = "product-card";

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;

    const title = document.createElement("h3");
    title.textContent = p.name;

    const brand = document.createElement("p");
    brand.textContent = p.brand;

    const price = document.createElement("p");
    price.textContent = `€ ${p.price}`;

    const favBtn = document.createElement("button");
    favBtn.type = "button";
    favBtn.dataset.id = String(p.id);
    favBtn.setAttribute("aria-label", isFavorite(p.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti");
    favBtn.textContent = isFavorite(p.id) ? "❤️ Nei preferiti" : "🤍 Aggiungi ai preferiti";

    favBtn.addEventListener("click", () => toggleFavorite(p.id));

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(brand);
    card.appendChild(price);
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
    list.forEach(p => productsGrid.appendChild(createProductCard(p)));
  }

  function renderFavoritesGrid() {
    favoritesGrid.innerHTML = "";
    const favProducts = products.filter(p => isFavorite(p.id));

    if (favProducts.length === 0) {
      const msg = document.createElement("p");
      msg.textContent = "Nessun plugin nei preferiti";
      favoritesGrid.appendChild(msg);
      return;
    }
    favProducts.forEach(p => favoritesGrid.appendChild(createProductCard(p)));
  }

  function renderAll() {
    const list = getFilteredSortedProducts();
    renderProductsGrid(list);
    renderFavoritesGrid();
  }

  // ====== EVENTS ======
  searchInput.addEventListener("input", renderAll);
  sortSelect.addEventListener("change", renderAll);

  // ====== START ======
  loadProducts();
});

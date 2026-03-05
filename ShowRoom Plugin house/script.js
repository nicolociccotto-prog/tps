document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.getElementById("products-grid");
  const favoritesGrid = document.getElementById("favorites-grid");
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort");
  const darkToggle = document.getElementById("dark-toggle");

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
      localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    });
  }

  // ---- Favoriti (salvo solo gli ID) ----
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
      favoritesIds = favoritesIds.filter(x => x !== id);
    } else {
      favoritesIds.push(id);
    }
    saveFavorites();
    renderAll();
  };

  // ---- Caricamento prodotti ----
  let products = [];

  async function loadProducts() {
    try {
      const res = await fetch("products.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`Fetch products.json fallito: ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("products.json non è un array");

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

  // ---- filtro + sort ----
  function getFilteredSortedProducts() {
    const q = searchInput.value.trim().toLowerCase();
    let list = products;

    if (q.length > 0) {
      list = list.filter(p => {
        const hay = `${p.name} ${p.brand} ${p.category}`.toLowerCase();
        return hay.includes(q);
      });
    }

    const sort = sortSelect.value;
    const copy = [...list];

    if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
    if (sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name));

    return copy;
  }

  // ---- card ----
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

    // bottone dettagli (per ora non fa nulla, ma non lo perdi)
    const detailsBtn = document.createElement("button");
    detailsBtn.type = "button";
    detailsBtn.textContent = "Dettagli";
    detailsBtn.style.borderRadius = "999px";
    detailsBtn.style.border = "1px solid var(--accent-color)";
    detailsBtn.style.background = "transparent";
    detailsBtn.style.color = "var(--accent-color)";
    detailsBtn.style.padding = "8px 16px";
    detailsBtn.style.cursor = "pointer";
    detailsBtn.style.transition = "var(--transition)";

    // cuore in basso a destra
    const favBtn = document.createElement("button");
    favBtn.type = "button";
    favBtn.className = "fav-btn";
    favBtn.setAttribute("aria-label", isFavorite(p.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti");
    favBtn.textContent = "♥";

    if (isFavorite(p.id)) favBtn.classList.add("is-fav");

    favBtn.addEventListener("click", () => toggleFavorite(p.id));

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
    renderProductsGrid(getFilteredSortedProducts());
    renderFavoritesGrid();
  }

  searchInput.addEventListener("input", renderAll);
  sortSelect.addEventListener("change", renderAll);

  loadProducts();
});

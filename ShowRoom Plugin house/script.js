// =======================
// DATI PRODOTTI
// =======================

const products = [
  {
    id: 1,
    name: "Serum",
    brand: "Xfer Records",
    price: 189,
    image: "https://via.placeholder.com/300x200?text=Serum"
  },
  {
    id: 2,
    name: "RC-20",
    brand: "XLN Audio",
    price: 99,
    image: "https://via.placeholder.com/300x200?text=RC-20"
  },
  {
    id: 3,
    name: "Valhalla VintageVerb",
    brand: "Valhalla DSP",
    price: 50,
    image: "https://via.placeholder.com/300x200?text=VintageVerb"
  }
]

// =======================
// SELEZIONE GRIGLIA
// =======================

const productsGrid = document.getElementById("products-grid")

// =======================
// FUNZIONE CREA CARD
// =======================

function renderProducts(productArray) {

  productsGrid.innerHTML = ""

  productArray.forEach(product => {

    const card = document.createElement("div")
    card.classList.add("product-card")

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.brand}</p>
      <p>€ ${product.price}</p>
      <button>Dettagli</button>
    `

    productsGrid.appendChild(card)

  })
}

// =======================
// AVVIO
// =======================

renderProducts(products)

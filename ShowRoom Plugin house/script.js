// =======================
// ARRAY PRODOTTI
// =======================

const products = [
  { id: 1, name: "Zenology", brand: "Arturia", price: 229, image: "images/prod1.jpg" },
  { id: 2, name: "Serum", brand: "Xfer Records", price: 180, image: "images/prod2.jpg" },
  { id: 3, name: "Xpand!2", brand: "AIR Music", price: 30, image: "images/prod3.jpg" },
  { id: 4, name: "Analog Lab V", brand: "Arturia", price: 199, image: "images/prod4.jpg" },
  { id: 5, name: "Nexus", brand: "reFX", price: 250, image: "images/prod5.jpg" },
  { id: 6, name: "FabFilter Pro Q4", brand: "FabFilter", price: 180, image: "images/prod6.jpg" },
  { id: 7, name: "Portal", brand: "Output", price: 129, image: "images/prod7.jpg" },
  { id: 8, name: "Thermal", brand: "Output", price: 99, image: "images/prod8.jpg" },
  { id: 9, name: "Evermotion", brand: "Sample Logic", price: 79, image: "images/prod9.jpg" },
  { id: 10, name: "Triton", brand: "Korg", price: 249, image: "images/prod10.jpg" }
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

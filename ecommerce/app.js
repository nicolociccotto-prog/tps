

let products = []

function parseCSVData(data) {
    const rows = data.trim().split("\n").slice(1)

    products = rows.map((row, index) => {
        const [marca, modello, descrizione, immagine, prezzo] = row.split(",")

        return {
            id: index,
            marca: marca?.trim(),
            modello: modello?.trim(),
            descrizione: descrizione?.trim(),
            immagine: immagine?.trim(),
            prezzo: prezzo?.trim()
        }
    })

    mostraProdotti()
    mostraDettaglioProdotto()
    mostraCarrello()
}

function caricaProdotti() {
    const localCSV = localStorage.getItem("csvData")

    if (localCSV) {
        parseCSVData(localCSV)
    } else {
        fetch("prodotti.csv")
            .then(response => response.text())
            .then(data => parseCSVData(data))
            .catch(error => console.log("Errore caricamento CSV:", error))
    }
}

function mostraProdotti() {
    const container = document.getElementById("products-container")
    if (!container) return

    container.innerHTML = ""

    products.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <img src="assets/${product.immagine}" alt="${product.modello}">
                <h2>${product.marca} ${product.modello}</h2>
                <p>${product.descrizione}</p>
                <div class="price">${product.prezzo} €</div>
                <a href="prodotto.html?id=${product.id}">Dettagli</a>
                <button onclick="aggiungiCarrello(${product.id})">Aggiungi al carrello</button>
            </div>
        `
    })
}

function mostraDettaglioProdotto() {
    const detail = document.getElementById("product-detail")
    if (!detail) return

    const params = new URLSearchParams(window.location.search)
    const id = parseInt(params.get("id"))

    const product = products.find(p => p.id === id)

    if (product) {
        detail.innerHTML = `
            <div class="product-card">
                <img src="assets/${product.immagine}" alt="${product.modello}">
                <h1>${product.marca} ${product.modello}</h1>
                <p>${product.descrizione}</p>
                <div class="price">${product.prezzo} €</div>
                <button onclick="aggiungiCarrello(${product.id})">Aggiungi al carrello</button>
            </div>
        `
    }
}

function aggiungiCarrello(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || []

    const prodotto = products.find(p => p.id === id)

    if (prodotto) {
        cart.push(prodotto)
        localStorage.setItem("cart", JSON.stringify(cart))
        alert("Prodotto aggiunto al carrello")
    } else {
        alert("Errore: prodotto non trovato")
    }
}

function mostraCarrello() {
    const cartContainer = document.getElementById("cart-items")
    if (!cartContainer) return

    let cart = JSON.parse(localStorage.getItem("cart")) || []

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Il carrello è vuoto</p>"
        return
    }

    let totale = 0

    cartContainer.innerHTML = cart.map((item, index) => {
        totale += parseFloat(item.prezzo)

        return `
            <div class="cart-item">
                <h2>${item.marca} ${item.modello}</h2>
                <p>${item.descrizione}</p>
                <p>${item.prezzo} €</p>
                <button onclick="rimuoviDalCarrello(${index})">Rimuovi</button>
            </div>
        `
    }).join("")

    cartContainer.innerHTML += `<h2>Totale: ${totale} €</h2>`
}

function rimuoviDalCarrello(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || []

    cart.splice(index, 1)

    localStorage.setItem("cart", JSON.stringify(cart))

    mostraCarrello()
}

function generaPDF() {
    const { jsPDF } = window.jspdf
    const doc = new jsPDF()

    let cart = JSON.parse(localStorage.getItem("cart")) || []
    let totale = 0

    doc.text("Riepilogo Acquisto", 10, 10)

    cart.forEach((item, index) => {
        doc.text(`${item.marca} ${item.modello} - ${item.prezzo}€`, 10, 20 + (index * 10))
        totale += parseFloat(item.prezzo)
    })

    doc.text(`Totale: ${totale} €`, 10, 30 + (cart.length * 10))

    doc.save("acquisto.pdf")
}

caricaProdotti()

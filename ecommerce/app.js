let products = []

fetch("prodotti.csv")
    .then(response => response.text())
    .then(data => {
        const rows = data.trim().split("\n").slice(1)

        products = rows.map((row, index) => {
            const [marca, modello, descrizione, immagine, prezzo] = row.split(",")

            return {
                id: index,
                marca,
                modello,
                descrizione,
                immagine,
                prezzo
            }
        })

        mostraProdotti()
    })

function mostraProdotti() {
    const container = document.getElementById("products-container")
    if (!container) return

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="assets/${product.immagine}" alt="${product.modello}">
            <h2>${product.marca} ${product.modello}</h2>
            <p>${product.prezzo} €</p>
            <a href="prodotto.html?id=${product.id}">Dettagli</a>
            <button onclick="aggiungiCarrello(${product.id})">Aggiungi al carrello</button>
        </div>
    `).join("")
}

function aggiungiCarrello(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || []
    cart.push(products[id])
    localStorage.setItem("cart", JSON.stringify(cart))
    alert("Prodotto aggiunto al carrello")
}

function generaPDF() {
    const { jsPDF } = window.jspdf
    const doc = new jsPDF()

    let cart = JSON.parse(localStorage.getItem("cart")) || []

    doc.text("Carrello Acquisti", 10, 10)

    cart.forEach((item, index) => {
        doc.text(`${item.marca} ${item.modello} - ${item.prezzo}€`, 10, 20 + (index * 10))
    })

    doc.save("carrello.pdf")
}

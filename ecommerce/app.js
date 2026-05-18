// SOSTITUISCI queste funzioni nel tuo app.js

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

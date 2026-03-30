
function leggiFile() {
    let input = document.getElementById("fileCSV");
    let file = input.files[0];
    }

    let reader = new FileReader();

    reader.onload = function(e) {
        let testo = e.target.result;
        let righe = testo.split("\n");
        let intestazioni = righe[0].split(",");

        let dati = new Array();
        let i = 1;

        while (i < righe.length) {
            if (righe[i] != "") {
                let campi = righe[i].split(",");
                let persona = new Object();

                let j = 0;
                while (j < intestazioni.length) {
                    persona[intestazioni[j]] = campi[j];
                    j = j + 1;
                }

                dati.push(persona);
            }

            i = i + 1;
        }

        document.getElementById("contenitore").innerHTML = "";
        creaBlocchiRicorsivo(dati, 0);
    };

    reader.readAsText(file);
}

function creaBlocchiRicorsivo(dati, indice) {
    if (indice >= dati.length) {
        return;
    }

    let contenitore = document.getElementById("contenitore");
    let persona = dati[indice];

    let blocco = document.createElement("div");
    blocco.className = "blocco";

    let testoHTML = "";

    testoHTML = testoHTML + "<div class='titolo'>";
    testoHTML = testoHTML + persona.nome + " " + persona.cognome;
    testoHTML = testoHTML + "</div>";

    testoHTML = testoHTML + "<div><b>Email:</b> " + persona.email + "</div>";
    testoHTML = testoHTML + "<div><b>Telefono:</b> " + persona.telefono + "</div>";
    testoHTML = testoHTML + "<div><b>Citta:</b> " + persona.citta + "</div>";

    blocco.innerHTML = testoHTML;

    contenitore.appendChild(blocco);

    creaBlocchiRicorsivo(dati, indice + 1);
}

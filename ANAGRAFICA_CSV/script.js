function leggiFile() {
    let input = document.getElementById("fileCSV");
    let file = input.files[0];

    if (file == null) {
        return;
    }

    let reader = new FileReader();

    reader.onload = function(e) {
        let testo = e.target.result;

        while (testo.indexOf("\r") != -1) {
            testo = testo.replace("\r", "");
        }

        let righe = testo.split("\n");
        let dati = new Array();
        let i = 1;

        while (i < righe.length) {
            if (righe[i] != "") {
                let campi = righe[i].split(",");
                let persona = new Object();

                persona.nome = campi[0];
                persona.cognome = campi[1];
                persona.email = campi[2];
                persona.telefono = campi[3];
                persona.citta = campi[4];

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

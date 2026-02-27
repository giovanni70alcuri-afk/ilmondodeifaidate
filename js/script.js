// --- FUNZIONE DI CARICAMENTO DATI ---
async function caricaDati(url) {
    try {
        const res = await fetch('json/' + url + '?v=' + Date.now());
        if (!res.ok) return null;
        return await res.json();
    } catch (e) { 
        console.error("Errore caricamento: " + url);
        return null; 
    }
}

// --- INIZIALIZZAZIONE (SIDEBAR E LIBRI) ---
async function inizializzaSito() {

    // sidebar destra
    const datiDX = await caricaDati('sidebar.json');
    const contDX = document.getElementById('sidebar-sticky-container');

    if (datiDX && contDX) {
        contDX.innerHTML = datiDX
        .filter(i => i.attivo === true)
        .map(i => `
            <div class="riquadro-custom">
                <a href="${i.link}" target="_blank">
                    <img src="${i.immagine}" alt="${i.descrizione}" loading="lazy">
                    <p><b>${i.descrizione}</b></p>
                </a>
            </div>
        `).join('');
    }

    // carosello libri
    const datiLibri = await caricaDati('libri.json');
    const track = document.getElementById('track-libri');

    if (datiLibri && datiLibri.libri && track) {
        track.innerHTML = datiLibri.libri.map(l => `
            <div class="slide-item">
                <a href="${l.link}" target="_blank">
                    <img src="${l.immagine}" alt="${l.titolo}" loading="lazy">
                </a>
            </div>
        `).join('');
    }

    // footer
    const datiFooter = await caricaDati('footer.json');
    const footerBox = document.getElementById('footer-sito');
    if (footerBox && datiFooter) {
        footerBox.innerHTML = `<p>${datiFooter.motto}</p>`;
    }
}

// --- MOSTRA CATEGORIE ---
async function mostraCategoria(slug) {

    const area = document.getElementById('prodotti-lista');
    const titoloSezione = document.getElementById('titolo-sezione');

    if (!area) return;

    area.innerHTML = "<p style='text-align:center; color:#999;'>caricamento...</p>";

    const dati = await caricaDati(slug + '.json');

    if (titoloSezione)
        titoloSezione.innerText = slug.toUpperCase().replace(/_/g, ' ');

    if (!dati) {
        area.innerHTML = "<p style='text-align:center; color:#999;'>nessun contenuto disponibile</p>";
        return;
    }

    const lista =
        Array.isArray(dati)
        ? dati
        : (
            dati[slug] ||
            dati.video ||
            dati.archivio_progetti ||
            dati.recensioni ||
            dati.restauro ||
            dati.elettronica ||
            dati.libri ||
            dati.contatti
        );

    if (lista && lista.length > 0) {

        area.innerHTML = lista.map(item => {

            const titolo =
                item.titolo ||
                item.prodotto ||
                item.attrezzo ||
                "progetto";

            const link =
                item.link ||
                item.link_articolo ||
                item.link_amazon ||
                item.url ||
                "#";

            const descrizione =
                item.descrizione ||
                item.descrizione_breve ||
                "";

            return `
                <div class="card-progetto">
                    <h3>${titolo}</h3>
                    <p>${descrizione}</p>
                    ${link !== "#" ? `<a href="${link}" target="_blank" class="btn-link">apri contenuto →</a>` : ''}
                </div>
            `;
        }).join('');

    } else {
        area.innerHTML = "<p style='text-align:center; color:#999;'>categoria vuota</p>";
    }
}

// --- CHAT BOT ---
let botResponses = {};

// Carica le risposte dal JSON
async function caricaChatbot() {
    const dati = await caricaDati('chatbot.json');
    if (dati) {
        botResponses = dati;
    }
}

// Carica il chatbot all'avvio
caricaChatbot();

async function inviaMessaggioBot() {

    const input = document.getElementById('bot-input');
    const chatBody = document.getElementById('chat-body');

    if (!input || !chatBody || input.value.trim() === "") return;

    const msg = input.value.toLowerCase();

    chatBody.innerHTML += `<div><b>tu:</b> ${input.value}</div>`;
    input.value = "";

    setTimeout(async () => {

        let response = "";

        if (msg.includes("contatt") || msg.includes("email")) {

            const res = await caricaDati('contatti.json');

            response =
                res?.email_destinatario
                ? `scrivimi a: ${res.email_destinatario}`
                : "contattami sui social";

        } else {

            response =
                botResponses[msg] ||
                botResponses["default"];
        }

        chatBody.innerHTML += `<div style="color:#cd2121;"><b>bot:</b> ${response}</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;

    }, 500);
}

// --- SIDEBAR E BOT A SCOMPARSA ---
document.addEventListener('DOMContentLoaded', () => {

    // Sidebar
    const sidebar = document.getElementById("sidebar-left-container");
    const toggleBtn = document.getElementById("toggleSidebar");

    toggleBtn.onclick = () => {
        sidebar.classList.toggle("sidebar-hidden");
    };

    // Chatbot
    const bot = document.getElementById("chatbot");
    const openBot = document.getElementById("openBot");
    const closeBot = document.getElementById("closeBot");

    openBot.onclick = () => {
        bot.classList.remove("chatbot-hidden");
    };

    closeBot.onclick = () => {
        bot.classList.add("chatbot-hidden");
    };

    // Inizializza sito
    inizializzaSito();
});

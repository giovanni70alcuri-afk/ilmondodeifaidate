let botDatabase = { libri: [], prodotti: [], guide: [] };
let indiceLibro = 0;
let indiceProdotti = 0;

async function inizializzaSito() {
    try {
        const [resLibri, resProd, resGuide] = await Promise.all([
            fetch('json/carosello.json'),
            fetch('json/sidebardx.json'),
            fetch('json/guide.json')
        ]);

        botDatabase.libri = await resLibri.json();
        botDatabase.prodotti = await resProd.json();
        botDatabase.guide = await resGuide.json();

        // Avvia le rotazioni
        aggiornaCarosello();
        aggiornaSidebarDX();
        
        setInterval(aggiornaCarosello, 5000); // Cambia libro ogni 5 sec
        setInterval(aggiornaSidebarDX, 5000); // Cambia prodotti ogni 5 sec
        
    } catch (error) {
        console.error("Errore caricamento dati JSON");
    }
}

// Rotazione Libri in alto
function aggiornaCarosello() {
    const container = document.getElementById('carosello-container');
    if (botDatabase.libri.length > 0) {
        const libro = botDatabase.libri[indiceLibro];
        container.innerHTML = `<a href="${libro.link_amazon}" target="_blank">
            <img src="${libro.url}" alt="${libro.titolo}" style="animation: fadeIn 1s;">
        </a>`;
        indiceLibro = (indiceLibro + 1) % botDatabase.libri.length;
    }
}

// Rotazione Prodotti Sidebar DX (Magliette, Jimbo, ecc.)
function aggiornaSidebarDX() {
    const container = document.getElementById('prodotti-consigliati');
    container.innerHTML = ""; 
    
    // Prendiamo 6 prodotti alla volta partendo dall'indice corrente
    for (let i = 0; i < 6; i++) {
        let index = (indiceProdotti + i) % botDatabase.prodotti.length;
        let prod = botDatabase.prodotti[index];
        
        if(prod.attivo) {
            container.innerHTML += `
                <div class="slot-prodotto" style="animation: fadeIn 1s;">
                    <a href="${prod.link}" target="_blank" style="text-decoration:none; color:inherit;">
                        <img src="${prod.immagine}">
                        <p>${prod.descrizione}</p>
                    </a>
                </div>`;
        }
    }
    indiceProdotti = (indiceProdotti + 1) % botDatabase.prodotti.length;
}

// Logica Chatbot
function toggleChat() {
    document.getElementById('chatbot-window').classList.toggle('hidden');
}

function inviaMessaggioBot() {
    const input = document.getElementById('bot-input');
    const area = document.getElementById('chatbot-chat-area');
    const userText = input.value.trim().toLowerCase();
    if (!userText) return;

    area.innerHTML += `<div style="text-align:right;"><strong>Tu:</strong> ${input.value}</div>`;
    let risposta = "Chiedimi di un libro o di una guida tecnica!";

    botDatabase.libri.forEach(l => {
        if (userText.includes("libro") || userText.includes(l.titolo.toLowerCase())) {
            risposta = `Manuale consigliato: <strong>"${l.titolo}"</strong>. <br><a href="${l.link_amazon}" target="_blank">→ Vedi su Amazon</a>`;
        }
    });

    botDatabase.guide.forEach(g => {
        if (userText.includes(g.argomento)) {
            risposta = `Guida: <strong>${g.titolo}</strong>. <br><a href="${g.link_pdf}" target="_blank">📂 Scarica PDF</a>`;
        }
    });

    area.innerHTML += `<div style="color:blue;"><strong>Bot:</strong> ${risposta}</div>`;
    input.value = "";
    area.scrollTop = area.scrollHeight;
}

window.onload = inizializzaSito;

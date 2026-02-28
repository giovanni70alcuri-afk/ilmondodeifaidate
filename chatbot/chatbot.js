// CHATBOT - Versione Completa
// Legge automaticamente tutti i JSON del sito

let configChat = {};

let libriData = [];
let videoData = [];
let elettronicaData = [];
let restauroData = [];
let recensioniData = [];
let progettiData = [];
let contattiData = {};

async function caricaJSON(url) {
    try {
        const res = await fetch(url + "?v=" + Date.now());
        return await res.json();
    } catch(e) {
        console.log("Errore caricamento:", url);
        return null;
    }
}

async function caricaChatbot() {
    configChat = await caricaJSON('chatbot/chatbot.json');
    
    const libri = await caricaJSON('json/libri.json');
    const video = await caricaJSON('json/video.json');
    const elettronica = await caricaJSON('json/elettronica.json');
    const restauro = await caricaJSON('json/restauro.json');
    const recensioni = await caricaJSON('json/recensioni_attrezzi.json');
    const progetti = await caricaJSON('json/deposito_progetti.json');
    const contatti = await caricaJSON('json/contatti.json');
    
    if(libri) libriData = libri.libri || [];
    if(video) videoData = video.video || [];
    if(elettronica) elettronicaData =elettronica.elettronica || [];
    if(restauro) restauroData = restauro.restauro || [];
    if(recensioni) recensioniData = recensioni.recensioni || [];
    if(progetti) progettiData = progetti.archivio_progetti || [];
    if(contatti) contattiData = contatti.configurazione_contatto || {};
}

function toggleChat() {
    document.getElementById("chat-box").classList.toggle("chat-chiusa");
}

function inviaMessaggio() {
    const input = document.getElementById("chat-input");
    const chat = document.getElementById("chat-messages");
    
    if(!input.value.trim()) return;
    
    const msg = input.value.toLowerCase();
    chat.innerHTML += `<div><b>Tu:</b> ${input.value}</div>`;
    input.value = "";
    
    let risposta = configChat.default || "Scrivi una parola chiave.";
    
    // LIBRI
    if(msg.includes("libri")) {
        if(libriData.length) {
            risposta = "I miei libri:<br>";
            libriData.slice(0,5).forEach(l => {
                risposta += "• " + l.titolo + "<br>";
            });
        } else {
            risposta = "Nessun libro trovato.";
        }
    }
    
    // VIDEO
    else if(msg.includes("video")) {
        if(videoData.length) {
            risposta = "Categorie video:<br>";
            const categorie = [...new Set(videoData.map(v => v.categoria))];
            categorie.forEach(c => {
                risposta += "• " + c + "<br>";
            });
        }
    }
    
    // ELETTRONICA
    else if(msg.includes("elettronica")) {
        if(elettronicaData.length) {
            risposta = "Progetti elettronica:<br>";
            elettronicaData.slice(0,3).forEach(e => {
                risposta += "• " + e.titolo + "<br>";
            });
            // Apre la categoria nel sito
            if(typeof mostraCategoria === 'function') {
                setTimeout(() => mostraCategoria('elettronica'), 1000);
            }
        }
    }
    
    // RESTAURO
    else if(msg.includes("restauro")) {
        if(restauroData.length) {
            risposta = "Progetti restauro:<br>";
            restauroData.slice(0,3).forEach(r => {
                risposta += "• " + r.titolo + "<br>";
            });
            if(typeof mostraCategoria === 'function') {
                setTimeout(() => mostraCategoria('restauro'), 1000);
            }
        }
    }
    
    // RECENSIONI
    else if(msg.includes("recensioni")) {
        if(recensioniData.length) {
            risposta = "Recensioni attrezzi:<br>";
            recensioniData.slice(0,3).forEach(r => {
                risposta += "• " + r.attrezzo + "<br>";
            });
            if(typeof mostraCategoria === 'function') {
                setTimeout(() => mostraCategoria('recensioni_attrezzi'), 1000);
            }
        }
    }
    
    // PROGETTI
    else if(msg.includes("progetti")) {
        if(progettiData.length) {
            risposta = "Archivio progetti:<br>";
            progettiData.slice(0,3).forEach(p => {
                risposta += "• " + p.titolo + "<br>";
            });
            if(typeof mostraCategoria === 'function') {
                setTimeout(() => mostraCategoria('deposito_progetti'), 1000);
            }
        }
    }
    
    // CONTATTI
    else if(msg.includes("contatt") || msg.includes("email")) {
        risposta = "Puoi scrivermi a: " + (contattiData.destinatario_email || "non disponibile");
    }
    
    chat.innerHTML += `<div style="color:#cd2121;"><b>Bot:</b> ${risposta}</div>`;
    chat.scrollTop = chat.scrollHeight;
}

//绑定点击事件到聊天图标
document.addEventListener("DOMContentLoaded", function() {
    caricaChatbot();
    
    const chatToggle = document.getElementById("chat-toggle");
    if(chatToggle) {
        chatToggle.onclick = toggleChat;
    }
});

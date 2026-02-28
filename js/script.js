// ============================================
// IL LABORATORIO DI ANGELO - Script Principale
// ============================================

// --- FUNZIONE DI CARICAMENTO DATI ---
async function caricaDati(url) {
    try {
        const res = await fetch('json/' + url + '?v=' + Date.now());
        if (!res.ok) return null;
        return await res.json();
    } catch(e) { 
        console.error("Errore caricamento:", url);
        return null; 
    }
}

// --- SIDEBAR SINISTRA - MENU ---
async function caricaMenu() {
    const datiSX = await caricaDati('sidebar_sx.json');
    const contSX = document.getElementById('sidebar-left-container');
    
    if(datiSX && contSX) {
        contSX.innerHTML = datiSX
            .filter(i => i.attivo === true)
            .map(i => `
                <a href="${i.link}" onclick="${i.onclick || ''}" class="nav-link">
                    <i class="fas ${i.icona}"></i>
                    ${i.descrizione}
                </a>
            `).join('');
    }
}

// --- SIDEBAR DESTRA - IMMAGINI ROTANTI ---
async function caricaSidebarDX() {
    const datiDX = await caricaDati('sidebar.json');
    const contDX = document.getElementById('sidebar-sticky-container');
    
    if(!datiDX || !contDX) return;
    
    // Box Jimbo
    let htmlJimbo = '';
    if(datiDX.jimbo) {
        htmlJimbo = `
            <div class="riquadro-custom">
                <h4>${datiDX.jimbo.titolo}</h4>
                <div class="carousel-box" id="carousel-jimbo">
                    ${datiDX.jimbo.immagini.map((img, idx) => 
                        `<img src="${img}" alt="Jimbo" class="${idx === 0 ? 'active' : ''}" loading="lazy">`
                    ).join('')}
                </div>
                <a href="${datiDX.jimbo.link}" target="_blank" class="btn-link">Visitate il Sito →</a>
            </div>
        `;
    }
    
    // Box Magliette
    let htmlMagliette = '';
    if(datiDX.magliette) {
        htmlMagliette = `
            <div class="riquadro-custom">
                <h4>${datiDX.magliette.titolo}</h4>
                <div class="carousel-box" id="carousel-magliette">
                    ${datiDX.magliette.immagini.map((img, idx) => 
                        `<img src="${img}" alt="Maglietta" class="${idx === 0 ? 'active' : ''}" loading="lazy">`
                    ).join('')}
                </div>
                <a href="${datiDX.magliette.link}" target="_blank" class="btn-link">Acquista →</a>
            </div>
        `;
    }
    
    contDX.innerHTML = htmlJimbo + htmlMagliette;
    
    // Avvia rotazione ogni 60 secondi
    avviaCarousel('carousel-jimbo', datiDX.jimbo.immagini.length);
    avviaCarousel('carousel-magliette', datiDX.magliette.immagini.length);
}

// --- ROTAZIONE IMMAGINI (60 secondi) ---
let intervalliCarousel = [];

function avviaCarousel(id, totale) {
    let indice = 0;
    const container = document.getElementById(id);
    if(!container) return;
    
    const immagini = container.querySelectorAll('img');
    
    // Cambia ogni 60 secondi
    const intervallo = setInterval(() => {
        immagini.forEach(img => img.classList.remove('active'));
        immagini[indice].classList.add('active');
        indice = (indice + 1) % totale;
    }, 60000); // 60000 ms = 60 secondi
    
    intervalliCarousel.push(intervallo);
}

// --- CAROSELLO LIBRI ---
async function caricaLibri() {
    const datiLibri = await caricaDati('libri.json');
    const track = document.getElementById('track-libri');
    
    if(datiLibri && datiLibri.libri && track) {
        track.innerHTML = datiLibri.libri.map(l => `
            <div class="slide-item">
                <a href="${l.link}" target="_blank">
                    <img src="${l.immag}" alt="${l.titolo}" loading="lazy">
                </a>
            </div>
        `).join('');
        avviaCaroselloLibri();
    }
}

function avviaCaroselloLibri() {
    const track = document.getElementById('track-libri');
    if(!track) return;
    
    let scrollPos = 0;
    setInterval(() => {
        scrollPos += 1;
        track.scrollLeft = scrollPos;
        if(scrollPos >= track.scrollWidth / 2) {
            scrollPos = 0;
        }
    }, 30);
}

// --- FOOTER ---
async function caricaFooter() {
    const datiFooter = await caricaDati('footer.json');
    const footerBox = document.getElementById('footer-sito');
    
    if(datiFooter && footerBox) {
        let socialLinks = '';
        if(datiFooter.social) {
            socialLinks = datiFooter.social.map(s => 
                `<a href="${s.url}" target="_blank">${s.nome}</a>`
            ).join(' | ');
        }
        
        footerBox.innerHTML = `
            <p>${datiFooter.motto || ''}</p>
            <p>${socialLinks}</p>
            <p style="margin-top:15px;font-size:0.7rem;">
                ${datiFooter.copyright || '© 2026 Angelo Cacioppo'}
            </p>
        `;
    }
}

// --- INIZIALIZZAZIONE COMPLETA ---
async function inizializzaSito() {
    await caricaMenu();
    await caricaSidebarDX();
    await caricaLibri();
    await caricaFooter();
}

// --- MOSTRA CATEGORIE ---
async function mostraCategoria(slug) {
    // Home page content
    if(slug === 'home' || slug === undefined) {
        const area = document.getElementById('prodotti-lista');
        const titoloSezione = document.getElementById('titolo-sezione');
        if(titoloSezione) titoloSezione.innerText = "BENVENUTI NEL LABORATORIO";
        if(area) {
            area.innerHTML = `
                <div class="card-progetto">
                    <h3>Il Tutto Fai Da Te</h3>
                    <p>Benvenuti nel mio laboratorio! Qui trovi progetti di elettronica, restauro di apparecchi d'epoca, recensioni attrezzi e i miei libri.</p>
                    <p>Seleziona una categoria dal menu a sinistra per esplorare i contenuti.</p>
                </div>
            `;
        }
        return;
    }
    
    const area = document.getElementById('prodotti-lista');
    const titoloSezione = document.getElementById('titolo-sezione');
    
    if(!area) return;
    
    area.innerHTML = '<p style="text-align:center;padding:20px;">Caricamento...</p>';
    
    const dati = await caricaDati(slug + '.json');
    
    if(titoloSezione) {
        titoloSezione.innerText = slug.replace(/_/g, ' ').toUpperCase();
    }
    
    if(!dati) {
        area.innerHTML = '<p style="text-align:center;padding:20px;">Nessun contenuto trovato.</p>';
        return;
    }
    
    // Trova l'array dei dati
    const lista = 
        Array.isArray(dati) ? dati :
        (dati[slug] || 
         dati.video || 
         dati.archivio_progetti || 
         dati.recensioni || 
         dati.restauro || 
         dati.elettronica ||
         dati.libri ||
         dati.jimbo ||
         dati.magliette ||
         []);
    
    if(lista && lista.length > 0) {
        area.innerHTML = lista.map(item => {
            const titolo = item.titolo || item.attrezzo || item.prodotto || "Senza titolo";
            const descrizione = item.descrizione || "";
            const link = item.link || item.url || item.link_amazon || item.link_articolo || "#";
            
            return `
                <div class="card-progetto">
                    <h3>${titolo}</h3>
                    <p>${descrizione}</p>
                    ${link !== '#' ? `<a href="${link}" target="_blank" class="btn-link">Apri →</a>` : ''}
                </div>
            `;
        }).join('');
    } else {
        area.innerHTML = '<p style="text-align:center;padding:20px;">Categoria vuota.</p>';
    }
}

// --- AVVIO ---
document.addEventListener('DOMContentLoaded', inizializzaSito);

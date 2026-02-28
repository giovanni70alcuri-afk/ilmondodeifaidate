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

// --- INIZIALIZZAZIONE SITO ---
async function inizializzaSito() {
    
    // Sidebar destra (senza immagini, solo testo)
    const datiDX = await caricaDati('sidebar.json');
    const contDX = document.getElementById('sidebar-sticky-container');
    
    if(datiDX && contDX) {
        contDX.innerHTML = datiDX
            .filter(i => i.attivo === true)
            .map(i => `
                <div class="riquadro-custom">
                    <a href="${i.link}" target="_blank">
                        <p><b>${i.descrizione}</b></p>
                    </a>
                </div>
            `).join('');
    }
    
    // Sidebar sinistra (menu)
    const datiSX = await caricaDati('sidebar_sx.json');
    const contSX = document.getElementById('sidebar-left-container');
    
    if(datiSX && contSX) {
        contSX.innerHTML = datiSX
            .filter(i => i.attivo === true)
            .map(i => `
                <a href="${i.link}" target="_blank" class="nav-link">
                    <i class="fas fa-external-link-alt"></i>
                    ${i.descrizione}
                </a>
            `).join('');
    }
    
    // Carosello libri
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
        avviaCarosello();
    }
    
    // Footer
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

// --- MOSTRA CATEGORIE ---
async function mostraCategoria(slug) {
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

// --- CAROSELLO LIBRI ---
function avviaCarosello() {
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

// --- AVVIO ---
document.addEventListener('DOMContentLoaded', inizializzaSito);

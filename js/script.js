// carosello libri
const datiLibri = await caricaDati('libri.json');
const track = document.getElementById('track-libri');

if (datiLibri && datiLibri.libri && track) {

    // duplico elementi per loop infinito
    const lista = [...datiLibri.libri, ...datiLibri.libri];

    track.innerHTML = lista.map(l => `
        <div class="slide-item">
            <a href="${l.link}" target="_blank">
                <img src="${l.immagine}" alt="${l.titolo}" loading="lazy">
            </a>
        </div>
    `).join('');

    let scrollSpeed = 0.4;
    let pausa = false;

    function autoScroll() {

        if (!pausa) {
            track.scrollLeft += scrollSpeed;

            if (track.scrollLeft >= track.scrollWidth / 2) {
                track.scrollLeft = 0;
            }
        }

        requestAnimationFrame(autoScroll);
    }

    autoScroll();

    // pausa quando il mouse passa sopra
    track.addEventListener("mouseenter", () => pausa = true);
    track.addEventListener("mouseleave", () => pausa = false);
}

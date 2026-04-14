let locales = [];

async function cargarDatos() {
    try {
        const response = await fetch('locales.json');
        locales = await response.json();
        
        // Ejecutar funciones una vez cargados los datos
        renderLocales();
        actualizarFiltros();
    } catch (error) {
        console.error("Error cargando los locales:", error);
    }
}

function renderLocales() {
    const grid = document.getElementById("locals-grid");
    if (!grid) return;
    grid.innerHTML = "";

    locales.forEach((local) => {
        const card = document.createElement("article");
        card.className = "local-card";
        // Guardamos los datos para el buscador
        card.dataset.search = `${local.name} ${local.comuna} ${local.category}`.toLowerCase();
        
        card.innerHTML = `
            <div class="local-img-wrap">
                <div class="local-img-box"><img src="${local.img}" alt="${local.name}"></div>
            </div>
            <div class="local-body">
                <span class="local-inline-tag">${local.category}</span>
                <h3>${local.name}</h3>
                <p><b>${local.comuna}</b></p>
                <p>${local.loc}</p>
                <button type="button" class="btn-ver">Ver más</button>
            </div>
        `;
        
        card.addEventListener("click", () => abrirDetalle(local));
        grid.appendChild(card);
    });
}

// Función para que el buscador funcione con los nuevos datos
function actualizarFiltros() {
    const searchInput = document.getElementById("main-search");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const termino = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll(".local-card");
        
        cards.forEach(card => {
            const contenido = card.dataset.search;
            card.style.display = contenido.includes(termino) ? "flex" : "none";
        });
    });
}

// Abrir el modal con la info del local
function abrirDetalle(local) {
    document.getElementById("modal-titulo").innerText = local.name;
    document.getElementById("modal-categoria").innerText = local.category;
    document.getElementById("modal-dir").innerText = `${local.comuna} · ${local.loc}`;
    document.getElementById("modal-desc").innerText = local.desc;
    document.getElementById("modal-hor").innerText = local.hor;
    document.getElementById("modal-img").src = local.img;
    document.getElementById("modal-wa").href = `https://wa.me/${local.wa}`;
    document.getElementById("modal-detalle").style.display = "flex";
}

document.addEventListener("DOMContentLoaded", cargarDatos);
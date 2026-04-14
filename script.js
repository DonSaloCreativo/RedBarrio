// Variable global que guardará los locales que vienen del Excel
let locales = [];

/**
 * 1. CARGA DE DATOS: Busca el archivo locales.json que genera tu Google Sheet
 */
async function cargarDatos() {
    try {
        // El "?v=" + Date.now() obliga al navegador a leer siempre la última versión del Excel
        const response = await fetch('locales.json?v=' + Date.now());
        if (!response.ok) throw new Error("No se pudo cargar el archivo locales.json");
        
        locales = await response.json();
        console.log("Locales cargados con éxito:", locales);
        
        // Ejecutamos las funciones para mostrar los datos en pantalla
        renderLocales();
        inicializarFiltros();
    } catch (error) {
        console.error("Error al cargar los locales:", error);
    }
}

/**
 * 2. RENDERIZADO: Crea las tarjetas de los locales en el HTML
 */
function renderLocales() {
    const grid = document.getElementById("locals-grid");
    if (!grid) return;
    grid.innerHTML = ""; // Limpiamos la cuadrícula antes de cargar

    locales.forEach((local) => {
        const card = document.createElement("article");
        card.className = "local-card";
        
        // Atributo para que el buscador sepa qué texto filtrar
        card.dataset.search = `${local.name} ${local.comuna} ${local.category}`.toLowerCase();
        
        card.innerHTML = `
            <div class="local-img-wrap">
                <div class="local-img-box">
                    <img src="${local.img}" alt="${local.name}" onerror="this.src='images/logo.png'">
                </div>
            </div>
            <div class="local-body">
                <span class="local-inline-tag">${local.category}</span>
                <h3>${local.name}</h3>
                <p><b>${local.comuna}</b></p>
                <p>${local.loc}</p>
                <button type="button" class="btn-ver">Ver más</button>
            </div>
        `;
        
        // Al hacer clic en la tarjeta, abrimos el modal con los detalles
        card.addEventListener("click", () => abrirDetalle(local));
        grid.appendChild(card);
    });
}

/**
 * 3. BUSCADOR: Filtra los locales en tiempo real
 */
function inicializarFiltros() {
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

/**
 * 4. MODAL: Muestra la información detallada del local seleccionado
 */
function abrirDetalle(local) {
    document.getElementById("modal-titulo").innerText = local.name;
    document.getElementById("modal-categoria").innerText = local.category;
    document.getElementById("modal-dir").innerText = `${local.comuna} · ${local.loc}`;
    document.getElementById("modal-desc").innerText = local.desc;
    document.getElementById("modal-hor").innerText = local.hor;
    document.getElementById("modal-img").src = local.img;
    document.getElementById("modal-img").alt = local.name;

    const waBtn = document.getElementById("modal-wa");
    // Limpiamos el número de WhatsApp por si acaso
    const numLimpio = local.wa ? local.wa.toString().replace(/\D/g, "") : "";
    waBtn.href = numLimpio ? `https://wa.me/${numLimpio}` : "#";
    
    document.getElementById("modal-detalle").style.display = "flex";
}

/**
 * 5. CERRAR MODAL
 */
function cerrarModal() {
    document.getElementById("modal-detalle").style.display = "none";
}

// Iniciar todo cuando el navegador esté listo
document.addEventListener("DOMContentLoaded", cargarDatos);

// Cerrar modal al hacer clic fuera de la tarjeta blanca
window.onclick = function(event) {
    const modal = document.getElementById("modal-detalle");
    if (event.target === modal) {
        cerrarModal();
    }
};
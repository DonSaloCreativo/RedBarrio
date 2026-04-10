// URL de Google Apps Script (Reemplaza a Sheetbest para ser 100% gratuito e ilimitado)
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxH1VvPvLKq9bxXD3bnP8owGzJVE0gmxScoWWY9smVlnO3TIPg554rTRdg34htBSDGysA/exec"; 
let datosLocales = [];

async function obtenerDatos() {
    try {
        const respuesta = await fetch(APPS_SCRIPT_URL);
        if (!respuesta.ok) throw new Error("Error en la respuesta de la red");
        const data = await respuesta.json();
        
        // Filtramos por estado 'aprobado' (sensible a minúsculas)
        // Con Apps Script, nos aseguramos de que los datos existan antes de filtrar
        datosLocales = data.filter(fila => {
            return fila.estado && fila.estado.toString().toLowerCase().trim() === "aprobado";
        });
        
        renderizarTarjetas(datosLocales);
        document.getElementById("loading").style.display = "none";
    } catch (error) {
        console.error("Error cargando datos:", error);
        document.getElementById("loading").innerHTML = `
            <div style="padding: 20px;">
                <p>No se pudieron cargar los locales.</p>
                <small>Asegúrate de haber publicado el Script de Google como "Cualquier persona".</small>
            </div>
        `;
    }
}

function renderizarTarjetas(locales) {
    const contenedor = document.getElementById("grid-negocios");
    contenedor.innerHTML = "";

    if (locales.length === 0) {
        contenedor.innerHTML = "<p class='status-msg'>No se encontraron locales aprobados en el Sheets.</p>";
        return;
    }

    locales.forEach(local => {
        const div = document.createElement("div");
        div.className = "card";
        div.onclick = () => abrirModal(local);
        
        div.innerHTML = `
            <img src="${local.imagen || 'https://via.placeholder.com/300x170?text=LlamaBarrio'}" alt="${local.nombre}">
            <div class="card-content">
                <span class="category-badge">${local.categoria || 'Local'}</span>
                <h3>${local.nombre}</h3>
                <p>📍 ${local.comuna}</p>
                <span class="info-resaltada">${local.precio || ""}</span>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

function buscar() {
    const comunaSelec = document.getElementById("location-filter").value;
    const busqueda = document.getElementById("main-search").value.toLowerCase();

    const filtrados = datosLocales.filter(l => {
        const matchComuna = comunaSelec ? l.comuna === comunaSelec : true;
        // Seguridad por si tags o categoría vienen vacíos o no son texto
        const nombre = (l.nombre || "").toString().toLowerCase();
        const tags = (l.tags || "").toString().toLowerCase();
        const cat = (l.categoria || "").toString().toLowerCase();
        
        const textoParaBuscar = `${nombre} ${tags} ${cat}`;
        const matchTexto = textoParaBuscar.includes(busqueda);
        
        return matchComuna && matchTexto;
    });

    renderizarTarjetas(filtrados);
}

function abrirModal(l) {
    const body = document.getElementById("popup-body");
    body.innerHTML = `
        <div style="position:relative;">
            <img src="${l.imagen}" style="width:100%; height:220px; object-fit:cover;">
        </div>
        <div style="padding:25px;">
            <h2 style="margin:0; color:var(--dark);">${l.nombre}</h2>
            <p style="color:var(--primary); font-weight:700; margin-top:5px;">${l.categoria}</p>
            <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">
            
            <div style="font-size:14px; color:#444; line-height:1.6;">
                <p><strong>📍 Ubicación:</strong> ${l.direccion || "Dirección no disponible"}, ${l.comuna}</p>
                <p><strong>⏰ Horario:</strong> ${l.horario || "Consultar directamente"}</p>
                <p><strong>📦 Especialidad:</strong> ${l.tags || l.categoria}</p>
            </div>
            
            <a href="https://wa.me/${l.telefono}" target="_blank" 
               style="display:block; background:#25d366; color:white; text-align:center; padding:15px; border-radius:12px; margin-top:25px; text-decoration:none; font-weight:bold; box-shadow: 0 4px 10px rgba(37,211,102,0.3);">
               📱 Contactar por WhatsApp
            </a>
        </div>
    `;
    document.getElementById("productPopup").style.display = "flex";
}

function cerrarModal(e) {
    if (e.target.id === "productPopup") cerrarPopupBtn();
}

function cerrarPopupBtn() {
    document.getElementById("productPopup").style.display = "none";
}

// Iniciar la descarga de datos al cargar la página
obtenerDatos();
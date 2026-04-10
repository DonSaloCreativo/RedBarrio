const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxH1VvPvLKq9bxXD3bnP8owGzJVE0gmxScoWWY9smVlnO3TIPg554rTRdg34htBSDGysA/exec"; 
let allProducts = [];

const comunas = ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Bernardo", "San Joaquín", "San Miguel", "San Ramón", "Santiago", "Vitacura"];

async function init() {
    const filter = document.getElementById("location-filter");
    if(filter) {
        filter.innerHTML = '<option value="">Comuna</option>' + 
        comunas.sort().map(c => `<option value="${c}">${c}</option>`).join('');
    }

    try {
        const res = await fetch(APPS_SCRIPT_URL);
        const data = await res.json();
        allProducts = data.filter(f => f.estado?.toString().toLowerCase().trim() === "aprobado");
        renderizar(allProducts);
    } catch (e) { console.error("Error:", e); }
}

function renderizar(datos) {
    const list = document.getElementById("product-list");
    const scroll = document.getElementById("cheap-scroll");

    // Recuadros de Recomendación (Estilo imagen 13)
    if(scroll) {
        scroll.innerHTML = allProducts.slice(0, 8).map(p => `
            <div class="circle-item" onclick="verDetalle('${p.nombre}')">
                <img src="${p.imagen || 'images/logo.png'}" class="circle-img">
                <p>${p.nombre}</p>
            </div>
        `).join('');
    }

    // Tarjetas de Resultados
    if(list) {
        list.innerHTML = datos.map(p => `
            <div class="res-card" onclick="verDetalle('${p.nombre}')">
                <img src="${p.imagen || 'images/logo.png'}" class="res-thumb">
                <div class="res-info">
                    <strong>${p.nombre}</strong><br>
                    <small>📍 ${p.comuna}</small>
                    <div style="color:var(--primary); font-weight:700; margin-top:5px;">${p.precio || ''}</div>
                </div>
            </div>
        `).join('');
    }
}

function buscar() {
    const loc = document.getElementById("location-filter").value;
    const txt = document.getElementById("main-search").value.toLowerCase();
    const filtrados = allProducts.filter(p => 
        (loc ? p.comuna === loc : true) && 
        (p.nombre.toLowerCase().includes(txt) || (p.tags || "").toLowerCase().includes(txt))
    );
    renderizar(filtrados);
}

function verDetalle(nombre) {
    const p = allProducts.find(x => x.nombre === nombre);
    const body = document.getElementById("popup-body");
    body.innerHTML = `
        <img src="${p.imagen}" style="width:100%; height:220px; object-fit:cover;">
        <div style="padding:20px; text-align:center;">
            <h2 style="margin:0;">${p.nombre}</h2>
            <p style="color:#666; font-size:0.9rem;">${p.tags || ''}</p>
            <h3 style="color:var(--primary); margin:10px 0;">${p.precio || ''}</h3>
            <p style="font-size:0.85rem;">📍 ${p.direccion || ''}, ${p.comuna}</p>
            <a href="https://wa.me/${p.telefono}" target="_blank" style="display:block; background:#2ecc71; color:white; padding:12px; border-radius:12px; text-decoration:none; font-weight:bold; margin-top:15px;">Contactar WhatsApp</a>
        </div>
    `;
    document.getElementById("productPopup").style.display = "flex";
}

function cerrarPopupProducto() { document.getElementById("productPopup").style.display = "none"; }
function cerrarModalExterno(e) { if(e.target.className === 'popup-overlay') cerrarPopupProducto(); }

init();
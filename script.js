const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxH1VvPvLKq9bxXD3bnP8owGzJVE0gmxScoWWY9smVlnO3TIPg554rTRdg34htBSDGysA/exec"; 
let allProducts = [];

const comunas = ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Bernardo", "San Joaquín", "San Miguel", "San Ramón", "Santiago", "Vitacura"];

async function init() {
    // 1. Cargar comunas en el selector
    const filter = document.getElementById("location-filter");
    if(filter){
        filter.innerHTML = '<option value="">Comuna</option>';
        comunas.sort().forEach(c => {
            const op = document.createElement("option");
            op.value = c; op.textContent = c;
            filter.appendChild(op);
        });
    }

    // 2. Traer datos reales
    try {
        const respuesta = await fetch(APPS_SCRIPT_URL);
        const data = await respuesta.json();
        
        // Mapeamos los datos del Excel para que coincidan con tu diseño original
        allProducts = data.filter(fila => fila.estado && fila.estado.toString().toLowerCase().trim() === "aprobado")
                          .map(fila => ({
                              name: fila.nombre,
                              image: fila.imagen || 'images/logo.png',
                              price: fila.precio || '',
                              comuna: fila.comuna,
                              desc: fila.tags || fila.categoria || '',
                              contacto: fila.telefono
                          }));
        
        displayProducts(allProducts);
    } catch (error) {
        console.error("Error cargando datos:", error);
    }
}

function displayProducts(products) {
    const list = document.getElementById("product-list");
    const scroll = document.getElementById("cheap-scroll");
    const comunaList = document.getElementById("comuna-list");

    // Sección Picadas (Círculos)
    if(scroll){
        scroll.innerHTML = "";
        allProducts.forEach(p => {
            const div = document.createElement("div");
            div.className = "circle-item";
            div.onclick = () => abrirDetalleProducto(p);
            div.innerHTML = `<img src="${p.image}" class="circle-img"><p style="font-size:0.7rem; font-weight:600; margin-top:5px;">${p.name}</p>`;
            scroll.appendChild(div);
        });
    }

    // Sección Resultados (Grilla)
    if(list){
        list.innerHTML = "";
        if(products.length === 0) document.getElementById("no-results").style.display = "block";
        else {
            document.getElementById("no-results").style.display = "none";
            products.forEach(p => {
                const card = document.createElement("div");
                card.className = "res-card";
                card.onclick = () => abrirDetalleProducto(p);
                card.innerHTML = `<img src="${p.image}" class="res-thumb"><div class="res-info"><strong>${p.name}</strong><br><small>📍 ${p.comuna}</small><div style="color:#FF4500; font-weight:700; margin-top:5px;">${p.price}</div></div>`;
                list.appendChild(card);
            });
        }
    }

    // Recomendaciones en tu comuna
    if(comunaList) {
        comunaList.innerHTML = "";
        allProducts.slice(0, 3).forEach(p => {
            const card = document.createElement("div");
            card.className = "res-card";
            card.onclick = () => abrirDetalleProducto(p);
            card.innerHTML = `<img src="${p.image}" class="res-thumb"><div class="res-info"><strong>${p.name}</strong><br><small>📍 ${p.comuna}</small></div>`;
            comunaList.appendChild(card);
        });
    }
}

function abrirDetalleProducto(p) {
    const body = document.getElementById("popup-body");
    body.innerHTML = `
        <img src="${p.image}" style="width:100%; height:180px; object-fit:cover;">
        <div style="padding:20px; text-align:center;">
            <h2>${p.name}</h2>
            <p>${p.desc}</p>
            <h3 style="color:#FF4500;">${p.price}</h3>
            <a href="https://wa.me/${p.contacto}" target="_blank" style="background:#2ecc71; color:white; border:none; padding:12px; width:100%; border-radius:10px; font-weight:bold; cursor:pointer; text-decoration:none; display:block;">Contactar</a>
        </div>`;
    document.getElementById("productPopup").style.display = "flex";
}

// Mantener tus funciones de UI originales
function cerrarPopupProducto() { document.getElementById("productPopup").style.display = "none"; }
function abrirFormPromo() { document.getElementById("popupPromo").style.display = "flex"; }
function cerrarFormPromo() { document.getElementById("popupPromo").style.display = "none"; }
function abrirFormDato() { document.getElementById("popupDato").style.display = "flex"; }
function cerrarFormDato() { document.getElementById("popupDato").style.display = "none"; }

function buscar() {
    const loc = document.getElementById("location-filter").value;
    const txt = document.getElementById("main-search").value.toLowerCase();
    const res = allProducts.filter(p => (loc ? p.comuna === loc : true) && p.name.toLowerCase().includes(txt));
    displayProducts(res);
}

window.onclick = (e) => { if(e.target.className === 'popup-overlay') e.target.style.display = "none"; }
init();
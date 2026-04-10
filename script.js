const comunas = ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Bernardo", "San Joaquín", "San Miguel", "San Ramón", "Santiago", "Vitacura"];

const allProducts = [
    { name: "Sushis del Puerto", image: "images/sushi.jpg", price: 12000, comuna: "Santiago", desc: "Sushi premium artesanal.", contacto: "+56912345678" },
    { name: "La Picada de Don Salo", image: "images/casera.jpg", price: 5500, comuna: "San Bernardo", desc: "Sabor casero de verdad.", contacto: "+56988887777" },
    { name: "Pizzería Italia", image: "images/pizza.jpg", price: 8990, comuna: "Santiago", desc: "Pizzas a la piedra con ingredientes italianos.", contacto: "+56922223344" },
    { name: "Empanadas Ñuñoa", image: "images/empanadas.jpg", price: 2500, comuna: "Ñuñoa", desc: "Receta tradicional de pino y queso.", contacto: "+5622223344" }
];

function init() {
    const filter = document.getElementById("location-filter");
    if(filter){
        filter.innerHTML = '<option value="">Comuna</option>';
        comunas.sort().forEach(c => {
            const op = document.createElement("option");
            op.value = c; op.textContent = c;
            filter.appendChild(op);
        });
    }
    displayProducts(allProducts);
}

function displayProducts(products) {
    const list = document.getElementById("product-list");
    const scroll = document.getElementById("cheap-scroll");
    const comunaList = document.getElementById("comuna-list");

    if(scroll) {
        scroll.innerHTML = "";
        allProducts.forEach(p => {
            const div = document.createElement("div");
            div.className = "circle-item";
            div.onclick = () => abrirDetalleProducto(p);
            div.innerHTML = `<img src="${p.image}" class="circle-img"><p style="font-size:0.7rem; font-weight:600; margin-top:5px;">${p.name}</p>`;
            scroll.appendChild(div);
        });
    }

    if(list) {
        list.innerHTML = "";
        if(products.length === 0) document.getElementById("no-results").style.display = "block";
        else {
            document.getElementById("no-results").style.display = "none";
            products.forEach(p => list.appendChild(createCard(p)));
        }
    }

    if(comunaList) {
        comunaList.innerHTML = "";
        allProducts.slice(0, 3).forEach(p => comunaList.appendChild(createCard(p)));
    }
}

function createCard(p) {
    const card = document.createElement("div");
    card.className = "res-card";
    card.onclick = () => abrirDetalleProducto(p);
    card.innerHTML = `<img src="${p.image}" class="res-thumb"><div class="res-info"><strong>${p.name}</strong><br><small>📍 ${p.comuna}</small><div style="color:var(--primary); font-weight:700; margin-top:5px;">$${p.price.toLocaleString('es-CL')}</div></div>`;
    return card;
}

function abrirDetalleProducto(p) {
    const body = document.getElementById("popup-body");
    body.innerHTML = `
        <div style="width:100%; height:200px; overflow:hidden;">
            <img src="${p.image}" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div style="padding:20px; text-align:center; display:flex; flex-direction:column; gap:10px;">
            <h2 style="margin:0;">${p.name}</h2>
            <p style="color:#666; font-size:0.9rem; min-height:40px;">${p.desc}</p>
            <h3 style="color:var(--primary); margin:5px 0;">$${p.price.toLocaleString('es-CL')}</h3>
            <a href="https://wa.me/${p.contacto}" target="_blank" style="background:#25D366; color:white; text-decoration:none; padding:12px; border-radius:10px; font-weight:bold;">Contactar por WhatsApp</a>
            <button onclick="cerrarPopupProducto()" style="background:#eee; border:none; padding:10px; border-radius:10px; cursor:pointer;">Cerrar</button>
        </div>`;
    document.getElementById("productPopup").style.display = "flex";
}

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
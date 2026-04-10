const allProducts = [
    { name: "Sushis del Puerto", image: "images/sushi.jpg", price: 12000, comuna: "Santiago", desc: "Artesanal y fresco.", contacto: "+569 1234 5678", destacado: true },
    { name: "La Picada de Don Salo", image: "images/casera.jpg", price: 5500, comuna: "San Bernardo", desc: "Sabor de hogar.", contacto: "@DonSaloPicadas", destacado: true },
    { name: "Pizzería Italia", image: "images/pizza.jpg", price: 8990, comuna: "Santiago", desc: "Pizzas a la piedra.", contacto: "www.italia.cl", destacado: false },
    { name: "Empanadas Ñuñoa", image: "images/empanadas.jpg", price: 2500, comuna: "Ñuñoa", desc: "Pino y Queso.", contacto: "+562 888 7766", destacado: true }
];

const comunas = ["Santiago", "San Bernardo", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "Recoleta", "La Florida"];

// Iniciar Selector
const locationFilter = document.getElementById("location-filter");
if(locationFilter) {
    locationFilter.innerHTML = '<option value="">Selecciona Comuna</option>';
    comunas.sort().forEach(c => {
        const option = document.createElement("option");
        option.value = c; option.textContent = c;
        locationFilter.appendChild(option);
    });
}

function abrirFormPromo() { document.getElementById("popupPromo").style.display = "flex"; }
function cerrarFormPromo() { document.getElementById("popupPromo").style.display = "none"; }
function abrirFormDato() { document.getElementById("popupDato").style.display = "flex"; }
function cerrarFormDato() { document.getElementById("popupDato").style.display = "none"; }

function abrirDetalleProducto(p) {
    const popup = document.getElementById("productPopup");
    const body = document.getElementById("popup-body");
    body.innerHTML = `
        <div class="popup-img-container">
            <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="popup-info-padding">
            <h2>${p.name}</h2>
            <p><strong>📍 ${p.comuna}</strong></p>
            <p>${p.desc || 'Promoción exclusiva de barrio.'}</p>
            <h3 style="color:var(--primary);">$${p.price.toLocaleString('es-CL')}</h3>
            <p>📞 Contacto: ${p.contacto}</p>
            <button onclick="cerrarPopupProducto()" style="background:var(--secondary); color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold; width:100%;">Volver</button>
        </div>
    `;
    popup.style.display = "flex";
}

function cerrarPopupProducto() { document.getElementById("productPopup").style.display = "none"; }

function displayProducts(products, isFilter = false, selectedComuna = "") {
    const listElement = document.getElementById("product-list");
    const featuredSection = document.getElementById("featured-section");
    const featuredList = document.getElementById("featured-list");
    
    // Resultados Principales
    listElement.innerHTML = "";
    products.forEach(p => {
        const card = document.createElement("div");
        card.className = "res-card";
        card.onclick = () => abrirDetalleProducto(p);
        card.innerHTML = `<img src="${p.image}" class="res-thumb"><div class="res-info"><strong>${p.name}</strong><p>📍 ${p.comuna}</p><div>$${p.price.toLocaleString('es-CL')}</div></div>`;
        listElement.appendChild(card);
    });

    // Lógica de Destacados de la comuna
    if (isFilter && selectedComuna) {
        const destacados = allProducts.filter(p => p.comuna === selectedComuna && p.destacado);
        if (destacados.length > 0) {
            featuredSection.style.display = "block";
            featuredList.innerHTML = "";
            destacados.forEach(p => {
                const card = document.createElement("div");
                card.className = "res-card";
                card.onclick = () => abrirDetalleProducto(p);
                card.innerHTML = `<img src="${p.image}" class="res-thumb"><div class="res-info"><strong>${p.name}</strong><p>📍 ${p.comuna}</p></div>`;
                featuredList.appendChild(card);
            });
        } else {
            featuredSection.style.display = "none";
        }
    } else {
        featuredSection.style.display = "none";
    }
}

// El barrio recomienda siempre visible (Picadas)
function initRecomendados() {
    const scrollElement = document.getElementById("cheap-scroll");
    scrollElement.innerHTML = "";
    allProducts.forEach(p => {
        const item = document.createElement("div");
        item.className = "circle-item";
        item.onclick = () => abrirDetalleProducto(p);
        item.innerHTML = `<img src="${p.image}" class="circle-img"><p style="font-size:0.75rem; font-weight:600;">${p.name}</p>`;
        scrollElement.appendChild(item);
    });
}

function buscar() {
    const comuna = locationFilter.value;
    const texto = document.getElementById("main-search").value.toLowerCase();
    const filtrados = allProducts.filter(p => {
        const matchComuna = comuna ? p.comuna === comuna : true;
        const matchTexto = p.name.toLowerCase().includes(texto);
        return matchComuna && matchTexto;
    });
    displayProducts(filtrados, true, comuna);
}

window.onclick = (e) => { if (e.target.className === 'popup-overlay') e.target.style.display = "none"; }

initRecomendados();
displayProducts(allProducts);
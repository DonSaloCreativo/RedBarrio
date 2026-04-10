const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxH1VvPvLKq9bxXD3bnP8owGzJVE0gmxScoWWY9smVlnO3TIPg554rTRdg34htBSDGysA/exec"; 
let allProducts = [];

async function init() {
    try {
        const respuesta = await fetch(APPS_SCRIPT_URL);
        const data = await respuesta.json();
        
        // Filtramos solo los locales marcados como "aprobado" en tu Excel
        allProducts = data.filter(f => f.estado && f.estado.toString().toLowerCase().trim() === "aprobado");
        
        displayProducts(allProducts);
    } catch (e) { console.error("Error cargando datos:", e); }
}

function displayProducts(products) {
    const list = document.getElementById("product-list");
    if(list) {
        list.innerHTML = products.map(p => `
            <div class="res-card">
                <img src="${p.imagen || 'images/logo.png'}" class="res-thumb">
                <div class="res-info">
                    <strong>${p.nombre}</strong><br>
                    <small>📍 ${p.comuna}</small>
                    <div style="color:#FF4500; font-weight:700;">${p.precio || ''}</div>
                </div>
            </div>
        `).join('');
    }
}
init();
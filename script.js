// LISTA DE PRODUCTOS
const allProducts = [
  { name: "Casera", image: "images/casera.jpg", price: 5000, comuna: "Providencia", destacado: true },
  { name: "Completo", image: "images/completo.jpg", price: 6000, comuna: "Las Condes" },
  { name: "Empanadas", image: "images/empanadas.jpg", price: 2000, comuna: "Ñuñoa", destacado: true },
  { name: "Pizza", image: "images/pizza.jpg", price: 8000, comuna: "Providencia" },
  { name: "Sushi", image: "images/sushi.jpg", price: 9000, comuna: "Las Condes" }
];

// ELEMENTOS DEL DOM
const cheapScroll = document.getElementById("cheap-scroll");
const featuredScroll = document.getElementById("featured-scroll");
const productList = document.getElementById("product-list");
const locationFilter = document.getElementById("location-filter");
const searchInput = document.getElementById("search-input");

// RELLENAR SELECT DE COMUNAS
const comunas = [...new Set(allProducts.map(p => p.comuna))];
comunas.forEach(c => {
  const option = document.createElement("option");
  option.value = c;
  option.textContent = c;
  locationFilter.appendChild(option);
});

// FUNCIÓN PARA MOSTRAR PRODUCTOS
function displayProducts(products, filterDestacados = false) {
  // "Lo más barato" siempre intacto
  cheapScroll.innerHTML = "";
  allProducts.forEach(p => {
    const cheapCard = document.createElement("div");
    cheapCard.className = "cheap-card";
    cheapCard.innerHTML = `
      ${p.destacado ? `<div class="badge">🌟 Oferta Real</div>` : ''}
      <img src="${p.image}" alt="${p.name}">
      <div class="info">
        <strong>${p.name}</strong><br>
        <small>${p.comuna}</small>
        <div>$${p.price.toLocaleString('es-CL')}</div>
      </div>
    `;
    cheapScroll.appendChild(cheapCard);
  });

  // Destacados filtrados
  featuredScroll.innerHTML = "";
  const destacados = products.filter(p => p.destacado);
  if(destacados.length === 0){
    featuredScroll.innerHTML = `<p class="no-results">No hay destacados en tu comuna.</p>`;
  } else {
    destacados.forEach(p => {
      const featuredCard = document.createElement("div");
      featuredCard.className = "featured-card";
      featuredCard.innerHTML = `
        <div class="badge">🌟 Destacado</div>
        <img src="${p.image}" alt="${p.name}">
        <div class="info">
          <strong>${p.name}</strong><br>
          <small>${p.comuna}</small>
          <div>$${p.price.toLocaleString('es-CL')}</div>
        </div>
      `;
      featuredScroll.appendChild(featuredCard);
    });
  }

  // Lista vertical
  productList.innerHTML = "";
  if(products.length === 0){
    productList.innerHTML = `<p class="no-results">No encontramos promociones con esos filtros. ¡Prueba otra búsqueda!</p>`;
  } else {
    products.forEach(p => {
      const li = document.createElement("li");
      li.innerHTML = `
        <img class="product-img" src="${p.image}" alt="${p.name}">
        <div class="product-info">
          <strong>${p.name}</strong> - <small>${p.comuna}</small><br>
          <strong>$${p.price.toLocaleString('es-CL')}</strong>
        </div>
      `;
      productList.appendChild(li);
    });
  }
}

// FUNCIÓN DE BÚSQUEDA Y FILTRO
function buscar() {
  const comuna = locationFilter.value;
  const query = searchInput.value.toLowerCase();

  const filtered = allProducts.filter(p => {
    const matchComuna = comuna ? p.comuna === comuna : true;
    const matchName = query ? p.name.toLowerCase().includes(query) : true;
    return matchComuna && matchName;
  });

  displayProducts(filtered);
}

// INICIALIZAR
displayProducts(allProducts);
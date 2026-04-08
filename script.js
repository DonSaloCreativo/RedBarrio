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

// MODAL DE CONTACTO
const modal = document.createElement("div");
modal.id = "modal";
document.body.appendChild(modal);

const modalClose = document.createElement("span");
modalClose.textContent = "✖";
modal.appendChild(modalClose);

const modalImg = document.createElement("img");
modal.appendChild(modalImg);

const modalName = document.createElement("div");
modalName.style.fontWeight = "600";
modal.appendChild(modalName);

const modalComuna = document.createElement("div");
modalComuna.style.fontSize = "0.9rem";
modalComuna.style.color = "#555";
modal.appendChild(modalComuna);

const modalPrice = document.createElement("div");
modalPrice.style.fontWeight = "600";
modal.appendChild(modalPrice);

const modalBtn = document.createElement("button");
modalBtn.textContent = "📩 Contactar";
modal.appendChild(modalBtn);

// CERRAR MODAL
modalClose.addEventListener("click", closeModal);
modalBtn.addEventListener("click", () => window.open("https://wa.me/56984368260", "_blank"));
window.addEventListener("click", e => { if(e.target === modal) closeModal(); });
function closeModal(){
  modal.style.transform = "translate(-50%, -50%) scale(0)";
  setTimeout(()=>{
    modalImg.src = "";
    modalName.textContent = "";
    modalComuna.textContent = "";
    modalPrice.textContent = "";
  }, 250);
}

// RELLENAR SELECT DE COMUNAS
const comunas = [...new Set(allProducts.map(p => p.comuna))];
comunas.forEach(c => {
  const option = document.createElement("option");
  option.value = c;
  option.textContent = c;
  locationFilter.appendChild(option);
});

// MOSTRAR PRODUCTOS
function displayProducts(products){
  // Lo más barato SIEMPRE visible
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
    cheapCard.addEventListener("click", () => showModal(p));
    cheapScroll.appendChild(cheapCard);
  });

  // Destacados
  featuredScroll.innerHTML = "";
  const destacados = products.filter(p => p.destacado);
  if(destacados.length === 0){
    featuredScroll.innerHTML = `<p style="padding:20px; color:#666;">No hay destacados en esta comuna.</p>`;
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
      featuredCard.addEventListener("click", () => showModal(p));
      featuredScroll.appendChild(featuredCard);
    });
  }

  // Lista vertical
  productList.innerHTML = "";
  if(products.length === 0){
    productList.innerHTML = `<p style="padding:20px; color:#666;">No se encontraron promociones con esos filtros.</p>`;
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
      li.addEventListener("click", () => showModal(p));
      productList.appendChild(li);
    });
  }
}

// ANIMACIÓN SUAVE DEL MODAL
function showModal(product){
  modalImg.src = product.image;
  modalName.textContent = product.name;
  modalComuna.textContent = product.comuna;
  modalPrice.textContent = `$${product.price.toLocaleString('es-CL')}`;
  
  modal.style.transform = "translate(-50%, -50%) scale(0.8)";
  modal.style.transition = "transform 0.4s cubic-bezier(.25,.8,.25,1)";
  setTimeout(()=> modal.style.transform = "translate(-50%, -50%) scale(1)", 50);
}

// BÚSQUEDA
function buscar(){
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
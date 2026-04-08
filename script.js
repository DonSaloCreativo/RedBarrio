const allProducts = [
  { name: "Casera", image: "images/casera.jpg", price: 5000, comuna: "Providencia" },
  { name: "Completo", image: "images/completo.jpg", price: 6000, comuna: "Las Condes" },
  { name: "Empanadas", image: "images/empanadas.jpg", price: 2000, comuna: "Ñuñoa" },
  { name: "Pizza", image: "images/pizza.jpg", price: 8000, comuna: "Providencia" },
  { name: "Sushi", image: "images/sushi.jpg", price: 9000, comuna: "Las Condes" }
];

const cheapScroll = document.getElementById("cheap-scroll");
const featuredScroll = document.getElementById("featured-scroll");
const productList = document.getElementById("product-list");
const locationFilter = document.getElementById("location-filter");
const searchInput = document.getElementById("search-input");

const normalizeText = (text) => {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

function displayProducts(products) {
  cheapScroll.innerHTML = "";
  featuredScroll.innerHTML = "";
  productList.innerHTML = "";

  if (products.length === 0) {
    const noResults = `<p style="grid-column: 1/-1; padding: 20px; color: #666;">
      No encontramos promociones con esos filtros. ¡Prueba otra búsqueda!
    </p>`;
    productList.innerHTML = noResults;
    return;
  }

  products.forEach(p => {
    const cardHTML = `
      <div class="cheap-card"> 
        <img src="${p.image}" alt="${p.name}">
        <div class="info">
          <strong>${p.name}</strong><br>
          <small>${p.comuna}</small>
          <div class="price-tag">$${p.price.toLocaleString('es-CL')}</div>
        </div>
      </div>
    `;
    cheapScroll.innerHTML += cardHTML;
    featuredScroll.innerHTML += cardHTML.replace("cheap-card", "featured-card");

    const li = document.createElement("li");
    li.innerHTML = `
      <img class="product-img" src="${p.image}">
      <div class="product-info">
        <strong>${p.name}</strong> - <small>${p.comuna}</small><br>
        <strong>$${p.price.toLocaleString('es-CL')}</strong>
      </div>
    `;
    productList.appendChild(li);
  });
}

function buscar() {
  const comuna = locationFilter.value;
  const query = normalizeText(searchInput.value);

  const filtered = allProducts.filter(p => {
    const matchComuna = comuna ? p.comuna === comuna : true;
    const matchName = query ? normalizeText(p.name).includes(query) : true;
    return matchComuna && matchName;
  });

  displayProducts(filtered);
}

displayProducts(allProducts);
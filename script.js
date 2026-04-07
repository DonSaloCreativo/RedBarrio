// EJEMPLO DE PRODUCTOS
const allProducts = [
  {name: 'Pizza Pepperoni', comuna: 'Providencia', type: 'cheap', img:'img1.jpg'},
  {name: 'Sushi Roll', comuna: 'Ñuñoa', type: 'cheap', img:'img2.jpg'},
  {name: 'Pastel de choclo', comuna: 'Providencia', type: 'featured', img:'img3.jpg'},
  {name: 'Café Latte', comuna: 'Ñuñoa', type: 'featured', img:'img4.jpg'}
];

// FUNCION MOSTRAR PRODUCTOS
function displayProducts(products){
  const cheapContainer = document.getElementById('cheap-scroll');
  const featuredContainer = document.getElementById('featured-scroll');
  const productList = document.getElementById('product-list');

  cheapContainer.innerHTML = '';
  featuredContainer.innerHTML = '';
  productList.innerHTML = '';

  products.forEach(p => {
    const card = document.createElement('div');
    card.classList.add(p.type === 'cheap' ? 'cheap-card' : 'featured-card');
    card.innerHTML = `<img src="${p.img}" alt="${p.name}">
                      <div class="info"><h4>${p.name}</h4><button class="contact-business">Contactar</button></div>`;
    if(p.type === 'cheap') cheapContainer.appendChild(card);
    if(p.type === 'featured') featuredContainer.appendChild(card);
    // Todos los productos
    const li = document.createElement('li');
    li.innerHTML = `<img class="product-img" src="${p.img}" alt="${p.name}"><div class="product-info"><h4>${p.name}</h4></div>`;
    productList.appendChild(li);
  });
}

// FUNCIÓN BUSCAR
function buscar() {
  displayProducts(allProducts);
}

// CARGAR INICIAL
displayProducts(allProducts);
// Tu link real de Google Sheets (Pestaña Publicados)
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRWzx7f1vqDJI0loZSkE0nMI9ZNc65LU9VU3Dejgj1eByfSAFHu3Nea8XsMlWwQgYoCJFjCA8UpU2ui/pub?gid=0&single=true&output=csv';

async function cargarPublicados() {
    const gridLocales = document.getElementById('locals-grid');
    if(!gridLocales) return;

    try {
        const respuesta = await fetch(SHEET_URL);
        const texto = await respuesta.text();
        
        // Dividimos por filas y quitamos la cabecera
        const filas = texto.split('\n').slice(1); 
        
        gridLocales.innerHTML = ''; 

        filas.forEach(linea => {
            // Separador por comas que respeta textos entre comillas
            const col = linea.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

            if (col.length < 6) return; 

            // Mapeo según tus columnas en Sheets:
            // Col D (3): Imagen | Col E (4): Dirección | Col F (5): El Dato | Col H (7): Autor
            const imagen = col[3]?.replace(/"/g, '').trim();    
            const donde = col[4]?.replace(/"/g, '').trim();     
            const elDato = col[5]?.replace(/"/g, '').trim();    
            const autor = col[7]?.replace(/"/g, '').trim();     

            const card = document.createElement('div');
            card.className = 'local-card';
            card.innerHTML = `
                <div class="card-img-box">
                    <img src="${imagen}" alt="Picada" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='https://via.placeholder.com/400x250?text=LlamaBarrio'">
                    <span class="badge open">Picada</span>
                </div>
                <div class="card-body">
                    <h3 style="font-size: 1.1rem; line-height: 1.3; margin:0 0 8px 0;">${elDato}</h3>
                    <p style="font-size:0.8rem; color:#666; margin:0;">📍 ${donde}</p>
                    <div class="card-foot">
                        <span>👤 Por: ${autor || 'Vecino'}</span>
                        <span style="color:#f26522;">⭐ Recomendado</span>
                    </div>
                </div>`;
            gridLocales.appendChild(card);
        });
    } catch (error) {
        console.error('Error al conectar con la pestaña Publicados:', error);
        gridLocales.innerHTML = '<p>Cargando picadas...</p>';
    }
}

document.addEventListener('DOMContentLoaded', cargarPublicados);
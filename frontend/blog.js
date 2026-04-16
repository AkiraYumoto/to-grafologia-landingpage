const STRAPI_URL = 'http://localhost:1337';

async function cargarBlog() {
    try {
        const response = await fetch(`${STRAPI_URL}/api/articulos?sort=publishedAt:desc&pagination[limit]=3&populate=*`);
        const { data } = await response.json();

        const contenedor = document.querySelector('.articulos-blog');
        if (!contenedor) return;

        contenedor.innerHTML = '';

        data.forEach((post, index) => {
            // LÓGICA DE IMAGEN CORREGIDA:
            // Verificamos que 'Imagen' exista, sea un Array, y tenga al menos 1 elemento
            let imgUrl = '';
            if (post.Imagen && Array.isArray(post.Imagen) && post.Imagen.length > 0) {
                imgUrl = post.Imagen[0].url; // Entramos al índice 0 del Array
            } else if (post.Imagen && post.Imagen.url) {
                imgUrl = post.Imagen.url; // Por si acaso Strapi decide no mandarlo como Array
            }

            const fullImgUrl = imgUrl ? `${STRAPI_URL}${imgUrl}` : 'garabatos.jpeg';

            if (index === 0) {
                contenedor.innerHTML += `
                    <article class="post-card-main">
                        <div class="post-imagen">
                            <img src="${fullImgUrl}" alt="${post.Titulo}">
                            <div class="post-main-text">    
                                <span class="post-categoria">${post.Categoria.toUpperCase()}</span>
                                <h3>${post.Titulo}</h3>
                            </div>
                        </div>
                    </article>
                `;
            } else {
                contenedor.innerHTML += `
                    <article class="post-card">
                        <img src="${fullImgUrl}" alt="${post.Titulo}" class="post-thumb">
                        <div class="post-content">
                            <h3>${post.Titulo}</h3>
                            <p>${post.Resumen}</p>
                        </div>
                    </article>
                `;
            }
        });
    } catch (error) {
        console.error("Error conectando con Strapi:", error);
    }
}

document.addEventListener('DOMContentLoaded', cargarBlog);
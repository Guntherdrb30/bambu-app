document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID del producto de la URL (ej. ?id=lamina-122)
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    // Encontrar el producto en nuestro objeto de datos
    const product = products[productId];

    // Elementos del DOM que vamos a actualizar
    const productNameEl = document.getElementById('product-name');
    const productPriceEl = document.getElementById('product-price');
    const productDescriptionEl = document.getElementById('product-description');
    const mainImageEl = document.getElementById('main-product-image');
    const thumbnailGalleryEl = document.getElementById('thumbnail-gallery');
    const whatsappLinkEl = document.getElementById('product-whatsapp-link');
    const mainImageContainer = document.querySelector('.main-image-container');

    if (product) {
        // Si encontramos el producto, actualizamos la página
        document.title = `${product.name} - Bambu App`;
        productNameEl.textContent = product.name;
        productPriceEl.textContent = product.price;
        productDescriptionEl.textContent = product.description;
        whatsappLinkEl.href = product.whatsapp_link;

        // Establecer la imagen principal inicial
        mainImageEl.src = product.images[0];
        mainImageContainer.style.backgroundImage = `url(${product.images[0]})`;

        // Limpiar y crear la galería de miniaturas
        thumbnailGalleryEl.innerHTML = '';
        product.images.forEach((imgSrc, index) => {
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.alt = `Vista ${index + 1} de ${product.name}`;
            thumb.classList.add('thumbnail');
            if (index === 0) {
                thumb.classList.add('active');
            }
            // Evento para cambiar la imagen principal al hacer clic en una miniatura
            thumb.addEventListener('click', () => {
                mainImageEl.src = imgSrc;
                mainImageContainer.style.backgroundImage = `url(${imgSrc})`;
                // Actualizar la clase 'active' en las miniaturas
                document.querySelector('.thumbnail.active').classList.remove('active');
                thumb.classList.add('active');
            });
            thumbnailGalleryEl.appendChild(thumb);
        });

        // Lógica para el zoom en la imagen principal
        mainImageContainer.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = e.target.getBoundingClientRect();
            const x = (e.clientX - left) / width * 100;
            const y = (e.clientY - top) / height * 100;
            mainImageContainer.style.backgroundPosition = `${x}% ${y}%`;
        });

    } else {
        // Si el producto no existe, mostrar un mensaje de error
        productNameEl.textContent = 'Producto no encontrado';
        document.querySelector('.product-detail-layout').innerHTML = 
            '<h1>Error 404</h1><p>El producto que buscas no existe. <a href="index.html">Volver al inicio</a>.</p>';
    }
});
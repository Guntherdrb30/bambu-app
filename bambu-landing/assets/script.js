document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURACIÓN Y ESTADO GLOBAL ---

    const WHATSAPP_NUMBER = '584245262306'; // Número de teléfono para WhatsApp

    // Base de datos de productos. La fuente de verdad.
    const products = {
        'lamina-122': {
            name: 'Lámina 1.22m x 3.00m',
            price: 110.00,
            image: 'assets/images/hero2.png',
            description: 'Ideal para revestimientos amplios y proyectos de gran escala.',
        },
        'lamina-60': {
            name: 'Lámina 0.60m x 3.00m',
            price: 60.00,
            image: 'assets/images/hero1.png',
            description: 'Perfecta para mobiliario, detalles decorativos y espacios más reducidos.',
        },
        'lamina-40': {
            name: 'Lámina 0.40m x 3.00m',
            price: 48.00,
            image: 'assets/images/hero3.png',
            description: 'Versátil para proyectos personalizados y acabados finos.',
        },
        'perfil-aluminio': {
            name: 'Perfil de aluminio 3m',
            price: 10.00,
            image: 'assets/images/perfil2.jpg',
            description: 'Para mejorar acabados y estética, disponible en colores variados.',
        }
    };

    // Cargar carrito desde localStorage o inicializarlo como un array vacío
    let cart = JSON.parse(localStorage.getItem('bambuCart')) || [];

    // --- 2. SELECTORES DE ELEMENTOS DEL DOM ---

    // Modales
    const whatsappModal = document.getElementById('whatsapp-modal');
    const cartModal = document.getElementById('cart-modal');
    const allModals = document.querySelectorAll('.modal');

    // Botones para abrir modales
    const openWhatsAppModalBtn = document.getElementById('open-modal-btn');
    const openCartModalBtn = document.getElementById('cart-icon-link');

    // Botones para cerrar modales
    const closeButtons = document.querySelectorAll('.close-btn');
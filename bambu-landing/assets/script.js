document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    // Replace with your actual API URL and WhatsApp number in a real environment
    const VITE_API_URL = 'http://localhost:3000/api'; // Example for local dev
    const MASTER_WHATS = '1234567890'; // Replace with your WhatsApp number

    // --- Landing Page Logic ---
    if (document.getElementById('whatsapp-modal')) {
        const modal = document.getElementById('whatsapp-modal');
        const openModalBtn = document.getElementById('open-modal-btn');
        const closeModalBtn = document.querySelector('.close-btn');

        openModalBtn.onclick = () => modal.classList.add('show');
        closeModalBtn.onclick = () => modal.classList.remove('show');
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.classList.remove('show');
            }
        };

        // Handle Modal Form Submission
        const whatsappForm = document.getElementById('whatsapp-form');
        whatsappForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = whatsappForm.querySelector('button[type="submit"]');
            const data = {
                name: document.getElementById('modal-name').value,
                phone: document.getElementById('modal-phone').value,
                email: document.getElementById('modal-email').value,
                city: document.getElementById('modal-city').value,
                notes: document.getElementById('modal-notes').value,
                qty_122x300: document.getElementById('qty_122x300').value,
                qty_60x300: document.getElementById('qty_60x300').value,
                qty_40x300: document.getElementById('qty_40x300').value,
                source: 'Modal WhatsApp',
            };

            if (!data.phone) {
                alert('El teléfono es requerido para continuar por WhatsApp.');
                return;
            }

            await submitLead(data, true, submitButton);
        });

        // Handle Contact Form Submission
        const contactForm = document.getElementById('contact-form');
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const data = {
                name: document.getElementById('contact-name').value,
                phone: document.getElementById('contact-phone').value,
                email: document.getElementById('contact-email').value,
                notes: document.getElementById('contact-notes').value,
                source: 'Formulario de Contacto',
            };

            if (!data.email && !data.phone) {
                alert('Debe proporcionar un email o un teléfono.');
                return;
            }

            await submitLead(data, false, submitButton);
        });

        

        // --- Product Carousel Logic ---
        const productGrid = document.querySelector('.product-grid');
        if (productGrid) {
            const prevBtn = document.querySelector('#producto .carousel-btn.prev');
            const nextBtn = document.querySelector('#producto .carousel-btn.next');
            
            const scrollCarousel = (direction) => {
                const card = productGrid.querySelector('.product-card');
                if (!card) return; // No cards, do nothing

                const gap = 30; // Must match the 'gap' in CSS
                const scrollAmount = card.offsetWidth + gap;

                productGrid.scrollBy({
                    left: scrollAmount * direction,
                    behavior: 'smooth'
                });
            };

            nextBtn.addEventListener('click', () => scrollCarousel(1));
            prevBtn.addEventListener('click', () => scrollCarousel(-1));

            const updateButtonState = () => {
                if (!prevBtn || !nextBtn) return;
                // A small tolerance is needed for floating point inaccuracies
                const isAtStart = productGrid.scrollLeft < 10;
                const isAtEnd = productGrid.scrollLeft + productGrid.clientWidth >= productGrid.scrollWidth - 10;

                prevBtn.disabled = isAtStart;
                nextBtn.disabled = isAtEnd;
            };

            productGrid.addEventListener('scroll', updateButtonState);
            window.addEventListener('resize', updateButtonState);
            setTimeout(updateButtonState, 100); // Initial check
        }

        // --- Perfiles Carousel Logic ---
        const perfilesGrid = document.querySelector('.perfiles-grid');
        if (perfilesGrid) {
            const prevBtn = document.querySelector('#perfiles-aluminio .carousel-btn.prev');
            const nextBtn = document.querySelector('#perfiles-aluminio .carousel-btn.next');
            
            const scrollCarousel = (direction) => {
                const card = perfilesGrid.querySelector('.product-card');
                if (!card) return; // No cards, do nothing

                const gap = 30; // Must match the 'gap' in CSS
                const scrollAmount = card.offsetWidth + gap;

                perfilesGrid.scrollBy({
                    left: scrollAmount * direction,
                    behavior: 'smooth'
                });
            };

            nextBtn.addEventListener('click', () => scrollCarousel(1));
            prevBtn.addEventListener('click', () => scrollCarousel(-1));

            const updateButtonState = () => {
                if (!prevBtn || !nextBtn) return;
                // A small tolerance is needed for floating point inaccuracies
                const isAtStart = perfilesGrid.scrollLeft < 10;
                const isAtEnd = perfilesGrid.scrollLeft + perfilesGrid.clientWidth >= perfilesGrid.scrollWidth - 10;

                prevBtn.disabled = isAtStart;
                nextBtn.disabled = isAtEnd;
            };

            perfilesGrid.addEventListener('scroll', updateButtonState);
            window.addEventListener('resize', updateButtonState);
            setTimeout(updateButtonState, 100); // Initial check
        }
    }

    async function submitLead(data, openWhatsApp, submitButton) {
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Enviando...';

        try {
            const response = await fetch(`${VITE_API_URL}/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error al enviar el lead');
            }

            alert('¡Gracias! Hemos recibido tus datos.');

            if (openWhatsApp) {
                let message = "Hola, estoy interesado en las láminas de bambú.\n";
                if(data.qty_122x300 > 0) message += `1.22x3.00m: ${data.qty_122x300} unidades\n`;
                if(data.qty_60x300 > 0) message += `0.60x3.00m: ${data.qty_60x300} unidades\n`;
                if(data.qty_40x300 > 0) message += `0.40x3.00m: ${data.qty_40x300} unidades\n`;
                message += `\nMis datos son: ${data.name}, ${data.city}`;
                window.open(`https://wa.me/${MASTER_WHATS}?text=${encodeURIComponent(message)}`, '_blank');
            }
            
            // Reset forms
            document.getElementById('whatsapp-form')?.reset();
            document.getElementById('contact-form')?.reset();
            if(document.getElementById('whatsapp-modal')) document.getElementById('whatsapp-modal').classList.remove('show');

        } catch (error) {
            console.error(error);
            alert('Hubo un problema al enviar tu solicitud. Por favor, inténtalo de nuevo.');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    }

    // --- Admin Page Logic ---
    if (document.getElementById('admin-token')) {
        const viewLeadsBtn = document.getElementById('view-leads-btn');
        const downloadCsvBtn = document.getElementById('download-csv-btn');
        const resultsDiv = document.getElementById('results');
        
        function getAdminToken() {
            const token = document.getElementById('admin-token').value;
            if (!token) {
                alert('Por favor, introduce el token.');
                return null;
            }
            return token;
        }

        viewLeadsBtn.addEventListener('click', async () => {
            const token = getAdminToken();
            if (!token) return;
            try {
                const res = await fetch(`${VITE_API_URL}/admin/leads`, { headers: { 'Authorization': `Bearer ${token}` } });
                if(res.status === 401) { alert('Token no válido.'); return; }
                if (!res.ok) throw new Error(`Error del servidor: ${res.statusText}`);
                const leads = await res.json();
                displayLeads(leads);
            } catch (err) {
                resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
            }
        });
        
        downloadCsvBtn.addEventListener('click', async () => {
            const token = getAdminToken();
            if (!token) return;
            try {
                const res = await fetch(`${VITE_API_URL}/admin/csv`, { headers: { 'Authorization': `Bearer ${token}` } });
                if(res.status === 401) { alert('Token no válido.'); return; }
                if (!res.ok) throw new Error(`Error del servidor: ${res.statusText}`);
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                const date = new Date().toISOString().split('T')[0];
                a.download = `leads_bambu_${date}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            } catch (err) {
                resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
            }
        });

        function displayLeads(leads) {
            if (leads.length === 0) {
                resultsDiv.innerHTML = '<p>No hay leads todavía.</p>';
                return;
            }
            const table = document.createElement('table');
            const thead = table.createTHead();
            const headerRow = thead.insertRow();
            Object.keys(leads[0]).forEach(key => {
                const th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);
            });

            const tbody = table.createTBody();
            leads.forEach(lead => {
                const row = tbody.insertRow();
                Object.values(lead).forEach(text => {
                    const cell = row.insertCell();
                    cell.textContent = text;
                });
            });

            resultsDiv.innerHTML = '';
            resultsDiv.appendChild(table);
        }
    }
});
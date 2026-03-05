/**
 * TECNOLOGY SOLUTIONS - JAVASCRIPT
 * Version limpia sin duplicados ni redeclaraciones
 */

const hamburger = document.getElementById('hamburger');
const navbarMenu = document.getElementById('navbarMenu');
const navLinks = document.querySelectorAll('.nav-link');
const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
const contactForm = document.getElementById('contactForm');
const testimoniosForm = document.getElementById('testimoniosForm');
const testimoniosContainer = document.getElementById('testimoniosContainer');
const starRating = document.getElementById('starRating');
const ratingValue = document.getElementById('ratingValue');
const stars = starRating ? starRating.querySelectorAll('.star') : [];

function scrollToServicios() {
    const section = document.getElementById('servicios');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

function scrollToContacto() {
    const section = document.getElementById('contacto');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

if (hamburger && navbarMenu) {
    hamburger.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

dropdownItems.forEach((item) => {
    const dropdownLink = item.querySelector('.nav-link');
    const dropdownMenu = item.querySelector('.dropdown-menu');

    if (!dropdownLink || !dropdownMenu) return;

    dropdownLink.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;
        e.preventDefault();

        dropdownItems.forEach((otherItem) => {
            if (otherItem === item) return;
            const otherMenu = otherItem.querySelector('.dropdown-menu');
            if (otherMenu) otherMenu.style.display = 'none';
        });

        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (!navbarMenu || !hamburger) return;
        navbarMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    navbar.style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none';
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        observer.unobserve(entry.target);
    });
}, observerOptions);

document
    .querySelectorAll('.service-card, .caracteristicas-item, .solucion-item, .proceso-step, .testimonios-card')
    .forEach((el) => {
        el.style.opacity = '0';
        observer.observe(el);
    });

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function ensureNotificationStyles() {
    if (document.getElementById('notification-animations')) return;
    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

function showNotification(message, type = 'info') {
    ensureNotificationStyles();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: #fff;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 400px;
        word-wrap: break-word;
    `;

    notification.style.backgroundColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre')?.value.trim() || '';
        const telefono = document.getElementById('telefono')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const servicio = document.getElementById('servicio')?.value || '';
        const mensaje = document.getElementById('mensaje')?.value.trim() || '';

        if (!nombre || !telefono || !email || !servicio || !mensaje) {
            showNotification('Por favor completa todos los campos', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Por favor ingresa un email valido', 'error');
            return;
        }

        if (!/^\d{9,15}$/.test(telefono.replace(/\D/g, ''))) {
            showNotification('Por favor ingresa un telefono valido', 'error');
            return;
        }

        showNotification('Formulario enviado correctamente. Te contactaremos pronto.', 'success');
        setTimeout(() => contactForm.reset(), 800);
    });
}

function updateStarDisplay(rating) {
    stars.forEach((star) => {
        const value = Number(star.getAttribute('data-rating'));
        if (value <= rating) {
            star.classList.add('active');
            star.textContent = '★';
            star.style.color = '#D4AF37';
        } else {
            star.classList.remove('active');
            star.textContent = '☆';
            star.style.color = '';
        }
    });
}

if (starRating && ratingValue && stars.length) {
    stars.forEach((star) => {
        star.addEventListener('click', () => {
            const rating = Number(star.getAttribute('data-rating'));
            ratingValue.value = String(rating);
            updateStarDisplay(rating);
        });

        star.addEventListener('mouseenter', () => {
            const rating = Number(star.getAttribute('data-rating'));
            updateStarDisplay(rating);
        });
    });

    starRating.addEventListener('mouseleave', () => {
        updateStarDisplay(Number(ratingValue.value) || 0);
    });
}

if (testimoniosForm && testimoniosContainer) {
    testimoniosForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombreTestimonio')?.value.trim() || '';
        const cargo = document.getElementById('cargoTestimonio')?.value.trim() || '';
        const rating = Number(document.getElementById('ratingValue')?.value || '0');
        const comentario = document.getElementById('comentarioTestimonio')?.value.trim() || '';

        if (!nombre || !cargo || !comentario) {
            showNotification('Por favor completa todos los campos', 'error');
            return;
        }

        if (!rating) {
            showNotification('Por favor selecciona una calificacion', 'error');
            return;
        }

        const card = document.createElement('div');
        const starsText = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        card.className = 'testimonios-card';
        card.style.animation = 'fadeInUp 0.6s ease-out';
        card.innerHTML = `
            <div class="testimonios-stars" style="color: #D4AF37;">${starsText}</div>
            <p>"${comentario}"</p>
            <p class="testimonios-autor">- ${nombre}, ${cargo}</p>
        `;

        testimoniosContainer.insertBefore(card, testimoniosContainer.firstChild);
        showNotification('Gracias por tu resena. Tu opinion ha sido publicada.', 'success');

        testimoniosForm.reset();
        if (ratingValue) ratingValue.value = '0';
        updateStarDisplay(0);
    });
}

document.querySelectorAll('input, textarea, select').forEach((input) => {
    input.addEventListener('focus', function onFocus() {
        if (this.parentElement) this.parentElement.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', function onBlur() {
        if (this.parentElement) this.parentElement.style.transform = 'scale(1)';
    });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function onClick(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

window.scrollToServicios = scrollToServicios;
window.scrollToContacto = scrollToContacto;

console.log('Tecnology Solutions - script cargado sin errores');

/* =====================================================
   EJEMPLOS DE CÓDIGO AVANZADO (COPY & PASTE)
   ===================================================== */

/* 
Aquí encontrarás ejemplos de funcionalidades avanzadas
que puedes copiar y pegar fácilmente en tu código.
*/

/* ===== EJEMPLO 1: EFECTO PARALLAX EN HERO ===== */

// Agregar en js/script.js
document.addEventListener('mousemove', (e) => {
    const parallaxElements = document.querySelectorAll('.hero-background');
    
    parallaxElements.forEach(element => {
        const moveValue = e.clientX * 0.05;
        element.style.transform = `translateX(${moveValue}px)`;
    });
});


/* ===== EJEMPLO 2: ANIMACIÓN DE SCROLL INFINITO ===== */

// Agregar en js/script.js
const observerConfig = {
    threshold: [0, 0.25, 0.5, 0.75, 1],
    rootMargin: '0px'
};

const elementsToAnimate = document.querySelectorAll(
    '.service-card, .caracteristicas-item, .solucion-item'
);

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerConfig);

elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});


/* ===== EJEMPLO 3: EFECTO HOVER CON MOUSE ===== */

// Agregar en js/script.js
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.background = 
            `radial-gradient(circle at ${x}px ${y}px, rgba(0, 123, 255, 0.1), transparent)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.background = '';
    });
});


/* ===== EJEMPLO 4: VALIDACIÓN AVANZADA FORMULARIO ===== */

function validarFormulario(form) {
    const campos = {
        nombre: {
            elemento: form.querySelector('#nombre'),
            regex: /^[a-zA-ZáéíóúÁÉÍÓÚ\s]{3,}$/,
            mensaje: 'Nombre debe tener al menos 3 caracteres'
        },
        email: {
            elemento: form.querySelector('#email'),
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            mensaje: 'Email inválido'
        },
        telefono: {
            elemento: form.querySelector('#telefono'),
            regex: /^\d{9,15}$/,
            mensaje: 'Teléfono debe tener entre 9 y 15 dígitos'
        },
        mensaje: {
            elemento: form.querySelector('#mensaje'),
            regex: /^.{10,}$/,
            mensaje: 'Mensaje debe tener al menos 10 caracteres'
        }
    };
    
    let esValido = true;
    
    Object.entries(campos).forEach(([campo, config]) => {
        const valor = config.elemento.value.trim();
        
        if (!config.regex.test(valor)) {
            config.elemento.style.borderColor = '#dc3545';
            console.warn(config.mensaje);
            esValido = false;
        } else {
            config.elemento.style.borderColor = '#28a745';
        }
    });
    
    return esValido;
}


/* ===== EJEMPLO 5: LOCALSTORAGE PARA GUARDAR PREFERENCIAS ===== */

// Guardar tema oscuro
function toggleDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    
    if (isDark) {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', false);
    } else {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', true);
    }
}

// Cargar preferencia al iniciar
window.addEventListener('load', () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});


/* ===== EJEMPLO 6: CONTADOR CON TEMPORIZADOR ===== */

function contarHastaNumeroPorSegundo(numeroFinal, duracionSegundos = 2) {
    const contador = document.querySelector('.counter');
    const incremento = numeroFinal / (duracionSegundos * 100);
    let numero = 0;
    
    const intervalo = setInterval(() => {
        numero += incremento;
        
        if (numero >= numeroFinal) {
            contador.textContent = numeroFinal;
            clearInterval(intervalo);
        } else {
            contador.textContent = Math.floor(numero);
        }
    }, 10);
}


/* ===== EJEMPLO 7: DEBOUNCE PARA BÚSQUEDA ===== */

function debounce(func, espera) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), espera);
    };
}

// Uso:
const buscar = debounce((e) => {
    console.log('Buscar:', e.target.value);
    // Aquí va la lógica de búsqueda
}, 300);

// document.querySelector('#busqueda').addEventListener('input', buscar);


/* ===== EJEMPLO 8: GALERÍA INTERACTIVA ===== */

const galeriaScripts = `
let imagenActual = 0;
const imagenes = document.querySelectorAll('.galeria-item img');

function mostrarImagen(indice) {
    imagenes.forEach((img, i) => {
        img.style.opacity = i === indice ? '1' : '0.3';
    });
    imagenActual = indice;
}

imagenes.forEach((img, i) => {
    img.addEventListener('click', () => mostrarImagen(i));
});

// Navegación automática cada 5 segundos
setInterval(() => {
    imagenActual = (imagenActual + 1) % imagenes.length;
    mostrarImagen(imagenActual);
}, 5000);
`;


/* ===== EJEMPLO 9: DESCARGA DE CATÁLOGO PDF ===== */

// HTML en index.html:
// <button class="btn btn-secondary" onclick="descargarCatalogo()">Descargar Catálogo</button>

function descargarCatalogo() {
    // Opción 1: Descargar archivo existente
    const enlace = document.createElement('a');
    enlace.href = '/assets/catalogo-tecnology-solutions.pdf';
    enlace.download = 'catalogo-tecnology-solutions.pdf';
    enlace.click();
    
    // Opción 2: Generar PDF dinámico (requiere librería jsPDF)
    // Ver: https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js
}


/* ===== EJEMPLO 10: INTEGRACIÓN CON SLACK ===== */

// Enviar notificaciones de formularios a Slack
async function enviarASlack(datos) {
    const webhookUrl = 'https://hooks.slack.com/services/TU/WEBHOOK/URL';
    
    const mensaje = {
        text: '📋 Nuevo formulario de contacto',
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Nuevo Contacto*\n\n*Nombre:* ${datos.nombre}\n*Email:* ${datos.email}\n*Teléfono:* ${datos.telefono}`
                }
            }
        ]
    };
    
    await fetch(webhookUrl, {
        method: 'POST',
        body: JSON.stringify(mensaje)
    });
}


/* ===== EJEMPLO 11: INTEGRACIÓN CON GOOGLE SHEETS ===== */

// Guardar datos del formulario en Google Sheets
async function guardarEnGoogleSheets(datos) {
    const scriptUrl = 'https://script.google.com/macros/d/xxx/usercopy';
    
    try {
        const form = document.getElementById('contactForm');
        await fetch(scriptUrl, {
            method: 'POST',
            body: new FormData(form)
        });
        console.log('Guardado en Google Sheets');
    } catch (error) {
        console.error('Error:', error);
    }
}


/* ===== EJEMPLO 12: CARRITO DE SOLICITUDES ===== */

// Simulación de "agregar al carrito"
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function agregarAlCarrito(servicio) {
    carrito.push({
        nombre: servicio,
        fecha: new Date().toLocaleString()
    });
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    showNotification(`${servicio} agregado al carrito`, 'success');
}

function mostrarCarrito() {
    console.log('Servicios seleccionados:', carrito);
    return carrito;
}


/* ===== EJEMPLO 13: FILTRADO DE SERVICIOS ===== */

function filtrarServicios(categoria) {
    document.querySelectorAll('.service-card').forEach(card => {
        const esDelTipo = card.getAttribute('data-categoria') === categoria;
        card.style.display = esDelTipo ? 'block' : 'none';
        card.style.opacity = esDelTipo ? '1' : '0.3';
    });
}

// Uso en HTML:
// <button onclick="filtrarServicios('seguridad')">Seguridad</button>
// <div class="service-card" data-categoria="seguridad">...</div>


/* ===== EJEMPLO 14: COMPARTIR EN REDES SOCIALES ===== */

function compartirEnRedes() {
    const titulo = 'Tecnology Solutions - Soluciones de Seguridad';
    const url = window.location.href;
    
    // Facebook
    const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    
    // WhatsApp
    const whatsapp = `https://wa.me/?text=${encodeURIComponent(titulo + ' ' + url)}`;
    
    // Twitter
    const twitter = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(titulo)}`;
    
    console.log('Compartir en Facebook:', facebook);
    console.log('Compartir en WhatsApp:', whatsapp);
    console.log('Compartir en Twitter:', twitter);
}


/* ===== EJEMPLO 15: ANIMACIÓN DE CARGA ===== */

// Mostrar spinner mientras carga
function mostrarCargando() {
    const spinner = document.createElement('div');
    spinner.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
        ">
            <div style="
                border: 4px solid #f3f3f3;
                border-top: 4px solid #007BFF;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
            "></div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(spinner);
}


/* ===== NOTAS IMPORTANTES ===== */

/*
1. SEGURIDAD:
   - Nunca guardes datos sensibles en localStorage
   - Siempre valida datos en el servidor también
   - Usa HTTPS en producción

2. RENDIMIENTO:
   - Usa debounce para eventos frecuentes (scroll, resize, input)
   - Carga imágenes con lazy loading
   - Minimiza CSS y JavaScript

3. ACCESIBILIDAD:
   - Agregar aria-labels a botones
   - Usar colores accesibles (contraste)
   - Soportar navegación por teclado

4. SEO:
   - Usar semantic HTML
   - Meta tags descriptivos
   - URLs amigables
   - Sitemap.xml

5. NAVEGADORES:
   - Probar en Chrome, Firefox, Safari, Edge
   - Usar polyfills si necesitas IE11
   - Mobile first design
*/

console.log('Ejemplos de código avanzado cargados ✓');

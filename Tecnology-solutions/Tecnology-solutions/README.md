# Tecnology Solution's

> Soluciones inteligentes de seguridad empresarial con tecnología de punta.

---

## 1. Descripción del Proyecto

Sitio web corporativo de **Tecnology Solution's**, una empresa dedicada al suministro, instalación y mantenimiento de sistemas de seguridad inteligente para hogares y empresas en Colombia.

El sitio presenta los servicios de la empresa, su portafolio de productos, casos de éxito, métricas de impacto y formularios de contacto integrados con WhatsApp para atención directa al cliente.

**Público objetivo:**

- Empresas que necesitan sistemas de seguridad (CCTV, control de acceso, alarmas)
- Hogares que buscan protección inteligente
- Edificios y oficinas que requieren soluciones de monitoreo

---

## 2. Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura semántica del sitio |
| **CSS3** | Estilos, animaciones, responsive design |
| **JavaScript (ES6+)** | Interactividad, animaciones scroll, formularios |
| **Three.js r128** | Globo 3D interactivo en la sección "Nosotros" |
| **Google Fonts** | Tipografías: Inter, Poppins, Playfair Display, Fjalla One |
| **WhatsApp API** | Envío de formularios directamente a WhatsApp |
| **CSS @import** | Sistema modular de estilos |
| **IntersectionObserver** | Animaciones activadas por scroll |

---

## 3. Estructura del Proyecto

```
Tecnology-solutions/
│
├── index.html                  ← Página principal
├── productos.html              ← Catálogo de productos
├── soluciones.html             ← Soluciones por sector
├── nosotros.html               ← Página "Sobre nosotros"
├── clientes.html               ← Clientes y casos de éxito
├── contacto.html               ← Formulario de contacto
├── README.md                   ← Este archivo
│
└── assets/
    ├── css/
    │   ├── styles.css           ← Entry point (importa todos los módulos)
    │   ├── responsive.css       ← Media queries para responsive design
    │   ├── base/
    │   │   ├── reset.css        ← Reset, variables CSS, tipografía global
    │   │   └── buttons.css      ← Estilos de botones reutilizables
    │   ├── components/
    │   │   ├── navbar.css       ← Navegación, dropdown, logo animado
    │   │   ├── footer.css       ← Pie de página
    │   │   ├── whatsapp.css     ← Botón flotante de WhatsApp
    │   │   ├── installation-modal.css ← Modal de instalación
    │   │   └── modals.css       ← Modales de mantenimiento y agendar
    │   └── sections/
    │       ├── hero.css         ← Hero principal con animaciones
    │       ├── services.css     ← Tarjetas de servicios
    │       ├── why-choose.css   ← Sección "Por qué elegirnos"
    │       ├── solutions.css    ← Soluciones por vertical
    │       ├── solutions-inline.css ← Estilos adicionales de soluciones
    │       ├── process.css      ← Proceso de trabajo (timeline)
    │       ├── nosotros.css     ← Sección "Sobre nosotros"
    │       ├── metrics.css      ← Métricas e infraestructura
    │       ├── clients.css      ← Carousel de clientes
    │       ├── testimonials.css ← Testimonios
    │       └── contact.css      ← Formulario de contacto
    │
    ├── img/                     ← Imágenes del sitio
    │
    └── js/
        ├── script.js            ← Lógica principal de la aplicación
        ├── globe.js             ← Globo 3D con Three.js
        └── modules/
            └── modals.js        ← Funciones de modales y WhatsApp
```

---

## 4. Cómo Ejecutar el Proyecto

### Opción 1: Servidor local con Python (recomendado)

```bash
cd Tecnology-solutions
python -m http.server 3001 --bind 127.0.0.1
```

Abrir en el navegador: **http://127.0.0.1:3001**

### Opción 2: Servidor con Node.js

```bash
cd Tecnology-solutions
npx serve
```

### Opción 3: Extensión Live Server (VS Code)

1. Instalar la extensión **Live Server** en VS Code
2. Click derecho sobre `index.html` → **Open with Live Server**

> **Nota:** Es necesario usar un servidor HTTP local. Abrir el archivo directamente con `file://` no cargará los estilos CSS correctamente debido al uso de `@import`.

---

## 5. Funcionalidades Principales

### Navegación
- Menú responsive con hamburger para móviles
- Dropdown de servicios con animaciones
- Scroll suave entre secciones

### Secciones de la Página Principal
| Sección | Descripción |
|---------|-------------|
| **Hero** | Presentación principal con imagen de la Tierra y CTAs |
| **Servicios** | 4 tarjetas interactivas (Instalación, Monitoreo, Mantenimiento, Asesoría) |
| **Por qué elegirnos** | Estadísticas y beneficios en layout asimétrico |
| **Soluciones** | 4 verticales: Hogares, Empresas, Oficinas, Edificios |
| **Ticker** | Banda animada con servicios en scroll continuo |
| **Proceso** | Timeline de 4 pasos: Análisis → Diseño → Instalación → Monitoreo |
| **Clientes** | Marquee animado con logos de clientes |
| **Métricas** | 4 contadores animados con datos de impacto |
| **Testimonios** | Reseñas de clientes con calificación por estrellas |
| **Contacto** | Formulario de contacto con validación |
| **Footer** | 4 columnas con links, contacto y redes sociales |

### Interactividad
- **Modales:** Detalle de instalación, mantenimiento y agendar visita
- **WhatsApp:** Botón flotante + envío de formularios vía WhatsApp
- **Animaciones scroll:** Elementos aparecen al hacer scroll (IntersectionObserver)
- **Contadores:** Métricas que cuentan desde 0 al entrar en viewport
- **Globo 3D:** Visualización interactiva con Three.js

### Páginas Secundarias
- **Productos:** Catálogo de equipos de control de acceso
- **Soluciones:** Detalle de soluciones por sector
- **Nosotros:** Historia y equipo de la empresa
- **Clientes:** Casos de éxito
- **Contacto:** Formulario dedicado

---

## 6. Buenas Prácticas Aplicadas

### Organización del Código
- **CSS modular:** Estilos separados por sección y componente (19 archivos)
- **JavaScript modular:** Lógica de modales separada del script principal
- **Estructura assets/:** Recursos organizados en `css/`, `js/`, `img/`
- **Comentarios profesionales:** Cada sección del HTML tiene encabezados descriptivos

### Rendimiento
- **Carga diferida:** Imágenes con `loading="lazy"`
- **Fuentes optimizadas:** `preconnect` para Google Fonts
- **Sin dependencias innecesarias:** Solo Three.js como librería externa

### Accesibilidad
- Atributos `aria-label`, `aria-modal`, `role` en modales
- Navegación por teclado en tarjetas de servicios
- Cierre de modales con tecla Escape
- Etiquetas semánticas HTML5

### SEO
- Meta description y theme-color configurados
- Estructura semántica con `<section>`, `<nav>`, `<footer>`
- Atributos `alt` en todas las imágenes

---

## Licencia

Proyecto privado de **Tecnology Solution's**. Todos los derechos reservados.

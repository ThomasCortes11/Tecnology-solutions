/**
 * ═══════════════════════════════════════════════════════
 * TECNOLOGY SOLUTIONS — Modals & WhatsApp Integration
 * Handles: Installation, Mantenimiento, Agendar modals
 * ═══════════════════════════════════════════════════════
 */

// ── Número WhatsApp del dueño (editar aquí) ──
const WHATSAPP_NUMERO = '573152284097';

/* ═══════════════════════════════════════
   KEYBOARD ACCESSIBILITY — Sol Cards
   ═══════════════════════════════════════ */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const focused = document.activeElement;
        if (focused && focused.classList.contains('sol-card')) {
            e.preventDefault();
            focused.click();
        }
    }
});

/* ═══════════════════════════════════════
   INSTALACIÓN MODAL
   ═══════════════════════════════════════ */
function openInstalacionModal() {
    document.getElementById('instalacionModal').hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeInstalacionModal() {
    document.getElementById('instalacionModal').hidden = true;
    document.body.style.overflow = '';
}

document.getElementById('instalacionModal').addEventListener('click', function (e) {
    if (e.target === this) closeInstalacionModal();
});

/* ═══════════════════════════════════════
   AGENDAR VISITA MODAL
   ═══════════════════════════════════════ */
function openAgendarModal() {
    const modal = document.getElementById('agendarModal');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const fechaInput = document.getElementById('ag-fecha');
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.min = hoy;
    fechaInput.focus();
}

function closeAgendarModal() {
    const modal = document.getElementById('agendarModal');
    modal.hidden = true;
    document.body.style.overflow = '';
}

document.getElementById('agendarModal').addEventListener('click', function (e) {
    if (e.target === this) closeAgendarModal();
});

/* ═══════════════════════════════════════
   MANTENIMIENTO MODAL
   ═══════════════════════════════════════ */
function openMantenimientoModal() {
    document.getElementById('mantenimientoModal').hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeMantenimientoModal() {
    document.getElementById('mantenimientoModal').hidden = true;
    document.body.style.overflow = '';
}

document.getElementById('mantenimientoModal').addEventListener('click', function (e) {
    if (e.target === this) closeMantenimientoModal();
});

/* ═══════════════════════════════════════
   CLOSE ALL MODALS ON ESCAPE
   ═══════════════════════════════════════ */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeAgendarModal();
        closeMantenimientoModal();
    }
});

/* ═══════════════════════════════════════
   WHATSAPP FORM SUBMISSIONS
   ═══════════════════════════════════════ */
function enviarMantenimientoWhatsApp(e) {
    e.preventDefault();
    const nombre = document.getElementById('mt-nombre').value.trim();
    const apellido = document.getElementById('mt-apellido').value.trim();
    const telefono = document.getElementById('mt-telefono').value.trim();
    const tipo = document.getElementById('mt-tipo').value || 'No especificado';
    const equipos = document.getElementById('mt-equipos').value || 'No especificado';
    const urgencia = document.querySelector('input[name="mt-urgencia"]:checked')?.value || 'No indicada';
    const desc = document.getElementById('mt-descripcion').value.trim();

    const msg =
        `\u{1F527} *SOLICITUD DE MANTENIMIENTO / SOPORTE*

\u{1F464} *Cliente:* ${nombre} ${apellido}
\u{1F4DE} *Teléfono:* ${telefono}
\u{1F6E0}\uFE0F *Tipo de soporte:* ${tipo}
\u{1F4FA} *Equipos / Sistema:* ${equipos}
\u26A0\uFE0F *Urgencia:* ${urgencia}

\u{1F4DD} *Descripción del problema:*
${desc}

_Enviado desde el sitio web de Tecnology Solutions_`;

    const url = 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(msg);
    window.open(url, '_blank', 'noopener,noreferrer');
    closeMantenimientoModal();
}

function enviarAgendarWhatsApp(e) {
    e.preventDefault();
    const nombre = document.getElementById('ag-nombre').value.trim();
    const apellido = document.getElementById('ag-apellido').value.trim();
    const telefono = document.getElementById('ag-telefono').value.trim();
    const fecha = document.getElementById('ag-fecha').value;
    const hora = document.getElementById('ag-hora').value;
    const servicio = document.getElementById('ag-servicio').value || 'No especificado';
    const desc = document.getElementById('ag-descripcion').value.trim();

    let fechaLegible = fecha;
    if (fecha) {
        const d = new Date(fecha + 'T00:00:00');
        fechaLegible = d.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const msg =
        `\u{1F5D3}\uFE0F *SOLICITUD DE VISITA TÉCNICA*

\u{1F464} *Cliente:* ${nombre} ${apellido}
\u{1F4DE} *Teléfono:* ${telefono}
\u{1F4C5} *Fecha preferida:* ${fechaLegible}
\u23F0 *Hora preferida:* ${hora}
\u{1F527} *Servicio de interés:* ${servicio}

\u{1F4DD} *Descripción:*
${desc}

_Enviado desde el sitio web de Tecnology Solutions_`;

    const url = 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(msg);
    window.open(url, '_blank', 'noopener,noreferrer');
    closeAgendarModal();
}

/* ═══════════════════════════════════════
   EXPOSE FUNCTIONS GLOBALLY
   ═══════════════════════════════════════ */
window.openInstalacionModal = openInstalacionModal;
window.closeInstalacionModal = closeInstalacionModal;
window.openAgendarModal = openAgendarModal;
window.closeAgendarModal = closeAgendarModal;
window.openMantenimientoModal = openMantenimientoModal;
window.closeMantenimientoModal = closeMantenimientoModal;
window.enviarMantenimientoWhatsApp = enviarMantenimientoWhatsApp;
window.enviarAgendarWhatsApp = enviarAgendarWhatsApp;

/**
 * ui.js
 * Controlador de interfaz gráfica de usuario.
 * Maneja la navegación, renderizado dinámico y lógica del formulario de contacto.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar renderizado dinámico
    renderHistory();
    renderModules();
    renderDevelopers();

    // Configurar navegación de pestañas (Menú lateral izquierdo)
    setupNavigation();

    // Configurar menú móvil (Hamburguesa)
    setupMobileMenu();

    // Configurar formulario de contacto
    setupContactForm();
});

// 1. Renderizar la Historia de AYD TAXI (Línea de tiempo)
function renderHistory() {
    const timelineContainer = document.getElementById("history-timeline");
    if (!timelineContainer) return;

    const historyData = window.AYD_TAXI_DATA.history;
    timelineContainer.innerHTML = historyData.map((item, index) => `
        <div class="timeline-item" style="animation-delay: ${index * 0.15}s">
            <div class="timeline-badge"></div>
            <div class="timeline-content">
                <span class="timeline-year">${item.year}</span>
                <p class="timeline-desc">${item.description}</p>
            </div>
        </div>
    `).join('');
}

// 2. Renderizar los 5 Módulos del Sistema (Tarjetas interactivas)
function renderModules() {
    const modulesGrid = document.getElementById("modules-grid");
    if (!modulesGrid) return;

    const modulesData = window.AYD_TAXI_DATA.modules;
    modulesGrid.innerHTML = modulesData.map((item, index) => `
        <div class="module-card" style="animation-delay: ${index * 0.1}s">
            <div class="module-card-header">
                <span class="module-badge">Servicio</span>
                <span class="module-price">${item.price}</span>
            </div>
            <h3 class="module-title">${item.title}</h3>
            <p class="module-desc">${item.description}</p>
            <button class="module-action-btn" onclick="openChatWithQuery('Cuéntame sobre el servicio de ${item.title}')">
                Consultar al Asistente
            </button>
        </div>
    `).join('');
}

// 3. Renderizar Desarrolladores (Daniel Rodríguez y Alejandro Hernández)
function renderDevelopers() {
    const developersContainer = document.getElementById("developers-list");
    if (!developersContainer) return;

    const devData = window.AYD_TAXI_DATA.developers;
    developersContainer.innerHTML = devData.map((dev, index) => `
        <div class="developer-card" style="animation-delay: ${index * 0.2}s">
            <div class="dev-avatar">
                ${dev.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div class="dev-info">
                <h3 class="dev-name">${dev.name}</h3>
                <span class="dev-title">${dev.title}</span>
                <p class="dev-profile">${dev.profile}</p>
            </div>
        </div>
    `).join('');
}

// 4. Configurar la Navegación por pestañas (Secciones)
function setupNavigation() {
    const menuLinks = document.querySelectorAll(".menu-link");
    const sections = document.querySelectorAll(".content-section");

    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetTab = link.getAttribute("data-tab");

            // Remover clase activa de todos los links
            menuLinks.forEach(l => l.classList.remove("active"));
            // Agregar clase activa al link seleccionado
            link.classList.add("active");

            // Ocultar todas las secciones
            sections.forEach(sec => sec.classList.remove("active"));
            
            // Mostrar la sección activa
            const activeSection = document.getElementById(targetTab);
            if (activeSection) {
                activeSection.classList.add("active");
                // Scroll suave al inicio del contenedor
                const mainContent = document.querySelector(".main-content");
                if (mainContent) mainContent.scrollTop = 0;
            }

            // Cerrar menú lateral en móviles al hacer clic en un link
            const sidebar = document.querySelector(".sidebar");
            const overlay = document.querySelector(".sidebar-overlay");
            if (sidebar && sidebar.classList.contains("open")) {
                sidebar.classList.remove("open");
                if (overlay) overlay.classList.remove("active");
            }
        });
    });
}

// 5. Configurar el menú hamburguesa para móviles
function setupMobileMenu() {
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    
    // Crear overlay si no existe para hacer clic fuera del sidebar en móviles y cerrarlo
    let overlay = document.querySelector(".sidebar-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("sidebar-overlay");
        document.body.appendChild(overlay);
    }

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
            overlay.classList.toggle("active");
        });

        overlay.addEventListener("click", () => {
            sidebar.classList.remove("open");
            overlay.classList.remove("active");
        });
    }
}

// 6. Configurar Formulario de Contacto e interacción
function setupContactForm() {
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return;

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const message = document.getElementById("contact-message").value.trim();

        // Validaciones básicas
        if (!name || !email || !message) {
            showNotification("Por favor, completa todos los campos del formulario.", "error");
            return;
        }

        if (!validateEmail(email)) {
            showNotification("Ingresa un correo electrónico válido.", "error");
            return;
        }

        // Simular envío
        const submitBtn = contactForm.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Enviando...";

        setTimeout(() => {
            // Éxito simulado
            showNotification("¡Mensaje enviado con éxito! Nos contactaremos pronto.", "success");
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500);
    });
}

// Auxiliar de validación de email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Sistema simple de notificaciones flotantes premium
function showNotification(message, type = "success") {
    let container = document.getElementById("notification-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "notification-container";
        document.body.appendChild(container);
    }

    const notification = document.createElement("div");
    notification.classList.add("toast-notification", type);
    
    // Iconos según el tipo
    const icon = type === "success" 
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

    notification.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(notification);

    // Animación de entrada y posterior remoción
    setTimeout(() => {
        notification.classList.add("show");
    }, 10);

    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Función global auxiliar para permitir que las tarjetas de servicios abran el chat directamente con una pregunta
function openChatWithQuery(query) {
    const chatLink = document.querySelector('.menu-link[data-tab="chatbot-section"]');
    if (chatLink) {
        chatLink.click();
        
        const userInput = document.getElementById("user-input");
        if (userInput) {
            userInput.value = query;
            // Opcional: autoenviar después de un breve delay
            setTimeout(() => {
                window.sendMessageToGemini(query);
            }, 500);
        }
    }
}

// Hacer global
window.openChatWithQuery = openChatWithQuery;

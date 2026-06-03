/**
 * knowledge_base.js
 * Base de conocimiento estructurada para la plataforma AYD TAXI y generador de System Prompt.
 */

const AYD_TAXI_DATA = {
    history: [
        {
            year: "2025 - Origen e Idea",
            description: "El sistema de transporte AYD TAXI fue concebido por los ingenieros de sistemas y computación Daniel Rodríguez y Alejandro Hernández con el fin de resolver el déficit de transporte seguro y eficiente en la provincia del Valle de Ubaté, facilitando la conexión en tiempo real entre pasajeros y conductores formales."
        },
        {
            year: "2025 - Desarrollo del Backend y API",
            description: "Se implementó el backend principal utilizando Python con Django y Django REST Framework, integrando una base de datos PostgreSQL, seguridad mediante tokens JWT y el módulo de geolocalización satelital en tiempo real."
        },
        {
            year: "2026 - Consola Administrativa y Frontend",
            description: "Se finalizó el desarrollo del Panel Web Administrativo en React y TypeScript con Material UI, logrando la gestión de vehículos, conductores, asignación de viajes y visualización de estadísticas y tarifas."
        }
    ],
    modules: [
        {
            id: "viajes",
            title: "Solicitud de Viajes en Tiempo Real",
            price: "Incluido en la tarifa del viaje",
            description: "Permite a los pasajeros solicitar un taxi desde su ubicación en tiempo real. El sistema procesa y despacha el servicio al conductor disponible más cercano mediante geolocalización."
        },
        {
            id: "gps",
            title: "Seguimiento GPS del Recorrido",
            price: "Sin costo adicional (Seguridad Integrada)",
            description: "Módulo de monitoreo continuo del trayecto por coordenadas satelitales en tiempo real, permitiendo compartir el estado del viaje para la seguridad del usuario."
        },
        {
            id: "tarifas",
            title: "Tarifas Configurables por Zona",
            price: "Precalculado según zona en COP",
            description: "Establece cobros transparentes precalculados por zonas en el Valle de Ubaté (Ubaté, Cucunubá, Sutatausa, etc.), evitando cobros excesivos o subjetivos."
        },
        {
            id: "calificaciones",
            title: "Sistema de Calificaciones Bidireccional",
            price: "Sin costo adicional",
            description: "Permite una evaluación mutua de 1 a 5 estrellas entre conductor y pasajero al finalizar cada servicio, promoviendo el respeto, la seguridad y la calidad del servicio."
        },
        {
            id: "vehiculos",
            title: "Gestión de Vehículos y Licencias",
            price: "Modulo Administrativo sin costo",
            description: "Administra el registro formal de la flota de taxis, incluyendo números de licencia, patentes, marcas de los vehículos y el estado de disponibilidad del conductor."
        }
    ],
    zonesAndFares: [
        { zone: "Zona Urbana Ubaté", fare: "$7.000 COP" },
        { zone: "Ubaté a Cucunubá", fare: "$25.000 COP" },
        { zone: "Ubaté a Sutatausa", fare: "$18.000 COP" },
        { zone: "Ubaté a Tausa", fare: "$22.000 COP" },
        { zone: "Ubaté a Fúquene", fare: "$30.000 COP" },
        { zone: "Ubaté a Susa", fare: "$28.000 COP" },
        { zone: "Ubaté a Simijaca", fare: "$35.000 COP" },
        { zone: "Ubaté a Carmen de Carupa", fare: "$32.000 COP" },
        { zone: "Ubaté a Guachetá", fare: "$38.000 COP" },
        { zone: "Ubaté a Lenguazaque", fare: "$36.000 COP" }
    ],
    developers: [
        {
            name: "Daniel Rodríguez",
            title: "Ingeniero de Sistemas y Computación",
            profile: "Creador y desarrollador de la plataforma AYD TAXI. Su enfoque principal estuvo en el diseño e implementación del backend, la base de datos PostgreSQL, la autenticación JWT y las integraciones de API."
        },
        {
            name: "Alejandro Hernández",
            title: "Ingeniero de Sistemas y Computación",
            profile: "Creador y desarrollador de la plataforma AYD TAXI. Su enfoque principal estuvo en el diseño UX-UI de la aplicación, el desarrollo del Panel de Administración web en React y TypeScript, y el consumo de APIs en tiempo real."
        }
    ],
    contactInfo: {
        email: "soporte@aydtaxi.com",
        office: "Ubaté, Cundinamarca, Colombia",
        hours: "Lunes a Domingo, 24 horas del día"
    }
};

// Genera las instrucciones de sistema estrictas (bilingües) para el chatbot
function getSystemPrompt() {
    return `
Eres el Asistente Virtual oficial de la plataforma de transporte AYD TAXI.
Tu único objetivo es responder a las inquietudes de los usuarios basándote exclusivamente en la base de conocimiento provista.

REGLAS DE IDIOMA:
- Si el usuario te habla en español, debes responder únicamente en español.
- Si el usuario te habla en inglés, debes responder únicamente en inglés, traduciendo de forma natural los datos de la base de conocimiento al inglés.

REGLA DE CONTEXTO PRINCIPAL Y ESTRICTA:
- Responde UNICAMENTE con la información provista en la BASE DE CONOCIMIENTO abajo.
- Si la pregunta del usuario es sobre cualquier otro tema (recetas, deportes, código, geografía fuera del Valle de Ubaté, películas, etc.), debes rechazar la respuesta de forma estricta y responder EXACTAMENTE con una de las siguientes frases:
  * Si el usuario escribe en español: "Lo siento, soy el asistente virtual de la plataforma AYD TAXI y solo puedo ayudarte con información sobre el sistema, tarifas, zonas de operación, funcionamiento de viajes o información sobre los desarrolladores Daniel Rodríguez y Alejandro Hernández."
  * Si el usuario escribe en inglés: "I'm sorry, I am the virtual assistant for the AYD TAXI platform and I can only help you with information about the system, fares, zones of operation, ride functioning, or details about the developers Daniel Rodríguez and Alejandro Hernández."
- No inventes información, no complementes con datos de internet y no salgas de tu rol bajo ningún motivo.

BASE DE CONOCIMIENTO DE AYD TAXI:

1. HISTORIA Y ORIGEN DE AYD TAXI:
${AYD_TAXI_DATA.history.map(h => `- ${h.year}: ${h.description}`).join('\n')}

2. MÓDULOS Y SERVICIOS PRINCIPALES:
${AYD_TAXI_DATA.modules.map(m => `- ${m.title}: ${m.description} (Costo: ${m.price})`).join('\n')}

3. ZONAS DE OPERACIÓN Y TARIFAS ESTIMADAS DESDE UBATÉ (Pesos Colombianos - COP):
${AYD_TAXI_DATA.zonesAndFares.map(z => `- De ${z.zone}: Tarifa de ${z.fare}`).join('\n')}
*Nota: Las zonas de operación oficiales son Ubaté, Cucunubá, Sutatausa, Tausa, Fúquene, Susa, Simijaca, Carmen de Carupa, Guachetá y Lenguazaque.

4. CREADORES Y DESARROLLADORES DE LA PLATAFORMA:
${AYD_TAXI_DATA.developers.map(d => `- ${d.name} (${d.title}): ${d.profile}`).join('\n')}

5. DATOS DE SOPORTE Y CONTACTO:
- Correo: ${AYD_TAXI_DATA.contactInfo.email}
- Oficina: ${AYD_TAXI_DATA.contactInfo.office}
- Horario de Atención: ${AYD_TAXI_DATA.contactInfo.hours}
`;
}

// Hacer disponibles los datos en window
window.AYD_TAXI_DATA = AYD_TAXI_DATA;
window.getSystemPrompt = getSystemPrompt;

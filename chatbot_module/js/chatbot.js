/**
 * chatbot.js
 * Lógica de conexión con la API de Gemini (Google AI Studio) y manejo de conversación.
 */

let API_KEY = "";
let chatHistory = [];

// Inicialización del chatbot al cargar la página
async function initChatbot() {
    // Carga variables de entorno (.env)
    const env = await window.loadEnv();
    API_KEY = env.GEMINI_API_KEY || "";
    
    if (!API_KEY) {
        console.warn("Chatbot: No se encontró la API Key en el archivo .env. Las consultas podrían fallar.");
    }
}

// Envía un mensaje a Gemini
async function sendMessageToGemini(userText) {
    const chatArea = document.getElementById('chat-area');
    const userInput = document.getElementById('user-input');
    
    if (!userText.trim()) return;

    // 1. Agregar mensaje del usuario en la UI
    appendChatMessage(userText, 'user');
    userInput.value = '';

    // 2. Mostrar indicador de carga
    showChatLoading();

    // 3. Agregar mensaje al historial de conversación
    chatHistory.push({
        role: "user",
        parts: [{ text: userText }]
    });

    // 4. Preparar la URL y cabeceras
    // Endpoint oficial recomendado por la guía
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    
    // Si no tenemos API Key configurada, mostramos un error directo
    if (!API_KEY) {
        hideChatLoading();
        appendChatMessage("Error: No se ha configurado la API Key de Google AI Studio. Crea un archivo `.env` basado en `.env.example` y coloca tu clave.", 'system error');
        chatHistory.pop(); // Elimina del historial el último mensaje fallido
        return;
    }

    try {
        const response = await fetch(`${apiUrl}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: chatHistory,
                systemInstruction: {
                    parts: [
                        { text: window.getSystemPrompt() }
                    ]
                },
                generationConfig: {
                    temperature: 0.2, // Temperatura baja para que sea factual y se apegue a las reglas
                    maxOutputTokens: 800
                }
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `Error HTTP ${response.status}`);
        }

        const data = await response.json();
        hideChatLoading();

        // 5. Extraer texto de la respuesta
        const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!aiResponseText) {
            throw new Error("No se recibió respuesta válida del modelo.");
        }

        // 6. Mostrar respuesta en la UI y guardar en historial
        appendChatMessage(aiResponseText, 'system');
        chatHistory.push({
            role: "model",
            parts: [{ text: aiResponseText }]
        });

    } catch (error) {
        console.error("Error al conectar con Gemini:", error);
        hideChatLoading();
        
        // Mensaje amigable según el idioma detectado en la entrada del usuario
        const isEnglish = /^[a-zA-Z\s?,.!-]+$/.test(userText) && (userText.toLowerCase().includes("how") || userText.toLowerCase().includes("what") || userText.toLowerCase().includes("who") || userText.toLowerCase().includes("fare") || userText.toLowerCase().includes("price") || userText.toLowerCase().includes("hello"));
        const errorMsg = isEnglish 
            ? "Sorry, I am having technical difficulties. Please try again later."
            : "Lo siento, estoy experimentando dificultades técnicas. Por favor, intenta de nuevo más tarde.";

        appendChatMessage(errorMsg, 'system error');
        chatHistory.pop(); // Quita el último mensaje de usuario para evitar trabas en reintentos
    }
}

// Auxiliar para inyectar mensajes en el DOM de chat
function appendChatMessage(text, sender) {
    const chatArea = document.getElementById('chat-area');
    if (!chatArea) return;

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    // Convertir saltos de línea a tags <br> para formatear el texto correctamente
    bubble.innerHTML = text.replace(/\n/g, '<br>');

    messageDiv.appendChild(bubble);
    chatArea.appendChild(messageDiv);

    // Auto-scroll al final
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Indicador de escritura animado
function showChatLoading() {
    const chatArea = document.getElementById('chat-area');
    if (!chatArea || document.getElementById('chat-loading-indicator')) return;

    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'system', 'loading');
    loadingDiv.id = 'chat-loading-indicator';

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';

    loadingDiv.appendChild(bubble);
    chatArea.appendChild(loadingDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function hideChatLoading() {
    const indicator = document.getElementById('chat-loading-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Inicializar al cargar el script
document.addEventListener("DOMContentLoaded", initChatbot);

// Exponer funciones globales
window.sendMessageToGemini = sendMessageToGemini;

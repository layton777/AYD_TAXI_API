// chatbot.js (frontend) - ahora envía mensajes al backend Django
// Carga la API key desde .env a través de loadEnv (solo para demostrar que el .env está disponible)
let API_URL = "";
loadEnv().then(env => {
  // El endpoint del backend que manejará el request a Gemini
  API_URL = "/api/chatbot/"; // Ruta relativa del proyecto Django
});

const chatArea = document.getElementById('chat-area');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Mantener historial opcional (puede enviarse al backend si se desea)
let chatHistory = [];

function addMessage(text, sender) {
    messageDiv.classList.add('message', sender);
    
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = text;
    
    messageDiv.appendChild(bubble);
    chatArea.appendChild(messageDiv);
    
    // Auto-scroll hacia abajo
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Función para mostrar animación de carga
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'system', 'loading');
    loadingDiv.id = 'loading-indicator';
    
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    
    loadingDiv.appendChild(bubble);
    chatArea.appendChild(loadingDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Eliminar animación de carga
function hideLoading() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Función principal para enviar el mensaje a Gemini
async function sendMessageToGemini(userText) {
    // 1. Mostrar el mensaje del usuario
    addMessage(userText, 'user');
    userInput.value = '';
    
    // 2. Mostrar indicador de carga
    showLoading();
    
    // 3. Preparar el contexto si es el primer mensaje
    if (chatHistory.length === 0) {
        // En lugar de enviarlo como mensaje normal, Gemini tiene un parámetro de 'systemInstruction',
        // pero para simplificar en este REST call basico, lo agregaremos al historial.
        chatHistory.push({
            role: "user",
            parts: [{ text: KNOWLEDGE_BASE + "\n\nA partir de ahora, responde a las siguientes preguntas del usuario teniendo en cuenta estas reglas." }]
        });
        chatHistory.push({
            role: "model",
            parts: [{ text: "Entendido. Soy el asistente de la academia de IA y solo responderé basándome en la información proporcionada. ¿En qué te puedo ayudar?" }]
        });
    }

    // 4. Agregar mensaje del usuario actual al historial
    chatHistory.push({
        role: "user",
        parts: [{ text: userText }]
    });

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: chatHistory
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        // 5. Extraer y mostrar respuesta
        const aiResponseText = data.candidates[0].content.parts[0].text;
        
        hideLoading();
        addMessage(aiResponseText, 'system');
        
        // 6. Guardar respuesta en el historial
        chatHistory.push({
            role: "model",
            parts: [{ text: aiResponseText }]
        });

    } catch (error) {
        console.error("Error al conectar con Gemini:", error);
        hideLoading();
        addMessage("Lo siento, estoy teniendo problemas técnicos de conexión. Intenta de nuevo más tarde.", 'system');
        
        // Remover el mensaje fallido del historial para que no se tranque
        chatHistory.pop();
    }
}

// Event Listeners
sendBtn.addEventListener('click', () => {
    const text = userInput.value.trim();
    if (text) sendMessageToGemini(text);
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const text = userInput.value.trim();
        if (text) sendMessageToGemini(text);
    }
});

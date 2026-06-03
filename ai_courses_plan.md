# Plan de Implementación: Chatbot de IA con Gemini

## Descripción del Proyecto
Desarrollo exclusivo del componente del Chatbot inteligente impulsado por la API de Google Gemini. El chatbot contará con una interfaz propia, diseño basado en la paleta solicitada (verde, azul y blanco), y una lógica estricta de restricción de contexto ("System Prompt") para que solo responda preguntas basándose en una base de conocimiento predefinida sobre cursos de Inteligencia Artificial.

## Arquitectura y Stack Tecnológico
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla).
- **Diseño:** Minimalista con los colores Verde, Azul y fondo Blanco.
- **API:** Google AI Studio (Gemini-1.5-flash).

### Estructura de Archivos Propuesta
El proyecto del chatbot se construirá en una carpeta dedicada (por ejemplo `chatbot_module/`):
```text
/chatbot_module
│
├── index.html              # Interfaz de usuario del chatbot
├── .env.example            # Archivo de ejemplo para la API Key
├── style.css               # Estilos del chatbot (burbujas de chat, input, colores)
├── knowledge_base.js       # Información estricta de los cursos y la academia
└── chatbot.js              # Lógica de la API de Gemini y manejo del contexto
```

## Estrategia del Chatbot (Restricción de Conocimiento)
1. **Base de Conocimiento (`knowledge_base.js`):** Contendrá la información estructurada de los 5 cursos, la historia de la IA y el perfil de los instructores.
2. **Llamada a la API (`chatbot.js`):** Al iniciar la conversación, se inyectará silenciosamente un bloque de contexto. Le daremos a Gemini instrucciones claras:
   > *"Eres el asistente virtual de una academia de IA. Basa tus respuestas ÚNICAMENTE en la siguiente información. Si el usuario pregunta algo que no está en este texto, debes responder: 'Lo siento, solo puedo ayudar con información relacionada a nuestros cursos y academia'."*
3. **Historial de Conversación:** Se mantendrá un arreglo con el historial de mensajes para que Gemini recuerde el hilo de la conversación y responda de forma coherente.

## Plan de Ejecución
1. Crear el directorio `chatbot_module`.
2. Escribir el archivo `.env.example` (para la API Key proporcionada).
3. Crear `knowledge_base.js` con la información base (cursos, precios).
4. Maquetar la interfaz del chat en `index.html` y aplicar estilos en `style.css`.
5. Implementar la conexión y el historial de chat usando `fetch` en `chatbot.js`.
6. Realizar una prueba de concepto interactiva.

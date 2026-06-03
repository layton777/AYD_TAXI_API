import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, TextField, IconButton, Avatar, CircularProgress, Alert } from '@mui/material';
import { Send, ChatBubble } from '@mui/icons-material';

interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
}

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
      title: "Solicitud de Viajes en Tiempo Real",
      price: "Incluido en la tarifa del viaje",
      description: "Permite a los pasajeros solicitar un taxi desde su ubicación en tiempo real. El sistema procesa y despacha el servicio al conductor disponible más cercano mediante geolocalización."
    },
    {
      title: "Seguimiento GPS del Recorrido",
      price: "Sin costo adicional (Seguridad Integrada)",
      description: "Módulo de monitoreo continuo del trayecto por coordenadas satelitales en tiempo real, permitiendo compartir el estado del viaje para la seguridad del usuario."
    },
    {
      title: "Tarifas Configurables por Zona",
      price: "Precalculado según zona en COP",
      description: "Establece cobros transparentes precalculados por zonas en el Valle de Ubaté (Ubaté, Cucunubá, Sutatausa, etc.), evitando cobros excesivos o subjetivos."
    },
    {
      title: "Sistema de Calificaciones Bidireccional",
      price: "Sin costo adicional",
      description: "Permite una evaluación mutua de 1 a 5 estrellas entre conductor y pasajero al finalizar cada servicio, promoviendo el respeto, la seguridad y la calidad del servicio."
    },
    {
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

const getSystemPrompt = () => {
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
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: '¡Hola! Soy el asistente virtual oficial de AYD TAXI. ¿Tienes dudas sobre el funcionamiento de los viajes, las tarifas estimadas, las zonas de operación o quieres conocer más sobre los creadores del proyecto (Daniel y Alejandro)? Pregúntame con confianza.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Leer la API Key desde las variables de entorno de Vite
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCfBNINOkoSWR3_dU1ytYMOi0jWIQYwbMg';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setErrorMsg('');

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    // Preparar el historial en el formato de Gemini
    // Traducimos el historial interno a la estructura de la API
    const historyPayload = messages.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));
    
    // Agregar el mensaje del usuario actual al payload
    historyPayload.push({
      role: 'user',
      parts: [{ text: userText }]
    });

    try {
      const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: historyPayload,
          systemInstruction: {
            parts: [
              { text: getSystemPrompt() }
            ]
          },
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 800
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Error HTTP ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponseText) {
        throw new Error('No se recibió una respuesta válida de la API.');
      }

      setMessages(prev => [...prev, { role: 'model', text: aiResponseText }]);
    } catch (err: any) {
      console.error(err);
      
      const isEnglish = /^[a-zA-Z\s?,.!-]+$/.test(userText) && (
        userText.toLowerCase().includes("how") || 
        userText.toLowerCase().includes("what") || 
        userText.toLowerCase().includes("who") || 
        userText.toLowerCase().includes("fare") || 
        userText.toLowerCase().includes("hello")
      );
      
      const errMsg = isEnglish 
        ? "Sorry, I am having technical difficulties. Please try again later."
        : "Lo siento, estoy experimentando dificultades técnicas. Por favor, intenta de nuevo más tarde.";

      setErrorMsg(err.message || 'Error de conexión');
      setMessages(prev => [...prev, { role: 'system', text: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <Box mb={2}>
        <Typography variant="h4" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ChatBubble color="primary" /> Asistente de Soporte IA
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Chat de soporte bilingüe preentrenado exclusivamente con el contexto de la plataforma AYD TAXI.
        </Typography>
      </Box>

      {errorMsg && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Problema de conexión con la API de IA: {errorMsg}. Se está usando la API Key por defecto.
        </Alert>
      )}

      <Paper 
        elevation={0} 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          border: '1px solid #e0e0e0', 
          borderRadius: 3, 
          overflow: 'hidden',
          backgroundColor: '#fff'
        }}
      >
        {/* Header del Chat */}
        <Box sx={{ px: 3, py: 2, bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#F9A825', color: '#212121', fontWeight: 700 }}>AT</Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>Soporte AYD TAXI</Typography>
            <Typography variant="caption" color="success.main" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <span style={{ width: 6, height: 6, backgroundColor: '#2e7d32', borderRadius: '50%', display: 'inline-block' }}></span>
              En línea
            </Typography>
          </Box>
        </Box>

        {/* Mensajes */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const isSystem = msg.role === 'system';
            
            return (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  width: '100%'
                }}
              >
                <Box 
                  sx={{ 
                    maxWidth: '75%', 
                    p: 2, 
                    borderRadius: 3,
                    borderBottomRightRadius: isUser ? 1 : 12,
                    borderBottomLeftRadius: isUser ? 12 : 1,
                    bgcolor: isUser ? 'primary.main' : isSystem ? 'error.light' : '#f5f5f5',
                    color: isUser ? '#212121' : isSystem ? '#d32f2f' : 'text.primary',
                    border: isUser ? 'none' : '1px solid #e0e0e0',
                    boxShadow: isUser ? '0 3px 6px rgba(249, 168, 37, 0.2)' : 'none'
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: isUser ? 600 : 400 }}>
                    {msg.text}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 3, borderBottomLeftRadius: 1, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                <Typography variant="caption" color="text.secondary">Escribiendo...</Typography>
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #e0e0e0', display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Pregúntame sobre tarifas, zonas de operación, creadores..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                bgcolor: '#fff'
              }
            }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSend} 
            disabled={loading || !input.trim()}
            sx={{ 
              bgcolor: 'primary.main', 
              color: '#212121',
              '&:hover': { bgcolor: 'primary.dark' },
              '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#a0a0a0' }
            }}
          >
            <Send fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}

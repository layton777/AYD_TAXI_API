/**
 * env_loader.js
 * Carga de variables de entorno (.env) en el frontend mediante fetch.
 */

async function loadEnv() {
    try {
        // Realiza una petición GET al archivo .env local
        const response = await fetch('.env');
        if (!response.ok) {
            throw new Error(`No se pudo leer el archivo .env (Estado: ${response.status})`);
        }
        const text = await response.text();
        const env = {};

        // Procesa el texto línea por línea
        const lines = text.split(/\r?\n/);
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Ignora líneas vacías y comentarios
            if (!trimmedLine || trimmedLine.startsWith('#')) {
                continue;
            }

            // Busca el primer signo '='
            const equalsIndex = trimmedLine.indexOf('=');
            if (equalsIndex === -1) continue;

            const key = trimmedLine.slice(0, equalsIndex).trim();
            let value = trimmedLine.slice(equalsIndex + 1).trim();

            // Remueve comillas dobles o simples al inicio y final del valor
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            env[key] = value;
        }
        return env;
    } catch (error) {
        console.warn("Lector .env: No se encontró el archivo .env o no está accesible. Se intentará usar configuraciones por defecto.", error);
        return {};
    }
}

// Exportar globalmente para que otros scripts lo puedan consumir
window.loadEnv = loadEnv;

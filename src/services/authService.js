// src/services/authService.js

// --- SERVICIO SIMULADO (MOCK) PARA PRESENTACIÓN ---
// Este archivo finge que todo salió bien. No necesita Backend ni MongoDB.

export const authService = {
  
  // 1. LOGIN MÁGICO
  // Te deja entrar siempre. Decide a dónde ir según lo que escribas en el correo.
  login: async (email, password) => {
    console.log(`Iniciando sesión simulada con: ${email}`);
    
    // Simulamos una pequeña carga de 0.5 segundos
    await new Promise(resolve => setTimeout(resolve, 500));

    let user;

    // Si el correo dice "admin" -> Te manda al Dashboard de Admin
    if (email.toLowerCase().includes("admin")) {
      user = { 
        name: "Director General", 
        email, 
        role: "admin" 
      };
    } 
    // Si el correo dice "cafe" -> Te manda al Dashboard de Cafetería
    else if (email.toLowerCase().includes("cafe")) {
      user = { 
        name: "Encargado Cafetería", 
        email, 
        role: "cafeteria" 
      };
    } 
    // Si escribes CUALQUIER OTRA COSA -> Te manda al Dashboard de Estudiante
    else {
      user = { 
        name: "Juan Pérez (Estudiante)", 
        email, 
        role: "estudiante",
        matricula: "2025001" // Matrícula fija para que funcione el QR
      };
    }

    // Guardamos el usuario falso en el navegador para que no se cierre la sesión al recargar
    localStorage.setItem('usuario', JSON.stringify(user));
    return user;
  },

  // 2. TICKET FALSO (Siempre devuelve un ticket válido)
  getTicketEstudiante: async (matricula) => {
    return {
      codigo: "TICKET-DEMO-2025",
      estado: "activo",
      fecha: new Date().toLocaleDateString(),
      tipo: "Comida Completa"
    };
  },

  // 3. VALIDACIÓN QR FALSA (Para que la cámara de la cafetería diga "Éxito")
  validarTicketQR: async (codigoTicket) => {
    console.log("Validando ticket simulado:", codigoTicket);
    await new Promise(resolve => setTimeout(resolve, 800)); // Espera simulada
    
    // Truco: Si escaneas un código que diga "ERROR", fingimos que falló.
    if(codigoTicket === "ERROR") return null;

    // Cualquier otro código QR que escanees será válido
    return {
      matricula: "2025001",
      alumno: "Juan Pérez (Demo)",
      estado: "VALIDO",
      hora: new Date().toLocaleTimeString()
    };
  },

  // 4. LOGOUT
  logout: () => {
    localStorage.removeItem('usuario');
    window.location.href = '/';
  }
};
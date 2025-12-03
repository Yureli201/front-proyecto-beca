// src/services/authService.js

// --- SERVICIO SIMULADO (MOCK) PARA PRESENTACIÓN ---
// Este archivo finge que todo salió bien. No necesita Backend ni MongoDB.

export const authService = {
  
  // 1. LOGIN MÁGICO
  login: async (email, password) => {
    console.log(`Iniciando sesión simulada con: ${email}`);
    await new Promise(resolve => setTimeout(resolve, 500));

    let user;

    if (email.toLowerCase().includes("admin")) {
      user = { name: "Director General", email, role: "admin" };
    } else if (email.toLowerCase().includes("cafe")) {
      user = { name: "Encargado Cafetería", email, role: "cafeteria" };
    } else {
      user = { 
        name: "Juan Pérez (Estudiante)", 
        email, 
        role: "estudiante",
        matricula: "2025001" 
      };
    }

    localStorage.setItem('usuario', JSON.stringify(user));
    return user;
  },

  // 2. GENERAR TOKEN SEGURO PARA QR
  getQRToken: (matricula) => {
    const fechaHoy = new Date().toLocaleDateString("es-MX").replace(/\//g, '-');
    const firma = "SECURE-TOKEN"; 
    return JSON.stringify({
      app: "BECA-UT",
      matricula,
      fecha: fechaHoy,
      firma
    });
  },

  // 3. VALIDACIÓN QR (Lógica de Negocio)
  validarTicketQR: async (codigoQR) => {
    console.log("Analizando QR:", codigoQR);
    await new Promise(resolve => setTimeout(resolve, 800)); 
    
    try {
      // A. Intentar leer el JSON
      const data = JSON.parse(codigoQR);

      // B. Validar Formato y Firma
      if (!data || data.app !== "BECA-UT" || !data.matricula || !data.fecha) {
        return null; // Formato inválido
      }

      // C. Validar Fecha (Solo vale por hoy)
      const fechaHoy = new Date().toLocaleDateString("es-MX").replace(/\//g, '-');
      if (data.fecha !== fechaHoy) {
        return { error: "QR Caducado (Fecha incorrecta)" };
      }

      // D. Retornar datos válidos (La validación de uso se hace en dataService)
      return {
        matricula: data.matricula,
        alumno: "Estudiante " + data.matricula,
        estado: "VALIDO",
        token: codigoQR 
      };

    } catch (e) {
      return null; // No es un JSON válido
    }
  },

  // 4. LOGOUT
  logout: () => {
    localStorage.removeItem('usuario');
    window.location.href = '/';
  }
};
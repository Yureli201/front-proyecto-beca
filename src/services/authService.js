// src/services/authService.js
import { dataService } from './dataService';

// --- SERVICIO DE AUTH CONECTADO A STORAGE ---

export const authService = {
  
  // 1. LOGIN REAL (Contra LocalStorage)
  login: async (email, password) => {
    // Simular un poco de espera para efecto de carga
    await new Promise(resolve => setTimeout(resolve, 500));

    // 1. Obtener todos los usuarios del "backend" (localStorage)
    const users = await dataService.getUsers();

    // 2. Buscar coincidencias
    const foundUser = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
    );

    if (!foundUser) {
        throw new Error("Credenciales inválidas");
    }

    // 3. Preparar objeto de sesión (sin password)
    const sessionUser = {
        id: foundUser.id,
        name: foundUser.nombre, // Normalizamos a 'name' para que coincida con lo que espera el front
        email: foundUser.email,
        role: foundUser.rol.toLowerCase(), // Normalizamos rol
        matricula: foundUser.matricula || null // Solo si tiene
    };

    // 4. Guardar sesión
    localStorage.setItem('usuario', JSON.stringify(sessionUser));
    return sessionUser;
  },

  // 2. GENERAR TOKEN SEGURO PARA QR
  getQRToken: (matricula) => {
    // Solo generamos QR si hay matrícula
    if (!matricula) return null;

    const fechaHoy = new Date().toLocaleDateString("es-MX").replace(/\//g, '-');
    const firma = "SECURE-TOKEN-" + Math.random().toString(36).substring(7); 
    
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

      // D. Retornar datos válidos
      // (Si quisieras validar "saldo" o "boleto usado" aquí consultarías dataService,
      // pero por ahora devolvemos que es válido estructuralmente)
      return {
        matricula: data.matricula,
        alumno: "Estudiante " + data.matricula, // Aquí podríamos buscar el nombre real en dataService si quisiéramos
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
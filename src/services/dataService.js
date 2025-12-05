// src/services/dataService.js

// --- BASE DE DATOS SIMULADA (MEMORIA) ---
// Estos datos existen mientras no recargues la página.
// En un futuro, aquí harías las llamadas a tu API real (fetch/axios).

let users = [
  { id: 1, nombre: "Juan Pérez", email: "juan@utxj.edu.mx", rol: "Estudiante" },
  { id: 2, nombre: "María González", email: "cafe@utxj.edu.mx", rol: "Cafetería" },
  { id: 3, nombre: "Director General", email: "admin@utxj.edu.mx", rol: "Admin" }
];

let historial = [
  { id: 1, alumno: "Ana López", matricula: "2024009", hora: "12:15 PM", estado: "Validado" },
  { id: 2, alumno: "Carlos Ruiz", matricula: "2024150", hora: "12:30 PM", estado: "Validado" }
];

export const dataService = {
  // --- USUARIOS (ADMIN) ---
  getUsers: async () => {
    // Simulamos un pequeño retraso de red (300ms) para realismo
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...users];
  },

  createUser: async (user) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newUser = { ...user, id: Date.now() };
    users.push(newUser);
    return newUser;
  },

  updateUser: async (id, updatedData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    users = users.map(u => u.id === id ? { ...u, ...updatedData } : u);
    return users.find(u => u.id === id);
  },

  deleteUser: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    users = users.filter(u => u.id !== id);
    return true;
  },

  // --- HISTORIAL (CAFETERÍA) ---
  getHistorial: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...historial];
  },

  addHistorialEntry: async (entry) => {
    // Validar si el token ya fue usado
    const yaExiste = historial.some(h => h.token === entry.token);
    
    if (yaExiste) {
      throw new Error("DUPLICADO");
    }

    const newEntry = { ...entry, id: Date.now() };
    historial.unshift(newEntry); 
    return newEntry;
  }
};

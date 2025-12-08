// src/services/dataService.js

const USERS_KEY = 'users_data_v2'; // Cambié la key para asegurar que se cree limpio
const HISTORIAL_KEY = 'historial_data';

// Datos iniciales si está vacío
const initialUsers = [
  { id: 1, nombre: "Juan Pérez", email: "juan@utxj.edu.mx", password: "123", rol: "Estudiante", matricula: "2025001" },
  { id: 2, nombre: "María González", email: "cafe@utxj.edu.mx", password: "123", rol: "Cafetería" },
  { id: 3, nombre: "Director General", email: "admin@utxj.edu.mx", password: "123", rol: "Admin" }
];

const initialHistorial = [
  { id: 1, alumno: "Ana López", matricula: "2024009", hora: "12:15 PM", estado: "Validado" },
  { id: 2, alumno: "Carlos Ruiz", matricula: "2024150", hora: "12:30 PM", estado: "Validado" }
];

// Helper para leer/guardar
const getStoredUsers = () => {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) {
        localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
        return initialUsers;
    }
    return JSON.parse(stored);
};

const saveStoredUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const dataService = {
  // --- USUARIOS (ADMIN) ---
  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getStoredUsers();
  },

  createUser: async (user) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const users = getStoredUsers();
    
    const newUser = { 
        ...user, 
        id: Date.now(),
        // Si no viene contraseña, poner una por defecto o validarlo en el front. 
        // Aquí asumimos que viene en 'user'.
    };
    
    users.push(newUser);
    saveStoredUsers(users);
    return newUser;
  },

  updateUser: async (id, updatedData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let users = getStoredUsers();
    
    users = users.map(u => u.id === id ? { ...u, ...updatedData } : u);
    saveStoredUsers(users);
    
    return users.find(u => u.id === id);
  },

  deleteUser: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let users = getStoredUsers();
    users = users.filter(u => u.id !== id);
    saveStoredUsers(users);
    return true;
  },

  // --- HISTORIAL (CAFETERÍA) ---
  getHistorial: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const stored = localStorage.getItem(HISTORIAL_KEY);
    if (!stored) {
        localStorage.setItem(HISTORIAL_KEY, JSON.stringify(initialHistorial));
        return initialHistorial;
    }
    return JSON.parse(stored);
  },

  addHistorialEntry: async (entry) => {
    // Validar si el token ya fue usado
    let historial = [];
    const stored = localStorage.getItem(HISTORIAL_KEY);
    if (stored) historial = JSON.parse(stored);
    else historial = [...initialHistorial];

    const yaExiste = historial.some(h => h.token && h.token === entry.token);
    
    if (yaExiste) {
      throw new Error("DUPLICADO");
    }

    const newEntry = { ...entry, id: Date.now() };
    historial.unshift(newEntry); 
    localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial));
    return newEntry;
  }
};

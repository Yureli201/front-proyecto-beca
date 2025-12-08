import axios from 'axios';
import { ProductServicesLocalStorage } from './ProductServicesLocalStorage';

// =========================================================================
// AQUÍ VAN TUS RUTAS DEL BACKEND
// =========================================================================
// Cuando tengas tu backend listo, cambia la URL base.
const API_URL = 'http://localhost:3000/api/products'; // Ejemplo, ajusta a tu puerto

// Función auxiliar para detectar si estamos online (o si queremos forzar online)
const checkOnlineStatus = () => window.navigator.onLine;

export const ProductServices = {
    
    getProducts: async () => {
        // Lógica: Intentar backend primero si hay internet. Si falla, usar LocalStorage.
        if (checkOnlineStatus()) {
            try {
                // NOTA: Descomenta estas líneas cuando tengas el backend corriendo
                // const response = await axios.get(API_URL);
                // return response.data;
                
                // POR AHORA: Forzamos el error para que use LocalStorage
                throw new Error("Backend no configurado aún");
            } catch (error) {
                console.warn("Modo Offline o Error en Backend: Usando LocalStorage", error);
                return await ProductServicesLocalStorage.getProducts();
            }
        } else {
            return await ProductServicesLocalStorage.getProducts();
        }
    },

    getProduct: async (id) => {
        if (checkOnlineStatus()) {
            try {
                // const response = await axios.get(`${API_URL}/${id}`);
                // return response.data;
                throw new Error("Backend no configurado aún");
            } catch (error) {
                return await ProductServicesLocalStorage.getProduct(id);
            }
        } else {
            return await ProductServicesLocalStorage.getProduct(id);
        }
    },

    createProduct: async (productData) => {
        if (checkOnlineStatus()) {
            try {
                // const response = await axios.post(API_URL, productData);
                // return response.data;
                throw new Error("Backend no configurado aún");
            } catch (error) {
                console.warn("Guardando en local (no se ha enviado al servidor)");
                return await ProductServicesLocalStorage.createProduct(productData);
            }
        } else {
             return await ProductServicesLocalStorage.createProduct(productData);
        }
    },

    updateProduct: async (id, productData) => {
        if (checkOnlineStatus()) {
            try {
                // const response = await axios.put(`${API_URL}/${id}`, productData);
                // return response.data;
                throw new Error("Backend no configurado aún");
            } catch (error) {
                 return await ProductServicesLocalStorage.updateProduct(id, productData);
            }
        } else {
            return await ProductServicesLocalStorage.updateProduct(id, productData);
        }
    },

    deleteProduct: async (id) => {
        if (checkOnlineStatus()) {
            try {
                // const response = await axios.delete(`${API_URL}/${id}`);
                // return response.data;
                throw new Error("Backend no configurado aún");
            } catch (error) {
                 return await ProductServicesLocalStorage.deleteProduct(id);
            }
        } else {
            return await ProductServicesLocalStorage.deleteProduct(id);
        }
    }
};

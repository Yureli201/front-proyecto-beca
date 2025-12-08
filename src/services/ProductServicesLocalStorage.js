const PRODUCTS_KEY = 'products_data';

export const ProductServicesLocalStorage = {
    getProducts: async () => {
        const products = localStorage.getItem(PRODUCTS_KEY);
        if (!products) {
            // Inicializamos con algunos datos de prueba para que no esté vacío
            const initialData = [
                { id: 1, name: "Café Americano", price: 25, category: "Bebidas", description: "Café negro recién hecho" },
                { id: 2, name: "Sandwich de Pollo", price: 45, category: "Alimentos", description: "Pan integral con pollo y vegetales" },
                { id: 3, name: "Jugo de Naranja", price: 20, category: "Bebidas", description: "Natural 350ml" },
                { id: 4, name: "Galleta de Avena", price: 15, category: "Postres", description: "Casera con pasas" }
            ];
            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialData));
            return initialData;
        }
        return JSON.parse(products);
    },

    getProduct: async (id) => {
        const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
        // Comparamos con == para que funcione con string o number
        const product = products.find(p => p.id == id);
        if (!product) throw new Error("Producto no encontrado");
        return product;
    },

    createProduct: async (productData) => {
        const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
        const newProduct = { 
            ...productData, 
            id: Date.now() // ID único simple basado en timestamp
        };
        products.push(newProduct);
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
        return newProduct;
    },

    updateProduct: async (id, productData) => {
        const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
        const index = products.findIndex(p => p.id == id);
        
        if (index !== -1) {
            const updatedProduct = { ...products[index], ...productData };
            products[index] = updatedProduct;
            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
            return updatedProduct;
        } else {
            throw new Error("Producto no encontrado para actualizar");
        }
    },

    deleteProduct: async (id) => {
        let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
        const initialLength = products.length;
        products = products.filter(p => p.id != id);
        
        if (products.length === initialLength) {
             throw new Error("Producto no encontrado para eliminar");
        }

        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
        return true; // Éxito
    }
};

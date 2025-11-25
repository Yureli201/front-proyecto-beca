import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- 1. Importa esto
import App from './App';

// Importa tus CSS globales aquí
import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/App.css"; // CORRECTO

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- 2. Envuelve tu App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
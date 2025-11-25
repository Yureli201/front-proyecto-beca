import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. IMPORTA EL LOGIN "CEREBRO" (LoginGeneral)
// Este es el que tiene la lógica para decidir si eres admin, cafe o estudiante.
import LoginGeneral from '../features/LoginGeneral.jsx';

// 2. IMPORTA TUS 3 PANTALLAS (DASHBOARDS)
import DashboardEstudiante from '../features/DashboardEstudiante.jsx';
import DashboardAdmin from '../features/DashboardAdmin.jsx';
import DashboardCafeteria from '../features/DashboardCafeteria.jsx';

export const AppRouter = () => {
  return (
    <Routes>
      {/* --- RUTA INICIAL (RAÍZ) --- */}
      {/* Es CRUCIAL que esto apunte a <LoginGeneral /> */}
      <Route path="/" element={<LoginGeneral />} />
      
      {/* --- RUTAS ESPECÍFICAS DE LOGIN (Por si acaso) --- */}
      {/* Redirigen todas al mismo login general para evitar confusiones */}
      <Route path="/login" element={<LoginGeneral />} />
      <Route path="/login-estudiante" element={<LoginGeneral />} />

      {/* --- RUTAS PROTEGIDAS (DASHBOARDS) --- */}
      <Route path="/estudiante/dashboard" element={<DashboardEstudiante />} />
      <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      <Route path="/cafeteria/dashboard" element={<DashboardCafeteria />} />

      {/* CATCH-ALL: Si escriben una ruta que no existe, volver al login */}
      <Route path="*" element={<LoginGeneral />} />
    </Routes>
  );
};
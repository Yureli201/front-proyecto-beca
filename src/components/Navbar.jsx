import React from 'react';

/**
 * Componente Navbar Reutilizable
 * @param {string} title - Título de la marca (ej. "Beca Digital")
 * @param {string} bgClass - Clase de fondo (ej. "bg-dark", "bg-secondary")
 * @param {ReactNode} children - Elementos a mostrar a la derecha (botones, texto usuario)
 */
const Navbar = ({ title, bgClass = "bg-dark", children }) => {
    return (
        <nav className={`navbar navbar-dark ${bgClass} px-3 py-3 border-bottom border-secondary shadow-sm`}>
            <div className="d-flex w-100 justify-content-between align-items-center">
                <span className="navbar-brand fw-bold fs-5 mb-0">{title}</span>
                <div className="d-flex gap-2 align-items-center">
                    {children}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

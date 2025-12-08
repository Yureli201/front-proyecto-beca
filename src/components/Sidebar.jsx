import React from 'react';
import { authService } from '../services/authService';

const Sidebar = ({ activeTab, onTabChange, showMobile, onCloseMobile }) => {
    const user = JSON.parse(localStorage.getItem('usuario') || '{}');

    return (
        <>
            {/* SIDEBAR */}
            <div
                className={`d-flex flex-column p-3 sidebar-container ${showMobile ? 'sidebar-open' : ''}`}
            >
                <div className="mb-5 px-2 mt-5 mt-md-2">
                    <h5 className="fw-bold mb-0">Hola, {user.name ? user.name.split(' ')[0] : 'Admin'}</h5>
                    <small className="opacity-75">{user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Panel de Control'}</small>
                </div>

                <ul className="nav flex-column gap-2 mb-auto">
                    <li className="nav-item">
                        <button
                            onClick={() => onTabChange('usuarios')}
                            className={`btn w-100 text-start ${activeTab === 'usuarios' ? 'btn-success text-white fw-bold shadow-sm' : 'btn-link text-dark text-decoration-none fw-medium'}`}
                        >
                            👥 Usuarios
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            onClick={() => onTabChange('boletos')}
                            className={`btn w-100 text-start ${activeTab === 'boletos' ? 'btn-success text-white fw-bold shadow-sm' : 'btn-link text-dark text-decoration-none fw-medium'}`}
                        >
                            🎫 Boletos
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            onClick={() => onTabChange('estadisticas')}
                            className={`btn w-100 text-start ${activeTab === 'estadisticas' ? 'btn-success text-white fw-bold shadow-sm' : 'btn-link text-dark text-decoration-none fw-medium'}`}
                        >
                            📊 Estadísticas
                        </button>
                    </li>
                    <li className="nav-item mt-4 pt-3 border-top border-secondary border-opacity-25">
                        <button
                            onClick={authService.logout}
                            className="btn w-100 text-start text-danger btn-link text-decoration-none fw-bold"
                        >
                            🚪 Cerrar Sesión
                        </button>
                    </li>
                </ul>
            </div>

            {/* OVERLAY OSCURO (Solo móvil) */}
            {showMobile && (
                <div
                    className="sidebar-overlay"
                    onClick={onCloseMobile}
                ></div>
            )}
        </>
    );
};

export default Sidebar;

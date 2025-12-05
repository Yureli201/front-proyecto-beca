import React from 'react';
import { authService } from '../services/authService';

const Sidebar = ({ activeTab, onTabChange, showMobile, onCloseMobile }) => {
    return (
        <>
            {/* SIDEBAR */}
            <div
                className={`d-flex flex-column p-3 text-white sidebar-container ${showMobile ? 'sidebar-open' : ''}`}
            >
                <div className="mb-5 px-2 mt-5 mt-md-2">
                    <h5 className="fw-bold mb-0">Admin Beca</h5>
                    <small className="opacity-75">Panel de Control</small>
                </div>

                <ul className="nav flex-column gap-2 mb-auto">
                    <li className="nav-item">
                        <button
                            onClick={() => onTabChange('usuarios')}
                            className={`btn w-100 text-start ${activeTab === 'usuarios' ? 'btn-light text-success fw-bold' : 'text-white btn-outline-success border-0'}`}
                        >
                            👥 Usuarios
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            onClick={() => onTabChange('estadisticas')}
                            className={`btn w-100 text-start ${activeTab === 'estadisticas' ? 'btn-light text-success fw-bold' : 'text-white btn-outline-success border-0'}`}
                        >
                            📊 Estadísticas
                        </button>
                    </li>
                </ul>

                <div className="mt-auto border-top border-white border-opacity-25 pt-3">
                    <button onClick={authService.logout} className="btn btn-sm btn-danger w-100 shadow-sm">
                        Cerrar Sesión
                    </button>
                </div>
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

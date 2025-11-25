import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { authService } from '../services/authService';

function DashboardAdmin() {
  const [tab, setTab] = useState('usuarios');
  const [showMobileMenu, setShowMobileMenu] = useState(false); // Estado menú móvil

  // --- DATOS FALSOS PARA DEMO ---
  const [users, setUsers] = useState([
    { id: 1, nombre: "Juan Pérez", email: "juan@utxj.edu.mx", rol: "Estudiante" },
    { id: 2, nombre: "María González", email: "cafe@utxj.edu.mx", rol: "Cafetería" },
    { id: 3, nombre: "Director General", email: "admin@utxj.edu.mx", rol: "Admin" }
  ]);

  const [modoFormulario, setModoFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', rol: 'Estudiante' });

  // --- FUNCIONES CRUD ---
  const abrirCrear = () => {
    setUsuarioEditando(null);
    setFormData({ nombre: '', email: '', rol: 'Estudiante' });
    setModoFormulario(true);
  };

  const abrirEditar = (user) => {
    setUsuarioEditando(user.id);
    setFormData({ nombre: user.nombre, email: user.email, rol: user.rol });
    setModoFormulario(true);
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    if (usuarioEditando) {
      setUsers(users.map(u => (u.id === usuarioEditando ? { ...u, ...formData } : u)));
    } else {
      const nuevoId = users.length + 1 + Math.random();
      setUsers([...users, { id: nuevoId, ...formData }]);
    }
    setModoFormulario(false);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleMenuClick = (tabName) => {
    setTab(tabName);
    setModoFormulario(false);
    setShowMobileMenu(false);
  };

  const getBadgeColor = (rol) => {
    if (rol === 'Admin') return 'bg-danger';
    if (rol === 'Cafetería') return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className="d-flex min-vh-100 bg-light position-relative">
      
      {/* BOTÓN MENÚ MÓVIL (Hamburguesa) - Solo visible en móvil */}
      <button 
        className="btn btn-success position-absolute top-0 start-0 m-3 d-md-none shadow" 
        style={{zIndex: 1050}}
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        ☰ Menú
      </button>

      {/* SIDEBAR RESPONSIVO */}
      <div 
        className={`d-flex flex-column p-3 text-white transition-all`} 
        style={{ 
          width: '250px', 
          backgroundColor: '#166534',
          position: 'fixed',
          height: '100vh',
          zIndex: 1040,
          left: 0,
          top: 0,
          transform: showMobileMenu ? 'translateX(0)' : 'translateX(-100%)', // Se oculta a la izquierda en móvil
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        {/* Estilo inline para que en PC siempre se vea (override del transform) */}
        <style>{`
          @media (min-width: 768px) {
            .transition-all { transform: none !important; position: relative !important; height: auto !important; }
          }
        `}</style>

        <div className="mb-5 px-2 mt-5 mt-md-2">
           <h5 className="fw-bold mb-0">Admin Beca</h5>
           <small className="opacity-75">Panel de Control</small>
        </div>
        
        <ul className="nav flex-column gap-2 mb-auto">
           <li className="nav-item">
             <button onClick={() => handleMenuClick('usuarios')} className={`btn w-100 text-start ${tab==='usuarios' ? 'btn-light text-success fw-bold' : 'text-white btn-outline-success border-0'}`}>
               👥 Usuarios
             </button>
           </li>
           <li className="nav-item">
             <button onClick={() => handleMenuClick('estadisticas')} className={`btn w-100 text-start ${tab==='estadisticas' ? 'btn-light text-success fw-bold' : 'text-white btn-outline-success border-0'}`}>
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

      {/* OVERLAY OSCURO (Cierra menú al tocar fuera en móvil) */}
      {showMobileMenu && (
        <div 
          className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" 
          style={{zIndex: 1030}}
          onClick={() => setShowMobileMenu(false)}
        ></div>
      )}

      {/* AREA DE CONTENIDO */}
      <div className="flex-grow-1 p-3 p-md-5 overflow-auto pt-5 pt-md-5">
        
        {/* VISTA USUARIOS */}
        {tab === 'usuarios' && (
          <div style={{animation: 'fadeIn 0.3s'}}>
            {!modoFormulario ? (
              <>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 mt-3 mt-md-0">
                  <div className="mb-3 mb-md-0">
                    <h2 className="fw-bold text-dark mb-0">Usuarios</h2>
                    <p className="text-muted small mb-0">Gestión de acceso</p>
                  </div>
                  <button onClick={abrirCrear} className="btn btn-success shadow-sm fw-bold w-100 w-md-auto"> + Nuevo</button>
                </div>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                   <div className="table-responsive">
                     <table className="table align-middle mb-0 table-hover">
                       <thead className="bg-light">
                         <tr>
                           <th className="p-3 small text-muted">Nombre</th>
                           <th className="small text-muted">Correo</th>
                           <th className="small text-muted">Rol</th>
                           <th className="text-end pe-4 small text-muted">Acciones</th>
                         </tr>
                       </thead>
                       <tbody>
                         {users.map((user) => (
                           <tr key={user.id}>
                             <td className="p-3 fw-bold text-nowrap">{user.nombre}</td>
                             <td className="text-nowrap">{user.email}</td>
                             <td><span className={`badge ${getBadgeColor(user.rol)} bg-opacity-10 text-${getBadgeColor(user.rol).replace('bg-', '')} px-3 py-2 rounded-pill`}>{user.rol}</span></td>
                             <td className="text-end pe-4 text-nowrap">
                               <button onClick={() => abrirEditar(user)} className="btn btn-sm btn-link text-decoration-none">Editar</button>
                               <button onClick={() => handleEliminar(user.id)} className="btn btn-sm btn-link text-danger text-decoration-none">Eliminar</button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </div>
              </>
            ) : (
              /* FORMULARIO RESPONSIVO */
              <div className="card border-0 shadow-sm rounded-4 p-4 mt-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3 className="fw-bold mb-4">{usuarioEditando ? 'Editar' : 'Crear'} Usuario</h3>
                <form onSubmit={handleGuardar}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nombre</label>
                    <input type="text" className="form-control" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Correo</label>
                    <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold">Rol</label>
                    <select className="form-select" value={formData.rol} onChange={(e) => setFormData({...formData, rol: e.target.value})}>
                      <option value="Estudiante">Estudiante</option>
                      <option value="Cafetería">Cafetería</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" onClick={() => setModoFormulario(false)} className="btn btn-light w-50">Cancelar</button>
                    <button type="submit" className="btn btn-success fw-bold w-50">{usuarioEditando ? 'Guardar' : 'Crear'}</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* VISTA ESTADÍSTICAS */}
        {tab === 'estadisticas' && (
           <div style={{animation: 'fadeIn 0.3s'}} className="mt-3 mt-md-0">
             <h2 className="fw-bold mb-4">Reporte Diario</h2>
             <div className="row g-3">
               <div className="col-12 col-md-4">
                 <div className="card border-0 shadow-sm p-4 text-center h-100 border-start border-4 border-success">
                   <h6 className="text-muted text-uppercase small">Boletos</h6>
                   <h2 className="display-4 fw-bold text-success my-2">154</h2>
                   <small className="text-success">↑ 12% hoy</small>
                 </div>
               </div>
               <div className="col-12 col-md-4">
                 <div className="card border-0 shadow-sm p-4 text-center h-100 border-start border-4 border-primary">
                   <h6 className="text-muted text-uppercase small">Estudiantes</h6>
                   <h2 className="display-4 fw-bold text-primary my-2">{users.length}</h2>
                   <small className="text-muted">Activos</small>
                 </div>
               </div>
               <div className="col-12 col-md-4">
                 <div className="card border-0 shadow-sm p-4 text-center h-100 border-start border-4 border-warning">
                   <h6 className="text-muted text-uppercase small">Alertas</h6>
                   <h2 className="display-4 fw-bold text-warning my-2">3</h2>
                   <small className="text-muted">Pendientes</small>
                 </div>
               </div>
             </div>
           </div>
        )}

      </div>
    </div>
  );
}

export default DashboardAdmin;
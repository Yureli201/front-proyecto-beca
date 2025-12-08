import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import { dataService } from '../services/dataService';

function DashboardAdmin() {
  const [tab, setTab] = useState('usuarios');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [users, setUsers] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modoFormulario, setModoFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', rol: 'Estudiante' });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await dataService.getUsers();
      const historyData = await dataService.getHistorial();
      setUsers(data);
      setHistorial(historyData);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirCrear = () => {
    setUsuarioEditando(null);
    setFormData({ nombre: '', email: '', password: '', rol: 'Estudiante' });
    setModoFormulario(true);
  };

  const abrirEditar = (user) => {
    setUsuarioEditando(user.id);
    setFormData({ nombre: user.nombre, email: user.email, password: user.password || '', rol: user.rol });
    setModoFormulario(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    // Extraer matrícula del correo (parte antes del @)
    const matriculaExtraida = formData.email.split('@')[0];

    const datosFinales = {
      ...formData,
      matricula: matriculaExtraida
    };

    if (usuarioEditando) {
      await dataService.updateUser(usuarioEditando, datosFinales);
    } else {
      await dataService.createUser(datosFinales);
    }
    await cargarUsuarios();
    setModoFormulario(false);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      await dataService.deleteUser(id);
      await cargarUsuarios();
    }
  };

  const getBadgeColor = (rol) => {
    if (rol === 'Admin') return 'bg-danger';
    if (rol === 'Cafetería') return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className="d-flex min-vh-100 bg-light position-relative">

      <button
        className="btn btn-success position-absolute top-0 start-0 m-3 d-md-none shadow rounded-circle p-3"
        style={{ zIndex: 1050, width: '50px', height: '50px' }}
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        ☰
      </button>

      <Sidebar
        activeTab={tab}
        onTabChange={(t) => { setTab(t); setModoFormulario(false); setShowMobileMenu(false); }}
        showMobile={showMobileMenu}
        onCloseMobile={() => setShowMobileMenu(false)}
      />

      <div className="flex-grow-1 p-4 p-lg-5 overflow-auto pt-5 pt-md-5">

        {/* VISTA USUARIOS */}
        {tab === 'usuarios' && (
          <div className="animate-fade-in mt-4 mt-md-0">
            {!modoFormulario ? (
              <>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5">
                  <div>
                    <h2 className="fw-bold text-dark mb-1">Gestión de Usuarios</h2>
                    <p className="text-muted small mb-0">Administra el acceso a la plataforma</p>
                  </div>
                  <button onClick={abrirCrear} className="btn btn-success shadow-sm fw-bold rounded-pill px-4 py-2 mt-3 mt-md-0">
                    + Nuevo Usuario
                  </button>
                </div>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                  <div className="table-responsive">
                    <table className="table align-middle mb-0 table-hover">
                      <thead className="bg-light border-bottom-0">
                        <tr>
                          <th className="p-4 small text-uppercase text-muted fw-bold border-0">Nombre</th>
                          <th className="p-4 small text-uppercase text-muted fw-bold border-0">Correo</th>
                          <th className="p-4 small text-uppercase text-muted fw-bold border-0">Rol</th>
                          <th className="p-4 small text-uppercase text-muted fw-bold border-0 text-end">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="border-top-0">
                        {loading ? (
                          <tr><td colSpan="4" className="text-center p-5 text-muted">Cargando usuarios...</td></tr>
                        ) : users.map((user) => (
                          <tr key={user.id}>
                            <td className="p-4 fw-bold text-dark border-bottom border-light">{user.nombre}</td>
                            <td className="p-4 text-secondary border-bottom border-light">{user.email}</td>
                            <td className="p-4 border-bottom border-light">
                              <span className={`badge ${getBadgeColor(user.rol)} bg-opacity-10 text-${getBadgeColor(user.rol).replace('bg-', '')} px-3 py-2 rounded-pill border border-${getBadgeColor(user.rol).replace('bg-', '')} border-opacity-25`}>
                                {user.rol}
                              </span>
                            </td>
                            <td className="p-4 text-end border-bottom border-light">
                              <button onClick={() => abrirEditar(user)} className="btn btn-sm btn-light text-primary fw-bold me-2 rounded-3 px-3">Editar</button>
                              <button onClick={() => handleEliminar(user.id)} className="btn btn-sm btn-light text-danger fw-bold rounded-3 px-3">Eliminar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="card border-0 shadow-lg rounded-5 p-5 mx-auto animate-fade-in" style={{ maxWidth: '600px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold mb-0">{usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                  <button onClick={() => setModoFormulario(false)} className="btn-close"></button>
                </div>

                <form onSubmit={handleGuardar}>
                  <div className="mb-4">
                    <label className="form-label fw-bold small text-uppercase text-muted">Nombre Completo</label>
                    <input type="text" className="form-control form-control-lg bg-light border-0 rounded-3" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold small text-uppercase text-muted">Correo Electrónico</label>
                    <input type="email" className="form-control form-control-lg bg-light border-0 rounded-3" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold small text-uppercase text-muted">Contraseña</label>
                    <input type="text" className="form-control form-control-lg bg-light border-0 rounded-3" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required placeholder="Mínimo 3 caracteres" />
                  </div>
                  <div className="mb-5">
                    <label className="form-label fw-bold small text-uppercase text-muted">Rol Asignado</label>
                    <select className="form-select form-select-lg bg-light border-0 rounded-3" value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })}>
                      <option value="Estudiante">Estudiante</option>
                      <option value="Cafetería">Cafetería</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-success btn-lg fw-bold rounded-3 shadow-sm">{usuarioEditando ? 'Guardar Cambios' : 'Crear Usuario'}</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {tab === 'boletos' && (
          <div className="animate-fade-in mt-4 mt-md-0">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5">
              <div>
                <h2 className="fw-bold text-dark mb-1">Monitor de Boletos</h2>
                <p className="text-muted small mb-0">Historial de consumo de alimentos</p>
              </div>
              <div className="bg-white px-3 py-2 rounded-4 shadow-sm border mt-3 mt-md-0">
                <span className="text-muted small me-2">Total Hoy:</span>
                <span className="fw-bold text-success fs-5">{historial.length}</span>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover">
                  <thead className="bg-light border-bottom-0">
                    <tr>
                      <th className="p-4 small text-uppercase text-muted fw-bold border-0">Hora</th>
                      <th className="p-4 small text-uppercase text-muted fw-bold border-0">Alumno</th>
                      <th className="p-4 small text-uppercase text-muted fw-bold border-0">Matrícula</th>
                      <th className="p-4 small text-uppercase text-muted fw-bold border-0 text-end">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="border-top-0">
                    {historial.length === 0 ? (
                      <tr><td colSpan="4" className="text-center p-5 text-muted">No hay registros de hoy.</td></tr>
                    ) : (
                      historial.map((item) => (
                        <tr key={item.id}>
                          <td className="p-4 fw-medium text-secondary font-monospace border-bottom border-light">{item.hora}</td>
                          <td className="p-4 fw-bold text-dark border-bottom border-light">{item.alumno}</td>
                          <td className="p-4 text-secondary border-bottom border-light">{item.matricula}</td>
                          <td className="p-4 text-end border-bottom border-light">
                            <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill border border-success border-opacity-25">
                              {item.estado}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VISTA ESTADÍSTICAS */}
        {tab === 'estadisticas' && (
          <div className="animate-fade-in mt-4 mt-md-0">
            <h2 className="fw-bold mb-2 text-dark">Panel de Control</h2>
            <p className="text-muted mb-5">Resumen de actividad del día</p>

            <div className="row g-4 justify-content-center">
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm p-4 h-100 rounded-5 position-relative overflow-hidden text-center">
                  <div className="position-absolute top-50 start-50 translate-middle display-1 user-select-none" style={{ opacity: 0.15, zIndex: 0, fontSize: '8rem' }}>🎫</div>
                  <div className="position-relative" style={{ zIndex: 1 }}>
                    <h6 className="text-muted text-uppercase small fw-bold mb-3">Boletos Canjeados</h6>
                    <h2 className="display-4 fw-bold text-dark mb-0">{historial.length}</h2>
                    <div className="mt-3 text-success small fw-bold bg-success bg-opacity-10 d-inline-block px-2 py-1 rounded-3">
                      Hoy
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm p-4 h-100 rounded-5 position-relative overflow-hidden text-center">
                  <div className="position-absolute top-50 start-50 translate-middle display-1 user-select-none" style={{ opacity: 0.15, zIndex: 0, fontSize: '8rem' }}>👥</div>
                  <div className="position-relative" style={{ zIndex: 1 }}>
                    <h6 className="text-muted text-uppercase small fw-bold mb-3">Estudiantes Activos</h6>
                    <h2 className="display-4 fw-bold text-dark mb-0">{users.filter(u => u.rol === 'Estudiante').length}</h2>
                    <div className="mt-3 text-primary small fw-bold bg-primary bg-opacity-10 d-inline-block px-2 py-1 rounded-3">
                      Total registrados
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm p-4 h-100 rounded-5 position-relative overflow-hidden text-center">
                  <div className="position-absolute top-50 start-50 translate-middle display-1 user-select-none" style={{ opacity: 0.15, zIndex: 0, fontSize: '8rem' }}>⚠️</div>
                  <div className="position-relative" style={{ zIndex: 1 }}>
                    <h6 className="text-muted text-uppercase small fw-bold mb-3">Alertas del Sistema</h6>
                    <h2 className="display-4 fw-bold text-dark mb-0">0</h2>
                    <div className="mt-3 text-secondary small fw-bold bg-secondary bg-opacity-10 d-inline-block px-2 py-1 rounded-3">
                      Todo en orden
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GRÁFICA SIMPLE CSS (Boletos por Hora) */}
            <div className="mt-5">
              <h4 className="fw-bold mb-4">Actividad por Hora (Estimación)</h4>
              <div className="card border-0 shadow-sm p-5 rounded-5">
                <div className="d-flex align-items-end justify-content-around w-100" style={{ height: '250px' }}>
                  {(() => {
                    // Agrupar por hora (simple)
                    const horas = {};
                    historial.forEach(h => {
                      // h.hora es string "12:15 PM"
                      const parteHora = h.hora.split(':')[0]; // "12"
                      horas[parteHora] = (horas[parteHora] || 0) + 1;
                    });

                    // Definir rango de horas de servicio relevantes
                    const rangoHoras = ['10', '11', '12', '01', '02', '03'];
                    const maxVal = Math.max(...Object.values(horas), 5); // Escala máxima dinámica (mínimo 5)

                    return rangoHoras.map(hora => {
                      const count = horas[hora] || 0;
                      const heightPercent = Math.max(((count / maxVal) * 100), 2); // Mínimo 2% para que se vea la barrita vacía

                      return (
                        <div key={hora} className="d-flex flex-column align-items-center flex-grow-1 px-1">
                          <div className="fw-bold mb-2 text-dark small">{count > 0 ? count : ''}</div>
                          <div
                            className={`rounded-3 w-100 ${count > 0 ? 'bg-success opacity-75' : 'bg-light'}`}
                            style={{
                              height: `${heightPercent}%`,
                              minHeight: '4px',
                              transition: 'height 0.5s ease'
                            }}
                          ></div>
                          <small className="text-muted mt-3 font-monospace fw-bold" style={{ fontSize: '0.8rem' }}>{hora}:00</small>
                        </div>
                      );
                    });
                  })()}
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
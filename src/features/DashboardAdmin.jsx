import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { usersService } from '../services/usersService';
import { authService } from '../services/authService';
import { ticketsService } from '../services/ticketsService';

function DashboardAdmin() {
  const [tab, setTab] = useState('usuarios');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modoFormulario, setModoFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formData, setFormData] = useState({ 
    nombre: '', 
    email: '', 
    password: '',
    rol: 'Estudiante',
    matricula: '',
    becaActiva: true
  });

  const [ticketsToday, setTicketsToday] = useState(0);
  const [ticketsAll, setTicketsAll] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    cargarUsuarios();
    countInfo();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await usersService.getAllUsers();
      const usuariosMapeados = response.data.users.map(user => ({
        id: user._id,
        nombre: user.name,
        email: user.email,
        rol: user.role,
        matricula: user.student_info?.matricula || null,
        becaActiva: user.student_info?.beca_activa || false
      }));
      console.log(usuariosMapeados);
      setUsers(usuariosMapeados);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirCrear = () => {
    setUsuarioEditando(null);
    setFormData({ 
      nombre: '', 
      email: '', 
      password: '',
      rol: 'Estudiante',
      matricula: '',
      becaActiva: true
    });
    setModoFormulario(true);
  };

  const abrirEditar = (user) => {
    setUsuarioEditando(user.email);
    setFormData({ 
      nombre: user.nombre, 
      email: user.email, 
      password: '', // Dejar vacío al editar (opcional)
      rol: user.rol,
      matricula: user.matricula || '',
      becaActiva: user.becaActiva || false
    });
    setModoFormulario(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      // Preparar los datos según el rol
      const userData = {
        name: formData.nombre,
        email: formData.email,
        role: formData.rol
      };

      // Agregar contraseña si se proporcionó (requerido al crear, opcional al editar)
      if (formData.password) {
        userData.password = formData.password;
      }

      // Si es estudiante, agregar student_info
      if (formData.rol === 'Estudiante') {
        userData.student_info = {
          matricula: parseInt(formData.matricula), // Convertir a número
          beca_activa: formData.becaActiva
        };
      }

      if (usuarioEditando) {
        // Actualizar usuario existente
        await usersService.editUser(usuarioEditando, userData);
      } else {
        // Crear nuevo usuario
        console.log(userData);
        await authService.createUser(userData);
      }
      
      await cargarUsuarios();
      setModoFormulario(false);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert("Error al guardar el usuario. Por favor intenta de nuevo.");
    }
  };

  const handleEliminar = async (email) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await usersService.deleteUser(email);
        await cargarUsuarios();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert("Error al eliminar el usuario. Por favor intenta de nuevo.");
      }
    }
  };

  const countInfo = async () => {
    try {
      const response = await ticketsService.getTicketsToday();
      setTicketsToday(response.data.tickets?.length || 0);

      const responseAll = await ticketsService.getAllTickets();
      setTicketsAll(responseAll.data.tickets);

      const responseUser = await usersService.getStudents();
      setStudents(responseUser.data.users || []);
    } catch (error) {
      console.error("Error al cargar información:", error);
    }
  }

  const getBadgeColor = (rol) => {
    if (rol === 'Administrador') return 'bg-danger';
    if (rol === 'Cafeteria') return 'bg-warning';
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
                              <button onClick={() => handleEliminar(user.email)} className="btn btn-sm btn-light text-danger fw-bold rounded-3 px-3">Eliminar</button>
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
                    <label className="form-label fw-bold small text-uppercase text-muted">Contraseña {usuarioEditando && <span className="text-muted small">(dejar vacío para no cambiar)</span>}</label>
                    <input 
                      type="password" 
                      className="form-control form-control-lg bg-light border-0 rounded-3" 
                      value={formData.password} 
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                      placeholder="••••••••"
                      required={!usuarioEditando} // Requerido solo al crear
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold small text-uppercase text-muted">Rol Asignado</label>
                    <select className="form-select form-select-lg bg-light border-0 rounded-3" value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })}>
                      <option value="Estudiante">Estudiante</option>
                      <option value="Cafeteria">Cafetería</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </div>

                  {/* Campos adicionales para Estudiantes */}
                  {formData.rol === 'Estudiante' && (
                    <>
                      <div className="mb-4">
                        <label className="form-label fw-bold small text-uppercase text-muted">Matrícula</label>
                        <input 
                          type="text" 
                          className="form-control form-control-lg bg-light border-0 rounded-3" 
                          value={formData.matricula} 
                          onChange={(e) => setFormData({ ...formData, matricula: e.target.value })} 
                          placeholder="Ej: 20234501"
                          required 
                        />
                      </div>
                      <div className="mb-5">
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="becaActivaSwitch"
                            checked={formData.becaActiva}
                            onChange={(e) => setFormData({ ...formData, becaActiva: e.target.checked })}
                          />
                          <label className="form-check-label fw-bold small text-uppercase text-muted" htmlFor="becaActivaSwitch">
                            Beca Activa
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.rol !== 'Estudiante' && <div className="mb-5"></div>}
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-success btn-lg fw-bold rounded-3 shadow-sm">{usuarioEditando ? 'Guardar Cambios' : 'Crear Usuario'}</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* VISTA ESTADÍSTICAS */}
        {tab === 'estadisticas' && (
          <div className="animate-fade-in mt-4 mt-md-0">
            <h2 className="fw-bold mb-2 text-dark">Panel de Control</h2>
            <p className="text-muted mb-5">Resumen de actividad del día</p>

            <div className="row g-4">
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm p-4 h-100 rounded-5 position-relative overflow-hidden">
                  <div className="position-absolute top-0 end-0 p-3 opacity-10 display-1 text-success">🎫</div>
                  <h6 className="text-muted text-uppercase small fw-bold mb-3">Boletos Canjeados Hoy</h6>
                  <h2 className="display-4 fw-bold text-dark mb-0">{ticketsToday}</h2>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm p-4 h-100 rounded-5 position-relative overflow-hidden">
                  <div className="position-absolute top-0 end-0 p-3 opacity-10 display-1 text-primary">👥</div>
                  <h6 className="text-muted text-uppercase small fw-bold mb-3">Estudiantes Activos</h6>
                  <h2 className="display-4 fw-bold text-dark mb-0">{students.length}</h2>
                  <div className="mt-3 text-primary small fw-bold bg-primary bg-opacity-10 d-inline-block px-2 py-1 rounded-3">
                    Total registrados
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm p-4 h-100 rounded-5 position-relative overflow-hidden">
                  <div className="position-absolute top-0 end-0 p-3 opacity-10 display-1 text-warning">🎫</div>
                  <h6 className="text-muted text-uppercase small fw-bold mb-3">Boletos Canjeados Totales</h6>
                  <h2 className="display-4 fw-bold text-dark mb-0">{ticketsAll}</h2>

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
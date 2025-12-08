import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { authService } from '../services/authService';
// import LogoProyecto from '../logo-beca.png'; // Descomenta si tienes logo

function LoginGeneral() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false); // Para deshabilitar botón mientras carga

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      // 1. Llamamos al Back
      const user = await authService.login(email, password);

      console.log("Usuario recibido:", user); // Para que veas en consola qué llegó

      // 2. Normalizamos el rol (todo a minúsculas para evitar errores)
      // Tu BD tiene: "Administrador", "Cafeteria", "Estudiante"
      const userRole = (user.role || user.rol || "").toLowerCase();

      // 3. Redirección Robusta
      if (userRole.includes("admin")) {
        navigate('/admin/dashboard');
      }
      else if (userRole.includes("cafe")) {
        navigate('/cafeteria/dashboard');
      }
      else {
        // Por defecto estudiante (cubre "estudiante", "alumno", etc.)
        navigate('/estudiante/dashboard');
      }

    } catch (err) {
      console.error(err);
      // Mensaje amigable para el usuario
      setError("No pudimos iniciar sesión. Verifica tu correo y contraseña.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center p-4 position-relative">

      <div className="card border-0 shadow-lg rounded-5 overflow-hidden" style={{ maxWidth: '420px', width: '100%' }}>
        {/* Barra superior decorativa */}
        <div className="bg-success h-1 w-100" style={{ height: '8px' }}></div>

        <div className="card-body p-5 text-center bg-white">

          {/* <img src={LogoProyecto} alt="Logo" style={{ width: '80px' }} className="mb-4" /> */}

          <h2 className="fw-bold mb-2 text-dark" style={{ letterSpacing: '-0.5px' }}>Bienvenido</h2>
          <p className="text-muted mb-5 small">Ingresa tus credenciales para acceder a la Beca Alimenticia</p>

          {error && (
            <div className="alert alert-danger text-start small border-0 bg-danger bg-opacity-10 text-danger fw-medium rounded-3 mb-4" role="alert">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4 text-start">
              <label className="form-label fw-semibold small text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Correo Institucional</label>
              <input
                type="email"
                className="form-control form-control-lg bg-light border-0 rounded-3 px-3"
                placeholder="ejemplo@utxj.edu.mx"
                style={{ fontSize: '0.95rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-5 text-start">
              <label className="form-label fw-semibold small text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Contraseña</label>
              <input
                type="password"
                className="form-control form-control-lg bg-light border-0 rounded-3 px-3"
                placeholder="••••••••"
                style={{ fontSize: '0.95rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success btn-lg w-100 fw-bold rounded-3 py-3 shadow-sm transition-all"
              style={{ fontSize: '1rem', letterSpacing: '0.5px' }}
              disabled={cargando}
            >
              {cargando ? (
                <span><span className="spinner-border spinner-border-sm me-2"></span>Ingresando...</span>
              ) : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginGeneral;
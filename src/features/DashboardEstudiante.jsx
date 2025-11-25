import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { authService } from '../services/authService';

function DashboardEstudiante() {
  const [usuario, setUsuario] = useState({ 
    name: "Cargando...", 
    matricula: "...", 
    carrera: "Ingeniería" 
  });
  const [tiempo, setTiempo] = useState({ horas: '00', minutos: '00', segundos: '00' });
  const [mensajeReloj, setMensajeReloj] = useState("Cargando...");
  const [servicioActivo, setServicioActivo] = useState(false);

  useEffect(() => {
    // 1. Cargar datos usuario del LocalStorage (Simulación de sesión persistente)
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
    if (usuarioGuardado) {
      setUsuario({
        name: usuarioGuardado.name || "Estudiante",
        matricula: usuarioGuardado.matricula || usuarioGuardado.student_info?.matricula || "S/N",
        carrera: "Desarrollo de Software"
      });
    }

    // 2. Lógica del Reloj Inteligente
    const intervalo = setInterval(() => {
      const ahora = new Date();
      
      // Definir Horarios: 11:00 AM a 2:00 PM (14:00)
      const inicioServicio = new Date(); 
      inicioServicio.setHours(11, 0, 0, 0);
      
      const finServicio = new Date(); 
      finServicio.setHours(14, 0, 0, 0);

      let diferencia = 0;

      if (ahora < inicioServicio) {
        // Antes de las 11:00 AM
        diferencia = inicioServicio - ahora;
        setMensajeReloj("El servicio inicia en:");
        setServicioActivo(false);
      } 
      else if (ahora >= inicioServicio && ahora < finServicio) {
        // Entre 11:00 AM y 2:00 PM
        diferencia = finServicio - ahora;
        setMensajeReloj("Tiempo restante para comer:");
        setServicioActivo(true);
      } 
      else {
        // Después de las 2:00 PM
        diferencia = 0;
        setMensajeReloj("Servicio finalizado por hoy");
        setServicioActivo(false);
      }

      // Formatear milisegundos a HH:MM:SS
      if (diferencia > 0) {
        const h = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diferencia / (1000 * 60)) % 60);
        const s = Math.floor((diferencia / 1000) % 60);

        setTiempo({
          horas: h.toString().padStart(2, '0'),
          minutos: m.toString().padStart(2, '0'),
          segundos: s.toString().padStart(2, '0')
        });
      } else {
        setTiempo({ horas: '00', minutos: '00', segundos: '00' });
      }

    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="min-vh-100 bg-white">
      {/* Navbar Compacto y Responsivo */}
      <nav className="navbar navbar-dark bg-secondary py-2 px-3 shadow-sm">
        <div className="d-flex w-100 justify-content-between align-items-center">
          <span className="navbar-brand fw-bold h1 mb-0 fs-5">Beca Digital</span>
          <div className="d-flex gap-2 align-items-center">
            {/* Ocultamos el nombre en pantallas muy pequeñas (d-none d-sm-block) */}
            <span className="text-white-50 d-none d-sm-block small">Hola, {usuario.name.split(" ")[0]}</span>
            <button onClick={authService.logout} className="btn btn-outline-light btn-sm px-3">Salir</button>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <h2 className="fw-bold mb-1 text-center text-md-start">Tu Boleto</h2>
            <p className="text-muted mb-4 text-center text-md-start small">Muestra este código en caja.</p>

            <div className="row g-3">
              
              {/* TARJETA QR */}
              {/* En móvil ocupa todo el ancho (col-12), en Tablet/PC ocupa 7 columnas (col-md-7) */}
              <div className="col-12 col-md-7">
                <div className={`p-4 rounded-4 shadow-sm d-flex flex-column flex-sm-row align-items-center gap-4 border ${servicioActivo ? 'border-success bg-success bg-opacity-10' : 'border-secondary bg-light'}`}>
                  
                  {/* Imagen QR */}
                  <div className="bg-white rounded-4 p-2 shadow-sm d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '180px', height: '180px' }}>
                     {servicioActivo ? (
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${usuario.matricula}`} 
                          alt="QR" 
                          className="img-fluid"
                        />
                     ) : (
                        <div className="text-center text-muted">
                          <h3>🔒</h3>
                          <small>Inactivo</small>
                        </div>
                     )}
                  </div>

                  {/* Datos del Alumno */}
                  <div className="text-dark w-100 text-center text-sm-start">
                    <h5 className="fw-bold mb-2 text-success">Beneficiario</h5>
                    <p className="mb-0 small text-muted">Nombre</p>
                    <p className="fw-bold mb-2 text-truncate">{usuario.name}</p>
                    
                    <p className="mb-0 small text-muted">Matrícula</p>
                    <p className="fw-bold font-monospace mb-3">{usuario.matricula}</p>
                    
                    {servicioActivo ? 
                       <span className="badge bg-success px-3 py-2 w-100 w-sm-auto">✅ ACTIVO</span> : 
                       <span className="badge bg-secondary px-3 py-2 w-100 w-sm-auto">🕒 CERRADO</span>
                    }
                  </div>
                </div>
              </div>

              {/* TARJETA RELOJ */}
              <div className="col-12 col-md-5">
                <div className={`p-4 rounded-4 h-100 shadow-sm text-center border d-flex flex-column justify-content-center ${servicioActivo ? 'bg-success bg-opacity-10 border-success' : 'bg-light border-secondary'}`}>
                  <h6 className="fw-bold text-dark mb-3 text-uppercase small">{mensajeReloj}</h6>
                  
                  <div className="d-flex gap-1 justify-content-center mb-3 align-items-center">
                     <div className="bg-white rounded p-2 display-6 fw-bold shadow-sm text-dark" style={{minWidth:'60px'}}>{tiempo.horas}</div>
                     <span className="h4 fw-bold text-muted mb-0">:</span>
                     <div className="bg-white rounded p-2 display-6 fw-bold shadow-sm text-dark" style={{minWidth:'60px'}}>{tiempo.minutos}</div>
                     <span className="h4 fw-bold text-muted mb-0">:</span>
                     <div className="bg-white rounded p-2 display-6 fw-bold shadow-sm text-dark" style={{minWidth:'60px'}}>{tiempo.segundos}</div>
                  </div>
                  
                  <p className="small text-muted mb-0">
                    Horario: 11:00 AM - 2:00 PM
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardEstudiante;
import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { authService } from '../services/authService';
import { ticketsService } from '../services/ticketsService';
import { useReloj } from '../hooks/useReloj';
import Navbar from '../components/Navbar';

function DashboardEstudiante() {
  const [usuario, setUsuario] = useState({
    name: "Cargando...",
    matricula: "..."
  });
  const [loading, setLoading] = useState(true);

  const { tiempo, mensajeReloj, servicioActivo } = useReloj();

  useEffect(() => {
    const cargarDatosEstudiante = async () => {
      const matricula = localStorage.getItem("matricula");
      const name = localStorage.getItem("name");

      setUsuario({
        name,
        matricula
      });
    };

    cargarDatosEstudiante();
  }, []);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar title="Beca Digital" bgClass="bg-success">
        <span className="text-white d-none d-sm-block small fw-medium opacity-75">Hola, {usuario.name.split(" ")[0]}</span>
        <button onClick={authService.logout} className="btn btn-light btn-sm px-3 fw-bold text-success rounded-pill shadow-sm">Salir</button>
      </Navbar>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">

            <div className="mb-4 text-center text-md-start">
              <h2 className="fw-bold text-dark mb-1" style={{ letterSpacing: '-0.5px' }}>Tu Boleto Digital</h2>
              <p className="text-muted small">Presenta este código en la caja de la cafetería.</p>
            </div>

            <div className="row g-4">

              {/* TARJETA QR */}
              <div className="col-12 col-md-7">
                <div className={`p-4 p-lg-5 rounded-5 shadow-sm d-flex flex-column flex-sm-row align-items-center gap-4 border-0 h-100 transition-all ${servicioActivo ? 'bg-white' : 'bg-white opacity-75'}`}>

                  {/* Imagen QR */}
                  <div className="qr-box flex-shrink-0 shadow-sm border border-light p-3 bg-white rounded-4">
                    {servicioActivo ? (
                      <QRCodeSVG
                        value={ticketsService.getQRToken()}
                        size={160}
                        level={"H"} // Alta corrección de errores
                        includeMargin={false}
                      />
                    ) : (
                      <div className="text-center text-muted py-4">
                        <div className="fs-1 mb-2">🔒</div>
                        <small className="fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Fuera de Horario</small>
                      </div>
                    )}
                  </div>

                  {/* Datos del Alumno */}
                  <div className="text-dark w-100 text-center text-sm-start">
                    <div className="mb-3">
                      <p className="mb-1 small text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Beneficiario</p>
                      <h4 className="fw-bold mb-0 text-dark text-truncate">{usuario.name}</h4>
                    </div>

                    <div className="mb-4">
                      <p className="mb-1 small text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Matrícula</p>
                      <p className="fs-5 font-monospace mb-0 text-dark">{usuario.matricula}</p>
                    </div>

                    {servicioActivo ?
                      <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-bold border border-success border-opacity-25">
                        ● DISPONIBLE
                      </span> :
                      <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill fw-bold border border-secondary border-opacity-25">
                        ● CERRADO
                      </span>
                    }
                  </div>
                </div>
              </div>

              {/* TARJETA RELOJ */}
              <div className="col-12 col-md-5">
                <div className={`p-4 rounded-5 h-100 shadow-sm text-center border-0 d-flex flex-column justify-content-center ${servicioActivo ? 'bg-success text-white' : 'bg-white text-dark'}`}
                  style={servicioActivo ? { background: 'linear-gradient(145deg, #166534, #15803d)' } : {}}>

                  <h6 className={`fw-bold mb-4 text-uppercase small ${servicioActivo ? 'text-white-50' : 'text-muted'}`} style={{ letterSpacing: '1px' }}>
                    {mensajeReloj}
                  </h6>

                  <div className="d-flex gap-2 justify-content-center mb-4 align-items-center">
                    <div className={`rounded-3 p-2 display-6 fw-bold shadow-sm ${servicioActivo ? 'bg-white text-success' : 'bg-light text-dark'}`} style={{ minWidth: '60px' }}>{tiempo.horas}</div>
                    <span className={`h4 fw-bold mb-0 ${servicioActivo ? 'text-white-50' : 'text-muted'}`}>:</span>
                    <div className={`rounded-3 p-2 display-6 fw-bold shadow-sm ${servicioActivo ? 'bg-white text-success' : 'bg-light text-dark'}`} style={{ minWidth: '60px' }}>{tiempo.minutos}</div>
                    <span className={`h4 fw-bold mb-0 ${servicioActivo ? 'text-white-50' : 'text-muted'}`}>:</span>
                    <div className={`rounded-3 p-2 display-6 fw-bold shadow-sm ${servicioActivo ? 'bg-white text-success' : 'bg-light text-dark'}`} style={{ minWidth: '60px' }}>{tiempo.segundos}</div>
                  </div>

                  <p className={`small mb-0 ${servicioActivo ? 'text-white-50' : 'text-muted'}`}>
                    Horario de Servicio: <br /> <strong>11:00 AM - 2:00 PM</strong>
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
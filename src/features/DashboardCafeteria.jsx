import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import 'bootstrap/dist/css/bootstrap.min.css';
import { authService } from '../services/authService';
import { dataService } from '../services/dataService';
import Navbar from '../components/Navbar';

function DashboardCafeteria() {
  const [vista, setVista] = useState('escanear');
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [datosTicket, setDatosTicket] = useState(null);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    const data = await dataService.getHistorial();
    setHistorial(data);
  };

  const handleScan = async (result) => {
    if (result && !procesando && !resultado) {
      const codigo = result[0]?.rawValue;
      if (codigo) {
        setProcesando(true);
        try {
          const ticketValido = await authService.validarTicketQR(codigo);

          if (ticketValido && !ticketValido.error) {

            const nuevoRegistro = {
              alumno: ticketValido.alumno || "Alumno Demo",
              matricula: ticketValido.matricula || codigo,
              hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              estado: "Validado",
              token: ticketValido.token // Guardamos el token para validar duplicados
            };

            // Intentar guardar (aquí puede saltar error de DUPLICADO)
            await dataService.addHistorialEntry(nuevoRegistro);
            await cargarHistorial();

            setDatosTicket(ticketValido);
            setResultado('exito');

          } else {
            // Error de formato o fecha
            setResultado('error');
          }
        } catch (error) {
          console.error(error);
          if (error.message === "DUPLICADO") {
            setResultado('duplicado');
          } else {
            setResultado('error');
          }
        } finally {
          setProcesando(false);
        }
      }
    }
  };

  const reiniciar = () => {
    setResultado(null);
    setDatosTicket(null);
    setProcesando(false);
  };

  return (
    <div className="min-vh-100 bg-light">

      <Navbar title="☕ Cafetería" bgClass="bg-dark">
        <div className="d-flex bg-white bg-opacity-10 rounded-pill p-1">
          <button onClick={() => setVista('escanear')} className={`btn btn-sm rounded-pill px-3 transition-all ${vista === 'escanear' ? 'btn-light fw-bold shadow-sm' : 'text-white-50'}`}>Escanear</button>
          <button onClick={() => setVista('historial')} className={`btn btn-sm rounded-pill px-3 transition-all ${vista === 'historial' ? 'btn-light fw-bold shadow-sm' : 'text-white-50'}`}>Historial</button>
        </div>
        <button onClick={authService.logout} className="btn btn-outline-danger btn-sm ms-2 rounded-pill px-3">Salir</button>
      </Navbar>

      {/* --- VISTA ESCÁNER --- */}
      {vista === 'escanear' && (
        <div className="container py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>

          {!resultado && (
            <div className="text-center w-100 animate-fade-in">
              <h3 className="mb-2 fw-bold text-dark">Escanear Boleto</h3>
              <p className="text-muted mb-4 small">Apunta la cámara al código QR del estudiante</p>

              <div className="mx-auto shadow-lg rounded-4 overflow-hidden position-relative border border-4 border-white" style={{ maxWidth: '320px', aspectRatio: '1/1' }}>
                <Scanner
                  onScan={handleScan}
                  components={{ audio: false, finder: false }}
                  styles={{ container: { width: '100%', height: '100%' } }}
                />
                {/* Overlay Guía */}
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center pointer-events-none">
                  <div style={{ width: '200px', height: '200px', border: '2px solid rgba(255,255,255,0.8)', borderRadius: '20px', boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)' }}></div>
                </div>
              </div>

              {procesando && <div className="mt-4 badge bg-white text-success shadow-sm px-3 py-2 rounded-pill fs-6"><span className="spinner-border spinner-border-sm me-2"></span> Verificando...</div>}
            </div>
          )}

          {/* MENSAJE DE ÉXITO */}
          {resultado === 'exito' && (
            <div className="card border-0 shadow-lg rounded-5 p-4 text-center animate-fade-in" style={{ maxWidth: '380px', width: '100%' }}>
              <div className="mb-3 text-success display-1">
                <i className="bi bi-check-circle-fill"></i> ✅
              </div>
              <h2 className="fw-bold text-dark mb-1">¡Boleto Válido!</h2>
              <p className="text-muted small mb-4">El estudiante puede recibir su alimento.</p>

              <div className="bg-light rounded-4 p-4 mb-4 text-start border border-secondary border-opacity-10">
                <p className="mb-1 small text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem' }}>Estudiante</p>
                <h5 className="fw-bold mb-3 text-dark">{datosTicket?.alumno}</h5>

                <p className="mb-1 small text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem' }}>Matrícula</p>
                <p className="font-monospace mb-0 text-dark fs-5">{datosTicket?.matricula}</p>
              </div>

              <button onClick={reiniciar} className="btn btn-success btn-lg w-100 fw-bold rounded-pill shadow-sm">
                Siguiente Estudiante
              </button>
            </div>
          )}

          {/* MENSAJE DE DUPLICADO */}
          {resultado === 'duplicado' && (
            <div className="card border-0 shadow-lg rounded-5 p-4 text-center animate-shake" style={{ maxWidth: '380px', width: '100%' }}>
              <div className="mb-3 text-warning display-1">⚠️</div>
              <h2 className="fw-bold text-warning mb-2">¡Ya Utilizado!</h2>
              <p className="text-muted mb-4">Este boleto ya fue escaneado el día de hoy.</p>
              <button onClick={reiniciar} className="btn btn-outline-warning btn-lg w-100 fw-bold rounded-pill">
                Intentar de Nuevo
              </button>
            </div>
          )}

          {/* MENSAJE DE ERROR */}
          {resultado === 'error' && (
            <div className="card border-0 shadow-lg rounded-5 p-4 text-center animate-shake" style={{ maxWidth: '380px', width: '100%' }}>
              <div className="mb-3 text-danger display-1">🚫</div>
              <h2 className="fw-bold text-danger mb-2">Código Inválido</h2>
              <p className="text-muted mb-4">Este código no es un boleto válido de la Beca Digital.</p>
              <button onClick={reiniciar} className="btn btn-outline-danger btn-lg w-100 fw-bold rounded-pill">
                Intentar de Nuevo
              </button>
            </div>
          )}

        </div>
      )}

      {/* --- VISTA HISTORIAL --- */}
      {vista === 'historial' && (
        <div className="container py-5 animate-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold text-dark mb-0">Historial del Día</h3>
              <p className="text-muted small mb-0">Registros de hoy</p>
            </div>
            <div className="bg-white px-3 py-2 rounded-4 shadow-sm border">
              <span className="text-muted small me-2">Total:</span>
              <span className="fw-bold text-success fs-5">{historial.length}</span>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light border-bottom-0">
                  <tr>
                    <th className="p-3 small text-uppercase text-muted fw-bold border-0">Hora</th>
                    <th className="p-3 small text-uppercase text-muted fw-bold border-0">Alumno</th>
                    <th className="p-3 small text-uppercase text-muted fw-bold border-0 text-end">Estado</th>
                  </tr>
                </thead>
                <tbody className="border-top-0">
                  {historial.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3 fw-medium text-secondary font-monospace small border-bottom border-light">{item.hora}</td>
                      <td className="p-3 fw-bold text-dark border-bottom border-light">{item.alumno}</td>
                      <td className="p-3 text-end border-bottom border-light">
                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill small fw-bold border border-success border-opacity-10">
                          {item.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardCafeteria;
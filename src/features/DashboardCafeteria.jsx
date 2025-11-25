import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import 'bootstrap/dist/css/bootstrap.min.css';
import { authService } from '../services/authService';

function DashboardCafeteria() {
  const [vista, setVista] = useState('escanear');
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [datosTicket, setDatosTicket] = useState(null);

  // Historial Simulado Inicial
  const [historial, setHistorial] = useState([
    { id: 1, alumno: "Ana López", matricula: "2024009", hora: "12:15 PM", estado: "Validado" },
    { id: 2, alumno: "Carlos Ruiz", matricula: "2024150", hora: "12:30 PM", estado: "Validado" }
  ]);

  const handleScan = async (result) => {
    if (result && !procesando && !resultado) {
      const codigo = result[0]?.rawValue;
      if (codigo) {
        setProcesando(true);
        try {
          // Validar con el servicio simulado
          const ticketValido = await authService.validarTicketQR(codigo);
          
          if (ticketValido) {
            setDatosTicket(ticketValido);
            setResultado('exito');
            
            // --- AGREGAR AL HISTORIAL AUTOMÁTICAMENTE ---
            const nuevoRegistro = {
              id: Date.now(),
              alumno: ticketValido.alumno || "Alumno Demo",
              matricula: ticketValido.matricula || codigo,
              hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              estado: "Validado"
            };
            setHistorial([nuevoRegistro, ...historial]);

          } else {
            setResultado('error');
          }
        } catch (error) {
          console.error(error);
          setResultado('error');
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
    <div className={vista === 'escanear' ? "min-vh-100 bg-dark text-white" : "min-vh-100 bg-light text-dark"}>
      
      {/* NAVBAR RESPONSIVO */}
      <nav className="navbar navbar-dark bg-dark px-3 py-3 border-bottom border-secondary">
        <span className="navbar-brand fw-bold fs-5">☕ Cafetería</span>
        <div className="d-flex gap-2">
            <button onClick={() => setVista('escanear')} className={`btn btn-sm ${vista==='escanear' ? 'btn-light text-dark fw-bold' : 'text-white-50'}`}>Escanear</button>
            <button onClick={() => setVista('historial')} className={`btn btn-sm ${vista==='historial' ? 'btn-light text-dark fw-bold' : 'text-white-50'}`}>Historial</button>
            <button onClick={authService.logout} className="btn btn-outline-danger btn-sm ms-1">Salir</button>
        </div>
      </nav>

      {/* --- VISTA ESCÁNER --- */}
      {vista === 'escanear' && (
        <div className="container py-4 d-flex flex-column align-items-center justify-content-center" style={{minHeight: '80vh'}}>
          
          {!resultado && (
            <>
              <h4 className="mb-4 fw-bold text-center">Escanea el QR</h4>
              
              {/* CONTENEDOR FLUIDO PARA MÓVIL (Clave para que no se rompa en cel) */}
              <div className="position-relative overflow-hidden rounded-4 border border-success shadow-lg" 
                   style={{ width: '100%', maxWidth: '350px', aspectRatio: '1/1' }}>
                <Scanner 
                  onScan={handleScan}
                  components={{ audio: false, finder: false }}
                  styles={{ container: { width: '100%', height: '100%' } }}
                />
                {/* Cuadro guía visual */}
                <div className="position-absolute top-50 start-50 translate-middle border border-white opacity-50" style={{width:'60%', height:'60%', borderRadius:'20px', borderWidth:'4px'}}></div>
              </div>
              
              <p className="mt-3 text-white-50 text-center px-3">Apunta la cámara al boleto digital del estudiante</p>
              {procesando && <div className="d-flex align-items-center gap-2 text-success mt-2"><span className="spinner-border spinner-border-sm"></span> Procesando...</div>}
            </>
          )}

          {/* MENSAJE DE ÉXITO */}
          {resultado === 'exito' && (
            <div className="card bg-success text-white p-4 text-center shadow-lg border-0 mx-3" style={{maxWidth:'400px', width:'100%', animation: 'fadeIn 0.5s'}}>
               <div className="display-1 mb-2">✅</div>
               <h2 className="fw-bold">¡Válido!</h2>
               <div className="bg-white text-dark rounded-3 p-3 my-3 text-start">
                 <p className="mb-0 small text-muted">Estudiante</p>
                 <h4 className="fw-bold mb-2 text-truncate">{datosTicket?.alumno}</h4>
                 <p className="mb-0 small text-muted">Matrícula</p>
                 <h5 className="font-monospace">{datosTicket?.matricula}</h5>
               </div>
               <button onClick={reiniciar} className="btn btn-light btn-lg w-100 fw-bold shadow-sm">
                 Siguiente
               </button>
            </div>
          )}

          {/* MENSAJE DE ERROR */}
          {resultado === 'error' && (
            <div className="card bg-danger text-white p-4 text-center shadow-lg border-0 mx-3" style={{maxWidth:'400px', width:'100%', animation: 'shake 0.5s'}}>
               <div className="display-1 mb-2">🚫</div>
               <h2 className="fw-bold">Inválido</h2>
               <p className="opacity-75 my-3">Código no encontrado o ya canjeado.</p>
               <button onClick={reiniciar} className="btn btn-outline-light btn-lg w-100 fw-bold">
                 Reintentar
               </button>
            </div>
          )}

        </div>
      )}

      {/* --- VISTA HISTORIAL --- */}
      {vista === 'historial' && (
        <div className="container py-4" style={{animation: 'fadeIn 0.3s'}}>
           <div className="d-flex justify-content-between align-items-center mb-3">
             <h4 className="fw-bold text-dark mb-0">Historial Hoy</h4>
             <span className="badge bg-primary rounded-pill">{historial.length}</span>
           </div>

           <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
             <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="p-3 small text-muted">Hora</th>
                      <th className="small text-muted">Alumno</th>
                      <th className="text-end pe-3 small text-muted">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3 fw-bold text-muted font-monospace small">{item.hora}</td>
                        <td className="text-truncate" style={{maxWidth: '150px'}}>{item.alumno}</td>
                        <td className="text-end pe-3">
                          <span className="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded-pill small">
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
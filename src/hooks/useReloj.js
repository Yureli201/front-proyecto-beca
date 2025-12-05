import { useState, useEffect } from 'react';

export const useReloj = () => {
  const [tiempo, setTiempo] = useState({ horas: '00', minutos: '00', segundos: '00' });
  const [mensajeReloj, setMensajeReloj] = useState("Cargando...");
  const [servicioActivo, setServicioActivo] = useState(false);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const ahora = new Date();
      
      // Definir Horarios: 11:00 AM a 2:00 PM (14:00)
      const inicioServicio = new Date(); 
      inicioServicio.setHours(11, 0, 0, 0);
      
      const finServicio = new Date(); 
      finServicio.setHours(18, 0, 0, 0);

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

  return { tiempo, mensajeReloj, servicioActivo };
};

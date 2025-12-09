import axios from "axios";

const BASE_URL = "https://api-proyecto-becas.onrender.com/api/tickets";
//const BASE_URL = "http://localhost:3000/api/tickets";

export const ticketsService = {
  getQRToken: () => {
    const matricula = localStorage.getItem("matricula");
    const nombre = localStorage.getItem("name");

    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0"); // Mes con 2 dígitos
    const day = String(hoy.getDate()).padStart(2, "0"); // Día con 2 dígitos
    const fechaHoy = `${year}-${month}-${day}`;

    // Generar el ticket_code: matrícula + fecha
    const ticketCode = `${matricula}${fechaHoy}`;

    // Crear el objeto con la estructura solicitada
    const qrData = {
      ticket_code: ticketCode,
      matricula: matricula,
      fecha: fechaHoy,
      nombre: nombre,
    };

    // Retornar como string JSON para el QR
    return JSON.stringify(qrData);
  },

  validarTicketQR: async (codigoQR) => {
    console.log("Analizando QR:", codigoQR);
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const data = JSON.parse(codigoQR);

      if (!data || !data.ticket_code || !data.matricula || !data.fecha) {
        console.log("Formato inválido - faltan campos requeridos");
        return null;
      }

      const hoy = new Date();
      const year = hoy.getFullYear();
      const month = String(hoy.getMonth() + 1).padStart(2, "0");
      const day = String(hoy.getDate()).padStart(2, "0");
      const fechaHoy = `${year}-${month}-${day}`;

      if (data.fecha !== fechaHoy) {
        console.log(
          `QR Caducado - Fecha del QR: ${data.fecha}, Fecha actual: ${fechaHoy}`
        );
        return { error: "QR Caducado (Fecha incorrecta)" };
      }

      const ticketCodeEsperado = `${data.matricula}${data.fecha}`;
      if (data.ticket_code !== ticketCodeEsperado) {
        console.log("Ticket code no coincide con matrícula y fecha");
        return null;
      }

      // Si el QR es válido, insertarlo en la base de datos
      try {
        const ticketData = {
          ticket_code: data.ticket_code,
          matricula: data.matricula,
        };

        console.log("Insertando ticket en la base de datos:", ticketData);

        // Obtener el token del localStorage
        const token = localStorage.getItem("token");

        const insertResponse = await axios.post(
          BASE_URL + "/insert",
          ticketData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Ticket insertado exitosamente:", insertResponse.data);

        // Retornar los datos del ticket validado e insertado
        return {
          ticket_code: data.ticket_code,
          matricula: data.matricula,
          fecha: data.fecha,
          alumno: data.nombre,
          token: codigoQR,
          insertado: true,
          responseDB: insertResponse.data,
        };
      } catch (insertError) {
        console.error("Error al insertar ticket en la BD:", insertError);

        // Si el error es porque ya existe el ticket, retornar error específico
        if (
          insertError.response?.status === 400 ||
          insertError.response?.status === 409
        ) {
          return {
            error: "Ticket ya utilizado",
            detalles:
              insertError.response?.data?.message ||
              "Este ticket ya fue canjeado hoy",
          };
        }

        // Para otros errores, retornar error genérico
        return {
          error: "Error al registrar el ticket",
          detalles: insertError.message,
        };
      }
    } catch (e) {
      console.error("Error al parsear QR:", e);
      return null;
    }
  },

  getTicketsToday() {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0");
    const day = String(hoy.getDate()).padStart(2, "0");
    const fechaHoy = `${year}-${month}-${day}`;

    return axios.get(BASE_URL + "/getRedeemed/" + fechaHoy);
  },

  getAllTickets() {
    return axios.get(BASE_URL + "/getAll");
  },
};

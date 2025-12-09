import axios from "axios";

const BASE_URL = "https://api-proyecto-becas.onrender.com/auth";
//const BASE_URL = "http://localhost:3000/auth";


export const authService = {
  login(credentials) {
    console.log("Iniciando sesión con:", credentials);
    return axios
      .post(BASE_URL + "/login", credentials)

      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("rol", response.data.user.role);
        localStorage.setItem("id", response.data.user._id);
        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("email", response.data.user.email);
        if (response.data.user.role === "Estudiante") {
          localStorage.setItem(
            "matricula",
            response.data.user.student_info.matricula
          );
        }
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  },

  createUser(userData) {
    return axios.post(BASE_URL + "/register", userData);
  },

  logout: () => {
    localStorage.clear();
    window.location.href = "/";
  },
};

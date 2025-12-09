import axios from "axios";

const BASE_URL = "https://api-proyecto-becas.onrender.com/api/users";
//const BASE_URL = "http://localhost:3000/api/users";

export const usersService = {
  getUserData(email) {
    return axios.get(BASE_URL + "/getOne/" + email);
  },

  getAllUsers() {
    return axios.get(BASE_URL + "/getAll");
  },

  editUser(email, userData) {
    return axios.put(BASE_URL + "/update/" + email, userData);
  },

  deleteUser(email) {
    return axios.delete(BASE_URL + "/delete/" + email);
  },

  getStudents(){
    return axios.get(BASE_URL + "/getRole/Estudiante");
  }
};

import axios from "axios";

const API = axios.create({
  baseURL: "https://stack-stories-9m8cydcxa-suryas-projects-521dbc15.vercel.app",
});

// Attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;

import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_URL;
console.log(import.meta.env.VITE_URL);

axios.defaults.withCredentials = true;

export default axios;
import axios from "axios";

axios.defaults.baseURL = "https://fin-flow-drab.vercel.app";
console.log(import.meta.env.VITE_URL);

axios.defaults.withCredentials = true;

export default axios;
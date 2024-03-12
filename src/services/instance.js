import axios from "axios";

const baseURL = 'https://chatapp-be-rghz.onrender.com/';

const authInstance = axios.create({
  baseURL: baseURL,
});
const protecdInstance = axios.create({
  baseURL:baseURL
})
protecdInstance.interceptors.request.use(config => {
  const User = sessionStorage.getItem('userData');
  if (User) {
    const authToken = JSON.parse(User).Token;
    config.headers['Authorization']=`Bearer ${authToken}`
  }
  return config;
})

export {authInstance,protecdInstance}
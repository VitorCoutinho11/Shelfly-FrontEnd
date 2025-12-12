import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Configurações Base
// 🚨 MANTEMOS A URL BASE FORA DA INSTÂNCIA AXIOS, mas a definimos como constante
const API_BASE_URL = 'http://192.168.1.242:8411'; 
const AUTH_TOKEN_KEY = 'authToken'; 

// 2. Criação da Instância do Axios
// 🚨 REMOVEMOS A PROPRIEDADE 'baseURL' AQUI
const api: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicApi: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


// --- Interceptors (mantidos iguais, aplicados apenas à 'api') ---

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest) {
      console.log('Token expirado ou inválido. Limpando token...');
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

// 5. Exportação
export default api;
export { API_BASE_URL }; // ⬅️ EXPORTAMOS A URL BASE SEPARADAMENTE
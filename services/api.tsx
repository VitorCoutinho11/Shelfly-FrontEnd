import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Configurações Base
const API_BASE_URL = 'http://academico3.rj.senac.br/shelfly/api'; // 💡 ADICIONEI /api - Verifique se a URL base do seu controller Spring é '/api/usuarios' ou apenas '/usuarios'.
const AUTH_TOKEN_KEY = 'authToken'; // Chave para armazenar o token

// 2. Criação da Instância do Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptors ---

// 3. Interceptor de Requisição (Request Interceptor)
// Adiciona o token JWT (se existir) ao cabeçalho Authorization
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // A busca do token DEVE ser ASSÍNCRONA no React Native
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

    if (token) {
      // Adiciona o token no formato Bearer
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Lida com erros de requisição antes de serem enviados
    return Promise.reject(error);
  }
);

// 4. Interceptor de Resposta (Response Interceptor)
// Lida com erros de resposta, especialmente 401 (Não Autorizado)
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Respostas bem-sucedidas passam direto
    return response;
  },
  async (error: AxiosError) => {
    // Garante que a requisição original e a resposta existam
    const originalRequest = error.config;

    // Verifica se o erro é 401 (Não Autorizado) E se a requisição original existe
    if (error.response?.status === 401 && originalRequest) {
      console.log('Token expirado ou inválido. Limpando token...');

      // Ação de token inválido/expirado
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      
      // 🚨 NOTA: Aqui é onde você acionaria uma ação de LOGOUT GLOBAL 
      // (por exemplo, usando um Context ou Event Emitter) para redirecionar 
      // o usuário para a tela de Login no seu aplicativo React Native.
      
      // Rejeita a promise
      return Promise.reject(error);
    }

    // Para todos os outros erros, rejeita a promise
    return Promise.reject(error);
  }
);

// 5. Exportação
// Exporte a instância para que possa ser usada em toda a aplicação
export default api;
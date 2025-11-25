// api-client.tsx

import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Configurações Base
const API_BASE_URL = 'http://academico3.rj.senac.br/shelfly';
const AUTH_TOKEN_KEY = 'authToken'; // Chave para armazenar o token

// 2. Criação da Instância do Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptors ---

// 3. Interceptor de Requisição (Request Interceptor)
// Adiciona o token JWT (se existir) ao cabeçalho Authorization
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
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
      // 1. Limpa o token antigo de forma assíncrona
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      
      // 2. Redireciona o usuário (Ação típica em RN: navegação para tela de Login)
      // Nota: Em um app RN, você usaria um sistema de notificação global 
      // ou context/hook de navegação para forçar o logout e redirecionamento.
      // Ex: globalEvent.emit('LOGOUT');
      
      // Rejeita a promise
      return Promise.reject(error);
    }

    // Para todos os outros erros, rejeita a promise
    return Promise.reject(error);
  }
);

// 5. Exportação
// Exporte a instância para que possa ser usada em toda a aplicação
export default apiClient;
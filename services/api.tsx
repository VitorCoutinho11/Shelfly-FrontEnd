import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Configurações Base
const API_BASE_URL = 'http://academico3.rj.senac.br/shelfly';
const AUTH_TOKEN_KEY = 'authToken'; 

// 2. Configurações Comuns de Instância
const commonConfig = {
    baseURL: API_BASE_URL, 
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
    },
};

// 3. Criação das Instâncias do Axios

// Instância principal: Requer autenticação e terá interceptors.
const api: AxiosInstance = axios.create(commonConfig);

// Instância pública: Para rotas sem token (login, cadastro, etc.). Não precisa de interceptors.
export const publicApi: AxiosInstance = axios.create(commonConfig);


// 4. Interceptors (Aplicados apenas à 'api')

// Interceptor de Requisição: Adiciona o Token JWT
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        
        // 🚨 Otimização: Se o token existir, ele será adicionado/atualizado.
        // Se o token for nulo, evita-se a injeção.
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            // Garante que não haja um cabeçalho de token residual
            delete config.headers.Authorization; 
        }

        return config;
    }, 
    (error) => Promise.reject(error)
);

// Interceptor de Resposta: Trata a Expiração do Token (401)
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => { 
        const originalRequest = error.config; 
        
        // Se for 401 (Não Autorizado) e tiver um originalRequest (para evitar loops)
        if (error.response?.status === 401 && originalRequest) { 
            console.log('Token expirado/inválido detectado (Status 401). Limpando token...');
            await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
            // 🚨 NOTA: Se o 401 ocorrer em uma rota que usa o token,
            // o app será redirecionado para a tela de login pelo AuthProvider.
            return Promise.reject(error);
        } 
        
        return Promise.reject(error); 
    }
);

// 5. Exportação
export default api;
export { API_BASE_URL };
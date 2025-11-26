// Este é um arquivo de serviço simulado necessário para a tipagem do AuthContext.

import AsyncStorage from '@react-native-async-storage/async-storage';

// ----------------------------------------------------------------------
// 1. Interfaces de Tipagem (Necessárias para AuthContext)
// ----------------------------------------------------------------------

// Estrutura do usuário retornada pela API no login
interface ApiUser {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string; // Novo campo
    readingGoal?: number; // Novo campo
}

// Resposta completa da API de login
export interface AuthResponse {
    token: string;
    user: ApiUser;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

// ----------------------------------------------------------------------
// 2. Funções de Simulação (Para rodar o Contexto sem API real)
// ----------------------------------------------------------------------

const TOKEN_KEY = '@AuthToken';

export const getAuthToken = async (): Promise<string | null> => {
    // Simula a recuperação de um token salvo
    return AsyncStorage.getItem(TOKEN_KEY);
};

export const signIn = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simula a chamada de login da API
    console.log(`Simulando login para: ${credentials.email}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    if (credentials.email === 'error@test.com') {
        throw { response: { data: { message: "Credenciais inválidas ou usuário não encontrado." } } };
    }

    const mockToken = 'mock-jwt-token-12345';
    await AsyncStorage.setItem(TOKEN_KEY, mockToken);

    return {
        token: mockToken,
        user: { 
            id: 'user-123-real', 
            name: 'Usuário Simulado', 
            email: credentials.email, 
            avatarUrl: 'https://i.pravatar.cc/150?img=sim', 
            readingGoal: 10, 
        }
    };
};

export const signOut = async (): Promise<void> => {
    // Simula a remoção do token
    await AsyncStorage.removeItem(TOKEN_KEY);
};

// ⚠️ Adicione aqui a função real para a chamada de API (ex: apiClient.patch('/me', newData))
export const updateProfile = async (data: Partial<ApiUser>): Promise<void> => {
    console.log("Simulando PATCH /me com dados:", data);
    await new Promise(resolve => setTimeout(resolve, 800));
    // Sucesso
};
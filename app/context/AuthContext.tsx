import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Importa o api.tsx e a API_BASE_URL (URL completa)
import api, { API_BASE_URL } from '@/services/api'; 
import { AxiosResponse } from 'axios'; 

// ----------------------------------------------------------------------
// 1. Tipos e Interfaces (Ajustadas para ShelflyBackEnd)
// ----------------------------------------------------------------------

// Estrutura do usuário (Corresponde ao UsuarioDTOResponse do backend)
export interface User { 
    id: string;
    name: string;
    email: string;
    avatarUrl?: string; 
    readingGoal?: number; 
}

// Resposta da API de Login (Corresponde ao RecoveryJwtTokenDto do backend)
export interface AuthTokenResponse { 
    token: string;
}

// Credenciais de Login
export interface LoginCredentials {
    email: string;
    password: string;
}

// Definição do Contexto
interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (newData: Partial<User>) => void; 
    requestEmailChange: (newEmail: string) => Promise<void>; 
    // 🚨 REINTRODUÇÃO: Função de teste de conexão
    testConnection: () => Promise<void>; 
}

interface AuthProviderProps {
    children: ReactNode;
}

// Componente de Carregamento
const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#387C6F" />
        <Text style={styles.loadingText}>Carregando dados de autenticação...</Text>
    </View>
);

// ----------------------------------------------------------------------
// 2. Constantes e Rotas
// ----------------------------------------------------------------------

const TOKEN_KEY = 'authToken';

// 🚨 CORREÇÃO: Rotas alinhadas com o Controller do Spring Boot (/users/...)
const AUTH_BASE_PATH = '/users'; // Base
const AUTH_LOGIN_PATH = '/users/login'; // Rota de Login POST
const USER_PROFILE_PATH = '/users/me'; // Rota de Perfil GET 

// Criação do Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----------------------------------------------------------------------
// 3. Auth Provider (Lógica Principal)
// ----------------------------------------------------------------------

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 
    const [user, setUser] = useState<User | null>(null);
    
    // Função de Logout (REAL)
    const internalSignOut = async (): Promise<void> => {
        await AsyncStorage.removeItem(TOKEN_KEY);
        delete api.defaults.headers.common['Authorization']; 
    };
    
    // Função para buscar dados do perfil (REAL)
    const getProfileData = async (): Promise<User> => {
        const response: AxiosResponse<User> = await api.get(USER_PROFILE_PATH);
        return response.data;
    }

    // --------------------------------------------------------------------
    // 🚨 FUNÇÃO DE TESTE DE REDE CRU (fetch)
    // --------------------------------------------------------------------
    const testConnection = async () => {
        console.log("--- INICIANDO TESTE DE CONEXÃO PURA (fetch) ---");
        // 🚨 GARANTIR USO DA NOVA ROTA:
        const testURL = `${API_BASE_URL}${AUTH_LOGIN_PATH}`; 

        try {
            const response = await fetch(testURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Envia dados, mas espera falhar com 400/401 se a conexão for OK
                body: JSON.stringify({ email: "test@test.com", password: "123" }), 
            });

            if (response.ok) {
                console.log(`✅ Conexão bem-sucedida! Status: ${response.status}. O servidor respondeu OK (Inesperado para login).`);
            } else {
                console.log(`⚠️ Conexão alcançada, mas falhou no servidor (Status ${response.status}). Ex: 400, 401, 404.`);
                // Tenta ler o corpo do erro
                const errorData = await response.text().catch(() => "Corpo de erro indisponível.");
                console.log("   Detalhes da Resposta (Spring Boot recebeu requisição):", errorData.substring(0, 100) + '...');
            }
        } catch (error) {
            // ❌ ESTE É O ERRO QUE CONFIRMA PROBLEMA DE REDE
            console.error("❌ ERRO CRU DE REDE (FETCH): O emulador não conseguiu acessar o IP/Porta da sua máquina. Verifique o Firewall ou o IP em api.tsx.", error);
        }
        console.log("--- FIM DO TESTE DE CONEXÃO PURA ---");
    };


    // --------------------------------------------------------------------
    // Efeito: Carregamento da Sessão (Persistência)
    // --------------------------------------------------------------------
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const token = await AsyncStorage.getItem(TOKEN_KEY);

                if (token) {
                    // Garante que o Axios use o token para a chamada getProfileData
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const profileData = await getProfileData();
                    setUser(profileData);
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error("Erro ao carregar sessão (Token inválido/expirado):", error);
                await internalSignOut(); 
            } finally {
                setIsLoading(false);
                // 🚨 ADIÇÃO TEMPORÁRIA: Roda o teste de conexão pura no carregamento
                await testConnection(); 
            }
        };

        loadInitialData();
    }, []);


    // --------------------------------------------------------------------
    // Função de Login (Duas Etapas)
    // --------------------------------------------------------------------
    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            const credentials: LoginCredentials = { email, password };
            
            // 1. CHAMADA 1: PEGAR SOMENTE O TOKEN
            const responseToken: AxiosResponse<AuthTokenResponse> = await api.post(
                AUTH_LOGIN_PATH, credentials
            );
            
            const { token } = responseToken.data;
            await AsyncStorage.setItem(TOKEN_KEY, token); 
            
            // Atualiza o header para a próxima chamada
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 

            // 2. CHAMADA 2: PEGAR OS DADOS DO USUÁRIO
            const userData = await getProfileData(); 

            setUser(userData);
            setIsLoggedIn(true);
            Alert.alert("Sucesso", `Bem-vindo(a), ${userData.name}!`);

        } catch (error: any) {
            console.error("ERRO COMPLETO DO AXIOS NO LOGIN:", error); 
            
            const errorMessage = error.response?.data?.message || error.message || "Ocorreu um erro. Verifique suas credenciais e a conexão de rede.";
            Alert.alert("Erro de Login", errorMessage);
            await internalSignOut(); 
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // --------------------------------------------------------------------
    // Funções Auxiliares (Logout, Update, Email Change)
    // --------------------------------------------------------------------
    const logout = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await internalSignOut(); 
            setUser(null);
            setIsLoggedIn(false);
            Alert.alert("Sucesso", "Você foi desconectado(a).");
        } catch (error) {
            console.error("Erro durante o logout:", error);
            setUser(null);
            setIsLoggedIn(false); 
        } finally {
            setIsLoading(false);
        }
    };

    const updateUser = async (newData: Partial<User>) => {
        if (!user) return; 
        setIsLoading(true);

        try {
            await api.patch(USER_PROFILE_PATH, newData); 
            
            setUser(prevUser => ({ ...prevUser!, ...newData, }));
            Alert.alert("Perfil Atualizado", "Suas informações foram salvas.");

        } catch (error: any) {
             const errorMessage = error.response?.data?.message || "Erro ao salvar as informações do perfil.";
             Alert.alert("Erro de Atualização", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const requestEmailChange = async (newEmail: string): Promise<void> => {
        if (!user) return; 
        setIsLoading(true);
        console.log(`API SIMULADA: Enviando link para ${user.email} para autorizar mudança para ${newEmail}`);
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        Alert.alert("Sucesso", "Um e-mail de verificação foi enviado para confirmar a troca.");
        setIsLoading(false);
    };


    // 🚨 Adicionando a função de teste ao contexto
    const authContextValue: AuthContextType = {
        user, isLoggedIn, isLoading, login, logout, updateUser, requestEmailChange, testConnection 
    };

    if (isLoading) {
        return <LoadingScreen />;
    }
    
    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Hook customizado e Styles
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC', 
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#6B7280', 
    }
});

export default AuthProvider;
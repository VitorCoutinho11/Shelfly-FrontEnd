import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { publicApi, API_BASE_URL } from '@/services/api'; 
import { AxiosResponse } from 'axios'; 

// ----------------------------------------------------------------------
// 1. Tipos e Interfaces (AJUSTADO)
// ----------------------------------------------------------------------

// Estrutura do usuário (Corresponde ao UsuarioDTOResponse do backend)
export interface User { 
    id: string;
    name: string;
    email: string;
    avatarUrl?: string; 
    readingGoal?: number; 
}

// 🚨 ALTERAÇÃO CRÍTICA: AuthTokenResponse agora inclui o User
// Assumimos que o endpoint /users/login retorna o token E o perfil
export interface AuthTokenResponse { 
    token: string;
    user: User; // <-- DADOS DO USUÁRIO ADICIONADOS AQUI
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
    testConnection: () => Promise<void>; 
}

interface AuthProviderProps {
    children: ReactNode;
}

// Componente de Carregamento
const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>Carregando dados de autenticação...</Text>
    </View>
);

// ----------------------------------------------------------------------
// 2. Constantes e Rotas (SIMPLIFICADO)
// ----------------------------------------------------------------------

const TOKEN_KEY = 'authToken';

// 🚨 REMOVIDO: USER_PROFILE_PATH não é mais necessário
const AUTH_LOGIN_PATH = '/users/login'; // Rota de Login POST

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
    
    // 🚨 REMOVIDO: getProfileData não é mais usado
    /* const getProfileData = async (): Promise<User> => {
        const response: AxiosResponse<User> = await api.get(USER_PROFILE_PATH);
        return response.data;
    } 
    */

    // --------------------------------------------------------------------
    // FUNÇÃO DE TESTE DE REDE CRU (fetch)
    // --------------------------------------------------------------------
    const testConnection = async () => {
        console.log("--- INICIANDO TESTE DE CONEXÃO PURA (fetch) ---");
        const testURL = `${API_BASE_URL}${AUTH_LOGIN_PATH}`; 

        try {
            const response = await fetch(testURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: "test@test.com", password: "123" }), 
            });

            if (response.ok) {
                console.log(`✅ Conexão bem-sucedida! Status: ${response.status}. O servidor respondeu OK (Inesperado para login).`);
            } else {
                console.log(`⚠️ Conexão alcançada, mas falhou no servidor (Status ${response.status}). Ex: 400, 401, 404.`);
                const errorData = await response.text().catch(() => "Corpo de erro indisponível.");
                console.log("   Detalhes da Resposta (Spring Boot recebeu requisição):", errorData.substring(0, 100) + '...');
            }
        } catch (error) {
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
                // 🚨 IMPORTANTE: Se não há rota de perfil, não conseguimos buscar os dados
                // Se o token existe, assumimos que o usuário está logado, mas o 'user' será nulo
                // até o próximo login ou se os dados básicos forem salvos separadamente.
                if (token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setIsLoggedIn(true);
                    // 💡 OPÇÃO: Para ter o nome, você teria que armazenar o objeto User no AsyncStorage no momento do login.
                    // Caso contrário, 'user' será null aqui.
                    console.warn("Sessão persistente carregada. Sem o /users/me, o objeto 'user' será nulo até o login.");
                }
            } catch (error) {
                console.error("Erro ao carregar sessão:", error);
                await internalSignOut(); 
            } finally {
                setIsLoading(false);
                await testConnection(); 
            }
        };

        loadInitialData();
    }, []);


    // --------------------------------------------------------------------
    // Função de Login (AGORA É DE UMA ETAPA)
    // --------------------------------------------------------------------
    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            const credentials: LoginCredentials = { email, password };
            
            // 1. CHAMADA ÚNICA: PEGAR TOKEN E DADOS DO USUÁRIO
            const responseToken: AxiosResponse<AuthTokenResponse> = await publicApi.post(AUTH_LOGIN_PATH, credentials);
            
            // 🚨 AJUSTE: Desestruturando o token E o user
            const { token, user: userData } = responseToken.data;
            
            await AsyncStorage.setItem(TOKEN_KEY, token); 
            // 💡 OPÇÃO: Salvar os dados do usuário para persistência
            // await AsyncStorage.setItem('userData', JSON.stringify(userData)); 
            
            // Atualiza o header para chamadas futuras
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 

            // Define os dados no estado
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

    // 🚨 ALTERAÇÃO: A função updateUser agora usa um caminho /users/update (exemplo)
    // Se o backend usar um PATCH na rota base /users (ou outra), ajuste conforme o backend.
    const updateUser = async (newData: Partial<User>) => {
        if (!user) return; 
        setIsLoading(true);
        
        // 🚨 Assumindo que você pode usar o PATCH na rota /users/
        const UPDATE_PATH = `/users/${user.id}`; 
        // OU, se o backend usa uma rota mais simples (que identifica pelo token):
        // const UPDATE_PATH = `/users`; // Se for assim, o endpoint /users (PATCH) deve ser criado no backend.

        try {
            // Se o backend não tem a rota /users/me (GET), é provável que ele também não tenha um PATCH no mesmo estilo.
            // Para simplificar, vou manter a chamada no caminho /users/
            await api.patch(`/users`, newData); // 💡 CHUTE: O backend usa PATCH /users e identifica o usuário pelo token
            
            setUser(prevUser => ({ ...prevUser!, ...newData, }));
            Alert.alert("Perfil Atualizado", "Suas informações foram salvas.");

        } catch (error: any) {
             const errorMessage = error.response?.data?.message || "Erro ao salvar as informações do perfil. Verifique se o endpoint /users (PATCH) existe.";
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
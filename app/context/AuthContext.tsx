import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ Se o auth-service.tsx não estiver no mesmo diretório, ajuste o caminho!
import { 
    signIn, 
    signOut, 
    getAuthToken, 
    AuthResponse, 
    LoginCredentials,
    updateProfile // Importado para simular a chamada de atualização
} from '@/services/auth-service'; 

// 1. Tipos
// Interface User com campos opcionais para avatar e meta de leitura
export interface User { 
    id: string;
    name: string;
    email: string;
    avatarUrl?: string; 
    readingGoal?: number; 
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    // Partial<User> permite passar apenas as propriedades que serão atualizadas
    updateUser: (newData: Partial<User>) => void; 
    requestEmailChange: (newEmail: string) => Promise<void>; 
}

interface AuthProviderProps {
    children: ReactNode;
}

// Componente simples para mostrar durante o carregamento
const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#387C6F" />
        <Text style={styles.loadingText}>Carregando dados de autenticação...</Text>
    </View>
);

// 2. Criação do Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provedor de Autenticação (Com integração real/simulada)
export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 
    const [user, setUser] = useState<User | null>(null);

    // Função auxiliar para mapear o User retornado pela API para o tipo User do Context
    const mapAuthResponseToUser = (authResponse: AuthResponse): User => ({
        id: authResponse.user.id,
        name: authResponse.user.name,
        email: authResponse.user.email,
        avatarUrl: authResponse.user.avatarUrl || undefined, 
        readingGoal: authResponse.user.readingGoal || undefined, 
    });

    // Efeito: Carregamento do Token na Inicialização (App Loading)
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const token = await getAuthToken();

                if (token) {
                    // Simulação da chamada de API para buscar dados do usuário:
                    await new Promise(resolve => setTimeout(resolve, 1500)); 

                    // Mock data
                    const realUserData: User = { 
                        id: 'user-123-real', 
                        name: 'Usuário Shelfly', 
                        email: 'usuario@shelfly.com', 
                        avatarUrl: 'https://i.pravatar.cc/150?img=real', 
                        readingGoal: 10, 
                    };
                    
                    setUser(realUserData);
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error("Erro ao carregar sessão (token inválido/expirado):", error);
                await signOut(); 
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // Função de Login
    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            const credentials: LoginCredentials = { email, password };
            const authResponse = await signIn(credentials);
            
            const userData = mapAuthResponseToUser(authResponse);
            setUser(userData);
            setIsLoggedIn(true);
            Alert.alert("Sucesso", `Bem-vindo(a), ${userData.name}!`);

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ocorreu um erro. Verifique suas credenciais.";
            Alert.alert("Erro de Login", errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Função de Logout
    const logout = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await signOut(); 
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

    // Função de Atualização de Perfil (Chama o serviço de API)
    const updateUser = async (newData: Partial<User>) => {
        if (!user) return; 
        setIsLoading(true);

        try {
            // ⚠️ Integração real: Chama a função de serviço que faz a requisição PATCH/PUT
            await updateProfile(newData); 
            
            // Atualiza o estado local APÓS o sucesso da API
            setUser(prevUser => ({
                ...prevUser!, 
                ...newData,
            }));
            Alert.alert("Perfil Atualizado", "Suas informações foram salvas.");

        } catch (error: any) {
             const errorMessage = error.response?.data?.message || "Erro ao salvar as informações do perfil.";
             Alert.alert("Erro de Atualização", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Função de Troca de E-mail (Envia solicitação)
    const requestEmailChange = async (newEmail: string): Promise<void> => {
        if (!user) return; 
        setIsLoading(true);
        
        // Simulação da chamada API real para solicitar a troca de e-mail
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log(`API SIMULADA: Enviando link para ${user.email} para autorizar mudança para ${newEmail}`);
        Alert.alert("Sucesso", "Um e-mail de verificação foi enviado para confirmar a troca.");
        setIsLoading(false);
    };


    // Valor do contexto
    const authContextValue: AuthContextType = {
        user,
        isLoggedIn,
        isLoading,
        login,
        logout,
        updateUser,
        requestEmailChange 
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

// 4. Hook customizado 
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

// 5. Exportação padrão
export default AuthProvider;

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
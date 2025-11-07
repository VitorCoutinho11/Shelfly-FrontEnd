import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';

// 1. Tipos (Atualizados)
interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string; // 👈 Adicionado
  readingGoal?: number; // 👈 Adicionado
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (newData: Partial<User>) => void; // 👈 Adicionado
  requestEmailChange: (newEmail: string) => Promise<void>; // 👈 Adicionado
}

interface AuthProviderProps {
  children: ReactNode;
}

// 2. Criação do Contexto com tipo
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provedor de Autenticação (Atualizado)
export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 
    const [user, setUser] = useState<User | null>(null);

    // Efeito para simular o carregamento do token ao iniciar
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
          // Simula um usuário logado para teste
          const mockUser: User = {
            id: 'user-123',
            name: 'Maria Silva',
            email: 'teste@mail.com',
            avatarUrl: 'https://i.pravatar.cc/150?img=12',
            readingGoal: 12,
          };
          setUser(mockUser);
            setIsLoggedIn(true); // 👈 Simula estar logado
            setIsLoading(false);
        }, 1500);
    }, []);

    // Função de Login (Atualizada com novos dados)
    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        if (email === 'teste@mail.com' && password === '123456') {
            const userData: User = { 
                id: 'user-123', 
                name: 'Maria Silva', 
                email: email,
                avatarUrl: 'https://i.pravatar.cc/150?img=12', // 👈 Adicionado
                readingGoal: 12, // 👈 Adicionado
            };
            setUser(userData);
            setIsLoggedIn(true);
            Alert.alert("Sucesso", `Bem-vindo(a), ${userData.name}!`);
        } else {
            Alert.alert("Erro de Login", "E-mail ou senha inválidos. Tente: teste@mail.com / 123456");
        }
        
        setIsLoading(false);
    };

    // Função de Logout
    const logout = async (): Promise<void> => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        setUser(null);
        setIsLoggedIn(false);
        Alert.alert("Sucesso", "Você foi desconectado(a).");
        
        setIsLoading(false);
    };

    // 💡 --- NOVAS FUNÇÕES --- 💡

    /**
     * Atualiza o estado do usuário localmente.
     * Em um app real, isso também faria uma chamada PATCH/PUT para sua API.
     */
    const updateUser = (newData: Partial<User>) => {
      if (user) {
        setUser(prevUser => ({
          ...prevUser!, // '!' é seguro pois checamos 'if (user)'
          ...newData,   // Mescla os novos dados (nome, avatarUrl, readingGoal)
        }));
        Alert.alert("Perfil Atualizado", "Suas informações foram salvas.");
      }
    };

    /**
     * Simula o envio de uma notificação por e-mail para confirmar a alteração.
     * NÃO altera o e-mail no estado local.
     */
    const requestEmailChange = async (newEmail: string): Promise<void> => {
      if (!user) return; // Guarda de segurança

      setIsLoading(true);
      
      // Simula uma chamada de API (ex: Firebase, seu backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Lógica de simulação
      console.log(`API SIMULADA: Enviando link para ${user.email} para autorizar mudança para ${newEmail}`);
      
      // O ProfileScreen cuidará do Alert para o usuário
      setIsLoading(false);
    };

    // Valor do contexto (Atualizado)
    const authContextValue: AuthContextType = {
        user,
        isLoggedIn,
        isLoading,
        login,
        logout,
        updateUser, // 👈 Fornecido
        requestEmailChange // 👈 Fornecido
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Hook customizado para usar o AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

// 5. Correção para o erro de rota que exige default export
export default AuthProvider;
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native'; // Usado para feedback de login/logout

// 1. Criação do Contexto
const AuthContext = createContext();

// 2. Provedor de Autenticação
export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    // Simula o estado de autenticação (deveria carregar do AsyncStorage)
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [user, setUser] = useState(null);

    // Efeito para simular o carregamento do token ao iniciar
    useEffect(() => {
        // Exemplo: Simula a verificação de um token salvo
        setIsLoading(true);
        setTimeout(() => {
            // Se houvesse um token válido: setIsLoggedIn(true)
            // Por agora, iniciamos deslogados para testar o AuthStack
            setIsLoggedIn(false); 
            setIsLoading(false);
        }, 1500);
    }, []);

    // Função de Login
    const login = async (email, password) => {
        setIsLoading(true);
        
        // Simulação de delay de API
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        if (email === 'teste@mail.com' && password === '123456') {
            const userData = { 
                id: 'user-123', 
                name: 'Maria Silva', 
                email: email 
            };
            setUser(userData);
            setIsLoggedIn(true);
            Alert.alert("Sucesso", `Bem-vindo(a), ${userData.name}!`);
        } else {
            // 🛑 NOTA: NUNCA DEIXE MENSAGENS DE ERRO LIGANDO A DICA DE LOGIN EM PROD.
            Alert.alert("Erro de Login", "E-mail ou senha inválidos. Tente: teste@mail.com / 123456");
        }
        
        setIsLoading(false);
    };

    // Função de Logout
    const logout = async () => {
        setIsLoading(true);
        // Simulação de delay para limpar token/storage
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        setUser(null);
        setIsLoggedIn(false);
        Alert.alert("Sucesso", "Você foi desconectado(a).");
        
        setIsLoading(false);
    };

    const authContextValue = {
        user,
        isLoggedIn,
        isLoading,
        login,
        logout,
        // Você adicionaria uma função de registro aqui se quisesse separá-la de login
    };

    // Se estiver carregando, mostre algo (opcional)
    if (isLoading && !isLoggedIn) {
        // Não adicionei um loader aqui para evitar o erro de texto,
        // mas você pode usar um componente de tela de Splash aqui.
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Hook customizado para usar o AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

// 4. Correção para o erro de rota que exige default export
// Esta é a parte que resolve o aviso/erro de "missing required default export"
export default AuthProvider; 
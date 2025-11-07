import * as React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

import { RouteProp, NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

// 💡 Importando o contexto. O TS vai procurar por 'AuthContext.tsx'
import { AuthProvider, useAuth as useAuthJS } from './context/AuthContext';

// 💡 Importa as telas SEM extensão. O TypeScript encontrará .tsx ou .ts
import LoginScreen from './LoginScreen';
import ProfileScreen from './ProfileScreen';
import BooksListScreen from './BooksListScreen';
import RegisterScreen from './RegisterScreen'
import BookDetailScreen from './BookDetailScreen';
import HomeScreen from './HomeScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import BookFormScreen from './BookFormScreen'; 

// --- 💡 DEFINIÇÃO DE TIPOS ---

// 1. Tipos para o Contexto de Autenticação
// (Idealmente, isso viria de AuthContext.tsx, mas definimos aqui para segurança)
interface AuthContextData {
  isLoggedIn: boolean;
}
// "Re-tipamos" o hook importado do JS para garantir a segurança dos tipos
const useAuth = (): AuthContextData => useAuthJS() as AuthContextData;

// 2. Tipos para o Theme
interface ThemeColors {
  primary: string;
  primaryForeground: string;
  mutedForeground: string;
  foreground: string;
  background: string;
}

// 3. Tipos para os Navegadores (O MAIS IMPORTANTE)

// Telas e parâmetros do Stack de Autenticação
export type AuthStackParamList = {
  Login: undefined; // 'undefined' significa que não recebe parâmetros
  Register: undefined;
  ForgotPassword: undefined;
};

// Telas e parâmetros do Navegador de Abas
export type MainTabParamList = {
  HomeTab: undefined;
  BooksTab: undefined;
  ProfileTab: undefined;
};

// Telas e parâmetros do Stack Principal (Pós-login)
export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>; // 👈 Navegador aninhado
  BookDetail: { bookId: string }; // 👈 Tela espera um 'bookId'
  BookForm: { bookId?: string }; // 👈 'bookId' é opcional (para 'Adicionar')
};

// --- FIM DOS TIPOS ---


// Inicializa os navegadores COM OS TIPOS
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const AppStackNav = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// --- Mock do Theme (Tipado) ---
const mockThemeColors: ThemeColors = {
    primary: '#10B981', // Verde
    primaryForeground: '#FFFFFF',
    mutedForeground: '#717182',
    foreground: '#1C1C1E',
    background: '#FFFFFF'
};

// =================================================================
// 💡 1. NAVEGADOR DE ABAS (Tipado)
// =================================================================
function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }: { route: RouteProp<MainTabParamList, keyof MainTabParamList> }) => ({
                headerShown: false,
                tabBarActiveTintColor: mockThemeColors.primary,
                tabBarInactiveTintColor: mockThemeColors.mutedForeground,
                tabBarLabelStyle: styles.tabLabel,
                tabBarStyle: styles.tabBar,
                
                // 💡 Lógica de ícone CORRIGIDA e OTIMIZADA
                // Usamos a prop 'focused' para alternar os ícones
                tabBarIcon: ({ focused, color, size }: { focused: boolean, color: string, size: number }) => {
                    let iconName: string; // Tipo string

                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'home' : 'home-outline'; 
                    } else if (route.name === 'BooksTab') {
                        iconName = focused ? 'book' : 'book-outline'; 
                    } else if (route.name === 'ProfileTab') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else {
                        iconName = 'alert-circle'; // Um ícone de fallback
                    }
                    
                    // 'name' deve ser string, o que 'iconName' agora é
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            {/* 💡 Os 'name' aqui devem bater com as chaves de MainTabParamList */}
            <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Início' }} />
            <Tab.Screen name="BooksTab" component={BooksListScreen} options={{ title: 'Livros' }} />
            <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Perfil' }} />
        </Tab.Navigator>
    );
}

// =================================================================
// 💡 2. STACK DO APLICATIVO PRINCIPAL (Tipado)
// =================================================================
function AppStack() {
    return (
        // 💡 Usando o navegador tipado
        <AppStackNav.Navigator screenOptions={{ headerShown: false }}>
            {/* 💡 Os 'name' aqui devem bater com as chaves de AppStackParamList */}
            <AppStackNav.Screen name="MainTabs" component={MainTabNavigator} />
            <AppStackNav.Screen name="BookDetail" component={BookDetailScreen} />
            <AppStackNav.Screen name="BookForm" component={BookFormScreen} />
        </AppStackNav.Navigator>
    );
}

// =================================================================
// 💡 3. STACK DE AUTENTICAÇÃO (Tipado)
// =================================================================
function AuthStack() {
    return (
        // 💡 Usando o navegador tipado
        <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
            {/* 💡 Os 'name' aqui devem bater com as chaves de AuthStackParamList */}
            <AuthStackNav.Screen name="Login" component={LoginScreen} />
            <AuthStackNav.Screen name="Register" component={RegisterScreen} />
            <AuthStackNav.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </AuthStackNav.Navigator>
    );
}

// 💡 4. NAVEGADOR RAIZ (Tipado)
function RootNavigator() {
    const { isLoggedIn } = useAuth(); 
    return isLoggedIn ? <AppStack /> : <AuthStack />;
}

// =================================================================
// 💡 5. COMPONENTE RAIZ (Ponto de Entrada)
// =================================================================
export default function App() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={mockThemeColors.primary} />
            
            <AuthProvider> 
              {/* 💡 Agora o RootNavigator está direto dentro do AuthProvider */}
                <RootNavigator /> 
            </AuthProvider>

        </SafeAreaView>
    );
}

// --- Estilos Locais (Inalterados, mas agora validados pelo TS) ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: mockThemeColors.background,
    },
    tabBar: { 
        height: 60, 
        paddingBottom: 5, 
        paddingTop: 5, 
        backgroundColor: mockThemeColors.background 
    },
    tabLabel: { 
        fontSize: 12, 
        fontWeight: '500' 
    }
});
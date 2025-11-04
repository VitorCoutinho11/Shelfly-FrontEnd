import * as React from 'react';
import { SafeAreaView, StatusBar, Text, StyleSheet } from 'react-native';


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import { AuthProvider, useAuth } from './context/AuthContext';

// Importa todas as suas telas (garantindo que todas usem 'export default')
import LoginScreen from './LoginScreen.jsx';
import ProfileScreen from './ProfileScreen.jsx';
import BooksListScreen from './BooksListScreen.jsx';
import RegisterScreen from './RegisterScreen.jsx'
import BookDetailScreen from './BookDetailScreen.jsx';
import HomeScreen from './HomeScreen.jsx';
import ForgotPasswordScreen from './ForgotPasswordScreen.jsx';
import BookFormScreen from './BookFormScreen.jsx'; 

// Inicializa os navegadores
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Mock do Theme para consistência ---
const mockThemeColors = {
    primary: '#10B981', // Verde
    primaryForeground: '#FFFFFF',
    mutedForeground: '#717182',
    foreground: '#1C1C1E',
    background: '#FFFFFF'
};

// =================================================================
// 💡 1. NAVEGADOR DE ABAS (Bottom Tabs - Início, Livros, Perfil)
// =================================================================
function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, // Oculta o header nativo nas telas de abas
                tabBarActiveTintColor: mockThemeColors.primary,
                tabBarInactiveTintColor: mockThemeColors.mutedForeground,
                tabBarLabelStyle: styles.tabLabel,
                tabBarStyle: styles.tabBar,
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    // Lógica para selecionar o ícone
                    if (route.name === 'HomeTab') {
                        iconName = 'home'; 
                    } else if (route.name === 'BooksTab') {
                        iconName = 'book'; 
                    } else if (route.name === 'ProfileTab') {
                        iconName = 'person';
                    }
                    // Usa ícone preenchido para ativo, e opcionalmente outline para inativo
                    const finalIconName = (route.name === 'BooksTab' || route.name === 'HomeTab' || route.name === 'ProfileTab') 
                                            ? iconName 
                                            : `${iconName}-outline`;
                    
                    return <Ionicons name={finalIconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Início' }} />
            <Tab.Screen name="BooksTab" component={BooksListScreen} options={{ title: 'Livros' }} />
            <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Perfil' }} />
        </Tab.Navigator>
    );
}

// =================================================================
// 💡 2. STACK DO APLICATIVO PRINCIPAL (Telas Pós-Login)
// =================================================================
function AppStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* O MainTabs é a primeira rota. */}
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            
            {/* Telas que se sobrepõem às abas */}
            <Stack.Screen 
                name="BookDetail" 
                component={BookDetailScreen} 
            />
            <Stack.Screen 
                name="BookForm" 
                component={BookFormScreen} 
            />
        </Stack.Navigator>
    );
}

// =================================================================
// 💡 3. STACK DE AUTENTICAÇÃO (Telas de Login)
// =================================================================
function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
}

function RootNavigator() {
    const { isLoggedIn } = useAuth(); // ⬅️ Obtém o estado real do Contexto
    
    // Agora o componente decide qual Stack mostrar
    return isLoggedIn ? <AppStack /> : <AuthStack />;
}

// =================================================================
// 💡 4. COMPONENTE RAIZ (Ponto de Entrada)
// =================================================================
export default function App() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={mockThemeColors.primary} />
            
          

            <AuthProvider> {/* ⬅️ ENVIOU TODOS OS COMPONENTES com o Auth Context */}
                <RootNavigator />
            </AuthProvider>

        </SafeAreaView>
    );
}

// --- Estilos Locais ---
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
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
// Componente de Ícone do Vector Icons
import Icon from 'react-native-vector-icons/Feather'; 

// 🚀 IMPORTAÇÃO DO CONTEXTO DE AUTENTICAÇÃO
import { useAuth } from './context/AuthContext'; 

// --- SIMULAÇÃO DO THEME (Mantido) ---
const Theme = {
    colors: {
        background: '#fcfcfc',
        card: '#fff',
        primary: '#387c6f', 
        primaryForeground: '#fff',
        secondary: '#f59e0b',
        secondaryLight: '#e0f2f1', 
        foreground: '#4b5563',
        mutedForeground: '#9ca3af',
        border: '#e5e7eb',
        inputBackground: '#f9fafb',
        inputBorder: '#e5e7eb',
    },
    spacing: {
        '2': 8, '3': 12, '4': 16, '6': 24, '8': 32, '10': 40
    },
    typography: {
        h1: { fontSize: 22, fontWeight: '700' },
        subtitle: { fontSize: 14, fontWeight: '400' },
        label: { fontSize: 16, fontWeight: '600' },
        input: { fontSize: 16, fontWeight: '400' },
        button: { fontSize: 18, fontWeight: '700' },
    },
    borderRadius: {
        'md': 8, 'lg': 12, 'xl': 20, '2xl': 25,
    }
};
// --- FIM DA SIMULAÇÃO DO THEME ---

const { colors, spacing, typography, borderRadius } = Theme;
const { width } = Dimensions.get('window');

// --- Componente de Ícone Principal ---
const AuthIcon = ({ iconName, bgColor, iconColor, shadowOpacity = 0.1 }) => (
    <View style={[styles.authIconContainer, { backgroundColor: bgColor, shadowOpacity: shadowOpacity }]}>
        <Text style={{ fontSize: 32, color: iconColor, fontWeight: 'bold' }}>{iconName === 'book' ? '📚' : '🔖'}</Text>
    </View>
);

// --- Componente de Input com Estilo (REVISADO para aceitar props de estado) ---
const CustomInput = ({ label, placeholder, secureTextEntry = false, keyboardType = 'default', iconName, value, onChangeText }) => (
    <View style={styles.formField}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputWrapper}>
            {iconName && <Icon name={iconName} size={20} color={colors.mutedForeground} style={styles.inputIcon} />}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                placeholderTextColor="#bdbdbd" 
                // 🚀 ADICIONADO: Conecta o estado local
                value={value} 
                onChangeText={onChangeText}
                autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
            />
        </View>
    </View>
);

// 🚀 COMPONENTE PRINCIPAL (REVISADO)
export default function LoginScreen({ navigation }) {
    // 💡 1. Obtém as funções e estados do contexto
    const { login, isLoading } = useAuth();
    
    // 💡 2. Estado local para os inputs
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    // 📌 Lógica para o botão 'Entrar'
    const handleLogin = () => {
        // 🚀 O BOTÃO CHAMA A FUNÇÃO REAL DE LOGIN DO CONTEXTO
        // Se o login for bem-sucedido, o 'isLoggedIn' muda, e o App.js renderiza o AppStack.
        login(email, password);
    };

    // 📌 Lógica para o link 'Esqueceu sua Senha?'
    const navigateToForgotPassword = () => {
        navigation.navigate('ForgotPassword');
    };

    // 📌 Lógica para o link 'Cadastre-se'
    const navigateToRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <View style={styles.fullContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* --- SEÇÃO DE ÍCONES DE CABEÇALHO --- */}
                <View style={styles.headerIconsContainer}>
                    <Text style={[styles.fadedIcon, { fontSize: 70, color: colors.secondaryLight, transform: [{ rotate: '-15deg' }] }]}>🔖</Text>
                    <AuthIcon iconName="book" bgColor={colors.primary} iconColor={colors.primaryForeground} />
                    <Text style={styles.appName}>Shelfly</Text>
                    <Text style={styles.appSubtitle}>
                        Sua Biblioteca Pessoal <Text style={styles.starIcon}>✨</Text>
                    </Text>
                </View>

                {/* --- CARD DE LOGIN --- */}
                <View style={styles.loginCard}>
                    <Text style={styles.cardTitle}>Bem-vindo de volta!</Text>
                    <Text style={styles.cardSubtitle}>Entre para continuar sua jornada literária</Text>

                    {/* Campos de Input (AGORA COM VALOR E ONCHANGETEXT) */}
                    <CustomInput 
                        label="E-mail" 
                        placeholder="seu@email.com" 
                        keyboardType="email-address" 
                        iconName="mail"
                        value={email} // ⬅️ CONECTADO
                        onChangeText={setEmail} // ⬅️ CONECTADO
                    />
                    <CustomInput 
                        label="Senha" 
                        placeholder="••••••••" 
                        secureTextEntry 
                        iconName="lock"
                        value={password} // ⬅️ CONECTADO
                        onChangeText={setPassword} // ⬅️ CONECTADO
                    />

                    {/* Link Esqueceu sua Senha */}
                    <TouchableOpacity style={styles.forgotPasswordLink} onPress={navigateToForgotPassword}>
                        <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
                    </TouchableOpacity>

                    {/* Botão Entrar (AGORA COM LÓGICA DE LOADING) */}
                    <TouchableOpacity 
                        style={[styles.primaryButton, isLoading && { opacity: 0.7 }]} 
                        onPress={handleLogin}
                        disabled={isLoading} // ⬅️ Desabilita durante o loading
                    >
                        {isLoading ? (
                            <ActivityIndicator color={colors.primaryForeground} />
                        ) : (
                            <Text style={styles.primaryButtonText}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                    {/* Divisor OU */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>OU</Text>
                        <View style={styles.divider} />
                    </View>

                    {/* Link Criar Conta */}
                    <TouchableOpacity onPress={navigateToRegister}>
                        <Text style={styles.registerLinkText}>
                            Ainda não tem uma conta? <Text style={styles.registerLinkHighlight}>Cadastre-se gratuitamente</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* --- RODAPÉ --- */}
                <Text style={styles.footerText}>
                    Organize, avalie e compartilhe suas leituras <Text style={styles.starIcon}>✨</Text>
                </Text>

            </ScrollView>
        </View>
    );
}

// --- ESTILOS (Inalterados) ---
const styles = StyleSheet.create({
    fullContainer: { flex: 1, backgroundColor: colors.background, },
    scrollContent: { flexGrow: 1, paddingTop: spacing['10'], paddingBottom: spacing['10'], alignItems: 'center', },
    headerIconsContainer: { alignItems: 'center', marginBottom: spacing['8'], position: 'relative', width: '100%', },
    fadedIcon: { position: 'absolute', top: -10, right: width / 2 - 140, opacity: 0.8, },
    authIconContainer: { width: 70, height: 70, borderRadius: borderRadius['lg'], justifyContent: 'center', alignItems: 'center', marginBottom: spacing['2'], shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5.46, elevation: 8, },
    appName: { fontSize: typography.h1.fontSize, fontWeight: typography.h1.fontWeight, color: colors.foreground, },
    appSubtitle: { fontSize: typography.subtitle.fontSize, color: colors.foreground, marginTop: 4, },
    starIcon: { color: colors.secondary, fontWeight: 'bold', },
    loginCard: { width: width * 0.9, maxWidth: 400, backgroundColor: colors.card, borderRadius: borderRadius['2xl'], padding: spacing['6'], paddingVertical: spacing['8'], shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10, alignItems: 'center', },
    cardTitle: { fontSize: typography.h1.fontSize, fontWeight: typography.h1.fontWeight, color: colors.foreground, marginBottom: spacing['2'], },
    cardSubtitle: { fontSize: typography.subtitle.fontSize, color: colors.mutedForeground, marginBottom: spacing['8'], textAlign: 'center', },
    formField: { width: '100%', marginBottom: spacing['4'], },
    label: { fontSize: typography.label.fontSize, fontWeight: typography.label.fontWeight, color: colors.foreground, marginBottom: spacing['2'], },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: borderRadius['lg'], paddingHorizontal: spacing['4'], height: 55, width: '100%', },
    inputIcon: { marginRight: spacing['2'] },
    input: { flex: 1, fontSize: typography.input.fontSize, color: colors.foreground, paddingVertical: 0, height: '100%' },
    forgotPasswordLink: { alignSelf: 'flex-end', marginBottom: spacing['6'], },
    forgotPasswordText: { color: colors.primary, fontWeight: '600', fontSize: 14, },
    primaryButton: { width: '100%', backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 16, borderRadius: borderRadius['lg'], height: 55, alignItems: 'center', justifyContent: 'center', },
    primaryButtonText: { color: colors.primaryForeground, fontSize: typography.button.fontSize, fontWeight: typography.button.fontWeight, },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing['6'], width: '100%', },
    divider: { flex: 1, height: 1, backgroundColor: colors.border, },
    dividerText: { marginHorizontal: spacing['3'], color: colors.mutedForeground, fontWeight: '500', fontSize: 14, },
    registerLinkText: { fontSize: 16, color: colors.foreground, textAlign: 'center', },
    registerLinkHighlight: { color: colors.secondary, fontWeight: 'bold', },
    footerText: { fontSize: 14, color: colors.mutedForeground, marginTop: spacing['6'], textAlign: 'center', paddingHorizontal: spacing['6'], }
});
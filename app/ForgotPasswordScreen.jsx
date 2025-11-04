import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

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
        headerLink: '#387c6f',
    },
    spacing: {
        '2': 8, '3': 12, '4': 16, '6': 24, '8': 32, '10': 40
    },
    typography: {
        h1: { fontSize: 22, fontWeight: '700' },
        h2: { fontSize: 18, fontWeight: '600' },
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

// --- Componente de Input com Estilo (Mantido) ---
const CustomInput = ({ placeholder, value, keyboardType = 'default', onChangeText }) => (
    <View style={styles.inputContainer}>
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            keyboardType={keyboardType}
            placeholderTextColor="#bdbdbd"
            value={value}
            onChangeText={onChangeText}
        />
    </View>
);

// 🚀 RECEBENDO A PROP NAVIGATION
export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');

    // 📌 Lógica para Voltar ao Login (usado no Header e no link inferior)
    const navigateToLogin = () => {
        // Envia o usuário de volta para a tela de login
        navigation.navigate('Login'); 
    };

    // 📌 Lógica para Enviar Link de Recuperação
    const handleSendRecoveryLink = () => {
        // Na vida real, você faria a chamada de API de recuperação aqui.
        alert(`Link de recuperação enviado para: ${email || 'o e-mail fornecido'}.`);
        
        // Após o envio (simulado), você pode retornar à tela de Login
        // para que o usuário possa tentar logar com a nova senha.
        navigateToLogin(); 
    };


    return (
        <View style={styles.fullContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 🚀 HEADER (Voltar) */}
                <TouchableOpacity style={styles.header} onPress={navigateToLogin}>
                    <Text style={styles.backArrow}>←</Text> 
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>

                {/* --- SEÇÃO DE ÍCONES E TÍTULOS (Mantido) --- */}
                <View style={styles.iconSection}>
                    <Text style={styles.fadedIcon}>✉️</Text>
                    <View style={styles.authIconContainer}>
                         <Text style={styles.authIconText}>✉️</Text> 
                    </View>
                    <Text style={styles.mainTitle}>Recuperar Senha</Text>
                    <Text style={styles.mainSubtitle}>
                        Não se preocupe, vamos ajudá-lo
                    </Text>
                </View>

                {/* --- CARD DE RECUPERAÇÃO (Mantido) --- */}
                <View style={styles.card}>
                    <Text style={styles.cardDescription}>
                        Digite o e-mail associado à sua conta e enviaremos instruções para redefinir sua senha.
                    </Text>

                    <View style={styles.labelContainer}>
                        <Text style={styles.labelIcon}>✉️</Text>
                        <Text style={styles.label}>E-mail</Text>
                    </View>

                    {/* Campo E-mail (Mantido) */}
                    <CustomInput 
                        placeholder="seu@email.com"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    
                    {/* 🚀 Botão Enviar Link de Recuperação */}
                    <TouchableOpacity style={styles.primaryButton} onPress={handleSendRecoveryLink}>
                        <Text style={styles.buttonIcon}>✈️</Text> 
                        <Text style={styles.primaryButtonText}>Enviar Link de Recuperação</Text>
                    </TouchableOpacity>

                    {/* 🚀 Link Voltar ao Login */}
                    <TouchableOpacity style={styles.loginLink} onPress={navigateToLogin}>
                        <Text style={styles.loginLinkText}>
                            Lembrou sua senha? <Text style={styles.loginLinkHighlight}>Voltar ao login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* --- Ícone de Chave no Fundo (Mantido) --- */}
                <Text style={styles.fadedKeyIcon}>🔑</Text>

            </ScrollView>
        </View>
    );
}

// --- ESTILOS (Mantido) ---
const styles = StyleSheet.create({
    fullContainer: { flex: 1, backgroundColor: colors.background, },
    scrollContent: { flexGrow: 1, paddingBottom: spacing['10'] || 40, alignItems: 'center', },
    header: { width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing['6'] || 24, paddingVertical: spacing['4'] || 16, marginBottom: spacing['6'] || 24, },
    backArrow: { fontSize: 24, color: colors.headerLink, marginRight: spacing['2'] || 8, },
    backText: { fontSize: 16, fontWeight: '600', color: colors.headerLink, },
    iconSection: { alignItems: 'center', marginBottom: spacing['8'] || 32, position: 'relative', width: '100%', },
    fadedIcon: { position: 'absolute', top: -10, right: '15%', opacity: 0.8, fontSize: 90, color: colors.secondaryLight, transform: [{ rotate: '15deg' }], },
    authIconContainer: { width: 70, height: 70, borderRadius: borderRadius['lg'], justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, marginBottom: spacing['2'] || 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5.46, elevation: 8, },
    authIconText: { fontSize: 32, color: colors.primaryForeground, },
    mainTitle: { fontSize: typography.h1.fontSize, fontWeight: typography.h1.fontWeight, color: colors.primary, marginTop: spacing['2'] || 8, },
    mainSubtitle: { fontSize: typography.subtitle.fontSize, color: colors.foreground, marginTop: 4, },
    card: { width: '90%', maxWidth: 400, backgroundColor: colors.card, borderRadius: borderRadius['2xl'], padding: spacing['6'] || 24, paddingVertical: spacing['8'] || 32, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10, alignItems: 'center', },
    cardDescription: { fontSize: typography.subtitle.fontSize, color: colors.mutedForeground, marginBottom: spacing['8'] || 32, textAlign: 'center', lineHeight: 20, },
    labelContainer: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: spacing['2'] || 8, },
    labelIcon: { fontSize: 16, color: colors.foreground, marginRight: spacing['2'] || 8, },
    label: { fontSize: typography.label.fontSize, fontWeight: typography.label.fontWeight, color: colors.foreground, },
    inputContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: borderRadius['lg'], height: 55, marginBottom: spacing['6'] || 24, },
    input: { flex: 1, paddingHorizontal: spacing['4'] || 16, paddingVertical: spacing['3'] || 12, fontSize: typography.input.fontSize, color: colors.foreground, width: '100%', backgroundColor: colors.inputBackground, borderRadius: borderRadius['lg'], borderWidth: 0, },
    primaryButton: { width: '100%', backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 16, borderRadius: borderRadius['lg'], height: 55, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: spacing['8'] || 32, },
    buttonIcon: { fontSize: 20, marginRight: spacing['2'] || 8, color: colors.primaryForeground, },
    primaryButtonText: { color: colors.primaryForeground, fontSize: typography.button.fontSize, fontWeight: typography.button.fontWeight, },
    loginLink: { padding: spacing['2'] || 8, },
    loginLinkText: { fontSize: 16, color: colors.foreground, textAlign: 'center', },
    loginLinkHighlight: { color: colors.primary, fontWeight: 'bold', },
    fadedKeyIcon: { position: 'absolute', bottom: 20, left: '20%', opacity: 0.5, fontSize: 80, color: colors.secondaryLight, transform: [{ rotate: '-45deg' }], },
});
import React, { useState } from 'react'; // Importe useState explicitamente
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
// ... (resto das imports e Theme)
// ...

// 🚀 IMPORTAÇÃO DO CONTEXTO DE AUTENTICAÇÃO
import { useAuth } from './context/AuthContext'; 

// ... (Componente BenefitItem e CustomInput revisado acima)

// 🚀 COMPONENTE PRINCIPAL (REVISADO)
export default function RegisterScreen({ navigation }) {
    // 💡 1. Obtém as funções e estados do contexto
    const { login, isLoading } = useAuth(); // Usamos 'login' para simular o login após o registro
    
    // 💡 2. Estado local para os inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // 📌 Lógica para o botão 'Voltar'
    const handleGoBack = () => {
        navigation.goBack();
    };

    // 📌 Lógica para o botão 'Criar Conta'
    const handleRegister = async () => {
        // Validação básica
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        // --- SIMULAÇÃO DE CHAMADA DE API DE REGISTRO ---
        // 1. Simular registro bem-sucedido
        Alert.alert("Sucesso", "Conta criada com sucesso! Logando...");
        
        // 2. Chamar a função de login (que está no AuthContext)
        // Isso simula o login automático após o registro
        await login(email, password); 
        // Se o login for bem-sucedido, o App.js muda para AppStack.
        
        // ------------------------------------------------
    };

    return (
        <View style={styles.fullContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 🚀 HEADER (Voltar) */}
                <TouchableOpacity style={styles.header} onPress={handleGoBack} disabled={isLoading}>
                    <Text style={styles.backArrow}>←</Text> 
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>

                {/* --- SEÇÃO DE ÍCONES SUPERIOR --- */}
                <View style={styles.iconSection}>
                    <Text style={styles.fadedIcon}>🤍</Text>
                    <View style={styles.authIconContainer}>
                         <Text style={styles.authIconText}>📖</Text> 
                    </View>
                    <Text style={styles.mainTitle}>Criar Conta</Text>
                    <Text style={styles.mainSubtitle}>
                        Comece sua jornada literária hoje <Text style={styles.starIcon}>✨</Text>
                    </Text>
                </View>

                {/* --- CARD DE CADASTRO --- */}
                <View style={styles.card}>
                    {/* Inputs (AGORA COM VALOR E ONCHANGETEXT) */}
                    <CustomInput 
                        icon="👤" 
                        placeholder="Seu nome" 
                        value={name} 
                        onChangeText={setName} 
                    />
                    <CustomInput 
                        icon="✉️" 
                        placeholder="seu@email.com" 
                        keyboardType="email-address" 
                        value={email} 
                        onChangeText={setEmail}
                    />
                    <CustomInput 
                        icon="🔒" 
                        placeholder="Mínimo 6 caracteres" 
                        secureTextEntry 
                        value={password} 
                        onChangeText={setPassword}
                    />
                    <CustomInput 
                        icon="✅" 
                        placeholder="Digite a senha novamente" 
                        secureTextEntry 
                        value={confirmPassword} 
                        onChangeText={setConfirmPassword}
                    />
                    
                    {/* 🚀 Botão Criar Conta (COM LÓGICA DE LOADING) */}
                    <TouchableOpacity 
                        style={[styles.primaryButton, isLoading && { opacity: 0.7 }]} 
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={colors.primaryForeground} />
                        ) : (
                            <Text style={styles.primaryButtonText}>Criar Conta</Text>
                        )}
                    </TouchableOpacity>

                    {/* --- SEÇÃO DE BENEFÍCIOS --- */}
                    <Text style={styles.benefitsHeader}>
                        Ao criar uma conta, você terá acesso a:
                    </Text>
                    {/* ... (Restante dos benefícios) ... */}
                    <View style={styles.benefitsGrid}>
                        <View style={styles.benefitsColumn}>
                            <BenefitItem text="Catálogo ilimitado" />
                            <BenefitItem text="Estatísticas detalhadas" />
                        </View>
                        <View style={styles.benefitsColumn}>
                            <BenefitItem text="Avaliações e resenhas" />
                            <BenefitItem text="Metas de leitura" />
                        </View>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

// --- ESTILOS (Adicione ou importe o ActivityIndicator) ---
// Note: Certifique-se de que `ActivityIndicator` está importado no topo, se for necessário.
// ... (o restante dos estilos permanece o mesmo)
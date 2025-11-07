import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  KeyboardTypeOptions,
  TextStyle, // 💡 Importado para tipar estilos
  ViewStyle,  // 💡 Importado para tipar estilos
} from 'react-native';

// 💡 Importando tipos de navegação
import { NavigationProp, ParamListBase } from '@react-navigation/native';

// --- 💡 INÍCIO DA DEFINIÇÃO DE TIPOS PARA O THEME ---
// Isso vai corrigir os erros de estilo

interface ThemeColors {
  background: string;
  card: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryLight: string;
  foreground: string;
  mutedForeground: string;
  border: string;
  inputBackground: string;
  inputBorder: string;
  headerLink: string;
}

// Usamos [key: string]: number para aceitar '2', '3', '4', etc.
interface ThemeSpacing {
  [key: string]: number;
}

interface TypographyStyle {
  fontSize: number;
  fontWeight: '700' | '600' | '400';
}

interface ThemeTypography {
  h1: TypographyStyle;
  h2: TypographyStyle;
  subtitle: TypographyStyle;
  label: TypographyStyle;
  input: TypographyStyle;
  button: TypographyStyle;
}

// Usamos [key: string]: number para aceitar 'md', 'lg', 'xl', etc.
interface ThemeBorderRadius {
  [key: string]: number;
}

// Interface principal do nosso Theme
interface AppTheme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: ThemeBorderRadius;
}

// --- FIM DA DEFINIÇÃO DE TIPOS PARA O THEME ---


// --- SIMULAÇÃO DO THEME ---
// 💡 Agora aplicamos o tipo AppTheme ao objeto
const Theme: AppTheme = {
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

// Agora o TypeScript sabe exatamente o que há dentro de cada variável
const { colors, spacing, typography, borderRadius } = Theme;

// --- DEFINIÇÃO DE TIPOS DOS COMPONENTES ---

interface CustomInputProps {
  placeholder: string;
  value: string;
  keyboardType?: KeyboardTypeOptions;
  onChangeText: (text: string) => void;
}

interface ForgotPasswordScreenProps {
  navigation: NavigationProp<ParamListBase>;
}
// --- FIM DOS TIPOS ---


// --- Componente de Input Tipado ---
const CustomInput: React.FC<CustomInputProps> = ({ 
  placeholder, 
  value, 
  keyboardType = 'default', 
  onChangeText 
}) => (
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

// --- Componente Principal Tipado ---
export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
    const [email, setEmail] = useState<string>('');

    const navigateToLogin = () => {
        navigation.navigate('Login'); 
    };

    const handleSendRecoveryLink = () => {
        alert(`Link de recuperação enviado para: ${email || 'o e-mail fornecido'}.`);
        navigateToLogin(); 
    };


    return (
        <View style={styles.fullContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <TouchableOpacity style={styles.header} onPress={navigateToLogin}>
                    <Text style={styles.backArrow}>←</Text> 
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>

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

                <View style={styles.card}>
                    <Text style={styles.cardDescription}>
                        Digite o e-mail associado à sua conta e enviaremos instruções para redefinir sua senha.
                    </Text>

                    <View style={styles.labelContainer}>
                        <Text style={styles.labelIcon}>✉️</Text>
                        <Text style={styles.label}>E-mail</Text>
                    </View>

                    <CustomInput 
                        placeholder="seu@email.com"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    
                    <TouchableOpacity style={styles.primaryButton} onPress={handleSendRecoveryLink}>
                        <Text style={styles.buttonIcon}>✈️</Text> 
                        <Text style={styles.primaryButtonText}>Enviar Link de Recuperação</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginLink} onPress={navigateToLogin}>
                        <Text style={styles.loginLinkText}>
                            Lembrou sua senha? <Text style={styles.loginLinkHighlight}>Voltar ao login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.fadedKeyIcon}>🔑</Text>

            </ScrollView>
        </View>
    );
}

// --- ESTILOS ---
// O StyleSheet.create não muda, mas agora o TypeScript
// entende todas as variáveis (colors.primary, typography.h1, etc.)
// 💡 Para ser 100% seguro, podemos tipar o próprio objeto styles.

// Definimos um tipo para o nosso objeto de estilos
type Styles = {
  fullContainer: ViewStyle;
  scrollContent: ViewStyle;
  header: ViewStyle;
  backArrow: TextStyle;
  backText: TextStyle;
  iconSection: ViewStyle;
  fadedIcon: TextStyle;
  authIconContainer: ViewStyle;
  authIconText: TextStyle;
  mainTitle: TextStyle;
  mainSubtitle: TextStyle;
  card: ViewStyle;
  cardDescription: TextStyle;
  labelContainer: ViewStyle;
  labelIcon: TextStyle;
  label: TextStyle;
  inputContainer: ViewStyle;
  input: TextStyle;
  primaryButton: ViewStyle;
  buttonIcon: TextStyle;
  primaryButtonText: TextStyle;
  loginLink: ViewStyle;
  loginLinkText: TextStyle;
  loginLinkHighlight: TextStyle;
  fadedKeyIcon: TextStyle;
};

// Aplicamos o tipo ao criar o StyleSheet
const styles = StyleSheet.create<Styles>({
    fullContainer: { flex: 1, backgroundColor: colors.background, },
    scrollContent: { flexGrow: 1, paddingBottom: spacing['10'] || 40, alignItems: 'center', },
    header: { width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing['6'] || 24, paddingVertical: spacing['4'] || 16, marginBottom: spacing['6'] || 24, },
    backArrow: { fontSize: 24, color: colors.headerLink, marginRight: spacing['2'] || 8, },
    backText: { fontSize: 16, fontWeight: '600', color: colors.headerLink, },
    iconSection: { alignItems: 'center', marginBottom: spacing['8'] || 32, position: 'relative', width: '100%', },
    fadedIcon: { position: 'absolute', top: -10, right: '15%', opacity: 0.8, fontSize: 90, color: colors.secondaryLight, transform: [{ rotate: '15deg' }], },
    authIconContainer: { width: 70, height: 70, borderRadius: borderRadius['lg'], justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, marginBottom: spacing['2'] || 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5.46, elevation: 8, },
    authIconText: { fontSize: 32, color: colors.primaryForeground, },
    // 💡 O 'fontWeight' aqui é 'string', mas o tipo do Theme é '700'
    // O TypeScript pode reclamar. Vamos forçar o tipo correto.
    mainTitle: { ...typography.h1, color: colors.primary, marginTop: spacing['2'] || 8, },
    mainSubtitle: { ...typography.subtitle, color: colors.foreground, marginTop: 4, },
    card: { width: '90%', maxWidth: 400, backgroundColor: colors.card, borderRadius: borderRadius['2xl'], padding: spacing['6'] || 24, paddingVertical: spacing['8'] || 32, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10, alignItems: 'center', },
    cardDescription: { ...typography.subtitle, color: colors.mutedForeground, marginBottom: spacing['8'] || 32, textAlign: 'center', lineHeight: 20, },
    labelContainer: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: spacing['2'] || 8, },
    labelIcon: { fontSize: 16, color: colors.foreground, marginRight: spacing['2'] || 8, },
    label: { ...typography.label, color: colors.foreground, },
    inputContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: borderRadius['lg'], height: 55, marginBottom: spacing['6'] || 24, },
    input: { ...typography.input, flex: 1, paddingHorizontal: spacing['4'] || 16, paddingVertical: spacing['3'] || 12, color: colors.foreground, width: '100%', backgroundColor: colors.inputBackground, borderRadius: borderRadius['lg'], borderWidth: 0, },
    primaryButton: { width: '100%', backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 16, borderRadius: borderRadius['lg'], height: 55, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: spacing['8'] || 32, },
    buttonIcon: { fontSize: 20, marginRight: spacing['2'] || 8, color: colors.primaryForeground, },
    primaryButtonText: { ...typography.button, color: colors.primaryForeground, },
    loginLink: { padding: spacing['2'] || 8, },
    loginLinkText: { fontSize: 16, color: colors.foreground, textAlign: 'center', },
    loginLinkHighlight: { color: colors.primary, fontWeight: 'bold', },
    fadedKeyIcon: { position: 'absolute', bottom: 20, left: '20%', opacity: 0.5, fontSize: 80, color: colors.secondaryLight, transform: [{ rotate: '-45deg' }], },
});
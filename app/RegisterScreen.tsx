import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';

// Importando ícones
import Feather from 'react-native-vector-icons/Feather';

// Importando tipos de navegação
import { NavigationProp, ParamListBase } from '@react-navigation/native';

// --- 💡 SIMULAÇÃO DO SEU TEMA (Baseado na Imagem) ---
// Eu criei um tema com as cores da imagem que você enviou
interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryForeground: string;
  background: string;
  card: string;
  foreground: string;
  mutedForeground: string;
  border: string;
  inputBackground: string;
  success: string;
}

interface ThemeSpacing { [key: string]: number; }
interface ThemeBorderRadius { [key: string]: number; }
interface ThemeTypography {
  h1: TextStyle;
  subtitle: TextStyle;
  body: TextStyle;
  small: TextStyle;
  label: TextStyle;
}

interface AppTheme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  typography: ThemeTypography;
}

const theme: AppTheme = {
  colors: {
    primary: '#F97316', // Laranja principal
    primaryLight: 'rgba(249, 115, 22, 0.1)', // Laranja bem claro (para o ícone)
    primaryForeground: '#FFFFFF', // Branco
    background: '#F9FAFB', // Cinza de fundo
    card: '#FFFFFF', // Branco
    foreground: '#1F2937', // Texto escuro
    mutedForeground: '#6B7280', // Texto cinza
    border: '#E5E7EB', // Borda
    inputBackground: '#F3F4F6', // Fundo do input
    success: '#10B981', // Verde
  },
  spacing: {
    '1': 4, '2': 8, '3': 12, '4': 16, '5': 20, '6': 24, '8': 32,
  },
  borderRadius: {
    'md': 8, 'lg': 12, 'xl': 16, '2xl': 24, 'full': 9999,
  },
  typography: {
    h1: { fontSize: 24, fontWeight: 'bold' },
    subtitle: { fontSize: 16, color: '#6B7280' },
    body: { fontSize: 16 },
    small: { fontSize: 14 },
    label: { fontSize: 16, fontWeight: '500', color: '#1F2937' },
  },
};
// --- FIM DA SIMULAÇÃO DO TEMA ---


// --- 💡 DEFINIÇÃO DE TIPOS ---

// Props para o componente principal
interface RegisterScreenProps {
  // A tela "Voltar" é (e deve ser) gerenciada pelo React Navigation,
  // então passamos a prop 'navigation' para ela.
  navigation: NavigationProp<ParamListBase>;
}

// Props para o componente de Input customizado
interface CustomInputProps {
  label: string;
  icon: string; // Nome do ícone (do Feather)
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

// Props para o item de benefício
interface BenefitItemProps {
  text: string;
}

// --- Fim dos Tipos ---


// --- Componente Reutilizável: Input do Formulário ---
const CustomInput: React.FC<CustomInputProps> = ({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
}) => {
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <Feather name={icon as any} size={18} color={theme.colors.mutedForeground} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor={theme.colors.mutedForeground}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
      />
    </View>
  );
};

// --- Componente Reutilizável: Item de Benefício ---
const BenefitItem: React.FC<BenefitItemProps> = ({ text }) => {
  return (
    <View style={styles.benefitItem}>
      <Feather name="check-circle" size={16} color={theme.colors.success} />
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
};


// --- COMPONENTE PRINCIPAL: TELA DE CADASTRO ---
export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleRegister = () => {
    // Lógica de registro aqui
    console.log({ name, email, password });
  };
  
  const goToLogin = () => {
    navigation.navigate('Login'); // Navega para a tela de Login
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* 💡 NOVO HEADER CUSTOMIZADO (Adicionado) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToLogin} style={styles.backButton}>
          {/* // 💡 CORRIGIDO: Cor alterada para o verde 'success' */}
          <Feather name="arrow-left" size={24} color={theme.colors.success} />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Seção Título e Ícones --- */}
        <View style={styles.iconSection}>
          <View style={styles.mainIconContainer}>
            <Feather name="book-open" size={32} color={theme.colors.primaryForeground} />
          </View>
          <View style={styles.fadedIconContainer}>
            <Feather name="heart" size={32} color={theme.colors.primary} />
          </View>
        </View>

        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>
          Comece sua jornada literária hoje ✨
        </Text>

        {/* --- Card Principal --- */}
        <View style={styles.card}>
          {/* --- Formulário --- */}
          <CustomInput
            label="Nome Completo"
            icon="user"
            placeholder="Seu nome"
            value={name}
            onChangeText={setName}
          />
          <CustomInput
            label="E-mail"
            icon="mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomInput
            label="Senha"
            icon="lock"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <CustomInput
            label="Confirmar Senha"
            icon="check-circle"
            placeholder="Digite a senha novamente"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {/* --- Botão Criar Conta --- */}
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleRegister}
          >
            <Text style={styles.primaryButtonText}>Criar Conta</Text>
          </TouchableOpacity>

          {/* --- Seção de Benefícios --- */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsHeader}>
              Ao criar uma conta, você terá acesso a:
            </Text>
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

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- 💡 StyleSheet (O "CSS" do React Native) ---

type Styles = {
  safeArea: ViewStyle;
  // 💡 Estilos do Header Adicionados
  header: ViewStyle;
  backButton: ViewStyle;
  backButtonText: TextStyle;
  // ---
  scrollContent: ViewStyle;
  iconSection: ViewStyle;
  mainIconContainer: ViewStyle;
  fadedIconContainer: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  card: ViewStyle;
  inputGroup: ViewStyle;
  labelContainer: ViewStyle;
  label: TextStyle;
  input: TextStyle; 
  primaryButton: ViewStyle;
  primaryButtonText: TextStyle;
  benefitsContainer: ViewStyle;
  benefitsHeader: TextStyle;
  benefitsGrid: ViewStyle;
  benefitsColumn: ViewStyle;
  benefitItem: ViewStyle;
  benefitText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  // 💡 ESTILOS DO HEADER ADICIONADOS
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    ...theme.typography.body,
    // 💡 CORRIGIDO: Cor alterada para o verde 'success'
    color: theme.colors.success, 
    marginLeft: theme.spacing[2],
    fontWeight: '600',
  },
  // ---
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing[5],
    paddingBottom: theme.spacing[8],
  },
  // --- Seção Título/Ícones ---
  iconSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // 💡 Ajustado o espaçamento por causa do novo header
    marginTop: theme.spacing[4], 
    marginBottom: theme.spacing[4],
  },
  mainIconContainer: {
    width: 72,
    height: 72,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fadedIconContainer: {
    width: 72,
    height: 72,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -20, // Sobreposição
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.foreground,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.subtitle,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
  },
  // --- Card Principal ---
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius['2xl'],
    padding: theme.spacing[6],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    // 💡 Adicionado borda sutil
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  // --- Inputs ---
  inputGroup: {
    marginBottom: theme.spacing[5],
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  label: {
    ...theme.typography.label,
    marginLeft: theme.spacing[2],
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    fontSize: 16,
    color: theme.colors.foreground,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  // --- Botão ---
  primaryButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginTop: theme.spacing[2],
  },
  primaryButtonText: {
    color: theme.colors.primaryForeground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // --- Seção Benefícios ---
  benefitsContainer: {
    marginTop: theme.spacing[6],
  },
  benefitsHeader: {
    ...theme.typography.small,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginBottom: theme.spacing[4],
  },
  benefitsGrid: {
    flexDirection: 'row',
  },
  benefitsColumn: {
    flex: 1, // Divide em 50%
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  benefitText: {
    ...theme.typography.small,
    color: theme.colors.foreground,
    marginLeft: theme.spacing[2],
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ViewStyle,
  ScrollView,
  TextStyle,
  KeyboardTypeOptions,
  ColorValue
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

// --- 💡 SIMULAÇÃO DE TIPOS (Baseado no seu ProfileScreen) ---
interface ThemeColors {
  primary: string;
  primaryForeground: string;
  background: string;
  card: string;
  foreground: string;
  mutedForeground: string;
  border: string;
  inputBackground: string;
}
interface ThemeSpacing { [key: string]: number; }
interface ThemeTypography {
  h2: TextStyle;
  body: TextStyle;
  small: TextStyle;
  label: TextStyle;
}
interface ThemeBorderRadius { [key: string]: number; }

// Objeto Theme SIMULADO (com cores do seu ProfileScreen)
const theme: { colors: ThemeColors, spacing: ThemeSpacing, typography: ThemeTypography, borderRadius: ThemeBorderRadius } = {
  colors: {
    primary: '#387C6F',
    primaryForeground: '#FFFFFF',
    background: '#F8FAFC',
    card: '#FFFFFF',
    foreground: '#1F2937',
    mutedForeground: '#6B7280',
    border: '#E5E7EB',
    inputBackground: '#F3F4F6',
  },
  spacing: {
    '1': 4, '2': 8, '3': 12, '4': 16, '5': 20, '6': 24, '8': 32,
  },
  typography: {
    h2: { fontSize: 20, fontWeight: 'bold' },
    body: { fontSize: 16 },
    small: { fontSize: 14, color: '#6B7280' },
    label: { fontSize: 16, fontWeight: '500', color: '#1F2937' },
  },
  borderRadius: {
    'lg': 12, 'xl': 20,
  },
};

// --- 💡 DEFINIÇÃO DE TIPOS ---

// Objeto de dados que o modal vai editar
interface ProfileData {
  name: string;
  email: string;
  avatarUrl: string;
  readingGoal: number;
}

// Props que o modal espera receber
interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
  // Você passará os dados atuais do usuário para preencher o formulário
  currentUser: {
    name: string;
    email: string;
    avatarUrl?: string;
    readingGoal?: number; // Adicione isso à sua interface AuthUser
  } | null;
}

// Props para o Input customizado
interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
}

// Props para o Input de Meta de Leitura
interface GoalInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}
// --- FIM DOS TIPOS ---


// --- Componente Reutilizável: Input do Formulário ---
const CustomInput: React.FC<CustomInputProps> = ({
  label, value, onChangeText, keyboardType = 'default'
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
      placeholderTextColor={theme.colors.mutedForeground as ColorValue}
    />
  </View>
);

// --- Componente Reutilizável: Input de Meta (com setas) ---
const GoalInput: React.FC<GoalInputProps> = ({ label, value, onChange }) => {
  const increment = () => onChange(value + 1);
  const decrement = () => onChange(value > 0 ? value - 1 : 0); // Não permite negativo

  const handleChangeText = (text: string) => {
    // Remove qualquer coisa que não seja número
    const numericValue = parseInt(text.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    } else {
      onChange(0); // Reseta para 0 se o texto for inválido
    }
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.goalInputContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={String(value)} // Converte número para string
          onChangeText={handleChangeText}
          keyboardType="number-pad"
        />
        <View style={styles.stepperContainer}>
          <TouchableOpacity onPress={increment} style={styles.stepperButton}>
            <Feather name="chevron-up" size={20} color={theme.colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity onPress={decrement} style={styles.stepperButton}>
            <Feather name="chevron-down" size={20} color={theme.colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


// --- COMPONENTE PRINCIPAL: MODAL DE EDIÇÃO ---
export default function EditProfileModal({
  visible,
  onClose,
  onSave,
  currentUser
}: EditProfileModalProps) {
  // Estado local para o formulário
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [readingGoal, setReadingGoal] = useState(currentUser?.readingGoal || 12);

  // Atualiza o estado se o usuário mudar
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setAvatarUrl(currentUser.avatarUrl || '');
      setReadingGoal(currentUser.readingGoal || 12);
    }
  }, [currentUser, visible]); // Recarrega quando o modal se torna visível

  const handleSave = () => {
    onSave({ name, email, avatarUrl, readingGoal });
    onClose(); // Fecha o modal
  };

  return (
    <Modal
      animationType="slide"
      transparent={true} // Fundo transparente
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          {/* 1. Cabeçalho do Modal */}
          <View style={styles.modalHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Editar Perfil</Text>
              <Text style={styles.subtitle}>Atualize suas informações pessoais</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={theme.colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {/* 2. Formulário */}
          <ScrollView>
            <CustomInput label="Nome" value={name} onChangeText={setName} />
            <CustomInput label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <CustomInput label="URL do Avatar" value={avatarUrl} onChangeText={setAvatarUrl} keyboardType="url" />
            <GoalInput label="Meta de Leitura Anual" value={readingGoal} onChange={setReadingGoal} />
          </ScrollView>

          {/* 3. Botões de Ação */}
          <View style={styles.footerButtons}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.button, styles.saveButton]}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

// --- ESTILOS para o Modal ---
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center', // Centraliza o modal
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro semi-transparente
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%', // Garante que não cubra a tela inteira
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[6],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingBottom: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing[5],
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.foreground,
  },
  subtitle: {
    ...theme.typography.small,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing[1],
  },
  closeButton: {
    position: 'absolute',
    top: -theme.spacing[2], // Ajusta posição
    right: -theme.spacing[2], // Ajusta posição
  },
  // --- Estilos do Formulário ---
  inputGroup: {
    marginBottom: theme.spacing[4],
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[2],
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.inputBackground,
    color: theme.colors.foreground,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  // --- Estilos da Meta de Leitura ---
  goalInputContainer: {
    flexDirection: 'row',
  },
  stepperContainer: {
    marginLeft: theme.spacing[2],
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stepperButton: {
    padding: theme.spacing[2],
  },
  // --- Estilos dos Botões de Ação ---
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing[6],
    paddingTop: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  button: {
    flex: 1,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing[2],
  },
  cancelButtonText: {
    ...theme.typography.body,
    color: theme.colors.foreground,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing[2],
  },
  saveButtonText: {
    ...theme.typography.body,
    color: theme.colors.primaryForeground,
    fontWeight: '600',
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  Switch, // 👈 Importando o componente de toggle
  ViewStyle,
  TextStyle,
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
// --- FIM DA SIMULAÇÃO ---


// --- 💡 DEFINIÇÃO DE TIPOS ---

// Objeto de dados que o modal vai gerenciar
export interface NotificationSettings {
  isEnabled: boolean;
  allowNewBooks: boolean;
  allowReminders: boolean;
  allowGoalProgress: boolean;
}

// Props que o modal espera receber
interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (settings: NotificationSettings) => void;
  currentSettings: NotificationSettings;
}

// Props para o nosso componente de toggle customizado
interface ToggleItemProps {
  label: string;
  subLabel?: string;
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  disabled?: boolean;
}
// --- FIM DOS TIPOS ---


// --- Componente Reutilizável: ToggleItem (Item com Botão) ---
const ToggleItem: React.FC<ToggleItemProps> = ({
  label, subLabel, value, onValueChange, disabled = false
}) => {
  return (
    <View style={styles.toggleItem}>
      <View style={styles.toggleTextContainer}>
        <Text style={[styles.toggleLabel, disabled && styles.disabledText]}>{label}</Text>
        {subLabel && <Text style={[styles.toggleSubLabel, disabled && styles.disabledText]}>{subLabel}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor={theme.colors.card}
        ios_backgroundColor={theme.colors.border}
      />
    </View>
  );
};


// --- COMPONENTE PRINCIPAL: MODAL DE NOTIFICAÇÕES ---
export default function NotificationsModal({
  visible,
  onClose,
  onSave,
  currentSettings
}: NotificationsModalProps) {
  
  // Estado local para o formulário
  const [isEnabled, setIsEnabled] = useState(currentSettings.isEnabled);
  const [allowNewBooks, setAllowNewBooks] = useState(currentSettings.allowNewBooks);
  const [allowReminders, setAllowReminders] = useState(currentSettings.allowReminders);
  const [allowGoalProgress, setAllowGoalProgress] = useState(currentSettings.allowGoalProgress);

  // Sincroniza o estado interno com as props quando o modal abre
  useEffect(() => {
    if (visible) {
      setIsEnabled(currentSettings.isEnabled);
      setAllowNewBooks(currentSettings.allowNewBooks);
      setAllowReminders(currentSettings.allowReminders);
      setAllowGoalProgress(currentSettings.allowGoalProgress);
    }
  }, [visible, currentSettings]);

  // Lógica para o toggle principal
  const handleMainToggle = (newValue: boolean) => {
    setIsEnabled(newValue);
    // Se desligar o principal, desliga todos os sub-itens
    if (!newValue) {
      setAllowNewBooks(false);
      setAllowReminders(false);
      setAllowGoalProgress(false);
    }
  };
  
  // Lógica para salvar
  const handleSave = () => {
    onSave({
      isEnabled,
      allowNewBooks,
      allowReminders,
      allowGoalProgress,
    });
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          {/* 1. Cabeçalho do Modal */}
          <View style={styles.modalHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Notificações</Text>
              <Text style={styles.subtitle}>Gerencie suas preferências de notificações</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={theme.colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {/* 2. Conteúdo com Toggles */}
          <ScrollView>
            <ToggleItem
              label="Ativar Notificações"
              subLabel="Receba atualizações sobre sua leitura"
              value={isEnabled}
              onValueChange={handleMainToggle} // Usa o handler customizado
            />
            
            <View style={styles.divider} />
            
            <ToggleItem
              label="Novos Livros"
              subLabel="Quando você adicionar um livro"
              value={allowNewBooks}
              onValueChange={setAllowNewBooks}
              disabled={!isEnabled} // 👈 Desabilitado se o principal estiver off
            />
            <ToggleItem
              label="Lembretes de Leitura"
              subLabel="Lembretes para continuar lendo"
              value={allowReminders}
              onValueChange={setAllowReminders}
              disabled={!isEnabled} // 👈 Desabilitado se o principal estiver off
            />
            <ToggleItem
              label="Progresso da Meta"
              subLabel="Atualizações sobre sua meta anual"
              value={allowGoalProgress}
              onValueChange={setAllowGoalProgress}
              disabled={!isEnabled} // 👈 Desabilitado se o principal estiver off
            />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[6],
  },
  // --- Cabeçalho ---
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingBottom: theme.spacing[4],
    marginBottom: theme.spacing[4],
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
    top: -theme.spacing[2],
    right: -theme.spacing[2],
  },
  // --- Conteúdo (Toggles) ---
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: theme.spacing[4],
  },
  toggleLabel: {
    ...theme.typography.label,
    color: theme.colors.foreground,
  },
  toggleSubLabel: {
    ...theme.typography.small,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing[1],
  },
  disabledText: {
    color: theme.colors.border, // Cor mais clara para texto desabilitado
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing[2],
  },
  // --- Botões ---
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
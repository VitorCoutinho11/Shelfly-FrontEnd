import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Alert 
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import { useState } from 'react';
// Importação de componentes que você definiu em seu projeto (usando alias @)
import EditProfileModal from '@/components/EditProfile'; 

// 💡 CORREÇÃO 1: Corrigindo os caminhos de importação para incluir '/index'
import NotificationsModal, { NotificationSettings } from '@/components/Notification'; 
import PrivacyModal, { PrivacySettings } from '@/components/Privacy';

// Importação do AuthContext original (usando alias ou caminho relativo)
import { useAuth as useAuthJS } from './context/AuthContext'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// --- 💡 SIMULAÇÃO DE TIPOS DO THEME ---
interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryLight: string;
  background: string;
  card: string;
  foreground: string;
  mutedForeground: string;
  border: string;
  destructive: string;
}
interface ThemeSpacing { [key: string]: number; }
interface TypographyStyle {
  fontSize: number;
  fontWeight?: 'bold' | 'normal' | '500' | '600' | '700';
  color?: string;
}
interface ThemeTypography {
  h1: TypographyStyle;
  h2: TypographyStyle;
  h3: TypographyStyle;
  body: TypographyStyle;
  small: TypographyStyle;
}
interface ThemeBorderRadius { [key: string]: number; }
type ShadowStyle = Pick<ViewStyle, 'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'>;
interface ThemeShadows {
  sm: ShadowStyle;
}
interface AppTheme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
}
const theme: AppTheme = {
  colors: {
    primary: '#387C6F',
    primaryForeground: '#FFFFFF',
    secondary: '#0D9488',
    secondaryLight: '#F0FDFA',
    background: '#F8FAFC',
    card: '#FFFFFF',
    foreground: '#1F2937',
    mutedForeground: '#6B7280',
    border: '#E5E7EB',
    destructive: '#EF4444',
  },
  spacing: {
    '1': 4, '2': 8, '3': 12, '4': 16, '5': 20, '6': 24, '8': 32,
  },
  typography: {
    h1: { fontSize: 28, fontWeight: 'bold' },
    h2: { fontSize: 20, fontWeight: 'bold' },
    h3: { fontSize: 18, fontWeight: '600' },
    body: { fontSize: 16 },
    small: { fontSize: 14 },
  },
  borderRadius: {
    'lg': 12, 'xl': 20, 'full': 9999,
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3.84,
      elevation: 5,
    },
  }
};
// --- FIM DA SIMULAÇÃO ---


// --- 💡 DEFINIÇÃO DE TIPOS ---
interface AuthUser {
  name: string;
  email: string;
  avatarUrl?: string;
  readingGoal?: number; 
}
interface AuthContextData {
  user: AuthUser | null;
  logout: () => void;
  updateUser: (newData: Partial<AuthUser>) => void;
  requestEmailChange: (newEmail: string) => Promise<void>;
}
// Cria um wrapper para usar o contexto JS de forma tipada
const useAuth = (): AuthContextData => useAuthJS() as AuthContextData;

type AppStackParamList = {
  MainTabs: undefined;
  BookDetail: { bookId: string };
  BookForm: { bookId?: string };
  Notifications: undefined;
  Privacy: undefined;
};
type ProfileScreenNavigationProp = NativeStackNavigationProp<AppStackParamList>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

interface MenuItemProps {
  icon: string;
  text: string;
  onPress: () => void;
  hasArrow?: boolean;
  isDestructive?: boolean;
}

interface GenreTagProps {
  text: string;
}
// --- FIM DOS TIPOS ---


// --- Componente Reutilizável: MenuItem ---
const MenuItem: React.FC<MenuItemProps> = ({
  icon, text, onPress, hasArrow = false, isDestructive = false
}) => {
  const textColor = isDestructive ? theme.colors.destructive : theme.colors.foreground;
  const iconColor = isDestructive ? theme.colors.destructive : theme.colors.primary; 

  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <Feather name={icon as any} size={20} color={iconColor} />
      </View>
      <Text style={[styles.menuText, { color: textColor }]}>{text}</Text>
      {hasArrow && (
        <Feather name="chevron-right" size={20} color={theme.colors.mutedForeground} />
      )}
    </TouchableOpacity>
  );
};

// --- Componente Reutilizável: GenreTag ---
const GenreTag: React.FC<GenreTagProps> = ({ text }) => (
  <View style={styles.genreTag}>
    <Text style={styles.genreTagText}>{text}</Text>
  </View>
);


// --- COMPONENTE PRINCIPAL: TELA DE PERFIL ---
export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isNotificationsModalVisible, setNotificationsModalVisible] = useState(false);
  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    isEnabled: true, allowNewBooks: true, allowReminders: true, allowGoalProgress: true,
  });
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    isPublic: false, // Padrão é privado
  });

  const { user, logout, updateUser, requestEmailChange } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // 💡 CORREÇÃO: Removido 'Notifications' e 'Privacy' de 'goTo'
  const goTo = (screen: 'MainTabs') => { // Você pode adicionar outras telas aqui se precisar
    navigation.navigate(screen);
  };

  // 💡 Adaptação da função de salvar para usar os tipos corretos
  const handleSaveProfile = async (data: Partial<AuthUser>) => {
    if (!user) return; 

    if (data.email && data.email !== user.email) {
      const { email, ...otherData } = data;
      updateUser(otherData);
      try {
        await requestEmailChange(email);
        Alert.alert(
          "Confirmação Pendente",
          `Enviamos um link de confirmação para o seu e-mail antigo (${user.email}) para aprovar a mudança.`
        );
      } catch (error) {
        Alert.alert("Erro", "Não foi possível iniciar a alteração de e-mail.");
      }
    } else {
      updateUser(data);
      Alert.alert("Sucesso", "Perfil atualizado!");
    }
    
    setModalVisible(false);
  };

  const handleSaveNotifications = (settings: NotificationSettings) => {
    setNotificationSettings(settings);
    console.log("Salvando configurações de notificação:", settings);
    setNotificationsModalVisible(false); 
  };

  const handleSavePrivacy = (settings: PrivacySettings) => {
    setPrivacySettings(settings);
    console.log("Salvando configurações de privacidade:", settings);
    setPrivacyModalVisible(false); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Header (Bloco Verde Curvo) */}
        <View style={styles.headerBlock}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <Text style={styles.headerSubtitle}>Gerencie suas informações</Text>
        </View>

        {/* 2. Card de Informações do Usuário (Flutuante e separado) */}
        <View style={styles.profileCard}> 
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: user?.avatarUrl || 'https://i.pravatar.cc/150?img=12' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraIcon}>
              <Feather name="camera" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{user?.name || 'Leitor'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'leitor@app.com'}</Text>

          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => setModalVisible(true)}
          >
            <Feather name="edit-3" size={16} color={theme.colors.primaryForeground} />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Card de Preferências de Leitura */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferências de Leitura</Text>
          
          <View style={styles.prefItem}>
            <View style={styles.prefItemText}>
              <Text style={styles.prefTitle}>Meta de Leitura Anual</Text>
              <Text style={styles.prefSubtitle}>Defina quantos livros você pretende ler este ano</Text>
            </View>
            <Text style={styles.prefValue}>{user?.readingGoal || 12} livros</Text>
          </View>

          <View style={[styles.prefItem, { borderBottomWidth: 0 }]}>
            <View style={styles.prefItemText}>
              <Text style={styles.prefTitle}>Gêneros Favoritos</Text>
            </View>
          </View>
          <View style={styles.tagsContainer}>
            <GenreTag text="Ficção" />
            <GenreTag text="Fantasia" />
          </View>
        </View>

        {/* 4. Card de Configurações */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Configurações</Text>
          <MenuItem
            icon="bell"
            text="Notificações"
            hasArrow
            onPress={() => setNotificationsModalVisible(true)} 
          />
          <MenuItem
            icon="shield"
            text="Privacidade"
            hasArrow
            onPress={() => setPrivacyModalVisible(true)} 
          />
          <MenuItem
            icon="log-out"
            text="Sair"
            isDestructive
            onPress={handleLogout}
          />
        </View>
        
        <View style={{ height: theme.spacing[8] }} />
      </ScrollView>

      {/* 💡 Adaptação do Modal para usar os tipos do AuthUser */}
      <EditProfileModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveProfile}
        // O tipo de currentUser precisa ser o AuthUser para o modal funcionar
        currentUser={user as any} 
      />

      <NotificationsModal
        visible={isNotificationsModalVisible}
        onClose={() => setNotificationsModalVisible(false)}
        onSave={handleSaveNotifications}
        currentSettings={notificationSettings}
      />

      <PrivacyModal
        visible={isPrivacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
        onSave={handleSavePrivacy}
        currentSettings={privacySettings}
      />
    </SafeAreaView>
  );
}

// --- 💡 Tipagem dos Estilos (CORRIGIDA) ---
type Styles = {
  safeArea: ViewStyle;
  scrollContent: ViewStyle;
  headerBlock: ViewStyle;
  headerTitle: TextStyle;
  headerSubtitle: TextStyle;
  card: ViewStyle;
  profileCard: ViewStyle;
  avatarWrapper: ViewStyle;
  avatar: ImageStyle;
  cameraIcon: ViewStyle;
  userName: TextStyle;
  userEmail: TextStyle;
  editButton: ViewStyle;
  editButtonText: TextStyle;
  cardTitle: TextStyle;
  prefItem: ViewStyle;
  prefItemText: ViewStyle;
  prefTitle: TextStyle;
  prefSubtitle: TextStyle;
  prefValue: TextStyle;
  tagsContainer: ViewStyle;
  genreTag: ViewStyle;
  genreTagText: TextStyle;
  menuItem: ViewStyle;
  menuIconContainer: ViewStyle;
  menuText: TextStyle;
};

// --- ESTILOS (CORRIGIDOS) ---
const styles = StyleSheet.create<Styles>({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background, 
  },
  scrollContent: {
    paddingBottom: theme.spacing['8'], 
  },
  headerBlock: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing['6'],
    paddingBottom: theme.spacing['8'], 
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    marginHorizontal: 0, 
    marginBottom: theme.spacing['6'], 
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.primaryForeground,
  },
  headerSubtitle: {
    ...theme.typography.small,
    color: theme.colors.primaryForeground,
    opacity: 0.8,
    marginTop: theme.spacing['1'],
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing['5'],
    marginBottom: theme.spacing['4'],
    ...theme.shadows.sm,
    marginHorizontal: theme.spacing['4'], 
  },
  profileCard: {
    marginTop: - (96 / 2) - theme.spacing['6'], 
    alignItems: 'center',
    backgroundColor: theme.colors.card, 
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing['5'],
    marginBottom: theme.spacing['4'],
    ...theme.shadows.sm,
    marginHorizontal: theme.spacing['4'], 
    zIndex: 1, 
  },
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.foreground,
    marginBottom: theme.spacing['3'],
  },
  avatarWrapper: {
    position: 'relative',
    marginTop: - (96 / 2), 
    marginBottom: theme.spacing['3'],
    zIndex: 2, 
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: theme.borderRadius.full,
    borderWidth: 3,
    borderColor: theme.colors.card, 
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing['2'],
    ...theme.shadows.sm,
    zIndex: 3, 
  },
  userName: {
    ...theme.typography.h2,
    color: theme.colors.foreground,
  },
  userEmail: {
    ...theme.typography.small,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing['4'],
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing['3'],
    paddingHorizontal: theme.spacing['5'],
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  editButtonText: {
    ...theme.typography.body,
    color: theme.colors.primaryForeground,
    fontWeight: '600',
    marginLeft: theme.spacing['2'],
  },
  prefItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  prefItemText: {
    flex: 1,
  },
  prefTitle: {
    ...theme.typography.body,
    color: theme.colors.foreground,
    fontWeight: '500',
  },
  prefSubtitle: {
    ...theme.typography.small,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing['1'],
  },
  prefValue: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: theme.spacing['2'],
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing['2'],
  },
  genreTag: {
    backgroundColor: theme.colors.secondaryLight,
    paddingHorizontal: theme.spacing['3'],
    paddingVertical: theme.spacing['1'],
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing['2'],
    marginBottom: theme.spacing['2'],
  },
  genreTagText: {
    color: theme.colors.secondary,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing['3'],
  },
  menuIconContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: theme.spacing['3'],
  },
  menuText: {
    ...theme.typography.body,
    flex: 1,
    fontWeight: '500',
  },
});
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

// 🚀 IMPORTAÇÃO DO CONTEXTO DE AUTENTICAÇÃO
import { useAuth } from './context/AuthContext'; 

// Simulação da importação do seu arquivo theme/index.js
// --- SIMULAÇÃO DO THEME (Mantido) ---
const Theme = {
    colors: {
        primary: '#10B981', // Verde
        primaryForeground: '#FFFFFF',
        mutedForeground: '#717182',
        foreground: '#1C1C1E',
        background: '#FFFFFF',
        card: '#F9FAFB',
        border: '#E5E7EB',
        destructive: '#EF4444', // Vermelho para 'Sair'
    },
    spacing: {
        '1': 4, '2': 8, '3': 12, '4': 16, '6': 24, '8': 32, '10': 40
    },
    typography: {
        h1: { fontSize: 28, fontWeight: 'bold' },
        subtitle: { fontSize: 16, color: '#717182' },
        xs: { fontSize: 12 }, // Adicionado para simular tipografia de NavBar
    },
    borderRadius: {
        'lg': 12, 'xl': 20,
    }
};
// --- FIM DA SIMULAÇÃO DO THEME ---

const { colors, spacing, typography } = Theme;

// --- Componente NavBar (Mantido) ---
// NOTA: A NavBar aqui é uma implementação manual e pode interferir com a BottomTabNavigator
// Se houver dois NavBars (um aqui e um do React Navigation), remova o manual.
const NavBar = ({ navigation }) => {
    // Esta NavBar é para simulação, mas o App real usa o Tab.Navigator
    const navItems = [
        { name: 'Início', icon: 'home-outline', isCurrent: false, screen: 'HomeTab' }, 
        { name: 'Livros', icon: 'book-outline', isCurrent: false, screen: 'BooksTab' }, 
        { name: 'Perfil', icon: 'person', isCurrent: true, screen: 'ProfileTab' }, 
    ];

    const navigateTo = (screenName) => {
        if (navigation) {
             // O navigation.navigate() dentro de uma tela de Tab irá alternar a Tab
            navigation.navigate(screenName); 
        }
    };

    // ... (restante da NavBar, estilos...)
    return (
        <View style={styles.navBar}>
            {navItems.map(item => (
                <TouchableOpacity 
                    key={item.name} 
                    style={styles.navBarItem} 
                    // Correção: Usar o nome correto da rota da aba
                    onPress={() => navigateTo(item.screen)} 
                >
                    <Ionicons 
                        name={item.isCurrent ? item.icon.replace('-outline', '') : item.icon} 
                        size={24} 
                        color={item.isCurrent ? colors.primary : colors.mutedForeground} 
                    />
                    <Text 
                        style={[
                            styles.navBarText, // Usando um estilo base mais seguro
                            { 
                                color: item.isCurrent ? colors.primary : colors.mutedForeground,
                                fontWeight: item.isCurrent ? '600' : '400',
                            }
                        ]}
                    >
                        {item.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};


// --- Componente MenuItem (REVISADO para aceitar onPress) ---
const MenuItem = ({ text, isDestructive = false, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={!onPress}>
    <Text style={[
      styles.menuItemText,
      isDestructive && { color: colors.destructive, fontWeight: '500' }
    ]}>
      {text}
    </Text>
  </TouchableOpacity>
);

// --- Componentes Auxiliares (Mock) ---
const GenreTag = ({ text }) => (
    <View style={styles.genreTag}>
        <Text style={styles.genreTagText}>{text}</Text>
    </View>
);

// --- Componente Principal (REVISADO) ---
const ProfileScreen = ({ navigation }) => {
    // 💡 1. Usa o AuthContext para obter o usuário e a função de logout
    const { user, logout } = useAuth();
    
    // 💡 2. Conecta a função de logout do contexto
    const handleLogout = () => {
        // Chama a função de logout do contexto, que gerencia o estado isLoggedIn
        logout(); 
        // O restante da navegação (voltar para a tela de Login) é tratado automaticamente
        // no App.js quando o isLoggedIn muda para false.
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* 1. Header do Perfil (Bloco Verde) */}
      <View style={styles.headerBlock}>
        <Text style={styles.headerTitle}>Perfil</Text>
        <Text style={styles.headerSubtitle}>Gerencie suas informações</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        <View style={{ marginTop: spacing['4'] }}> 

          {/* Bloco de Informações do Usuário (Card 1) */}
          <View style={styles.card}>
            <View style={styles.profileInfoContainer}>
              <View style={styles.avatarWrapper}>
                <Image 
                  source={{ uri: 'https://via.placeholder.com/96' }} 
                  style={styles.avatar} 
                />
                <View style={styles.cameraIcon}>
                  <Text style={styles.cameraIconText}>📷</Text> 
                </View>
              </View>
              {/* 💡 EXIBIÇÃO DINÂMICA DO NOME E E-MAIL */}
              <Text style={styles.userName}>{user ? user.name : 'Carregando...'}</Text>
              <Text style={styles.userEmail}>{user ? user.email : 'usuario@shelfly.com'}</Text>

              {/* Botão Editar Perfil */}
              <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>📝 Editar Perfil</Text> 
              </TouchableOpacity>
            </View>
          </View>

          {/* Bloco de Preferências de Leitura (Card 2) */}
          {/* ... (Conteúdo inalterado) ... */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Preferências de Leitura</Text>
            
            <View style={styles.readingGoalRow}>
              <View style={{ flexShrink: 1 }}>
                <Text style={styles.bodyText}>Meta de Leitura Anual</Text>
                <Text style={styles.smallText}>Defina quantos livros você pretende ler este ano</Text>
              </View>
              <Text style={styles.goalValue}>24 livros</Text>
            </View>

            <Text style={[styles.bodyText, { marginTop: spacing['4'] }]}>Gêneros Favoritos</Text>
            <View style={styles.genresContainer}>
              <GenreTag text="Ficção" />
              <GenreTag text="Mistério" />
            </View>
          </View>


          {/* Bloco de Configurações (Card 3) */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Configurações</Text>
            <MenuItem text="Notificações" />
            <MenuItem text="Privacidade" />
            <MenuItem text="Sobre o Shelfly" />
            
            {/* ITEM SAIR (AGORA CHAMA A FUNÇÃO DE LOGOUT DO CONTEXTO) */}
            <MenuItem 
                text="→ Sair" 
                isDestructive={true} 
                onPress={handleLogout} // ⬅️ Conectado ao contexto
            /> 
            
          </View>
          
          <View style={{ height: spacing['8'] }} /> 

        </View>
      </ScrollView>

      {/* 🚀 3. BARRA DE NAVEGAÇÃO/FOOTER */}
      {/* Se a BottomTabNavigator já estiver sendo usada, remova a NavBar manual abaixo */}
      {/* <NavBar navigation={navigation} /> */}
      
    </SafeAreaView>
  );
};

// --- ESTILOS (Ajustados/Completados para o código) ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerBlock: {
        backgroundColor: colors.primary,
        padding: spacing['6'],
        paddingBottom: spacing['8'],
    },
    headerTitle: {
        fontSize: typography.h1.fontSize,
        fontWeight: typography.h1.fontWeight,
        color: colors.primaryForeground,
    },
    headerSubtitle: {
        fontSize: typography.subtitle.fontSize,
        color: colors.primaryForeground,
        opacity: 0.8,
        marginTop: spacing['1'],
    },
    scrollContent: {
        paddingHorizontal: spacing['4'],
        // O card deve cobrir a parte de baixo do header
        marginTop: -spacing['4'], 
    },
    card: {
        backgroundColor: colors.background,
        borderRadius: Theme.borderRadius.lg,
        padding: spacing['6'],
        marginVertical: spacing['2'],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1,
        borderColor: colors.border,
    },
    profileInfoContainer: {
        alignItems: 'center',
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: spacing['4'],
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 3,
        borderColor: colors.primary,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primaryForeground,
        borderRadius: 15,
        padding: 5,
        borderWidth: 2,
        borderColor: colors.border,
    },
    cameraIconText: { fontSize: 16 },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.foreground,
    },
    userEmail: {
        fontSize: 14,
        color: colors.mutedForeground,
        marginBottom: spacing['4'],
    },
    editButton: {
        backgroundColor: colors.card,
        paddingVertical: spacing['2'],
        paddingHorizontal: spacing['4'],
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    editButtonText: {
        color: colors.foreground,
        fontWeight: '600',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.foreground,
        marginBottom: spacing['3'],
    },
    readingGoalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing['3'],
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    bodyText: { fontSize: 16, color: colors.foreground },
    smallText: { fontSize: 12, color: colors.mutedForeground },
    goalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: spacing['2'],
    },
    genreTag: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing['3'],
        paddingVertical: spacing['1'],
        borderRadius: Theme.borderRadius.lg,
        marginRight: spacing['2'],
        marginBottom: spacing['2'],
    },
    genreTagText: {
        color: colors.primaryForeground,
        fontSize: 14,
        fontWeight: '600',
    },
    menuItem: {
        paddingVertical: spacing['3'],
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuItemText: {
        fontSize: 16,
        color: colors.foreground,
    },
    // Estilos da NavBar manual (se ainda estiver sendo usada)
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: spacing['2'],
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    },
    navBarItem: {
        alignItems: 'center',
    },
    navBarText: { // Estilo base para os textos da NavBar
        fontSize: 12, 
        marginTop: 2 
    }
});

export default ProfileScreen;
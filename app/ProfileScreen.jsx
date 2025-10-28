import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';

// Simulação da importação do seu arquivo theme/index.js
// Em seu projeto, substitua este bloco pela importação real:
// import Theme from './theme/index'; 
const Theme = {
  colors: {
    primary: '#0F766E',
    primaryForeground: '#FFFFFF',
    accent: '#FB923C',
    accentForeground: '#FFFFFF',
    background: '#FFFFFF',
    foreground: '#1C1C1E',
    card: '#FFFFFF',
    cardForeground: '#1C1C1E',
    muted: '#ECECF0',
    mutedForeground: '#717182',
    destructive: '#D4183D', // Cor vermelha para "Sair"
    border: 'rgba(0,0,0,0.1)',
  },
  spacing: {
    0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24,
    7: 28, 8: 32, 10: 40, 12: 48, 16: 64, 20: 80, 24: 96,
  },
  typography: {
    h2: { fontSize: 20, fontWeight: '500', lineHeight: 30 },
    h3: { fontSize: 18, fontWeight: '500', lineHeight: 27 },
    h4: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
    body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    small: { fontSize: 14, fontWeight: '400', lineHeight: 21 },
    button: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
  },
};

const { colors, spacing, typography } = Theme;


// --- Componentes Reutilizáveis ---

/**
 * Componente para os itens de menu na seção Configurações.
 */
const MenuItem = ({ text, isDestructive = false }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Text style={[
      styles.menuItemText,
      // Se for destrutivo (Sair), usa a cor vermelha e negrito
      isDestructive && { color: colors.destructive, fontWeight: '500' }
    ]}>
      {text}
    </Text>
  </TouchableOpacity>
);

/**
 * Componente para o rótulo (tag) dos Gêneros Favoritos.
 */
const GenreTag = ({ text }) => (
  <View style={styles.genreTag}>
    <Text style={styles.genreTagText}>{text}</Text>
  </View>
);

// --- Tela Principal ---

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Bloco do Header de Perfil (Topo Verde) */}
        <View style={styles.headerBlock}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <Text style={styles.headerSubtitle}>Gerencie suas informações</Text>
        </View>
        
        {/* Envolve os cards para aplicar margem superior */}
        <View style={{ marginTop: spacing[4] }}> 

          {/* Bloco de Informações do Usuário (Card 1) */}
          <View style={styles.card}>
            <View style={styles.profileInfoContainer}>
              <View style={styles.avatarWrapper}>
                {/* Avatar da Maria Silva */}
                <Image 
                  source={{ uri: 'https://via.placeholder.com/96' }} // Placeholder
                  style={styles.avatar} 
                />
                {/* Ícone de câmera para mudar a foto */}
                <View style={styles.cameraIcon}>
                  <Text style={styles.cameraIconText}>📷</Text> 
                </View>
              </View>
              <Text style={styles.userName}>Maria Silva</Text>
              <Text style={styles.userEmail}>maria@example.com</Text>

              {/* Botão Editar Perfil */}
              <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>📝 Editar Perfil</Text> 
              </TouchableOpacity>
            </View>
          </View>

          {/* Bloco de Preferências de Leitura (Card 2) */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Preferências de Leitura</Text>
            
            {/* Meta de Leitura Anual */}
            <View style={styles.readingGoalRow}>
              <View style={{ flexShrink: 1 }}>
                <Text style={styles.bodyText}>Meta de Leitura Anual</Text>
                <Text style={styles.smallText}>Defina quantos livros você pretende ler este ano</Text>
              </View>
              <Text style={styles.goalValue}>24 livros</Text>
            </View>

            {/* Gêneros Favoritos */}
            <Text style={[styles.bodyText, { marginTop: spacing[4] }]}>Gêneros Favoritos</Text>
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
            
            {/* ITEM SAIR (com isDestructive=true) */}
            <MenuItem text="→ Sair" isDestructive={true} /> 
            
          </View>

        </View>

      </View>
    </SafeAreaView>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header do Perfil (Bloco Verde)
  headerBlock: {
    backgroundColor: colors.primary,
    padding: spacing[4],
  },
  headerTitle: {
    ...typography.h2,
    color: colors.primaryForeground,
    marginTop: spacing[4],
  },
  headerSubtitle: {
    ...typography.small,
    color: colors.primaryForeground,
    opacity: 0.8,
  },

  // Cartões (Blocos Brancos)
  card: {
    backgroundColor: colors.card,
    marginHorizontal: spacing[4], // Espaçamento lateral
    padding: spacing[4],
    borderRadius: 0, 
    marginBottom: spacing[4],
    // Simulação da sombra 'md' do seu tema
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 2,
  },
  
  // Informações do Usuário
  profileInfoContainer: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing[4],
  },
  avatar: {
    width: spacing[24], // 96px
    height: spacing[24], 
    borderRadius: spacing[12], 
    backgroundColor: colors.muted, 
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.background,
    borderRadius: spacing[3], 
    padding: spacing[1], 
    borderWidth: 1,
    borderColor: colors.border,
  },
  cameraIconText: {
    fontSize: typography.small.fontSize,
  },
  userName: {
    ...typography.h3,
    color: colors.foreground,
    marginBottom: spacing[1],
  },
  userEmail: {
    ...typography.body,
    color: colors.mutedForeground,
    marginBottom: spacing[4],
  },

  // Botão Editar Perfil
  editButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: 0, 
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  editButtonText: {
    ...typography.button,
    color: colors.primaryForeground,
  },

  // Título das Seções (Preferências, Configurações)
  sectionTitle: {
    ...typography.h4,
    color: colors.cardForeground,
    marginBottom: spacing[4],
    fontWeight: '500',
  },

  // Meta de Leitura
  readingGoalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[1],
  },
  bodyText: {
    ...typography.body,
    color: colors.cardForeground,
  },
  smallText: {
    ...typography.small,
    color: colors.mutedForeground,
  },
  goalValue: {
    ...typography.body,
    color: colors.primary, 
    fontWeight: '500',
    marginLeft: spacing[4], 
  },

  // Gêneros
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing[2],
  },
  genreTag: {
    backgroundColor: colors.muted,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderRadius: spacing[1], 
    marginRight: spacing[2],
    marginBottom: spacing[2], 
  },
  genreTagText: {
    ...typography.small,
    color: colors.mutedForeground,
    fontWeight: '500',
  },

  // Itens de Menu (Configurações)
  menuItem: {
    paddingVertical: spacing[3], // Garante espaçamento entre os itens
  },
  menuItemText: {
    ...typography.body,
    color: colors.cardForeground,
  },
});

export default ProfileScreen;
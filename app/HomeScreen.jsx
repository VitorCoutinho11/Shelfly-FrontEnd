import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import Theme from '../theme/index.js';
// Não estou importando BookCard pois a seção "Tendências" foi substituída pelas estatísticas
// import BookCard from '../components/BookCard/index.jsx';

const { colors, spacing, typography, borderRadius } = {
  ...Theme,
  colors: {
      ...Theme.colors,
      // Cores para os cards de estatísticas (ajustadas para o visual)
      statCardBg: Theme.colors.card || '#FFFFFF',
      // Cores do gênero mais lido
      genreBg: '#D1FAE5', // Um verde claro similar ao usado
      genreText: '#047857', // Um verde escuro
      // Cor de destaque para o Header
      headerBg: '#4C8C80', // Cor de fundo do Header (verde escuro)
      headerText: '#FFFFFF',
      
      // Cores dos ícones (Feather/Lucide original no seu tema seria:
      // blue, yellow, purple, green
      icon1: '#60A5FA', // Total de Livros
      icon2: '#10B981', // Livros Finalizados
      icon3: '#FCD34D', // Média de Avaliação
      icon4: '#A78BFA', // Lendo Agora
  },
  spacing: Theme.spacing || { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 },
  typography: Theme.typography || { body: { fontSize: 16 }, h2: { fontSize: 24 }, h3: { fontSize: 20 }, small: { fontSize: 14 } }
};

// --- Mocks de Dados da Tela ---
const userStats = {
    totalBooks: 5,
    finishedBooks: 3,
    averageRating: 4.7,
    readingNow: 1,
    mostReadGenre: 'Fantasia',
    mostReadGenreCount: 1,
};

// --- Componente de Card de Estatística (pequeno) ---
const StatCard = ({ title, value, iconEmoji, iconColor, iconBgColor }) => (
    <View style={stylesLocal.statCard}>
        <View style={[stylesLocal.statIcon, { backgroundColor: iconBgColor, borderColor: iconColor, borderWidth: 1 }]}>
            <Text style={[stylesLocal.statIconEmoji, { fontSize: 20 }]}>{iconEmoji}</Text>
        </View>
        <Text style={stylesLocal.statValue}>{value}</Text>
        <Text style={stylesLocal.statTitle}>{title}</Text>
    </View>
);

// --- Componente Principal ---
export default function HomeScreen(){
    const { totalBooks, finishedBooks, averageRating, readingNow, mostReadGenre, mostReadGenreCount } = userStats;
    
    return (
        <ScrollView style={styles.container}>
            
            {/* Header com Avatar e Saudação */}
            <View style={stylesLocal.header}>
                <View style={stylesLocal.headerContent}>
                    {/* Imagem do Avatar (mock) */}
                    <Image 
                        source={{ uri: 'https://picsum.photos/60/60?random=1' }} 
                        style={stylesLocal.avatar} 
                    />
                    <View style={stylesLocal.headerTextContainer}>
                        <Text style={stylesLocal.welcome}>Olá, Maria!</Text>
                        <Text style={stylesLocal.subtitle}>Bem-vindo de volta</Text>
                    </View>
                </View>
            </View>

            {/* Grid de Estatísticas (Row 1) */}
            <View style={stylesLocal.statsGrid}>
                <StatCard 
                    title="Total de Livros" 
                    value={totalBooks} 
                    iconEmoji="📚" 
                    iconColor={colors.icon1}
                    iconBgColor={colors.icon1 + '20'} // Cor com transparência
                />
                <StatCard 
                    title="Livros Finalizados" 
                    value={finishedBooks} 
                    iconEmoji="🧑‍🤝‍🧑" // Usando um emoji simples para 'parceiro' ou 'meta'
                    iconColor={colors.icon2}
                    iconBgColor={colors.icon2 + '20'}
                />
            </View>
            
            {/* Grid de Estatísticas (Row 2) */}
            <View style={stylesLocal.statsGrid}>
                <StatCard 
                    title="Média de Avaliação" 
                    value={averageRating} 
                    iconEmoji="⭐" 
                    iconColor={colors.icon3}
                    iconBgColor={colors.icon3 + '20'}
                />
                <StatCard 
                    title="Lendo Agora" 
                    value={readingNow} 
                    iconEmoji="📈" // Usando emoji para 'Gráfico de Crescimento' (similar a flecha)
                    iconColor={colors.icon4}
                    iconBgColor={colors.icon4 + '20'}
                />
            </View>

            {/* --- Seção Gênero Mais Lido --- */}
            <View style={stylesLocal.section}>
                <Text style={stylesLocal.sectionTitle}>Gênero Mais Lido</Text>
                <View style={stylesLocal.genreCard}>
                    <Text style={stylesLocal.genreText}>{mostReadGenre}</Text>
                    <Text style={stylesLocal.genreSubtitle}>{mostReadGenreCount} livro</Text>
                </View>
            </View>

            {/* --- Seção Histórico de Leituras --- */}
            <View style={stylesLocal.section}>
                <Text style={stylesLocal.sectionTitle}>Histórico de Leituras</Text>
                {/* Mock para o Gráfico - Um View simples para simular a área do gráfico */}
                <View style={stylesLocal.chartMock}>
                    <Text style={stylesLocal.chartLabel}>[Simulação de Gráfico]</Text>
                </View>
            </View>
            
            <View style={{ height: spacing[8] }} /> {/* Espaço no final */}
        </ScrollView>
    );
}

// --- ESTILOS ESPECÍFICOS DA HOMESCREEN ---
const stylesLocal = StyleSheet.create({
    header: { 
        backgroundColor: colors.headerBg, 
        paddingHorizontal: spacing[4], 
        paddingVertical: spacing[8],
        // Adiciona um arredondamento suave na parte inferior (opcional, para visual)
        borderBottomLeftRadius: spacing[6], 
        borderBottomRightRadius: spacing[6],
        marginBottom: spacing[4],
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: spacing[4],
        borderWidth: 2,
        borderColor: colors.headerText, // Borda branca no avatar
    },
    headerTextContainer: {
        justifyContent: 'center',
    },
    welcome: { 
        fontSize: typography.h3.fontSize, 
        fontWeight: '600', 
        color: colors.headerText,
        marginBottom: spacing[1],
    },
    subtitle: { 
        color: colors.headerText + 'AA', // Um pouco mais transparente
        ...typography.body,
    },
    
    // --- Grid de Estatísticas ---
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[4],
        marginBottom: spacing[3],
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.statCardBg,
        borderRadius: spacing[3],
        padding: spacing[4],
        marginHorizontal: spacing[2],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing[3],
    },
    statIconEmoji: {
        fontSize: 20,
    },
    statValue: {
        fontSize: typography.h2.fontSize,
        fontWeight: 'bold',
        color: colors.foreground,
        marginBottom: spacing[1],
    },
    statTitle: {
        ...typography.small,
        color: colors.mutedForeground,
    },

    // --- Seções Gerais ---
    section: { 
        marginTop: spacing[4], 
        paddingHorizontal: spacing[4] 
    },
    sectionTitle: { 
        fontSize: typography.h3.fontSize, 
        fontWeight: '600', 
        marginBottom: spacing[3],
        color: colors.foreground,
    },

    // --- Gênero Mais Lido ---
    genreCard: {
        backgroundColor: colors.genreBg,
        borderRadius: spacing[3],
        padding: spacing[4],
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 80,
    },
    genreText: {
        fontSize: typography.body.fontSize,
        fontWeight: '600',
        color: colors.genreText,
    },
    genreSubtitle: {
        ...typography.small,
        color: colors.genreText,
        opacity: 0.8,
        marginTop: spacing[1],
    },

    // --- Histórico de Leituras (Mock) ---
    chartMock: {
        backgroundColor: colors.card,
        borderRadius: spacing[3],
        height: 200, // Altura fixa para simular o gráfico
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    chartLabel: {
        color: colors.mutedForeground,
        ...typography.body,
    },
});

// Mantendo seus estilos originais para o container
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: Theme.colors.background },
});
import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
// Assumindo que o arquivo de tema está em '../theme/index.js'
import Theme, { colors, spacing, typography, borderRadius, shadows } from '../theme/index'; 

import Feather from 'react-native-vector-icons/Feather';

// --- MOCK de Dados para a Home (conforme imagem) ---
const userStats = {
    userName: "chatgpt!",
    avatarUrl: "https://i.pravatar.cc/150?img=47", 
    stats: [
        { icon: 'book-open', value: 5, label: "Total de Livros", iconBg: '#d7e4fd', iconColor: '#1D4ED8' },
        { icon: 'check-square', value: 3, label: "Livros Finalizados", iconBg: '#c9f9e8', iconColor: '#047857' },
        { icon: 'star', value: 4.7, label: "Média de Avaliação", iconBg: '#fff8d6', iconColor: '#A16207' },
        { icon: 'trending-up', value: 1, label: "Lendo Agora", iconBg: '#fbe8ff', iconColor: '#86198F' },
    ],
    mostReadGenre: { name: 'Fantasia', count: 1 },
    readingHistoryLabels: ['jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.'],
};


// 💡 Componente de Cartão de Estatística
const StatCard = ({ icon, value, label, iconBg, iconColor }) => (
    <View style={styles.statCard}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
            <Feather name={icon} size={20} color={iconColor} />
        </View>
        <Text style={[typography.h2, { color: colors.foreground, marginTop: spacing[1] }]}>{value}</Text>
        <Text style={[typography.small, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
);

// 💡 Gráfico Simplificado (Placeholder)
const ReadingHistoryChart = () => (
    <View style={styles.chartPlaceholder}>
        {/* Linhas do grid */}
        <View style={[styles.chartGridLine, { top: '25%' }]} />
        <View style={[styles.chartGridLine, { top: '50%' }]} />
        <View style={[styles.chartGridLine, { top: '75%' }]} />

        {/* Labels do eixo X */}
        <View style={styles.chartXAxisLabels}>
            {userStats.readingHistoryLabels.map(month => (
                <Text key={month} style={[typography.xs, { color: colors.mutedForeground }]}>{month}</Text>
            ))}
        </View>
    </View>
);


// 💡 Componente Principal
export default function HomeScreen({ navigation }) { 
    return (
        <SafeAreaView style={styles.safeArea}>
            {/* O status bar agora usa o tema do header */}
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
            
            {/* Header (com a cor primary) */}
            <View style={styles.header}>
                <Image 
                    source={{ uri: userStats.avatarUrl }} 
                    style={styles.avatar} 
                />
                <View>
                    <Text style={[typography.body, { color: colors.primaryForeground, fontWeight: '500' }]}>Olá, {userStats.userName}</Text>
                    <Text style={[typography.small, { color: colors.primaryForeground }]}>Bem-vindo de volta</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContentContainer}>
                
                {/* Estatísticas (Grid) */}
                <View style={styles.statsGrid}>
                    {userStats.stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </View>

                {/* Gênero Mais Lido */}
                <View style={styles.sectionContainer}>
                    <Text style={[typography.label, styles.sectionTitle]}>Gênero Mais Lido</Text>
                    <View style={styles.genreCard}>
                        <Text style={[typography.body, styles.genreName]}>{userStats.mostReadGenre.name}</Text>
                        <Text style={[typography.small, styles.genreCount]}>{userStats.mostReadGenre.count} livro</Text>
                    </View>
                </View>

                {/* Histórico de Leituras */}
                <View style={styles.sectionContainer}>
                    <Text style={[typography.label, styles.sectionTitle]}>Histórico de Leituras</Text>
                    <View style={styles.chartCard}>
                        <ReadingHistoryChart />
                    </View>
                </View>

                {/* Espaço no final para garantir que o scroll não esbarre na TabBar nativa */}
                <View style={{ height: spacing[10] }} /> 
            </ScrollView>

            {/* 🛑 A NavBar CUSTOMIZADA FOI REMOVIDA. A barra de abas será renderizada pelo MainTabNavigator. */}
        </SafeAreaView>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background, 
    },
    header: {
        backgroundColor: colors.primary, 
        padding: spacing[4],
        paddingTop: spacing[7], 
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomLeftRadius: borderRadius['xl'], 
        borderBottomRightRadius: borderRadius['xl'],
        marginBottom: spacing[4], 
    },
    scrollContentContainer: {
        paddingHorizontal: spacing[4],
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: borderRadius.full,
        marginRight: spacing[3],
        borderWidth: 2,
        borderColor: colors.primaryForeground,
        backgroundColor: colors.muted, 
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: spacing[6],
    },
    statCard: {
        width: '48%', 
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing[4],
        marginBottom: spacing[3],
        ...shadows.sm, 
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.sm, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionContainer: {
        marginBottom: spacing[6],
    },
    sectionTitle: {
        color: colors.foreground, 
        marginBottom: spacing[3]
    },
    genreCard: {
        backgroundColor: colors.statusReadBg || '#F0FDF4', // Mock de cor de fundo claro
        padding: spacing[4],
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    genreName: {
        color: colors.primary, 
        fontWeight: '500'
    },
    genreCount: {
        color: colors.mutedForeground 
    },
    chartCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing[4],
        ...shadows.sm,
    },
    // Estilos do Gráfico
    chartPlaceholder: {
        height: 150, 
        justifyContent: 'flex-end', 
        paddingBottom: spacing[2],
        position: 'relative',
    },
    chartGridLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
    },
    chartXAxisLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[1],
        marginTop: spacing[2], 
    },
});
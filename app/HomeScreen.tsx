import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  StatusBar,
  ViewStyle, 
  TextStyle, 
  ImageStyle,
  Animated, 
  ActivityIndicator,
  Dimensions 
} from 'react-native';

// 💡 Importação do AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// 💡 Importando tipos de navegação
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import Feather from 'react-native-vector-icons/Feather';

// ------------------------------------------
// --- DEFINIÇÃO DE TIPOS E TEMA (MANTIDO) ---
// ------------------------------------------

interface ThemeColors {
  background: string;
  card: string;
  primary: string;
  primaryForeground: string;
  foreground: string;
  mutedForeground: string;
  border: string;
  muted: string;
  statusReadBg: string; 
  [key: string]: string; 
}

interface ThemeSpacing {
  [key: string]: number;
}

interface TypographyStyle {
  fontSize: number;
  fontWeight?: 'normal' | 'bold' | '500' | '600' | '700' | '100' | '200' | '300' | '400' | '800' | '900';
}

interface ThemeTypography {
  h2: TypographyStyle;
  small: TypographyStyle;
  xs: TypographyStyle;
  body: TypographyStyle;
  label: TypographyStyle;
  [key: string]: TypographyStyle;
}

interface ThemeBorderRadius {
  sm: number;
  lg: number;
  xl: number;
  full: number;
  [key: string]: number;
}

type ShadowStyle = Pick<ViewStyle, 'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'>;

interface ThemeShadows {
  sm: ShadowStyle;
  [key: string]: ShadowStyle;
}

interface AppTheme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
}

// --- SIMULAÇÃO DO THEME ---
const Theme: AppTheme = {
  colors: {
    background: '#FAFAFA',
    card: '#FFFFFF',
    primary: '#10B981', // Verde esmeralda
    primaryForeground: '#FFFFFF',
    foreground: '#1F2937',
    mutedForeground: '#6B7280',
    border: '#E5E7EB',
    muted: '#F3F4F6',
    statusReadBg: '#F0FDF4',
  },
  spacing: {
    '1': 4, '2': 8, '3': 12, '4': 16, '6': 24, '7': 28, '10': 40,
  },
  typography: {
    h2: { fontSize: 20, fontWeight: '600' },
    small: { fontSize: 14 },
    xs: { fontSize: 12 },
    body: { fontSize: 16 },
    label: { fontSize: 16, fontWeight: '600' },
  },
  borderRadius: {
    sm: 6,
    lg: 12,
    xl: 20,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2.22,
      elevation: 3,
    },
  }
};
const { colors, spacing, typography, borderRadius, shadows } = Theme;

// ------------------------------------------
// --- DEFINIÇÃO DE TIPOS DE DADOS PARA ASYNC STORAGE ---
// ------------------------------------------

interface Stat {
  icon: string; 
  value: number;
  label: string;
  iconBg: string;
  iconColor: string;
}

interface MostReadGenre {
  name: string;
  count: number;
}

interface MonthlyData {
    month: string;
    booksRead: number;
}

interface UserStats {
  userName: string;
  avatarUrl: string;
  stats: Stat[];
  mostReadGenre: MostReadGenre;
  readingHistoryData: MonthlyData[]; 
  readingGoal: number; 
}

interface HomeScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

interface ChartBarProps {
    month: string;
    booksRead: number;
    maxBooks: number;
    barHeight: number;
}


// --- MOCK INICIAL (Fallback) ---
const initialUserStats: UserStats = {
    userName: "Usuário Shelfly",
    avatarUrl: "https://i.pravatar.cc/150?img=47", 
    stats: [
        { icon: 'book-open', value: 5, label: "Total de Livros", iconBg: '#d7e4fd', iconColor: '#1D4ED8' },
        { icon: 'check-square', value: 3, label: "Livros Finalizados", iconBg: '#c9f9e8', iconColor: '#047857' },
        { icon: 'star', value: 4.7, label: "Média de Avaliação", iconBg: '#fff8d6', iconColor: '#A16207' },
        { icon: 'trending-up', value: 1, label: "Lendo Agora", iconBg: '#fbe8ff', iconColor: '#86198F' },
    ],
    mostReadGenre: { name: 'Fantasia', count: 1 },
    readingHistoryData: [
      { month: 'jun.', booksRead: 2 },
      { month: 'jul.', booksRead: 4 },
      { month: 'ago.', booksRead: 1 },
      { month: 'set.', booksRead: 5 },
      { month: 'out.', booksRead: 3 },
      { month: 'nov.', booksRead: 6 },
    ],
    readingGoal: 6, 
};

// --- CHAVE DE ARMAZENAMENTO ---
const STORAGE_KEY = '@UserStats';

/**
 * Função utilitária para salvar os dados no AsyncStorage.
 */
export const saveUserStats = async (stats: UserStats) => {
  try {
    const jsonValue = JSON.stringify(stats);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Erro ao salvar os dados no AsyncStorage:', e);
  }
};

// ------------------------------------------
// --- COMPONENTES ---
// ------------------------------------------

// 💡 Componente de Cartão de Estatística
const StatCard: React.FC<Stat> = ({ icon, value, label, iconBg, iconColor }) => (
    <View style={styles.statCard}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
            <Feather name={icon} size={20} color={iconColor} />
        </View>
        <Text style={[typography.h2, styles.statCardValue]}>{value}</Text>
        <Text style={[typography.small, styles.statCardLabel]}>{label}</Text>
    </View>
);

// 💡 Componente ChartBar (Barra Animada)
const ChartBar: React.FC<ChartBarProps> = ({ month, booksRead, maxBooks, barHeight }) => {
    const [animatedHeight] = useState(new Animated.Value(0)); 
    // Usa displayMax (que é a meta de leitura ou 4) para normalização da altura.
    const targetHeightPercentage = maxBooks > 0 ? (booksRead / maxBooks) * 100 : 0; 
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    useEffect(() => {
        if (targetHeightPercentage > 0) {
            Animated.timing(animatedHeight, {
                toValue: targetHeightPercentage,
                duration: 800, 
                useNativeDriver: false, 
            }).start();
        }
    }, [targetHeightPercentage]);

    const animatedBarPixelHeight = animatedHeight.interpolate({
        inputRange: [0, 100],
        outputRange: [0, barHeight], 
    });

    return (
        <TouchableOpacity 
            style={styles.barWrapper}
            onPressIn={() => setIsTooltipVisible(true)}
            onPressOut={() => setIsTooltipVisible(false)}
            activeOpacity={0.8}
        >
            {isTooltipVisible && (
                <View style={styles.tooltip}>
                    <Text style={styles.tooltipTextMonth}>{month}</Text>
                    <Text style={styles.tooltipTextValue}>Livros: {booksRead}</Text>
                    <View style={styles.tooltipArrow} />
                </View>
            )}

            <View style={[styles.barContainer, { height: barHeight }]}>
                <Animated.View 
                    style={[
                        styles.bar, 
                        { 
                            height: animatedBarPixelHeight,
                            backgroundColor: booksRead > 0 ? colors.primary : colors.mutedForeground,
                        }
                    ]} 
                />
            </View>

            <Text style={[typography.xs, styles.chartLabelMonth]}>{month}</Text>
        </TouchableOpacity>
    );
};


// 💡 Componente Principal: ReadingHistoryChart (Gráfico com barras)
const ReadingHistoryChart: React.FC<{ userStats: UserStats }> = ({ userStats }) => {
    const CHART_AREA_HEIGHT = 150; 
    // O valor máximo é a meta de leitura para que 100% da barra represente a meta.
    const maxBooks = userStats.readingGoal; 

    // Labels do Eixo Y (Máximo arredondado para cima para ser divisível por 4, ou mínimo 4)
    const displayMax = Math.max(4, Math.ceil(maxBooks / 4) * 4);
    const yAxisLabels = [displayMax, (displayMax * 3) / 4, displayMax / 2, displayMax / 4, 0];
    

    return (
        <View style={styles.chartContainer}>
            {/* 1. Eixo Y (Labels) */}
            <View style={styles.yAxisLabels}>
                {yAxisLabels.map((label, index) => (
                    <Text key={index} style={[typography.xs, styles.chartLabelY]}>{label}</Text>
                ))}
            </View>

            {/* 2. Área do Gráfico e Barras */}
            <View style={styles.chartArea}>
                {/* Linhas do Grid Horizontais */}
                {yAxisLabels.slice(1, -1).map((_, index) => (
                    <View 
                        key={index} 
                        style={[
                            styles.chartGridLine, 
                            { 
                                top: (index + 1) * (CHART_AREA_HEIGHT / (yAxisLabels.length - 1))
                            }
                        ]}
                    />
                ))}

                {/* Container das Barras */}
                <View style={[styles.barsContainer, { height: CHART_AREA_HEIGHT }]}>
                    {userStats.readingHistoryData.map((dataItem, index) => (
                        <ChartBar 
                            key={index}
                            month={dataItem.month} 
                            booksRead={dataItem.booksRead} 
                            maxBooks={displayMax} // Usa o valor máximo calculado para a proporção
                            barHeight={CHART_AREA_HEIGHT}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};


// ------------------------------------------
// --- COMPONENTE PRINCIPAL (HomeScreen) ---
// ------------------------------------------

export default function HomeScreen({ navigation }: HomeScreenProps) { 
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    /**
     * Função para carregar os dados do AsyncStorage.
     */
    const fetchUserStats = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            
            if (jsonValue != null) {
                setStats(JSON.parse(jsonValue));
            } else {
                // Se não houver dados, salva o mock inicial e o usa
                await saveUserStats(initialUserStats);
                setStats(initialUserStats);
            }
        } catch (e) {
            console.error('Erro ao ler ou inicializar dados do AsyncStorage:', e);
            // Em caso de falha, usa o mock para garantir que a tela carregue
            setStats(initialUserStats); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserStats();
    }, []);

    // Tela de Carregamento enquanto espera o AsyncStorage
    if (loading || !stats) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Carregando estatísticas...</Text>
            </View>
        );
    }

    // Renderização Principal (usando os dados carregados de 'stats')
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
            
            {/* Header */}
            <View style={styles.header}>
                <Image 
                    source={{ uri: stats.avatarUrl }} 
                    style={styles.avatar} 
                />
                <View>
                    <Text style={styles.headerWelcome}>Olá, {stats.userName}</Text>
                    <Text style={styles.headerSubtitle}>Bem-vindo de volta</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContentContainer}>
                
                {/* Estatísticas (Grid) */}
                <View style={styles.statsGrid}>
                    {stats.stats.map((stat: Stat) => ( 
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </View>

                {/* Gênero Mais Lido */}
                <View style={styles.sectionContainer}>
                    <Text style={[typography.label, styles.sectionTitle]}>Gênero Mais Lido</Text>
                    <View style={styles.genreCard}>
                        <Text style={[typography.body, styles.genreName]}>{stats.mostReadGenre.name}</Text>
                        <Text style={[typography.small, styles.genreCount]}>{stats.mostReadGenre.count} livro</Text>
                    </View>
                </View>

                {/* Histórico de Leituras */}
                <View style={styles.sectionContainer}>
                    <Text style={[typography.label, styles.sectionTitle]}>Histórico de Leituras</Text>
                    <View style={styles.chartCard}>
                        <ReadingHistoryChart userStats={stats} /> 
                    </View>
                </View>

                <View style={{ height: spacing[10] }} /> 
            </ScrollView>
        </SafeAreaView>
    );
}

// ------------------------------------------
// --- DEFINIÇÃO DOS ESTILOS (TypeScript Corrigido) ---
// ------------------------------------------
// A definição de tipo Styles deve vir antes de StyleSheet.create
type Styles = {
  safeArea: ViewStyle;
  header: ViewStyle;
  scrollContentContainer: ViewStyle;
  avatar: ImageStyle;
  headerWelcome: TextStyle;
  headerSubtitle: TextStyle;
  statsGrid: ViewStyle;
  statCard: ViewStyle;
  iconContainer: ViewStyle;
  statCardValue: TextStyle;
  statCardLabel: TextStyle;
  sectionContainer: ViewStyle;
  sectionTitle: TextStyle;
  genreCard: ViewStyle;
  genreName: TextStyle;
  genreCount: TextStyle;
  chartCard: ViewStyle;
  chartContainer: ViewStyle;
  yAxisLabels: ViewStyle;
  chartLabelY: TextStyle;
  chartArea: ViewStyle;
  barsContainer: ViewStyle;
  chartGridLine: ViewStyle;
  barWrapper: ViewStyle;
  barContainer: ViewStyle;
  bar: ViewStyle;
  chartLabelMonth: TextStyle;
  tooltip: ViewStyle;
  tooltipTextMonth: TextStyle;
  tooltipTextValue: TextStyle;
  tooltipArrow: ViewStyle;
  loadingContainer: ViewStyle; // Novo para a tela de carregamento
  loadingText: TextStyle; // Novo para a tela de carregamento
};

const styles = StyleSheet.create<Styles>({
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
        borderBottomLeftRadius: borderRadius.xl, 
        borderBottomRightRadius: borderRadius.xl,
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
    headerWelcome: {
      ...typography.body, 
      color: colors.primaryForeground, 
      fontWeight: '500'
    },
    headerSubtitle: {
      ...typography.small, 
      color: colors.primaryForeground
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
    statCardValue: {
      ...typography.h2, 
      color: colors.foreground, 
      marginTop: spacing[1]
    },
    statCardLabel: {
      ...typography.small, 
      color: colors.mutedForeground
    },
    sectionContainer: {
        marginBottom: spacing[6],
    },
    sectionTitle: {
        ...typography.label,
        color: colors.foreground, 
        marginBottom: spacing[3]
    },
    genreCard: {
        backgroundColor: colors.statusReadBg,
        padding: spacing[4],
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    genreName: {
        ...typography.body,
        color: colors.primary, 
        fontWeight: '500'
    },
    genreCount: {
        ...typography.small,
        color: colors.mutedForeground 
    },
    chartCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing[4],
        ...shadows.sm,
    },
    chartContainer: {
        flexDirection: 'row',
        paddingRight: spacing[2],
        paddingTop: spacing[3],
        height: 190,
    },
    yAxisLabels: {
        width: 30,
        justifyContent: 'space-between',
        paddingBottom: spacing[4],
    },
    chartLabelY: {
        ...typography.xs,
        color: colors.mutedForeground,
        textAlign: 'right',
    },
    chartArea: {
        flex: 1,
        position: 'relative',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
    },
    chartGridLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
    },
    barsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    barWrapper: {
        alignItems: 'center',
        width: 40,
        paddingBottom: spacing[1],
    },
    barContainer: {
        width: 20,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        borderRadius: borderRadius.sm,
    },
    chartLabelMonth: {
        ...typography.xs,
        color: colors.mutedForeground,
        marginTop: spacing[1],
    },
    tooltip: {
        position: 'absolute',
        bottom: '100%',
        marginBottom: 10,
        backgroundColor: colors.card,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        ...shadows.sm,
        zIndex: 10,
        alignItems: 'center',
    },
    tooltipTextMonth: {
        ...typography.xs,
        fontWeight: 'bold',
        color: colors.foreground,
    },
    tooltipTextValue: {
        ...typography.xs,
        color: colors.mutedForeground,
    },
    tooltipArrow: {
        position: 'absolute',
        bottom: -6,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: colors.card,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        ...typography.body,
        color: colors.mutedForeground,
        marginTop: spacing[3],
    }
});
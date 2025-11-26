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
  Animated 
} from 'react-native';

// 💡 Importando tipos de navegação
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import Feather from 'react-native-vector-icons/Feather';

// --- 💡 INÍCIO DA DEFINIÇÃO DE TIPOS PARA O THEME ---
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

// --- FIM DA DEFINIÇÃO DE TIPOS PARA O THEME ---


// --- 💡 SIMULAÇÃO DO THEME ---
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
// --- FIM DA SIMULAÇÃO DO THEME ---


// --- 💡 DEFINIÇÃO DE TIPOS DE DADOS E PROPS ---

// 1. Tipo para um item de estatística
interface Stat {
  icon: string; 
  value: number;
  label: string;
  iconBg: string;
  iconColor: string;
}

// 2. Tipo para o gênero mais lido
interface MostReadGenre {
  name: string;
  count: number;
}

// 3. Tipo para os dados de leitura mensal
interface MonthlyData {
    month: string;
    booksRead: number;
}

// 4. Tipo para o objeto userStats
interface UserStats {
  userName: string;
  avatarUrl: string;
  stats: Stat[];
  mostReadGenre: MostReadGenre;
  readingHistoryData: MonthlyData[]; 
  readingGoal: number; 
}

// 5. Tipo para as props do HomeScreen
interface HomeScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

// 6. Tipo para as props da barra
interface ChartBarProps {
    month: string;
    booksRead: number;
    maxBooks: number;
    barHeight: number;
}

// REMOVIDO: type StatCardProps = Stat; // <-- Esta linha causava o erro
// --- FIM DOS TIPOS ---


// --- MOCK de Dados (Tipado) ---
const userStats: UserStats = {
    userName: "chatgpt!",
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


// 💡 Componente de Cartão de Estatística (Tipado com Stat)
// StatCard: React.FC<StatCardProps> foi alterado para StatCard: React.FC<Stat>
const StatCard: React.FC<Stat> = ({ icon, value, label, iconBg, iconColor }) => (
    <View style={styles.statCard}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
            <Feather name={icon} size={20} color={iconColor} />
        </View>
        <Text style={[typography.h2, styles.statCardValue]}>{value}</Text>
        <Text style={[typography.small, styles.statCardLabel]}>{label}</Text>
    </View>
);

// ------------------------------------------
// 💡 NOVO COMPONENTE: ChartBar (Barra Animada)
// ------------------------------------------
const ChartBar: React.FC<ChartBarProps> = ({ month, booksRead, maxBooks, barHeight }) => {
    // Valor animado que vai de 0 a 100 (altura em porcentagem)
    const [animatedHeight] = useState(new Animated.Value(0)); 
    const targetHeightPercentage = maxBooks > 0 ? (booksRead / maxBooks) * 100 : 0;
    
    // Estado para controlar o tooltip (livros lidos)
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    useEffect(() => {
        // Inicia a animação da barra no carregamento
        if (targetHeightPercentage > 0) {
            Animated.timing(animatedHeight, {
                toValue: targetHeightPercentage,
                duration: 800, // 0.8 segundos de animação suave
                useNativeDriver: false, 
            }).start();
        }
    }, [targetHeightPercentage]);

    // Calcula a altura da View (em pixels) baseada na porcentagem e na altura total do gráfico
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
            {/* Tooltip (Mostra a quantidade de livros) */}
            {isTooltipVisible && (
                <View style={styles.tooltip}>
                    <Text style={styles.tooltipTextMonth}>{month}</Text>
                    <Text style={styles.tooltipTextValue}>Livros: {booksRead}</Text>
                    {/* Triângulo apontando para a barra */}
                    <View style={styles.tooltipArrow} />
                </View>
            )}

            {/* O container da barra. Usamos justifyContent: 'flex-end' para a barra crescer de baixo para cima. */}
            <View style={[styles.barContainer, { height: barHeight }]}>
                <Animated.View 
                    style={[
                        styles.bar, 
                        { 
                            height: animatedBarPixelHeight, // Altura animada em pixels
                            backgroundColor: booksRead > 0 ? colors.primary : colors.mutedForeground, // Cor verde se leu, cinza se 0
                        }
                    ]} 
                />
            </View>

            {/* Label do Mês */}
            <Text style={[typography.xs, styles.chartLabelMonth]}>{month}</Text>
        </TouchableOpacity>
    );
};
// ------------------------------------------
// 💡 FIM DO NOVO COMPONENTE: ChartBar
// ------------------------------------------


// 💡 Componente Principal: ReadingHistoryChart (Gráfico com barras)
const ReadingHistoryChart = () => {
    // Altura fixa da área do gráfico para cálculo preciso (em pixels)
    const CHART_AREA_HEIGHT = 150; 
    const maxBooks = userStats.readingGoal; // Meta de leitura como valor máximo

    // Labels do Eixo Y (Máximo arredondado para cima para ser divisível por 4, ou mínimo 4)
    const displayMax = Math.max(4, Math.ceil(maxBooks / 4) * 4);
    const yAxisLabels = [displayMax, (displayMax * 3) / 4, displayMax / 2, displayMax / 4, 0];
    
    // O valor de um "livro" em pixels, baseado no displayMax e altura total
    // const pixelsPerUnit = CHART_AREA_HEIGHT / displayMax; // Variável não usada, removida

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
                {/* Começamos do segundo label (topo) até o penúltimo (base) */}
                {yAxisLabels.slice(1, -1).map((_, index) => (
                    <View 
                        key={index} 
                        style={[
                            styles.chartGridLine, 
                            { 
                                // O grid deve ser posicionado de cima para baixo
                                top: (index + 1) * (CHART_AREA_HEIGHT / (yAxisLabels.length - 1))
                            }
                        ]}
                    />
                ))}

                {/* Container das Barras (usa a altura total para normalização) */}
                <View style={[styles.barsContainer, { height: CHART_AREA_HEIGHT }]}>
                    {userStats.readingHistoryData.map((dataItem, index) => (
                        <ChartBar 
                            key={index}
                            month={dataItem.month} 
                            booksRead={dataItem.booksRead} 
                            maxBooks={displayMax}
                            barHeight={CHART_AREA_HEIGHT} // Passamos a altura total para o cálculo da animação
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};


// 💡 Componente Principal (Tipado)
export default function HomeScreen({ navigation }: HomeScreenProps) { 
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
            
            {/* Header */}
            <View style={styles.header}>
                <Image 
                    source={{ uri: userStats.avatarUrl }} 
                    style={styles.avatar} 
                />
                <View>
                    <Text style={styles.headerWelcome}>Olá, {userStats.userName}</Text>
                    <Text style={styles.headerSubtitle}>Bem-vindo de volta</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContentContainer}>
                
                {/* Estatísticas (Grid) */}
                <View style={styles.statsGrid}>
                    {userStats.stats.map((stat: Stat) => ( 
                        <StatCard key={stat.label} {...stat} />
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

                {/* Espaço no final */}
                <View style={{ height: spacing[10] }} /> 
            </ScrollView>
        </SafeAreaView>
    );
}

// --- Tipagem e Estilos do Componente ---
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
  // NOVOS ESTILOS para o Gráfico
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

    // --------------------------------
    // ESTILOS DO GRÁFICO DE BARRAS
    // --------------------------------
    chartContainer: {
        flexDirection: 'row',
        paddingRight: spacing[2],
        paddingTop: spacing[3],
        height: 190, // Altura total do container (eixo Y + barras)
    },
    yAxisLabels: {
        width: 30,
        justifyContent: 'space-between',
        paddingBottom: spacing[4], // Espaço para o 0
    },
    chartLabelY: {
        ...typography.xs,
        color: colors.mutedForeground,
        textAlign: 'right',
    },
    chartArea: {
        flex: 1,
        position: 'relative',
        borderBottomWidth: StyleSheet.hairlineWidth, // Eixo X
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
        alignItems: 'flex-end', // Alinha as barras na parte inferior
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    barWrapper: {
        alignItems: 'center',
        width: 40, // Largura total da coluna da barra
        paddingBottom: spacing[1],
    },
    barContainer: {
        width: 20, // Largura da barra animada
        alignItems: 'center',
        justifyContent: 'flex-end', // Garante que a barra cresça de baixo para cima
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
        bottom: -6, // Meio triângulo
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
    }
});
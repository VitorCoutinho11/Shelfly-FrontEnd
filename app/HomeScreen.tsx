import React from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  StatusBar,
  ViewStyle, // 💡 Importado para tipar estilos
  TextStyle,  // 💡 Importado para tipar estilos
  ImageStyle  // 💡 Importado para tipar estilos
} from 'react-native';

// 💡 Importando tipos de navegação
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import Feather from 'react-native-vector-icons/Feather';

// --- 💡 INÍCIO DA DEFINIÇÃO DE TIPOS PARA O THEME ---
// Adicionei isso para corrigir os "erros de estilo"
// O ideal é mover isso para seu arquivo 'theme/index.ts'

interface ThemeColors {
  background: string;
  card: string;
  primary: string;
  primaryForeground: string;
  foreground: string;
  mutedForeground: string;
  border: string;
  muted: string;
  statusReadBg: string; // Adicionado
  [key: string]: string; // Para cores extras
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

// Tipo para Sombras
type ShadowStyle = Pick<ViewStyle, 'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'>;

interface ThemeShadows {
  sm: ShadowStyle;
  [key: string]: ShadowStyle;
}

// Interface principal do nosso Theme
interface AppTheme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
}

// --- FIM DA DEFINIÇÃO DE TIPOS PARA O THEME ---


// --- 💡 SIMULAÇÃO DO THEME (para este arquivo funcionar) ---
// Removi a importação e colei uma simulação baseada no seu código
const Theme: AppTheme = {
  colors: {
    background: '#FAFAFA',
    card: '#FFFFFF',
    primary: '#10B981',
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
// 💡 Desestruturando a simulação
const { colors, spacing, typography, borderRadius, shadows } = Theme;
// --- FIM DA SIMULAÇÃO DO THEME ---


// --- 💡 DEFINIÇÃO DE TIPOS DE DADOS E PROPS ---

// 1. Tipo para um item de estatística
interface Stat {
  icon: string; // 💡 Deveria ser 'keyof typeof Feather.glyphMap' para ser 100%
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

// 3. Tipo para o objeto userStats
interface UserStats {
  userName: string;
  avatarUrl: string;
  stats: Stat[];
  mostReadGenre: MostReadGenre;
  readingHistoryLabels: string[];
}

// 4. Tipo para as props do StatCard (é o mesmo que 'Stat')
type StatCardProps = Stat;

// 5. Tipo para as props do HomeScreen
interface HomeScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

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
    readingHistoryLabels: ['jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.'],
};


// 💡 Componente de Cartão de Estatística (Tipado)
const StatCard: React.FC<StatCardProps> = ({ icon, value, label, iconBg, iconColor }) => (
    <View style={styles.statCard}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
            {/* Para o Feather, 'icon' é 'name'. Se o tipo Stat usasse 'name' em vez de 'icon',
              seria uma "prop spread" direta: <Feather size={20} color={iconColor} {...props} />
              Mas assim funciona perfeitamente:
            */}
            <Feather name={icon} size={20} color={iconColor} />
        </View>
        <Text style={[typography.h2, styles.statCardValue]}>{value}</Text>
        <Text style={[typography.small, styles.statCardLabel]}>{label}</Text>
    </View>
);

// 💡 Gráfico Simplificado (Placeholder)
// Não precisa de tipos, pois acessa 'userStats' do escopo externo
const ReadingHistoryChart = () => (
    <View style={styles.chartPlaceholder}>
        {/* Linhas do grid */}
        <View style={[styles.chartGridLine, { top: '25%' }]} />
        <View style={[styles.chartGridLine, { top: '50%' }]} />
        <View style={[styles.chartGridLine, { top: '75%' }]} />

        {/* Labels do eixo X */}
        <View style={styles.chartXAxisLabels}>
            {userStats.readingHistoryLabels.map(month => (
                <Text key={month} style={[typography.xs, styles.chartLabel]}>{month}</Text>
            ))}
        </View>
    </View>
);


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
                    {userStats.stats.map((stat: Stat) => ( // 💡 'index' como key é ok se a lista não muda
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

// --- 💡 Tipagem dos Estilos ---
// Isso ajuda o TypeScript a validar as chaves do StyleSheet
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
  chartPlaceholder: ViewStyle;
  chartGridLine: ViewStyle;
  chartXAxisLabels: ViewStyle;
  chartLabel: TextStyle;
};

// --- Estilos (Tipados) ---
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
    chartLabel: {
      ...typography.xs, 
      color: colors.mutedForeground
    }
});
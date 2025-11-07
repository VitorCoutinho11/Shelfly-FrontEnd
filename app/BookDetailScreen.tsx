import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    Alert,
    SafeAreaView,
    // 💡 Importando tipos de Estilo
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// 💡 Importando tipos de Navegação
import { NavigationProp, RouteProp } from '@react-navigation/native';

// Mocks e Tema
// 💡 CORRIGIDO: Removida a extensão .js
import Theme from '../theme/index'; 

// --- 💡 SIMULAÇÃO DE TIPOS DO THEME ---
// (Baseado nos estilos que você está usando neste arquivo)
interface ThemeColors {
  background: string;
  primary: string;
  primaryForeground: string;
  mutedForeground: string;
  foreground: string;
  card: string;
  border: string;
  [key: string]: string; // Permite cores extras
}
interface ThemeSpacing { [key: string]: number; }
interface TypographyStyle {
  fontSize: number;
  fontWeight?: 'bold' | 'normal' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  color?: string;
  lineHeight?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}
interface ThemeTypography {
  body: TypographyStyle;
  h3: TypographyStyle;
  h4: TypographyStyle;
  small: TypographyStyle;
  xs: TypographyStyle;
}
interface ThemeBorderRadius {
  lg: number;
  md: number;
}
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

// 💡 Aplicando o tipo ao Theme importado
const { colors, spacing, typography, borderRadius, shadows } = Theme as AppTheme;
// --- FIM DA SIMULAÇÃO DE TIPOS ---


// --- 💡 DEFINIÇÃO DE TIPOS DE DADOS ---

type BookStatus = 'want-to-read' | 'reading' | 'read';

// Usando uma União Discriminada para o tipo Book
interface BookBase {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string;
  year: number;
  totalPages: number;
  synopsis: string;
}

interface BookToRead extends BookBase {
  status: 'want-to-read';
}

interface BookReading extends BookBase {
  status: 'reading';
  progress: number;
}

interface BookRead extends BookBase {
  status: 'read';
  rating: number;
}

// O tipo Book é a união dos três
type Book = BookToRead | BookReading | BookRead;

interface StatusDisplay {
  label: string;
  color: string;
}

// Tipo para o statusMap
type StatusMap = {
  [key in BookStatus]: StatusDisplay;
}

// --- 💡 DEFINIÇÃO DE TIPOS DE NAVEGAÇÃO ---

// (Baseado no seu index.tsx e BookListScreen.tsx)
type AppStackParamList = {
  MainTabs: undefined; 
  BookDetail: { bookId: string }; // 👈 Esta é a tela atual
  BookForm: { bookId?: string }; 
};

// Tipo específico para a prop 'route' desta tela
type BookDetailScreenRouteProp = RouteProp<AppStackParamList, 'BookDetail'>;

// Tipo para as props do componente
interface BookDetailScreenProps {
  navigation: NavigationProp<AppStackParamList>;
  route: BookDetailScreenRouteProp;
}

// --- Fim dos Tipos ---


// --- Mocks de Dados (Tipados) ---
const mockBooks: Book[] = [
    { 
        id:'1', 
        title:'O Nome do Vento', 
        author:'Patrick Rothfuss', 
        cover:'https://picsum.photos/400/600?random=101', 
        genre: 'Fantasia',
        year: 2007,
        status:'read', 
        rating: 4.5,
        totalPages: 699,
        synopsis: 'Uma história épica sobre Kvothe...',
    },
    { 
        id:'2', 
        title:'A Paciente Silenciosa', 
        author:'Alex Michaelides', 
        cover:'https://picsum.photos/400/600?random=102', 
        genre: 'Thriller',
        year: 2019,
        status:'reading', 
        progress: 65,
        totalPages: 350,
        synopsis: 'Um thriller psicológico...',
    },
];

// 💡 Função tipada
const getBookById = (id: string): Book | undefined => {
    return mockBooks.find(book => book.id === id);
};

// Mapeamento de status (Tipado)
const statusMap: StatusMap = {
    'want-to-read': { label: 'Quero Ler', color: '#FCD34D' },
    'reading': { label: 'Lendo', color: colors.primary },  
    'read': { label: 'Lido', color: '#6366F1' },  
};

// --- Componente Principal (Tipado) ---
export default function BookDetailScreen({ navigation, route }: BookDetailScreenProps) {
    // 📌 Obtém o ID (o TS sabe que bookId é string)
    const { bookId } = route.params; // Não precisa de '|| {}' pois é obrigatório
    const [book, setBook] = useState<Book | null>(null);

    useEffect(() => {
        if (bookId) {
            const fetchedBook = getBookById(bookId);
            setBook(fetchedBook || null); // Define como nulo se não for encontrado
        }
    }, [bookId]);

    // 💡 Guard Clause para segurança
    const checkBookExists = (): boolean => {
        if (!book) {
            Alert.alert("Erro", "Livro não encontrado.");
            return false;
        }
        return true;
    }

    // Lógica de exclusão
    const handleDelete = () => {
        if (!checkBookExists()) return;

        Alert.alert(
            "Confirmar Exclusão",
            `Tem certeza que deseja excluir "${book!.title}" da sua biblioteca?`, // '!' pois já checamos
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Excluir", 
                    onPress: () => {
                        Alert.alert("Sucesso", `Livro "${book!.title}" excluído.`);
                        navigation.goBack(); 
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    // Navega para a tela de edição
    const handleEdit = () => {
        if (!checkBookExists()) return;
        navigation.navigate('BookForm', { bookId: book!.id });
    };

    if (!book) {
        return (
            <SafeAreaView style={stylesLocal.safeArea}>
                <View style={stylesLocal.container}>
                    <Text style={stylesLocal.loadingText}>Carregando ou Livro não encontrado...</Text>
                </View>
            </SafeAreaView>
        );
    }
    
    // Mapeamento de status (O TS sabe que book.status é válido)
    const currentStatus = statusMap[book.status];

    // Função para renderizar estrelas (Tipada)
    const renderRating = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        const stars: JSX.Element[] = []; // 💡 Array de elementos JSX
        for (let i = 0; i < fullStars; i++) {
            stars.push(<Text key={`full${i}`} style={stylesLocal.starIcon}>★</Text>);
        }
        if (hasHalfStar) {
            stars.push(<Text key="half" style={stylesLocal.starIcon}>★</Text>);
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Text key={`empty${i}`} style={stylesLocal.starIconEmpty}>☆</Text>);
        }
        return stars;
    };


    return (
        <SafeAreaView style={stylesLocal.safeArea}>
            {/* Header Customizado */}
            <View style={stylesLocal.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={stylesLocal.backButton}>
                    <Icon name="arrow-left" size={24} color={colors.primaryForeground} />
                </TouchableOpacity>
                <Text style={stylesLocal.headerTitle}>Detalhes do Livro</Text>
                <TouchableOpacity onPress={handleEdit} style={stylesLocal.headerAction}>
                    <Icon name="edit" size={22} color={colors.primaryForeground} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={stylesLocal.headerAction}>
                    <Icon name="trash-2" size={22} color={colors.primaryForeground} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={stylesLocal.scrollContent}>
                
                {/* Seção 1: Capa e Título */}
                <View style={stylesLocal.coverSection}>
                    <Image source={{ uri: book.cover }} style={stylesLocal.coverImage} resizeMode="cover" />
                    
                    <View style={stylesLocal.infoBlock}>
                        <Text style={stylesLocal.bookTitle}>{book.title}</Text>
                        <Text style={stylesLocal.bookAuthor}>Por {book.author}</Text>
                        
                        {/* Status e Avaliação */}
                        <View style={stylesLocal.statusAndRating}>
                            <View style={[stylesLocal.statusBadge, { backgroundColor: currentStatus.color }]}>
                                <Text style={stylesLocal.statusText}>{currentStatus.label}</Text>
                            </View>

                            {/* 💡 O TS sabe que 'book.rating' existe aqui */}
                            {book.status === 'read' && (
                                <View style={stylesLocal.ratingContainer}>
                                    {renderRating(book.rating)}
                                    <Text style={stylesLocal.ratingValue}>{book.rating}</Text>
                                </View>
                            )}
                            {/* 💡 O TS sabe que 'book.progress' existe aqui */}
                            {book.status === 'reading' && (
                                <Text style={stylesLocal.progressText}>{book.progress}% concluído</Text>
                            )}
                        </View>
                    </View>
                </View>

                {/* Seção 2: Detalhes Técnicos */}
                <View style={stylesLocal.detailsCard}>
                    <Text style={stylesLocal.sectionTitle}>Detalhes</Text>
                    
                    <View style={stylesLocal.detailRow}>
                        <Text style={stylesLocal.detailLabel}>Gênero:</Text>
                        <Text style={stylesLocal.detailValue}>{book.genre}</Text>
                    </View>
                    <View style={stylesLocal.detailRow}>
                        <Text style={stylesLocal.detailLabel}>Ano de Publicação:</Text>
                        <Text style={stylesLocal.detailValue}>{String(book.year)}</Text>
                    </View>
                    <View style={stylesLocal.detailRow}>
                        <Text style={stylesLocal.detailLabel}>Total de Páginas:</Text>
                        <Text style={stylesLocal.detailValue}>{String(book.totalPages)}</Text>
                    </View>
                </View>

                {/* Seção 3: Sinopse */}
                <View style={stylesLocal.detailsCard}>
                    <Text style={stylesLocal.sectionTitle}>Sinopse</Text>
                    <Text style={stylesLocal.synopsisText}>{book.synopsis}</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

// --- 💡 Tipagem dos Estilos ---
type Styles = {
  safeArea: ViewStyle;
  container: ViewStyle;
  loadingText: TextStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  headerTitle: TextStyle;
  headerAction: ViewStyle;
  scrollContent: ViewStyle;
  coverSection: ViewStyle;
  coverImage: ImageStyle;
  infoBlock: ViewStyle;
  bookTitle: TextStyle;
  bookAuthor: TextStyle;
  statusAndRating: ViewStyle;
  statusBadge: ViewStyle;
  statusText: TextStyle;
  ratingContainer: ViewStyle;
  starIcon: TextStyle;
  starIconEmpty: TextStyle;
  ratingValue: TextStyle;
  progressText: TextStyle;
  detailsCard: ViewStyle;
  sectionTitle: TextStyle;
  detailRow: ViewStyle;
  detailLabel: TextStyle;
  detailValue: TextStyle;
  synopsisText: TextStyle;
};

// --- ESTILOS (Tipados e Corrigidos) ---
const stylesLocal = StyleSheet.create<Styles>({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background || '#F4F4F5',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...typography.body,
        color: colors.mutedForeground,
    },
    // --- Header ---
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: spacing['4'],
        paddingHorizontal: spacing['4'],
        backgroundColor: colors.primary,
        ...shadows.sm,
    },
    backButton: {
        paddingRight: spacing['4'],
    },
    headerTitle: {
        ...typography.h4,
        color: colors.primaryForeground,
        fontWeight: 'bold',
        flex: 1, 
    },
    headerAction: {
        paddingLeft: spacing['4'],
    },
    // --- Scroll Content ---
    scrollContent: {
        padding: spacing['4'],
    },
    // --- Capa e Info Principal ---
    coverSection: {
        flexDirection: 'row',
        marginBottom: spacing['6'],
        alignItems: 'flex-start',
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg || 10,
        padding: spacing['4'],
        ...shadows.sm,
    },
    coverImage: {
        width: 120,
        height: 180,
        borderRadius: borderRadius.md || 8,
        marginRight: spacing['4'],
        backgroundColor: colors.border,
    },
    infoBlock: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: spacing['1'],
    },
    bookTitle: {
        ...typography.h3,
        fontWeight: 'bold',
        color: colors.foreground,
        marginBottom: spacing['1'],
    },
    bookAuthor: {
        ...typography.small,
        color: colors.mutedForeground,
        marginBottom: spacing['3'],
    },
    statusAndRating: {
        marginTop: spacing['3'],
    },
    statusBadge: {
        paddingVertical: spacing['1'],
        paddingHorizontal: spacing['2'],
        borderRadius: borderRadius.md || 8,
        alignSelf: 'flex-start',
        marginBottom: spacing['2'],
    },
    statusText: {
        ...typography.xs,
        color: colors.primaryForeground,
        fontWeight: 'bold',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: { // 💡 CORRIGIDO: É um ícone de texto
        color: '#FFD700', 
        fontSize: 18,
    },
    starIconEmpty: { // 💡 CORRIGIDO: É um ícone de texto
        color: colors.border,
        fontSize: 18,
    },
    ratingValue: {
        ...typography.small,
        marginLeft: spacing['1'],
        fontWeight: '600',
        color: colors.foreground,
    },
    progressText: {
        ...typography.small,
        color: colors.primary,
        fontWeight: '600',
    },
    // --- Cards de Detalhes e Sinopse ---
    detailsCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg || 10,
        padding: spacing['4'],
        marginBottom: spacing['4'],
        ...shadows.sm,
    },
    sectionTitle: {
        ...typography.h4,
        fontWeight: 'bold',
        color: colors.foreground,
        marginBottom: spacing['3'],
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing['2'],
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: spacing['2'],
    },
    detailLabel: {
        ...typography.body,
        color: colors.mutedForeground,
    },
    detailValue: {
        ...typography.body,
        fontWeight: '600',
        color: colors.foreground,
    },
    synopsisText: {
        ...typography.body,
        lineHeight: 22,
        color: colors.foreground,
        textAlign: 'justify',
    },
});
import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    Alert,
    SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// Mocks e Tema
import Theme from '../theme/index.js'; 
const { colors, spacing, typography, borderRadius, shadows } = Theme; 

// --- Mocks de Dados ---
const mockBooks = [
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
        synopsis: 'Uma história épica sobre Kvothe, um lendário mago, músico e assassino. Detalhes da Edição. A busca de Kvothe por respostas sobre os Chandrian o leva a muitos lugares perigosos e inesperados.',
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
        synopsis: 'Um thriller psicológico sobre uma famosa pintora que mata o marido e se recusa a falar uma única palavra desde então.',
    },
];

const getBookById = (id) => {
    return mockBooks.find(book => book.id === id);
};

// Mapeamento de status para exibição
const statusMap = {
    'want-to-read': { label: 'Quero Ler', color: '#FCD34D' }, // Amarelo/Ouro
    'reading': { label: 'Lendo', color: colors.primary },     // Verde (Primary)
    'read': { label: 'Lido', color: '#6366F1' },              // Roxo/Índigo
};

// --- Componente Principal ---
export default function BookDetailScreen({ navigation, route }) {
    // 📌 Obtém o ID do livro passado pela BooksListScreen
    const { bookId } = route.params || {}; 
    const [book, setBook] = useState(null);

    useEffect(() => {
        if (bookId) {
            // Carrega os dados mockados com base no ID
            const fetchedBook = getBookById(bookId);
            setBook(fetchedBook);
        }
    }, [bookId]);

    // Lógica de exclusão do livro
    const handleDelete = () => {
        Alert.alert(
            "Confirmar Exclusão",
            `Tem certeza que deseja excluir "${book.title}" da sua biblioteca?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Excluir", 
                    onPress: () => {
                        // 💡 Aqui você chamaria a função de exclusão
                        Alert.alert("Sucesso", `Livro "${book.title}" excluído.`);
                        navigation.goBack(); // Volta para a lista
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    // Navega para a tela de edição
    const handleEdit = () => {
        // Navega para o BookForm, passando o ID para acionar o modo Edição
        navigation.navigate('BookForm', { bookId: book.id });
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
    
    // Mapeamento de status e cor
    const currentStatus = statusMap[book.status] || { label: 'Desconhecido', color: colors.mutedForeground };

    // Função para renderizar estrelas
    const renderRating = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<Text key={`full${i}`} style={stylesLocal.starIcon}>★</Text>);
        }
        if (hasHalfStar) {
            stars.push(<Text key="half" style={stylesLocal.starIcon}>★</Text>); // Usando estrela completa para simplicidade, mas representaria meia estrela
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

                            {book.status === 'read' && (
                                <View style={stylesLocal.ratingContainer}>
                                    {renderRating(book.rating)}
                                    <Text style={stylesLocal.ratingValue}>{book.rating}</Text>
                                </View>
                            )}
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
                        <Text style={stylesLocal.detailValue}>{book.year}</Text>
                    </View>
                    <View style={stylesLocal.detailRow}>
                        <Text style={stylesLocal.detailLabel}>Total de Páginas:</Text>
                        <Text style={stylesLocal.detailValue}>{book.totalPages}</Text>
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

// --- ESTILOS ---
const stylesLocal = StyleSheet.create({
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
        flex: 1, // Permite que o título ocupe o espaço restante
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
        alignSelf: 'flex-start', // Garante que o badge não estique
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
    starIcon: {
        color: '#FFD700', // Gold
        fontSize: 18,
    },
    starIconEmpty: {
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
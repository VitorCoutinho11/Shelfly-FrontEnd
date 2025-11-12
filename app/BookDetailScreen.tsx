import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    StyleSheet, 
    TouchableOpacity, 
    ImageBackground, 
    Alert,
    Modal,
    TextInput,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';

// Ícones e Navegação
import Icon from 'react-native-vector-icons/Feather';
import StarIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { AppStackParamList } from '.'; 

// --- IMPORTANTE: AsyncStorage ---
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// Tema
import Theme from '../theme/index'; 
const { colors, spacing, typography, borderRadius, shadows } = Theme; 

// --- DEFINIÇÃO DE TIPOS E DADOS INICIAIS (NÃO MOCKS) ---
type BookListStatus = 'Lido' | 'Lendo' | 'Quero Ler';

interface BookListItem {
    id: string;
    title: string;
    author: string;
    cover: string;
    status: BookListStatus;
    rating?: number; 
    progress?: number; 
    coverImage: string;
    registrationDate: Date;
    genre: string; 
    publicationYear: number; 
    synopsis: string; 
    totalPages: number; 
    userReview?: string; 
    pagesRead?: number; 
}

// Chave para armazenar a LISTA DE LIVROS no AsyncStorage
const ASYNC_STORAGE_KEY = '@BookList'; 

// Lista inicial de livros (Dados expandidos para teste)
const initialMockData: BookListItem[] = [
    { 
        id:'2', 
        title:'A Paciente Silenciosa', 
        author:'Alex Michaelides', 
        cover:'https://picsum.photos/400/600?random=2', 
        status:'Lido', 
        progress:100, 
        coverImage: 'https://picsum.photos/400/600?random=2', 
        registrationDate: new Date('2024-05-20'), 
        genre: 'Mistério', 
        publicationYear: 2019, 
        synopsis: 'Uma psicoterapeuta se recusa a falar após ser acusada de matar seu marido.', 
        totalPages: 336,
        pagesRead: 336, 
    },
    // Adicionado livro 2 (Lendo)
    { 
        id:'3', 
        title:'1984', 
        author:'George Orwell', 
        cover:'https://picsum.photos/400/600?random=3', 
        status:'Lendo', 
        progress: 35, 
        coverImage: 'https://picsum.photos/400/600?random=3', 
        registrationDate: new Date('2024-08-15'), 
        genre: 'Ficção Científica', 
        publicationYear: 1949, 
        synopsis: 'Em um futuro distópico, a sociedade é vigiada pelo Grande Irmão.', 
        totalPages: 416,
        pagesRead: 146, 
    },
    // Adicionado livro 3 (Quero Ler)
    { 
        id:'4', 
        title:'O Morro dos Ventos Uivantes', 
        author:'Emily Brontë', 
        cover:'https://picsum.photos/400/600?random=4', 
        status:'Quero Ler', 
        progress: 0, 
        coverImage: 'https://picsum.photos/400/600?random=4', 
        registrationDate: new Date('2024-09-01'), 
        genre: 'Romance Gótico', 
        publicationYear: 1847, 
        synopsis: 'A intensa e trágica história de amor entre Heathcliff e Catherine Earnshaw.', 
        totalPages: 440,
        pagesRead: 0,
    }
];

type BookDetailRouteProp = RouteProp<AppStackParamList, 'BookDetail'>;


// =================================================================
// 📚 COMPONENTE PRINCIPAL: BOOK DETAIL SCREEN
// =================================================================

export default function BookDetailScreen() {
    const route = useRoute<BookDetailRouteProp>();
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    // O ID do livro é recebido através dos parâmetros de navegação
    const { bookId } = route.params;

    const [book, setBook] = useState<BookListItem | null>(null); 
    const [isLoading, setIsLoading] = useState(true); 

    // Estados temporários do Modal de Avaliação
    const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
    const [tempRating, setTempRating] = useState<number>(0);
    const [tempReview, setTempReview] = useState<string>(''); 

    // Estados para Progresso e Animação
    const [isProgressModalVisible, setIsProgressModalVisible] = useState(false);
    const [tempPagesRead, setTempPagesRead] = useState<string>('0'); 
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [activeContentStatus, setActiveContentStatus] = useState<BookListStatus>('Quero Ler'); 

    // --- 🔑 FUNÇÕES DE PERSISTÊNCIA (AsyncStorage) 🔑 ---
    
    // 1. Função para salvar o livro atual na lista
    const saveBookData = async (updatedBook: BookListItem) => {
        try {
            const storedData = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
            let bookList: BookListItem[] = storedData ? JSON.parse(storedData) : [];

            // Encontra o índice e substitui o livro atualizado
            const bookIndex = bookList.findIndex(b => b.id === updatedBook.id);
            if (bookIndex > -1) {
                bookList[bookIndex] = updatedBook;
            } else {
                bookList.push(updatedBook);
            }

            await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(bookList));
            setBook(updatedBook); // Atualiza o estado local
            return true;
        } catch (error) {
            console.error("Erro ao salvar dados do livro:", error);
            Alert.alert("Erro de Salvamento", "Não foi possível salvar os detalhes atualizados do livro.");
            return false;
        }
    };

    // 2. Função para carregar a lista completa de livros (Usando useCallback para async/await)
    const loadBookData = useCallback(async () => {
        try {
            const storedData = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
            let bookList: BookListItem[] = [];
            
            if (storedData) {
                // Se houver dados salvos, usa-os e rehidrata a data
                bookList = JSON.parse(storedData).map((b: any) => ({
                    ...b,
                    registrationDate: new Date(b.registrationDate) 
                }));
            } else {
                // Primeira carga: usa o mock expandido e salva para persistência futura
                bookList = initialMockData;
                // 💡 CORRIGIDO: Certificando-se de usar ASYNC_STORAGE_KEY (sem typo)
                await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(initialMockData));
            }
            
            // Encontra o livro atual na lista usando o bookId da navegação
            const currentBook = bookList.find(b => b.id === bookId) || null;

            if (currentBook) {
                setBook(currentBook);
                setActiveContentStatus(currentBook.status);
                
                // Prioriza 'pagesRead' se existir, ou usa a fórmula antiga como fallback
                const pagesReadForInitialization = currentBook.pagesRead 
                    || Math.round(((currentBook.progress || 0) / 100) * currentBook.totalPages);
                
                setTempPagesRead(pagesReadForInitialization.toString());
                setTempRating(currentBook.rating || 0);
                setTempReview(currentBook.userReview || '');

            } else {
                Alert.alert("Erro", "O livro solicitado não foi encontrado. O ID passado foi: " + bookId);
            }

        } catch (error) {
            console.error("Erro ao carregar dados do livro:", error);
            Alert.alert("Erro de Carregamento", "Não foi possível carregar os detalhes do livro.");
        } finally {
            setIsLoading(false);
        }
    }, [bookId]);

    // --- 🔄 USE EFFECT: Carregar Dados na Montagem ---
    useEffect(() => {
        loadBookData();
    }, [loadBookData]);


    // --- LÓGICAS DE AÇÃO ---
    
    const handleOpenRatingModal = () => {
        setTempRating(book?.rating || 0);
        setTempReview(book?.userReview || '');
        setIsRatingModalVisible(true);
    };

    const handleSaveRating = async () => {
        if (!book) return; 

        if (tempRating === 0) {
            Alert.alert("Atenção", "Por favor, selecione uma nota de 1 a 5 estrelas.");
            return;
        }

        const updatedBook: BookListItem = { 
            ...book, 
            rating: tempRating, 
            userReview: tempReview 
        };
        
        const success = await saveBookData(updatedBook); 
        
        if (success) {
            setIsRatingModalVisible(false);
        }
    };
    
    const handleUpdateStatus = (newStatus: BookListStatus) => {
        if (!book || book.status === newStatus) return;

        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150, 
            useNativeDriver: true,
        }).start(() => {
            const updatedBook = { ...book, status: newStatus };
            saveBookData(updatedBook).then((success) => {
                if(success) {
                    setActiveContentStatus(newStatus); 
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 250, 
                        useNativeDriver: true,
                    }).start();
                }
            });
        });
    };

    const handleSaveProgress = async () => {
        if (!book) return;

        const pages = parseInt(tempPagesRead || '0', 10);

        if (isNaN(pages) || pages < 0) {
            Alert.alert("Erro", "Por favor, insira um número de página válido.");
            return;
        }
        
        const newProgressPercent = Math.min(100, Math.round((pages / book.totalPages) * 100));
        let updatedBook: BookListItem;

        if (pages >= book.totalPages) {
            updatedBook = { 
                ...book, 
                progress: 100, 
                status: 'Lido',
                pagesRead: book.totalPages 
            };
            await saveBookData(updatedBook);
            handleUpdateStatus('Lido'); 
        } else {
            updatedBook = { 
                ...book, 
                progress: newProgressPercent,
                pagesRead: pages 
            };
            await saveBookData(updatedBook);
        }
        
        setIsProgressModalVisible(false);
    };

    const handleDelete = async () => {
         Alert.alert(
            "Confirmar Exclusão",
            `Tem certeza que deseja remover "${book?.title}" da sua biblioteca?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Excluir", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            const storedData = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
                            let bookList: BookListItem[] = storedData ? JSON.parse(storedData) : [];
                            
                            const filteredList = bookList.filter(b => b.id !== bookId);

                            await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(filteredList));
                            navigation.goBack(); 
                        } catch (error) {
                            console.error("Erro ao deletar livro:", error);
                            Alert.alert("Erro", "Não foi possível excluir o livro.");
                        }
                    } 
                }
            ]
        );
    }
    
    const StarRating = ({ rating, size }: { rating: number | undefined, size: number }) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <StarIcon
                    key={i}
                    name={i <= (rating || 0) ? 'star' : 'star-outline'}
                    size={size}
                    color={i <= (rating || 0) ? colors.accent : colors.mutedForeground} 
                    style={{ marginRight: 2 }}
                />
            );
        }
        return <View style={{ flexDirection: 'row' }}>{stars}</View>;
    };
    
    const renderUserReview = () => {
        if (!book || !book.rating || book.rating === 0) return null; 

        return (
            <View style={styles.userReviewBox}>
                <Text style={styles.synopsisTitle}>Sua Resenha</Text>
                <View style={styles.communityReview}>
                    <View style={[styles.avatar, { backgroundColor: colors.accent }]} /> 
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <Text style={styles.reviewUser}>Você</Text>
                            <StarRating rating={book.rating} size={18} />
                        </View>
                        <Text style={styles.reviewDate}>{new Date().toLocaleDateString('pt-BR')}</Text>
                        <Text style={styles.reviewText}>{book.userReview || '(Sem resenha escrita)'}</Text>
                        <TouchableOpacity style={styles.editReviewButton} onPress={handleOpenRatingModal}>
                            <Text style={styles.editReviewText}>Editar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const renderStatusButton = (statusValue: BookListStatus) => {
        const isSelected = book?.status === statusValue;
        
        let backgroundColor: string = colors.card; 
        
        if (isSelected) {
            switch(statusValue) {
                case 'Quero Ler':
                    backgroundColor = '#ECECF0'; 
                    break;
                case 'Lendo':
                    backgroundColor = '#FFD70030'; 
                    break;
                case 'Lido':
                    backgroundColor = '#00808030'; 
                    break;
            }
        }

        return (
            <TouchableOpacity 
                key={statusValue}
                style={[styles.statusButton, { backgroundColor }]}
                onPress={() => handleUpdateStatus(statusValue)}
            >
                <Text style={[
                    styles.statusText, 
                    isSelected && { fontWeight: '600' }
                ]}>
                    {statusValue}
                </Text>
            </TouchableOpacity>
        );
    };


    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.foreground, marginTop: spacing['4'] }}>Carregando dados do livro...</Text>
            </View>
        );
    }
    
    if (!book) { 
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Livro não encontrado!</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.goBackText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ImageBackground 
                source={{ uri: book.coverImage }} 
                style={styles.headerImage}
                imageStyle={{ resizeMode: 'cover' }}
            >
                <View style={styles.overlay} /> 
                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <Icon name="arrow-left" size={24} color={colors.card} />
                    </TouchableOpacity>
                    <View style={styles.rightButtons}>
                        <TouchableOpacity onPress={() => navigation.navigate('BookForm', { bookId: book.id })} style={styles.iconButton}>
                            <Icon name="edit" size={20} color={colors.card} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={[styles.iconButton, { backgroundColor: '#FF000040', borderRadius: 50 }]}>
                            <Icon name="trash-2" size={20} color={colors.card} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.detailsBox}>
                    <Text style={styles.title}>{book.title}</Text>
                    <Text style={styles.author}>por {book.author}</Text>
                    
                    <View style={styles.tagContainer}>
                        <View style={styles.tag}><Text style={styles.tagText}>{book.genre}</Text></View>
                        <View style={styles.tag}><Icon name="calendar" size={12} color={colors.mutedForeground} /><Text style={styles.tagText}> {book.publicationYear}</Text></View>
                        <View style={[styles.tag, { backgroundColor: colors.primary + '30' }]}><Text style={[styles.tagText, { color: colors.primary, fontWeight: '600' }]}>{book.status}</Text></View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing['3'], marginBottom: spacing['6'] }}>
                        {renderStatusButton('Quero Ler')}
                        {renderStatusButton('Lendo')}
                        {renderStatusButton('Lido')}
                    </View>

                    <Animated.View style={{ opacity: fadeAnim }}>
                        
                        {activeContentStatus === 'Lendo' && (
                            <View style={styles.progressContainer}>
                                <View style={styles.progressHeader}>
                                    <Text style={styles.progressTitle}>Progresso</Text>
                                    <Text style={styles.progressPercent}>{(book.pagesRead || 0)} de {book.totalPages} páginas</Text>
                                </View>
                                <View style={styles.progressBarWrapper}>
                                    <View style={[styles.progressBar, { width: `${book.progress || 0}%`, backgroundColor: colors.accent }]} />
                                    <Text style={styles.progressPercentOverlay}>{book.progress || 0}%</Text>
                                </View>
                                <TouchableOpacity style={styles.updateProgressButton} onPress={() => setIsProgressModalVisible(true)}> 
                                    <Icon name="book-open" size={16} color={colors.foreground} />
                                    <Text style={styles.updateProgressText}>Atualizar Progresso</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {activeContentStatus === 'Lido' && (
                            <View style={styles.ratingBox}>
                                <Text style={styles.ratingTitle}>Sua Avaliação</Text>
                                <StarRating rating={book.rating} size={28} /> 
                                <TouchableOpacity style={styles.rateButton} onPress={handleOpenRatingModal}>
                                    <Text style={styles.rateButtonText}>{book.rating ? 'Editar Avaliação' : 'Avaliar Livro'}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        
                    </Animated.View>

                    <View style={styles.synopsisBox}>
                        <Text style={styles.synopsisTitle}>Sinopse</Text>
                        <Text style={styles.synopsisText}>{book.synopsis}</Text>
                    </View>
                    
                    {renderUserReview()} 

                    <View style={styles.communityRatingBox}>
                        <Text style={styles.synopsisTitle}>Avaliações da Comunidade</Text>
                        <View style={styles.communityReview}>
                            <View style={styles.avatar} />
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    <Text style={styles.reviewUser}>Outro Usuário</Text>
                                    <StarRating rating={4} size={18} />
                                </View>
                                <Text style={styles.reviewDate}>08/11/2025</Text>
                                <Text style={styles.reviewText}>Um livro que me prendeu do início ao fim!</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>

            <Modal
                visible={isProgressModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsProgressModalVisible(false)}
            >
                <KeyboardAvoidingView 
                    style={styles.modalOverlay} 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeModalButton} onPress={() => setIsProgressModalVisible(false)}>
                            <Icon name="x" size={24} color={colors.foreground} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Atualizar Progresso</Text>
                        <Text style={styles.modalSubtitle}>Atualize quantas páginas você já leu</Text>

                        <Text style={styles.modalLabel}>Páginas Lidas</Text>
                        <View style={styles.progressInputWrapper}>
                            <TextInput 
                                value={tempPagesRead}
                                onChangeText={(text) => setTempPagesRead(text.replace(/[^0-9]/g, ''))}
                                style={styles.modalProgressInput}
                                keyboardType="numeric"
                                placeholderTextColor={colors.mutedForeground}
                                maxLength={String(book.totalPages).length + 1}
                            />
                            <View style={styles.spinnerIcon}>
                                <TouchableOpacity 
                                    onPress={() => setTempPagesRead(prev => String(Math.min(book.totalPages, parseInt(prev || '0') + 1)))}
                                >
                                    <Icon name="chevron-up" size={16} color={colors.foreground} />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => setTempPagesRead(prev => String(Math.max(0, parseInt(prev || '0') - 1)))}
                                >
                                    <Icon name="chevron-down" size={16} color={colors.foreground} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <Text style={styles.pagesTotalText}>
                            De **{book.totalPages}** páginas totais
                        </Text>
                        
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setIsProgressModalVisible(false)}>
                                <Text style={styles.modalCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveProgress}>
                                <Text style={styles.modalSaveText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
            
            <Modal
                visible={isRatingModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsRatingModalVisible(false)}
            >
                 <KeyboardAvoidingView 
                    style={styles.modalOverlay} 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeModalButton} onPress={() => setIsRatingModalVisible(false)}>
                            <Icon name="x" size={24} color={colors.foreground} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Avaliar Livro</Text>
                        <Text style={styles.modalSubtitle}>Compartilhe sua opinião sobre este livro</Text>

                        <Text style={styles.modalLabel}>Avaliação</Text>
                        <View style={styles.modalStarSelector}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <TouchableOpacity key={star} onPress={() => setTempRating(star)}>
                                    <StarIcon
                                        name={star <= tempRating ? 'star' : 'star-outline'}
                                        size={40}
                                        color={star <= tempRating ? colors.accent : colors.border}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        
                        <Text style={styles.modalLabel}>Resenha (opcional)</Text>
                        <TextInput 
                            value={tempReview}
                            onChangeText={setTempReview}
                            placeholder="O que você achou deste livro?"
                            style={styles.modalReviewInput}
                            placeholderTextColor={colors.mutedForeground}
                            multiline
                        />
                        
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setIsRatingModalVisible(false)}>
                                <Text style={styles.modalCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveRating}>
                                <Text style={styles.modalSaveText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: colors.background 
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    errorText: {
        fontSize: typography.h3?.fontSize || 20,
        color: colors.foreground,
    },
    goBackText: {
        marginTop: spacing['4'],
        color: colors.primary,
        fontSize: typography.body?.fontSize || 16,
    },
    headerImage: {
        width: '100%',
        height: 200,     
        justifyContent: 'space-between',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)', 
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing['4'],
        paddingTop: spacing['6'],
    },
    iconButton: {
        padding: spacing['2'],
    },
    rightButtons: {
        flexDirection: 'row',
        gap: spacing['3'],
    },
    scrollContent: {
        paddingBottom: spacing['8'],
    },
    detailsBox: {
        backgroundColor: colors.card,
        borderTopLeftRadius: borderRadius.xl || 20,
        borderTopRightRadius: borderRadius.xl || 20,
        padding: spacing['6'],
        paddingTop: spacing['10'], 
        marginTop: -spacing['10'], 
        ...shadows.lg,
    },
    title: {
        fontSize: typography.h2?.fontSize || 28,
        fontWeight: 'bold',
        color: colors.foreground,
        marginBottom: spacing['5'],
        top: 15
    },
    author: {
        fontSize: typography.body?.fontSize || 16,
        color: colors.mutedForeground,
        marginBottom: spacing['4'],
    },
    tagContainer: {
        flexDirection: 'row',
        marginBottom: spacing['6'],
        gap: spacing['2'],
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.muted,
        borderRadius: borderRadius.lg || 10,
        paddingHorizontal: spacing['3'],
        paddingVertical: spacing['1'],
    },
    tagText: {
        fontSize: typography.small?.fontSize || 14,
        color: colors.foreground,
    },
    statusButton: {
        flex: 1, 
        borderRadius: borderRadius.md || 8,
        padding: spacing['4'],
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    statusText: {
        fontSize: typography.body?.fontSize || 16,
        color: colors.foreground,
    },
    // --- Estilos de Progresso (Lendo) ---
    progressContainer: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        paddingVertical: spacing['4'],
        marginBottom: spacing['6'],
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing['4'],
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing['2'],
    },
    progressTitle: {
        fontSize: typography.body?.fontSize || 16,
        fontWeight: '500',
        color: colors.foreground,
    },
    progressBarWrapper: {
        height: 10,
        backgroundColor: colors.muted,
        borderRadius: borderRadius.sm,
        justifyContent: 'center',
        marginBottom: spacing['4'],
    },
    progressBar: {
        height: '100%',
        borderRadius: borderRadius.sm,
    },
    progressPercent: {
        fontSize: typography.small?.fontSize || 14,
        color: colors.mutedForeground,
    },
    progressPercentOverlay: {
        position: 'absolute',
        right: spacing['2'],
        fontSize: typography.small?.fontSize || 14,
        color: colors.card,
        fontWeight: 'bold',
    },
    updateProgressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing['3'],
        borderRadius: borderRadius.md,
        marginTop: spacing['3'],
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
    },
    updateProgressText: {
        fontSize: typography.body?.fontSize || 16,
        color: colors.foreground,
        marginLeft: spacing['2'],
        fontWeight: '500',
    },
    // --- Estilos de Avaliação (Lido) ---
    ratingBox: {
        marginBottom: spacing['6'],
    },
    ratingTitle: {
        fontSize: typography.h4?.fontSize || 20,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: spacing['2'],
    },
    rateButton: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md || 8,
        paddingVertical: spacing['3'],
        marginTop: spacing['3'],
        alignItems: 'center',
        backgroundColor: colors.card,
    },
    rateButtonText: {
        fontSize: typography.body?.fontSize || 16,
        color: colors.foreground,
        fontWeight: '500',
    },
    // --- Estilos da Sinopse ---
    synopsisBox: {
        marginBottom: spacing['6'],
    },
    synopsisTitle: {
        fontSize: typography.h4?.fontSize || 20,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: spacing['2'],
    },
    synopsisText: {
        fontSize: typography.body?.fontSize || 16,
        color: colors.foreground,
        lineHeight: (typography.body?.fontSize || 16) * 1.5,
    },
    // --- Estilos de Resenha do Usuário ---
    userReviewBox: {
        marginBottom: spacing['6'],
        paddingBottom: spacing['4'],
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    editReviewButton: {
        marginTop: spacing['2'],
        alignSelf: 'flex-start',
    },
    editReviewText: {
        fontSize: typography.small?.fontSize || 14,
        color: colors.primary,
        fontWeight: '500',
    },
    // --- Estilos de Comentário da Comunidade ---
    communityRatingBox: {
        marginTop: spacing['4'],
        paddingTop: spacing['4'],
    },
    communityReview: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: spacing['4'],
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary, 
        marginRight: spacing['3'],
    },
    reviewUser: {
        fontSize: typography.body?.fontSize || 16,
        fontWeight: '600',
        color: colors.foreground,
    },
    reviewDate: {
        fontSize: typography.small?.fontSize || 12,
        color: colors.mutedForeground,
        marginBottom: spacing['1'],
    },
    reviewText: {
        fontSize: typography.body?.fontSize || 16,
        color: colors.foreground,
    },
    // --- Estilos Comuns do Modal ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl || 20,
        padding: spacing['6'],
        ...shadows.lg,
    },
    closeModalButton: {
        position: 'absolute',
        top: spacing['4'],
        right: spacing['4'],
        zIndex: 10,
        padding: spacing['2'],
    },
    modalTitle: {
        fontSize: typography.h3?.fontSize || 24,
        fontWeight: 'bold',
        color: colors.foreground,
        marginBottom: spacing['1'],
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: typography.body?.fontSize || 16,
        color: colors.mutedForeground,
        marginBottom: spacing['6'],
        textAlign: 'center',
    },
    modalLabel: {
        fontSize: typography.body?.fontSize || 16,
        fontWeight: '600',
        color: colors.foreground,
        marginBottom: spacing['2'],
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing['3'],
        marginTop: spacing['6'],
    },
    modalCancelButton: {
        paddingVertical: spacing['3'],
        paddingHorizontal: spacing['6'],
        borderRadius: borderRadius.md || 8,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    modalCancelText: {
        fontSize: typography.body?.fontSize || 16,
        color: colors.foreground,
        fontWeight: '500',
    },
    modalSaveText: { 
        fontSize: typography.body?.fontSize || 16,
        color: colors.primaryForeground,
        fontWeight: '500',
    },
    modalSaveButton: { 
        paddingVertical: spacing['3'],
        paddingHorizontal: spacing['6'],
        borderRadius: borderRadius.md || 8,
        backgroundColor: colors.primary, 
        alignItems: 'center',
    },
    // --- Estilos Específicos do Modal de Progresso ---
    progressInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md || 8,
        height: 50,
        marginBottom: spacing['2'],
    },
    modalProgressInput: {
        flex: 1,
        paddingHorizontal: spacing['3'],
        fontSize: typography.h3?.fontSize || 24,
        fontWeight: 'bold',
        color: colors.foreground,
        textAlign: 'right',
    },
    spinnerIcon: {
        height: '100%',
        width: 40,
        borderLeftWidth: 1,
        borderColor: colors.border,
        justifyContent: 'space-around',
        paddingVertical: spacing['1'],
    },
    pagesTotalText: {
        fontSize: typography.small?.fontSize || 14,
        color: colors.mutedForeground,
        marginBottom: spacing['2'],
    },
    // --- Estilos Específicos do Modal de Avaliação ---
    modalReviewInput: {
        minHeight: 80,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md || 8,
        padding: spacing['3'],
        fontSize: typography.body?.fontSize || 16,
        color: colors.foreground,
        textAlignVertical: 'top', 
        marginBottom: spacing['6'],
    },
    modalStarSelector: {
        flexDirection: 'row',
        marginBottom: spacing['6'],
    },
});
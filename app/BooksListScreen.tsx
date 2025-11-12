import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    FlatList, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView, 
    StatusBar,
    ListRenderItemInfo, 
    Alert 
} from 'react-native';

// --- IMPORTANTE: AsyncStorage ---
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// Navegação
import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native';

// Componentes necessários
import BookCard from '../components/BookCard/index'; 
import Icon from 'react-native-vector-icons/Feather';
import { FilterDropdown, FilterOption } from '../components/FilterDropdown'; 

// Tema
import Theme from '../theme/index'; 
const { colors, spacing, typography, borderRadius, shadows } = Theme; 

// --- CONSTANTES E TIPOS CORRIGIDOS ---

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

interface BooksListScreenProps {
    navigation: NavigationProp<ParamListBase>;
}

const ASYNC_STORAGE_KEY = '@BookList'; 

// MOCK DATA COMPLETO: Usado apenas na primeira vez que o AsyncStorage está vazio.
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


export default function BooksListScreen({ navigation }: BooksListScreenProps) {
    const [searchText, setSearchText] = useState<string>('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    
    const [allBooks, setAllBooks] = useState<BookListItem[]>([]);
    const [displayedBooks, setDisplayedBooks] = useState<BookListItem[]>([]); 
    const [selectedSort, setSelectedSort] = useState<FilterOption>('Data de Cadastro'); 


    // --- FUNÇÕES DE CARREGAMENTO E PERSISTÊNCIA ---

    const loadBooksFromStorage = useCallback(async () => {
        try {
            const storedData = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
            let bookList: BookListItem[] = [];

            if (storedData) {
                // Se houver dados, parse e rehidrate as datas
                bookList = JSON.parse(storedData).map((b: any) => ({
                    ...b,
                    registrationDate: new Date(b.registrationDate)
                }));
            } else {
                // Primeira vez: usa os mocks e salva a lista COMPLETA
                bookList = initialMockData.map(b => ({ ...b, registrationDate: new Date(b.registrationDate) }));
                await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(bookList));
            }

            setAllBooks(bookList); 
        } catch (error) {
            console.error("Erro ao carregar livros:", error);
            Alert.alert("Erro de Carga", "Não foi possível carregar a sua biblioteca.");
        }
    }, []);

    // RECARREGA AO ENTRAR NA TELA
    useFocusEffect(
        useCallback(() => {
            loadBooksFromStorage();
        }, [loadBooksFromStorage])
    );
    
    
    // --- FUNÇÃO PRINCIPAL DE ORDENAÇÃO ---
    const sortBooks = (option: FilterOption, list: BookListItem[]): BookListItem[] => {
        const sortedList = [...list]; 

        switch (option) {
            case 'Data de Cadastro':
                sortedList.sort((a, b) => b.registrationDate.getTime() - a.registrationDate.getTime());
                break;
            case 'Título':
                sortedList.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
                break;
            case 'Autor':
                sortedList.sort((a, b) => a.author.toLowerCase().localeCompare(b.author.toLowerCase()));
                break;
            case 'Avaliação':
                sortedList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                break;
        }

        return sortedList;
    };
    
    // --- USE EFFECT PARA APLICAR FILTRAGEM E ORDENAÇÃO ---
    useEffect(() => {
        let filteredList = [...allBooks];

        if (searchText) {
            const lowerSearchText = searchText.toLowerCase();
            filteredList = filteredList.filter(book => 
                book.title.toLowerCase().includes(lowerSearchText) || 
                book.author.toLowerCase().includes(lowerSearchText) ||
                book.genre.toLowerCase().includes(lowerSearchText) 
            );
        }

        const finalDisplayedList = sortBooks(selectedSort, filteredList);
        
        setDisplayedBooks(finalDisplayedList);

    }, [allBooks, selectedSort, searchText]); 
    

    const handleSearch = (text: string) => { 
        setSearchText(text);
    };
    
    const handleAddBook = () => {
        navigation.navigate('BookForm', {}); 
    };
    
    const handleBookPress = (bookId: string) => {
        navigation.navigate('BookDetail', { bookId });
    };

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    }

    const handleSortSelect = (option: FilterOption) => {
        setSelectedSort(option); 
        setIsDropdownVisible(false); 
    };
    
    const renderBookItem = ({ item }: ListRenderItemInfo<BookListItem>) => (
        <BookCard 
            book={item} 
            onPress={() => handleBookPress(item.id)} 
        />
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            <View style={{ flex: 1 }}>
                
                {/* 1. ÁREA SUPERIOR */}
                <View style={styles.topContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Minha Biblioteca</Text>
                        
                        {/* BOTÃO ADICIONAR (ÚNICO NO CANTO) */}
                        <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
                            <Icon name="plus" size={18} color={colors.primary} /> 
                            <Text style={styles.addButtonText}>Adicionar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.searchBarWrapper}>
                        <View style={styles.searchBar}>
                        <Icon name="search" size={20} color={colors.mutedForeground} style={{ marginRight: spacing['2'] }} />
                        <TextInput
                            placeholder="Buscar por título, autor ou gênero" 
                            style={styles.searchInput}
                            placeholderTextColor={colors.mutedForeground}
                            onChangeText={handleSearch}
                            value={searchText}
                        />
                        </View>
                    </View>
                </View>

                {/* 2. BARRA DE FILTRO */}
                <View style={styles.filterBar}>
                    {/* Botão de Ordenação (Abre o Dropdown) */}
                    <TouchableOpacity 
                        style={[styles.filterButton, styles.sortButtonActive]} 
                        onPress={toggleDropdown}
                    >
                        <Icon name="trending-up" size={16} color={colors.foreground} /> 
                        <Text style={styles.filterText}>Ordenar: {selectedSort}</Text> 
                        <Icon name="chevron-down" size={16} color={colors.foreground} style={{ marginLeft: spacing['1'] }} />
                    </TouchableOpacity>
                    <Text style={styles.countText}>
                        {displayedBooks.length} livro{displayedBooks.length !== 1 ? 's' : ''}
                    </Text>
                </View>

                {/* 3. LISTA DE LIVROS */}
                <FlatList
                    data={displayedBooks} 
                    keyExtractor={item => item.id} 
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    renderItem={renderBookItem} 
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum livro encontrado. 📚</Text>}
                />
            </View>

            {/* 4. RENDERIZAÇÃO DO DROPDOWN */}
            <FilterDropdown 
                isVisible={isDropdownVisible}
                onClose={toggleDropdown}
                onSelect={handleSortSelect}
                selectedOption={selectedSort}
                topPosition={165 + spacing['3']} 
                leftPosition={spacing['6']} 
            />
        </SafeAreaView>
    );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: colors.background 
    },
    topContainer: {
        backgroundColor: colors.primary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing['6'],
        paddingTop: spacing['4'], 
        paddingBottom: spacing['3'], 
        backgroundColor: colors.primary, 
        // Altura restaurada (ou ajustada, já que o botão reset não está mais lá)
        minHeight: 56, 
    },
    headerTitle: {
        fontSize: typography.h3?.fontSize || 24, 
        color: colors.primaryForeground, 
        fontWeight: '600',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card, 
        borderRadius: borderRadius.md || 8, 
        paddingVertical: spacing['2'],
        paddingHorizontal: spacing['3'],
        ...shadows.sm,
    },
    addButtonText: {
        fontSize: typography.small?.fontSize || 14,
        color: colors.primary, 
        fontWeight: '600',
        marginLeft: spacing['1'],
    },
    searchBarWrapper: {
        paddingHorizontal: spacing['6'],
        paddingBottom: spacing['4'], 
        backgroundColor: colors.primary, 
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card, 
        borderRadius: borderRadius.lg || 10,
        paddingHorizontal: spacing['4'],
        height: 48,
        ...shadows.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: typography.body?.fontSize || 16,
        color: colors.foreground,
        paddingVertical: 0, 
    },
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingHorizontal: spacing['6'],
        paddingTop: spacing['4'], 
        paddingBottom: spacing['4'],
        backgroundColor: colors.background, 
        borderBottomWidth: 1, 
        borderBottomColor: colors.border,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing['2'],
        paddingHorizontal: spacing['3'],
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md || 8,
        backgroundColor: colors.card, 
    },
    sortButtonActive: {
        borderColor: colors.border, 
        backgroundColor: colors.card,
    },
    filterText: {
        fontSize: typography.small?.fontSize || 14,
        color: colors.foreground,
        marginLeft: spacing['1'],
    },
    countText: {
        fontSize: typography.small?.fontSize || 14,
        color: colors.mutedForeground,
        fontWeight: '500',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: spacing['4'], 
        marginBottom: spacing['4'],
    },
    listContent: {
        paddingTop: spacing['4'],
    },
    emptyText: {
        textAlign: 'center',
        marginTop: spacing['8'],
        fontSize: 18, 
        color: colors.mutedForeground,
    }
});
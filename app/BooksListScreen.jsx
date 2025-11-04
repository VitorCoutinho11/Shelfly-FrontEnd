import React from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
// Componentes necessários para a visualização
import BookCard from '../components/BookCard/index.jsx'; 
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

// Importa o Theme
import Theme from '../theme/index.js'; 
const { colors, spacing, typography, borderRadius, shadows } = Theme; 

const sample = [
  // Mock data
  { id:'1', title:'O Nome do Vento', author:'Patrick Rothfuss', cover:'https://picsum.photos/200/300?random=1', status:'Lido', rating:4.5, coverImage: 'URL_CAPA_1' },
  { id:'2', title:'A Paciente Silenciosa', author:'Alex Michaelides', cover:'https://picsum.photos/200/300?random=2', status:'Lendo', progress:65, coverImage: 'URL_CAPA_2' },
  { id:'3', title:'Orgulho e Preconceito', author:'Jane Austen', cover:'https://picsum.photos/200/300?random=3', status:'Quero Ler', coverImage: 'URL_CAPA_3' },
  { id:'4', title:'Fundação', author:'Isaac Asimov', cover:'https://picsum.photos/200/300?random=4', status:'Lido', rating:3.5, coverImage: 'URL_CAPA_4' },
  { id:'5', title:'O Hobbit', author:'J.R.R. Tolkien', cover:'https://picsum.photos/200/300?random=5', status:'Lido', rating:5.0, coverImage: 'URL_CAPA_5' },
];

// O componente NavBar customizado FOI REMOVIDO daqui pois o AppStack já gerencia o BottomTabNavigator.

export default function BooksListScreen({ navigation }) {
    const [searchText, setSearchText] = React.useState('');
    
    const handleSearch = (text) => { 
        setSearchText(text);
        // Lógica de filtragem dos dados viria aqui
    };
    
    const handleAddBook = () => {
        // Corrigido para a rota 'BookForm'
        navigation.navigate('BookForm');
    };
    
    // Ação ao clicar no card, navegando para a tela de detalhes
    const handleBookPress = (bookId) => {
        navigation.navigate('BookDetail', { bookId });
    };

    return (
        // SafeAreaView deve ter o background principal para cobrir a área acima do Status Bar
        <SafeAreaView style={styles.safeArea}>
            {/* O Status bar é definido como light-content para ser legível no fundo primário (verde) */}
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            <View style={{ flex: 1 }}>
                
                {/* 1. ÁREA SUPERIOR: TÍTULO, BOTÃO ADICIONAR E BUSCA */}
                <View style={styles.topContainer}>
                    {/* TÍTULO E BOTÃO ADICIONAR */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Minha Biblioteca</Text>
                        <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
                            <Icon name="plus" size={18} color={colors.primary} /> 
                            <Text style={styles.addButtonText}>Adicionar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* BARRA DE BUSCA */}
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

                {/* 2. FILTRO E ORDENAÇÃO */}
                <View style={styles.filterBar}>
                    <TouchableOpacity style={styles.filterButton}>
                        <Icon name="filter" size={16} color={colors.foreground} />
                        <Text style={styles.filterText}>Filtrar</Text> 
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.filterButton}>
                        <Icon name="arrow-down" size={16} color={colors.foreground} /> 
                        <Text style={styles.filterText}>Data de Cadastro</Text>
                        <Icon name="chevron-down" size={16} color={colors.foreground} style={{ marginLeft: spacing['1'] }} />
                    </TouchableOpacity>
                </View>

                {/* 3. LISTA DE LIVROS */}
                <FlatList
                    data={sample}
                    keyExtractor={i => i.id}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <BookCard 
                            book={item} 
                            onPress={() => handleBookPress(item.id)} 
                        />
                    )}
                />
            </View>
            
            {/* A NavBar customizada FOI REMOVIDA AQUI, 
                pois o BottomTabNavigator do React Navigation cuidará disso. 
            */}
        </SafeAreaView>
    );
}

// ... (Estilos mantidos)
const styles = StyleSheet.create({
    // ... (Estilos originais da BooksListScreen)
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
    },
    headerTitle: {
        // Corrigido para ser compatível com o Theme de cores
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
        shadowColor: shadows.sm?.shadowColor, // Adicionado para consistência
        shadowOffset: shadows.sm?.shadowOffset,
        shadowOpacity: shadows.sm?.shadowOpacity,
        shadowRadius: shadows.sm?.shadowRadius,
        elevation: shadows.sm?.elevation,
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
        shadowColor: shadows.sm?.shadowColor,
        shadowOffset: shadows.sm?.shadowOffset,
        shadowOpacity: shadows.sm?.shadowOpacity,
        shadowRadius: shadows.sm?.shadowRadius,
        elevation: shadows.sm?.elevation,
    },
    searchInput: {
        flex: 1,
        fontSize: typography.body?.fontSize || 16,
        color: colors.foreground,
        paddingVertical: 0, 
    },
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: spacing['6'],
        paddingTop: spacing['4'], 
        paddingBottom: spacing['4'],
        backgroundColor: colors.background, 
        gap: spacing['3'],
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
    filterText: {
        fontSize: typography.small?.fontSize || 14,
        color: colors.foreground,
        marginLeft: spacing['1'],
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: spacing['4'], 
        marginBottom: spacing['4'],
    },
    listContent: {
        paddingTop: spacing['4'],
    },
    // Estilos da NavBar customizada foram removidos
});
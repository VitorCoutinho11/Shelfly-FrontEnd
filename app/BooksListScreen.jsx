import React from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
// Componentes necessários para a visualização
import BookCard from '../components/BookCard/index.jsx'; 
import Icon from 'react-native-vector-icons/Feather';

// Importa o Theme
import Theme from '../theme/index.js'; 
// CORREÇÃO CRÍTICA: Desestruturando 'borderRadius' (nome correto no seu tema)
const { colors, spacing, typography, borderRadius, shadows } = Theme; 

const sample = [
  // Mock data replicando a imagem e os status (RF02.02)
  { id:'1', title:'O Nome do Vento', author:'Patrick Rothfuss', cover:'https://picsum.photos/200/300?random=1', status:'Lido', rating:4.5 },
  { id:'2', title:'A Paciente Silenciosa', author:'Alex Michaelides', cover:'https://picsum.photos/200/300?random=2', status:'Lendo', progress:65 },
  { id:'3', title:'Quero Ler TIKTOK', author:'Hazelwood', cover:'https://picsum.photos/200/300?random=3', status:'Quero Ler' },
  { id:'4', title:'Lido Scifi', author:'Crichton', cover:'https://picsum.photos/200/300?random=4', status:'Lido' },
];

export default function BooksListScreen({ navigation }) {
  
  // RF04.01 - Função para busca.
  const handleSearch = (text) => {
    // Lógica futura: aplicar filtro na lista de livros baseado no texto
  };

  // RF02.01 - Função para ir para a tela de cadastro/adição de livro
  const handleAddBook = () => {
    navigation.navigate('AddEditBook');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. CABEÇALHO FIXO COM TÍTULO E BOTÃO ADICIONAR */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minha Biblioteca</Text>
        {/* RF02.01: Botão Adicionar Livro */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
          {/* AGORA VERDE: colors.primary */}
          <Icon name="plus" size={18} color={colors.primary} /> 
          <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
      </View>

      {/* 2. BARRA DE BUSCA (RF04.01) */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={colors.mutedForeground} style={{ marginRight: spacing['2'] }} />
          <TextInput
            placeholder="Buscar por título, autor ou gênero..." 
            style={styles.searchInput}
            placeholderTextColor={colors.mutedForeground}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* 3. FILTRO E ORDENAÇÃO (RF04.02 e RF04.03) */}
      <View style={styles.filterBar}>
        {/* RF04.02: Filtro */}
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter" size={16} color={colors.foreground} />
          <Text style={styles.filterText}>Filtrar</Text> 
        </TouchableOpacity>

        {/* RF04.03: Ordenação */}
        <TouchableOpacity style={styles.filterButton}>
          {/* O ícone Feather 'arrow-up-down' não existe; usando 'bar-chart' ou 'arrow-down-up' */}
          <Icon name="arrow-up" size={16} color={colors.foreground} /> 
          <Text style={styles.filterText}>Data de Cadastro</Text>
        </TouchableOpacity>
        {/* Adicione um ícone de dropdown (Chevron down) ao lado do texto de ordenação, se quiser replicar a imagem fielmente */}
      </View>

      {/* 4. LISTA DE LIVROS (RF04) */}
      <FlatList
        data={sample}
        keyExtractor={i => i.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <BookCard 
            book={item} 
            // Navega para a tela de detalhes (RF02.02, RF03)
            onPress={() => navigation.navigate('BookDetail', { bookId: item.id })} 
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (Estilos da tela e listagem)
  safeArea: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['4'],
    // NOVO: Fundo VERDE para o cabeçalho
    backgroundColor: colors.primary, 
    ...shadows.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary, // Mantém a cor da borda consistente
  },
  headerTitle: {
    ...typography.h2,
    // NOVO: Cor BRANCA para o título
    color: colors.primaryForeground, 
  },
  // ESTILO DO BOTÃO ADICIONAR (AGORA COM FUNDO BRANCO)
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // NOVO: Fundo BRANCO
    backgroundColor: colors.card, 
    borderRadius: borderRadius.md, 
    paddingVertical: spacing['2'],
    paddingHorizontal: spacing['3'],
  },
  // ESTILO DO TEXTO DO BOTÃO ADICIONAR (AGORA VERDE)
  addButtonText: {
    ...typography.small,
    // NOVO: Cor VERDE
    color: colors.primary, 
    fontWeight: '600',
    marginLeft: spacing['1'],
  },
  // NOVO: Fundo VERDE para o container da barra de busca
  searchBarContainer: {
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['4'],
    backgroundColor: colors.primary, 
  },
  // O restante dos estilos permanece o mesmo...
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing['4'],
    height: 48,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.foreground,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing['6'],
    paddingTop: spacing['3'],
    paddingBottom: spacing['4'],
    // O filtro pode ter fundo BRANCO para contraste, como se fosse um painel separado
    backgroundColor: colors.card,
    gap: spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing['2'],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  filterText: {
    ...typography.small,
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
    paddingBottom: spacing['8'],
  },
});
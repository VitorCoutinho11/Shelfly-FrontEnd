import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from 'react-native';

// Removidas todas as importações de bibliotecas de ícones

// Mocks para funções de storage e tipos
import Theme from '../theme/index.js';

// --- Mocks (mantidos) ---
const mockBook = {
    id: '1',
    title: 'O Nome do Vento', 
    author: 'Patrick Rothfuss',
    cover: 'https://picsum.photos/400/600', 
    genre: 'Fantasia',
    year: 2007,
    status: 'read', 
    synopsis: 'Uma história épica sobre Kvothe, um lendário mago, músico e assassino.',
    totalPages: 699,
    pagesRead: 699,
    progress: 100,
    rating: 4,
    review: 'Uma história envolvente e maravilhosamente escrita. Um dos melhores inícios de saga.',
};

const mockReviews = [
    { id: 'r1', userName: 'João Santos', rating: 4, comment: 'Excelente leitura! Recomendo muito.', date: new Date().toISOString() },
    { id: 'r2', userName: 'Ana Costa', rating: 5, comment: 'Um dos melhores livros que já li. Não consegui parar de ler!', date: new Date().toISOString() },
];

const getBookByIdMock = (id) => {
    if (id === '1') return { ...mockBook };
    return null;
};
// --- Fim dos Mocks ---

// Desestrutura o tema
const { colors, spacing, typography } = {
  ...Theme,
  colors: {
      ...Theme.colors,
      statusWantBg: '#E0E7FF', 
      statusReadingBg: '#FEF9C3', 
      statusReadBg: '#D1FAE5', 
      statusReadBorder: '#34D399', 
      statusWantText: '#1D4ED8',
      statusReadingText: '#B45309',
      statusReadText: '#047857',
      cardForeground: Theme.colors.foreground || '#1C1C1E',
      mutedForeground: Theme.colors.mutedForeground || '#717182',
  },
  spacing: Theme.spacing || { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 },
  typography: Theme.typography || { body: { fontSize: 16 }, small: { fontSize: 14 }, button: { fontSize: 16 } }
};


// Componente simples para os Status Tags (Gênero/Ano/Lido)
const InfoTag = ({ text, isPrimary = false, emoji }) => (
    <View style={[stylesLocal.tagContainer, isPrimary ? stylesLocal.tagPrimary : stylesLocal.tagMuted]}>
        {emoji && <Text style={[stylesLocal.tagEmoji, isPrimary && { color: colors.primaryForeground }]}>{emoji}</Text>}
        <Text style={[stylesLocal.tagText, isPrimary ? stylesLocal.tagPrimaryText : stylesLocal.tagMutedText]}>{text}</Text>
    </View>
);

// Componente simples de StarRating (MOCK para visualização)
const StarRating = ({ rating, size = 'sm' }) => {
    const maxStars = 5;
    const starSize = size === 'sm' ? 16 : 24;
    return (
        <View style={{ flexDirection: 'row' }}>
            {Array.from({ length: maxStars }, (_, index) => (
                // Usando o caractere Unicode da estrela
                <Text key={index} style={{ fontSize: starSize, color: index < rating ? colors.accent : colors.mutedForeground, paddingHorizontal: 1 }}>★</Text>
            ))}
        </View>
    );
};

// --- Componente Principal ---

export default function BookDetailScreen({ bookId = '1', onBack = () => {}, onEdit = () => {} }) {
  
  const [book, setBook] = useState(getBookByIdMock(bookId));
  const [reviews, setReviews] = useState(mockReviews);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(book?.rating || 0);

  if (!book) {
    return (
      <View style={[stylesLocal.fullScreenContainer, stylesLocal.centerContent]}>
        <Text style={{ color: colors.mutedForeground, marginBottom: spacing[4] }}>Livro não encontrado</Text>
        <TouchableOpacity onPress={onBack} style={stylesLocal.actionButton}>
             <Text style={stylesLocal.actionText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusLabels = {
    'want-to-read': 'Quero Ler',
    'reading': 'Lendo',
    'read': 'Lido',
  };
  
  const statusStyles = {
    'want-to-read': { bg: colors.statusWantBg, text: colors.statusWantText, border: '#60A5FA' },
    'reading': { bg: colors.statusReadingBg, text: colors.statusReadingText, border: '#FCD34D' },
    'read': { bg: colors.statusReadBg, text: colors.statusReadText, border: colors.statusReadBorder },
  };
  
  const handleStatusChange = (newStatus) => {
    setBook(prev => ({...prev, status: newStatus}));
  };
  
  const handleReviewClick = () => {
    setRating(book.rating || 0);
    setShowReviewModal(true);
  };
  
  const handleReviewSubmit = () => {
      Alert.alert('Avaliação Salva', `Você avaliou ${book.title} com ${rating} estrelas.`);
      setBook(prev => ({...prev, rating: rating}));
      setShowReviewModal(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir Livro",
      `Tem certeza que deseja excluir "${book.title}"?`,
      [{ text: "Cancelar", style: "cancel" }, { text: "Excluir", onPress: onBack, style: 'destructive' }]
    );
  };

  return (
    <View style={stylesLocal.fullScreenContainer}>
      <ScrollView>
        
        {/* Bloco da Capa (Imagem e Botões Flutuantes) */}
        <View style={stylesLocal.headerWrapper}>
            <Image source={{ uri: book.cover }} style={stylesLocal.cover} resizeMode="cover" />
            <View style={stylesLocal.headerOverlay} /> 

            {/* Botão de Voltar: Usando Emoji */}
            <TouchableOpacity onPress={onBack} style={stylesLocal.iconButtonBack}>
                <Text style={stylesLocal.actionIconText}>👈</Text>
            </TouchableOpacity>

            {/* Botões de Ação: Usando Emojis */}
            <View style={stylesLocal.iconButtonsRight}>
                <TouchableOpacity onPress={() => onEdit(book.id)} style={stylesLocal.iconButton}>
                    <Text style={stylesLocal.actionIconText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={[stylesLocal.iconButton, { backgroundColor: colors.destructive, opacity: 0.8 }]}>
                    <Text style={[stylesLocal.actionIconText, { color: colors.primaryForeground }]}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* Conteúdo Principal em Cards */}
        <View style={stylesLocal.contentContainer}>
          <View style={stylesLocal.card}>
            {/* Título e Autor */}
            <Text style={stylesLocal.title}>{book.title}</Text>
            <Text style={stylesLocal.author}>por {book.author}</Text>

            {/* Tags de Gênero, Ano e Status */}
            <View style={stylesLocal.tagsContainer}>
              <InfoTag text={book.genre} isPrimary={false} />
              <InfoTag text={String(book.year)} emoji="🗓️" />
              <InfoTag text={statusLabels[book.status]} isPrimary={false} />
            </View>
            
            {/* Botões de Status (Quero Ler, Lendo, Lido) */}
            <View style={stylesLocal.statusButtonsContainer}>
                {['want-to-read', 'reading', 'read'].map(statusKey => (
                    <TouchableOpacity
                        key={statusKey}
                        onPress={() => handleStatusChange(statusKey)}
                        style={[
                            stylesLocal.statusButton,
                            book.status === statusKey && {
                                backgroundColor: statusStyles[statusKey].bg,
                                borderColor: statusStyles[statusKey].border,
                            }
                        ]}
                    >
                        <Text style={[
                            stylesLocal.statusButtonText,
                            book.status === statusKey && { color: statusStyles[statusKey].text, fontWeight: '600' }
                        ]}>
                            {statusLabels[statusKey]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Seção de Avaliação (Visível quando 'Lido') */}
            {book.status === 'read' && (
                <View style={{ marginTop: spacing[4] }}>
                    <Text style={stylesLocal.sectionTitleSmall}>Sua Avaliação</Text>
                    <View style={stylesLocal.ratingSection}>
                        <StarRating rating={book.rating || 0} size="sm" />
                        <TouchableOpacity 
                            onPress={handleReviewClick} 
                            style={stylesLocal.editRatingButton}
                        >
                            <Text style={stylesLocal.editRatingText}>
                                {book.rating ? 'Editar Avaliação' : 'Avaliar Livro'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            
            {/* Sinopse */}
            <View style={{ marginTop: spacing[4] }}>
                <Text style={stylesLocal.sectionTitleSmall}>Sinopse</Text>
                <Text style={stylesLocal.synopsisText}>{book.synopsis}</Text>
            </View>

          </View>

          {/* Avaliações da Comunidade */}
          {book.status === 'read' && reviews.length > 0 && (
            <View style={stylesLocal.card}>
                <Text style={stylesLocal.sectionTitle}>Avaliações da Comunidade</Text>
                {reviews.map((review, index) => (
                    <View key={review.id} style={[stylesLocal.reviewItem, index < reviews.length - 1 && stylesLocal.reviewSeparator]}>
                        <View style={stylesLocal.avatar}>
                            {/* Ícone de usuário com Emoji */}
                            <Text style={{ fontSize: 20 }}>👤</Text>
                        </View>
                        <View style={stylesLocal.reviewInfo}>
                            <View style={stylesLocal.reviewHeader}>
                                <Text style={stylesLocal.reviewUserName}>{review.userName}</Text>
                                <StarRating rating={review.rating} size="sm" />
                            </View>
                            <Text style={stylesLocal.reviewDate}>{new Date(review.date).toLocaleDateString('pt-BR')}</Text>
                            <Text style={stylesLocal.reviewComment}>{review.comment}</Text>
                        </View>
                    </View>
                ))}
            </View>
          )}

        </View>
      </ScrollView>

      {/* --- MODAL DE AVALIAÇÃO (Simplificado) --- */}
      <Modal
        visible={showReviewModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={stylesLocal.modalOverlay}>
          <View style={stylesLocal.modalContent}>
            <Text style={stylesLocal.modalTitle}>Avaliar Livro</Text>
            
            <View style={stylesLocal.modalInputGroup}>
                <Text style={stylesLocal.inputLabel}>Avaliação</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: spacing[2] }}>
                    {[1, 2, 3, 4, 5].map(star => (
                        <TouchableOpacity key={star} onPress={() => setRating(star)} style={{ paddingHorizontal: spacing[1] }}>
                             {/* Usando o caractere Unicode da estrela para seleção */}
                             <Text style={{ fontSize: 30, color: star <= rating ? colors.accent : colors.mutedForeground }}>★</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            
            <View style={stylesLocal.modalInputGroup}>
                <Text style={stylesLocal.inputLabel}>Resenha</Text>
                <TextInput style={[stylesLocal.textInput, stylesLocal.textArea]} multiline placeholder="O que você achou?" />
            </View>

            <View style={stylesLocal.modalFooter}>
                <TouchableOpacity onPress={() => setShowReviewModal(false)} style={[stylesLocal.modalButton, { borderColor: colors.border, borderWidth: 1 }]}>
                    <Text style={stylesLocal.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReviewSubmit} style={[stylesLocal.modalButton, { backgroundColor: colors.primary }]}>
                    <Text style={[stylesLocal.modalButtonText, { color: colors.primaryForeground }]}>Salvar</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


// --- ESTILOS ---
const stylesLocal = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    // --- Header e Capa ---
    headerWrapper: {
        height: 320, 
        position: 'relative',
    },
    cover: {
        width: '100%',
        height: 320,
    },
    headerOverlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
        ...StyleSheet.absoluteFillObject,
        top: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.4)', 
    },
    iconButtonBack: {
        position: 'absolute',
        top: spacing[6],
        left: spacing[4],
        width: spacing[10], 
        height: spacing[10],
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconButtonsRight: {
        position: 'absolute',
        top: spacing[6],
        right: spacing[4],
        flexDirection: 'row',
        gap: spacing[2],
    },
    iconButton: {
        width: spacing[10],
        height: spacing[10],
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIconText: {
        fontSize: 16, // Tamanho base para o emoji
        color: colors.cardForeground, // Cor padrão, mas o emoji pode sobrescrever
    },

    // --- Conteúdo Principal ---
    contentContainer: {
        paddingHorizontal: spacing[4],
        marginTop: -spacing[10], 
        paddingBottom: spacing[4],
        zIndex: 10,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: spacing[4], 
        padding: spacing[6],
        marginBottom: spacing[4],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24, 
        fontWeight: 'bold',
        marginBottom: spacing[1],
        color: colors.foreground,
    },
    author: {
        ...typography.body,
        color: colors.mutedForeground,
        marginBottom: spacing[4],
    },
    
    // --- Tags ---
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing[2],
        marginBottom: spacing[6],
    },
    tagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1],
        borderRadius: 9999,
    },
    tagEmoji: {
        fontSize: 12,
        marginRight: spacing[1],
    },
    tagPrimary: {
        backgroundColor: colors.primary,
    },
    tagPrimaryText: {
        ...typography.small,
        color: colors.primaryForeground,
        fontWeight: '500',
    },
    tagMuted: {
        backgroundColor: colors.muted,
    },
    tagMutedText: {
        ...typography.small,
        color: colors.cardForeground,
        fontWeight: '500',
    },
    
    // --- Botões de Status ---
    statusButtonsContainer: {
        flexDirection: 'column',
        gap: spacing[3],
        marginBottom: spacing[4],
    },
    statusButton: {
        backgroundColor: colors.muted,
        padding: spacing[3],
        borderRadius: 8, 
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.muted,
    },
    statusButtonText: {
        ...typography.body,
        color: colors.cardForeground,
    },
    
    // --- Seção de Avaliação ---
    ratingSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing[2],
        marginBottom: spacing[4],
        paddingVertical: spacing[2],
    },
    editRatingButton: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    editRatingText: {
        ...typography.small,
        color: colors.primaryForeground,
        fontWeight: '600',
    },
    sectionTitleSmall: {
        ...typography.body,
        fontWeight: '600',
        color: colors.foreground,
    },
    synopsisText: {
        ...typography.small,
        color: colors.mutedForeground,
        lineHeight: typography.small.lineHeight * 1.2,
    },

    // --- Avaliações da Comunidade ---
    sectionTitle: {
        fontSize: 18, 
        fontWeight: '600',
        marginBottom: spacing[4],
        color: colors.foreground,
    },
    reviewItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: spacing[3],
    },
    reviewSeparator: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        marginBottom: spacing[3],
    },
    avatar: {
        width: spacing[10],
        height: spacing[10],
        borderRadius: 9999,
        backgroundColor: colors.muted,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing[3],
        flexShrink: 0,
    },
    reviewInfo: {
        flex: 1,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing[1],
    },
    reviewUserName: {
        ...typography.body,
        fontWeight: '500',
        color: colors.foreground,
    },
    reviewDate: {
        fontSize: 12, 
        color: colors.mutedForeground,
        marginBottom: spacing[1],
    },
    reviewComment: {
        ...typography.small,
        color: colors.foreground,
    },
    
    // --- Modal Styles ---
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: spacing[4],
    },
    modalContent: {
        width: '90%',
        backgroundColor: colors.card,
        borderRadius: spacing[4],
        padding: spacing[6],
    },
    modalTitle: {
        fontSize: 20, 
        fontWeight: '600',
        marginBottom: spacing[1],
    },
    modalInputGroup: {
        marginBottom: spacing[4],
    },
    inputLabel: {
        ...typography.small,
        fontWeight: '500',
        marginBottom: spacing[1],
    },
    textInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 4,
        padding: spacing[3],
        backgroundColor: colors.inputBackground,
        color: colors.foreground,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalFooter: {
        flexDirection: 'row',
        gap: spacing[2],
        marginTop: spacing[4],
    },
    modalButton: {
        flex: 1,
        paddingVertical: spacing[3],
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonText: {
        ...typography.button,
        color: colors.foreground,
    },
});
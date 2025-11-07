import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle
} from 'react-native';

// Importando sem .js
import Theme from '../../theme/index'; 

// --- 💡 SIMULAÇÃO DE TIPOS DO THEME ---
interface ThemeColors {
  card: string;
  foreground: string;
  mutedForeground: string;
  // Cores de Status
  statusWantBg: string;
  statusWantText: string;
  statusReadingBg: string;
  statusReadingText: string;
  statusReadBg: string;
  statusReadText: string;
}
interface ThemeBorderRadius {
  lg: number;
}
interface AppTheme {
  colors: ThemeColors;
  borderRadius: ThemeBorderRadius;
}
const { colors, borderRadius } = Theme as AppTheme;
// --- FIM DA SIMULAÇÃO DE TIPOS ---


// --- 💡 DEFINIÇÃO DE TIPOS DE DADOS (CORRIGIDO) ---

// 1. O tipo de status em Português (como vem da sua lista)
type BookStatus = 'Lido' | 'Lendo' | 'Quero Ler';

// 2. Interface para a prop 'book'
interface Book {
  cover: string;
  status: BookStatus; // 👈 CORRIGIDO para aceitar o tipo em Português
  title: string;
  author: string;
}

// 3. Interface para as props do componente
interface BookCardProps {
  book: Book;
  onPress: () => void;
}

// --- FIM DOS TIPOS ---


// --- COMPONENTE PRINCIPAL (Corrigido) ---
export default function BookCard({ book, onPress }: BookCardProps){

  // 💡 CORRIGIDO: Chaves agora são em Português
  const statusStyles: { [key in BookStatus]: { backgroundColor: string, color: string } } = {
    'Quero Ler': { backgroundColor: colors.statusWantBg, color: colors.statusWantText },
    'Lendo': { backgroundColor: colors.statusReadingBg, color: colors.statusReadingText },
    'Lido': { backgroundColor: colors.statusReadBg, color: colors.statusReadText },
  };

  // 💡 CORRIGIDO: Chaves agora são em Português
  const statusLabels: { [key in BookStatus]: string } = { 
    'Quero Ler':'Quero Ler', 
    'Lendo':'Lendo', 
    'Lido':'Lido' 
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.coverContainer}>
        <Image source={{ uri: book.cover }} style={styles.cover} />
        {/* O TS agora sabe que book.status (ex: 'Lido') é uma chave válida */}
        <View style={[styles.statusBadge, {backgroundColor: statusStyles[book.status]?.backgroundColor}]}>
          <Text style={[styles.statusText, {color: statusStyles[book.status]?.color}]}>{statusLabels[book.status]}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
      </View>
    </TouchableOpacity>
  );
}

// --- 💡 Tipagem dos Estilos ---
type Styles = {
  card: ViewStyle;
  coverContainer: ViewStyle;
  cover: ImageStyle;
  statusBadge: ViewStyle;
  statusText: TextStyle;
  info: ViewStyle;
  title: TextStyle;
  author: TextStyle;
};

// --- ESTILOS (Tipados) ---
const styles = StyleSheet.create<Styles>({
  card:{ 
    width: 160, 
    backgroundColor: Theme.colors.card, 
    borderRadius: borderRadius.lg, 
    overflow:'hidden', 
    shadowColor:'#000', 
    shadowOffset:{width:0,height:2}, 
    shadowOpacity:0.1, 
    shadowRadius:4, 
    elevation:2 
  },
  coverContainer:{ 
    width:'100%', 
    aspectRatio:2/3, 
    position:'relative' 
  },
  cover:{ 
    width:'100%', 
    height:'100%' 
  },
  statusBadge:{ 
    position:'absolute', 
    top:8, 
    right:8, 
    paddingHorizontal:8, 
    paddingVertical:4, 
    borderRadius:6 
  },
  statusText:{ 
    fontSize:12, 
    fontWeight:'500' 
  },
  info:{ 
    padding:12 
  },
  title:{ 
    fontSize:18, 
    fontWeight:'500', 
    marginBottom:4, 
    color: Theme.colors.foreground 
  },
  author:{ 
    fontSize:14, 
    color: Theme.colors.mutedForeground 
  },
});
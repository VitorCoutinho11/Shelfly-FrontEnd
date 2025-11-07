import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  // 💡 1. Importar os tipos de estilo é uma boa prática
  ViewStyle,
  TextStyle
} from 'react-native';

// 💡 2. Importar o Theme (sem .js)
import Theme from '../../theme/index';

// --- 💡 3. SIMULAÇÃO DE TIPOS DO THEME ---
// (Isso corrige os erros em 'styles' informando ao TS o que 'Theme' contém)
interface ThemeColors {
  border: string;
  card: string;
  foreground: string; // Adicionado para a cor do título
}
interface AppTheme {
  colors: ThemeColors;
}
// Aplicando o tipo ao Theme importado
const { colors } = Theme as AppTheme;
// --- FIM DA SIMULAÇÃO ---


// --- 💡 4. DEFINIÇÃO DAS PROPS ---
// (Esta é a correção principal para o seu erro 'any')
interface HeaderProps {
  title: string;
}
// --- FIM DOS TIPOS ---


// --- COMPONENTE PRINCIPAL (Tipado) ---
// 💡 5. Aplicando a interface 'HeaderProps' às props
export default function Header({ title }: HeaderProps){
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

// --- 💡 6. Tipagem dos Estilos ---
// (Isso informa ao TS que 'container' é um ViewStyle e 'title' é um TextStyle)
type Styles = {
  container: ViewStyle;
  title: TextStyle;
};

// --- ESTILOS (Tipados) ---
// 💡 7. Aplicando o tipo 'Styles' ao StyleSheet.create
const styles = StyleSheet.create<Styles>({
  container:{ 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border, 
    backgroundColor: colors.card 
  },
  title:{ 
    fontSize: 18, 
    fontWeight: '600',
    color: colors.foreground // Adicionando uma cor ao título
  }
});
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  // 💡 Importando tipos de estilo
  ViewStyle,
  TextStyle
} from 'react-native';

// 💡 Importando sem .js
import Theme from '../../theme/index';

// --- 💡 SIMULAÇÃO DE TIPOS DO THEME ---
interface ThemeColors {
  border: string;
  card: string;
  foreground: string; // Adicionado para o título
}
interface AppTheme {
  colors: ThemeColors;
}
// 💡 Aplicando o tipo ao Theme importado
const { colors } = Theme as AppTheme;
// --- FIM DA SIMULAÇÃO DE TIPOS ---


// --- 💡 DEFINIÇÃO DE TIPOS DE PROPS ---
interface HeaderProps {
  title: string;
}
// --- FIM DOS TIPOS ---


// --- COMPONENTE PRINCIPAL (Tipado) ---
export default function Header({ title }: HeaderProps){
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

// --- 💡 Tipagem dos Estilos ---
type Styles = {
  container: ViewStyle;
  title: TextStyle;
};

// --- ESTILOS (Tipados) ---
const styles = StyleSheet.create<Styles>({
  container:{ 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border, // Agora é 'colors'
    backgroundColor: colors.card // Agora é 'colors'
  },
  title:{ 
    fontSize: 18, 
    fontWeight: '600',
    color: colors.foreground // 💡 Cor adicionada
  }
});
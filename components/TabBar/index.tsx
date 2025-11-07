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
  card: string;
  border: string;
}
interface AppTheme {
  colors: ThemeColors;
}
// Aplicando o tipo ao Theme importado
const { colors } = Theme as AppTheme;
// --- FIM DA SIMULAÇÃO ---


// --- 💡 DEFINIÇÃO DE TIPOS DE PROPS ---
// Este componente não recebe props, então a interface é vazia
interface TabBarProps {}
// --- FIM DOS TIPOS ---


// --- COMPONENTE PRINCIPAL (Tipado) ---
export default function TabBar(props: TabBarProps){ 
  return (
    <View style={styles.bar}>
      <Text>TabBar</Text>
    </View>
  ); 
}

// --- 💡 Tipagem dos Estilos ---
type Styles = {
  bar: ViewStyle;
};

// --- ESTILOS (Tipados) ---
const styles = StyleSheet.create<Styles>({
  bar:{ 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: colors.card, 
    borderTopWidth: 1, 
    borderTopColor: colors.border, 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingBottom: 20 
  }
});
import React from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet,
  // 1. Importando o tipo base para as props do TextInput
  TextInputProps,
  // 2. Importando os tipos de estilo
  ViewStyle,
  TextStyle
} from 'react-native';

// 3. Importando o Theme (sem .js)
import Theme from '../../theme/index';

// --- 💡 4. SIMULAÇÃO DE TIPOS DO THEME (CORRIGIDA) ---
interface ThemeColors {
  inputBackground: string;
  foreground: string;
  // 👇 CORREÇÃO: Adicionada a propriedade que faltava
  mutedForeground: string; 
}
interface ThemeBorderRadius {
  [key: string]: number; 
}
interface AppTheme {
  colors: ThemeColors;
  borderRadius: ThemeBorderRadius;
}
// Aplicando o tipo ao Theme importado
const { colors, borderRadius } = Theme as AppTheme;
// --- FIM DA SIMULAÇÃO ---


// --- 💡 5. DEFINIÇÃO DAS PROPS ---
interface SearchBarProps extends TextInputProps {
  // Nenhuma prop customizada necessária por enquanto
}
// --- FIM DOS TIPOS ---


// --- COMPONENTE PRINCIPAL (Tipado) ---
export default function SearchBar(props: SearchBarProps){
  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Buscar livros" 
        // Agora 'colors.mutedForeground' é reconhecido
        placeholderTextColor={colors.mutedForeground || '#9CA3AF'} 
        {...props} 
        style={styles.input} 
      />
    </View>
  );
}

// --- 💡 7. Tipagem dos Estilos ---
type Styles = {
  container: ViewStyle;
  input: TextStyle;
};

// --- ESTILOS (Tipados) ---
const styles = StyleSheet.create<Styles>({
  container:{ 
    backgroundColor: colors.inputBackground, 
    borderRadius: 10, 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    marginHorizontal: 24, 
    marginVertical: 16 
  },
  input:{ 
    fontSize: 16,
    color: colors.foreground 
  }
});
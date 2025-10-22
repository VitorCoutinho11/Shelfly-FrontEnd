import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Theme from '../../theme/index.js';
export default function SearchBar(props){
  return (
    <View style={styles.container}>
      <TextInput {...props} placeholder="Buscar livros" style={styles.input} />
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ backgroundColor: Theme.colors.inputBackground, borderRadius:10, paddingHorizontal:16, paddingVertical:8, marginHorizontal:24, marginVertical:16 },
  input:{ fontSize:16 }
});

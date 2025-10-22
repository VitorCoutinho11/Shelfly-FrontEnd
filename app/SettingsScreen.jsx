import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import Theme from '../theme/index.js';
export default function SettingsScreen(){
  const { colors } = Theme;
  return (
    <View style={styles.container}>
      <View style={styles.row}><Text style={styles.label}>Notificações</Text><Switch value={false} /></View>
      <View style={styles.row}><Text style={styles.label}>Tema escuro</Text><Switch value={false} /></View>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, padding:24, backgroundColor: Theme.colors.background },
  row:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:12, borderBottomWidth:1, borderBottomColor: Theme.colors.border },
  label:{ fontSize:16 }
});

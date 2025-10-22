import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Theme from '../../theme/index.js';
export default function Header({ title }){
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ padding:16, borderBottomWidth:1, borderBottomColor: Theme.colors.border, backgroundColor: Theme.colors.card },
  title:{ fontSize:18, fontWeight:'600' }
});

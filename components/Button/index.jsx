import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Theme from '../../theme/index.js';
export default function Button({ children, onPress, variant='primary' }){
  const stylesBtn = variant === 'primary' ? styles.primary : styles.outline;
  return (
    <TouchableOpacity style={stylesBtn} onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  primary:{ backgroundColor: Theme.colors.primary, padding:12, borderRadius:8, alignItems:'center' },
  outline:{ backgroundColor:'transparent', borderWidth:1, borderColor: Theme.colors.border, padding:12, borderRadius:8, alignItems:'center' },
  text:{ color: Theme.colors.primaryForeground, fontWeight:'500' }
});

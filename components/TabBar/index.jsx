import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Theme from '../../theme/index.js';
export default function TabBar(){ return <View style={styles.bar}><Text>TabBar</Text></View>; }
const styles = StyleSheet.create({
  bar:{ position:'absolute', bottom:0, left:0, right:0, backgroundColor: Theme.colors.card, borderTopWidth:1, borderTopColor: Theme.colors.border, flexDirection:'row', justifyContent:'space-around', paddingBottom:20 }
});

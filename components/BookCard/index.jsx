import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Theme from '../../theme/index.js';
const { colors, borderRadius } = Theme;
export default function BookCard({ book, onPress }){
  const statusStyles = {
    'want-to-read': { backgroundColor: colors.statusWantBg, color: colors.statusWantText },
    'reading': { backgroundColor: colors.statusReadingBg, color: colors.statusReadingText },
    'read': { backgroundColor: colors.statusReadBg, color: colors.statusReadText },
  };
  const statusLabels = { 'want-to-read':'Quero Ler', 'reading':'Lendo', 'read':'Lido' };
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.coverContainer}>
        <Image source={{ uri: book.cover }} style={styles.cover} />
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
const styles = StyleSheet.create({
  card:{ width:160, backgroundColor: Theme.colors.card, borderRadius: borderRadius.lg, overflow:'hidden', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:2 },
  coverContainer:{ width:'100%', aspectRatio:2/3, position:'relative' },
  cover:{ width:'100%', height:'100%' },
  statusBadge:{ position:'absolute', top:8, right:8, paddingHorizontal:8, paddingVertical:4, borderRadius:6 },
  statusText:{ fontSize:12, fontWeight:'500' },
  info:{ padding:12 },
  title:{ fontSize:18, fontWeight:'500', marginBottom:4, color: Theme.colors.foreground },
  author:{ fontSize:14, color: Theme.colors.mutedForeground },
});

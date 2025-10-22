import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Theme from '../theme/index.js';

export default function BookDetailScreen(){
  const book = { title:'Dom Casmurro', author:'Machado de Assis', cover:'https://picsum.photos/400/600' };
  const { colors } = Theme;
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: book.cover }} style={styles.cover} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Marcar como Lendo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.destructive }]}>
          <Text style={[styles.actionText, { color: colors.destructiveForeground }]}>Deletar livro</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: Theme.colors.background },
  cover:{ width:'100%', aspectRatio:2/3, maxHeight:400 },
  info:{ paddingHorizontal:24, paddingVertical:24 },
  title:{ fontSize:28, fontWeight:'600', marginBottom:8 },
  author:{ fontSize:16, color: Theme.colors.mutedForeground, marginBottom:16 },
  actionButton:{ backgroundColor: Theme.colors.primary, paddingVertical:10, borderRadius:8, alignItems:'center', marginBottom:12 },
  actionText:{ color: Theme.colors.primaryForeground, fontSize:16, fontWeight:'500' },
});

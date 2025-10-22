import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Theme from '../theme/index.js';
import BookCard from '../components/BookCard/index.jsx';
const { colors, spacing, typography } = Theme;

export default function HomeScreen(){
  const trending = [
    {id:'1', title:'Dom Casmurro', author:'Machado de Assis', cover:'https://picsum.photos/200/300?random=11', status:'read'},
    {id:'2', title:'O Alquimista', author:'Paulo Coelho', cover:'https://picsum.photos/200/300?random=12', status:'want-to-read'},
  ];
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Olá — Bem-vindo</Text>
        <Text style={styles.subtitle}>Continue de onde parou</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tendências</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:16}}>
          {trending.map(b => <BookCard key={b.id} book={b} />)}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: Theme.colors.background },
  header:{ paddingHorizontal:24, paddingTop:24, paddingBottom:12 },
  welcome:{ fontSize:24, fontWeight:'500', marginBottom:4 },
  subtitle:{ color: Theme.colors.mutedForeground },
  section:{ marginTop:12 },
  sectionTitle:{ paddingHorizontal:24, fontSize:18, fontWeight:'500', marginBottom:8 }
});

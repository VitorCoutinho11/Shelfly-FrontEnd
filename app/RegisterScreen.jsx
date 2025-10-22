import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Theme from '../theme';

export default function RegisterScreen() {
  const { colors, spacing, typography, borderRadius } = Theme;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Criar conta</Text>
        <TextInput placeholder="Nome" style={styles.input} />
        <TextInput placeholder="Email" style={styles.input} />
        <TextInput placeholder="Senha" style={styles.input} secureTextEntry />
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Criar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { colors, spacing, typography, borderRadius } = Theme;

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.background, justifyContent:'center', alignItems:'center', paddingHorizontal:spacing[6]||24 },
  card:{ width:'100%', maxWidth:420, backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing[6]||24 },
  title:{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, marginBottom:16 },
  input:{ backgroundColor: colors.inputBackground, borderWidth:1, borderColor: colors.inputBorder, borderRadius: borderRadius.md, padding:12, marginBottom:12 },
  primaryButton:{ backgroundColor: colors.primary, padding:12, borderRadius: borderRadius.md, alignItems:'center' },
  primaryButtonText:{ color: colors.primaryForeground, fontWeight:'500' }
});

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Theme from '../theme/index.js';

export default function LoginScreen(){
  const { colors, spacing, typography, borderRadius } = Theme;
  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        <View style={styles.logo}><Text style={styles.logoText}>S</Text></View>
        <Text style={styles.title}>Bem-vindo ao Shelfly</Text>
        <Text style={styles.subtitle}>Organize sua biblioteca pessoal de forma simples e bonita.</Text>

        <View style={styles.formField}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="seu@email.com" keyboardType="email-address" />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Senha</Text>
          <TextInput style={styles.input} placeholder="••••••••" secureTextEntry />
        </View>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { colors, spacing, typography, borderRadius } = require('../theme/index.js');

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.background, justifyContent:'center', alignItems:'center', paddingHorizontal: spacing[6] || 24 },
  loginCard:{ width:'100%', maxWidth:400, backgroundColor: colors.card, borderRadius: borderRadius['2xl'], padding: spacing[6] || 24, shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.1, shadowRadius:12, elevation:4 },
  logo:{ width:64, height:64, backgroundColor: colors.primary, borderRadius: borderRadius['2xl'], alignItems:'center', justifyContent:'center', marginBottom: spacing[4] || 16, alignSelf:'center' },
  logoText:{ color: colors.primaryForeground, fontSize:32, fontWeight:'600' },
  title:{ textAlign:'center', marginBottom: spacing[2] || 8, fontSize: typography.h1.fontSize, fontWeight: typography.h1.fontWeight },
  subtitle:{ textAlign:'center', color: colors.mutedForeground, marginBottom: spacing[8] || 32 },
  formField:{ marginBottom: spacing[4] || 16 },
  label:{ fontSize: typography.label.fontSize, fontWeight: typography.label.fontWeight, color: colors.foreground, marginBottom: spacing[2] || 8 },
  input:{ backgroundColor: colors.inputBackground, borderWidth:1, borderColor: colors.inputBorder, borderRadius: borderRadius.md, paddingHorizontal: spacing[3] || 12, paddingVertical: spacing[2] || 8, height:36, fontSize: typography.input.fontSize, color: colors.foreground },
  primaryButton:{ backgroundColor: colors.primary, paddingVertical:8, paddingHorizontal:16, borderRadius: borderRadius.md, height:36, alignItems:'center', justifyContent:'center', marginTop:12 },
  primaryButtonText:{ color: colors.primaryForeground, fontSize: typography.button.fontSize, fontWeight: typography.button.fontWeight },
  outlineButton:{ backgroundColor:'transparent', borderWidth:1, borderColor: colors.border, paddingVertical:8, paddingHorizontal:16, borderRadius: borderRadius.md, height:36, alignItems:'center', justifyContent:'center', marginTop:12 },
  outlineButtonText:{ color: colors.foreground, fontSize: typography.button.fontSize, fontWeight: typography.button.fontWeight },
});

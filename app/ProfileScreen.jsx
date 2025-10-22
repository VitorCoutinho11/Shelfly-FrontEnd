import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Theme from '../theme/index.js';
export default function ProfileScreen(){
  const { colors } = Theme;
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}><Text style={styles.avatarText}>VM</Text></View>
        <Text style={styles.profileName}>Vitor Medeiros</Text>
        <Text style={styles.profileEmail}>vitor@example.com</Text>
      </View>

      <View style={styles.settingsList}>
        <TouchableOpacity style={styles.settingsItem}><Text style={styles.settingsText}>Conta</Text></TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}><Text style={styles.settingsText}>Preferências</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.settingsItem, {backgroundColor:Theme.colors.card}]}><Text style={styles.settingsText}>Sair</Text></TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: Theme.colors.background },
  profileHeader:{ alignItems:'center', paddingVertical:32, backgroundColor: Theme.colors.card, borderBottomWidth:1, borderBottomColor: Theme.colors.border },
  avatar:{ width:96, height:96, borderRadius:48, backgroundColor: Theme.colors.primary, alignItems:'center', justifyContent:'center', marginBottom:16 },
  avatarText:{ fontSize:40, fontWeight:'600', color: Theme.colors.primaryForeground },
  profileName:{ fontSize:20, fontWeight:'500', marginBottom:4 },
  profileEmail:{ fontSize:14, color: Theme.colors.mutedForeground },
  settingsList:{ paddingVertical:16 },
  settingsItem:{ flexDirection:'row', alignItems:'center', paddingHorizontal:24, paddingVertical:16, backgroundColor: Theme.colors.card, borderBottomWidth:1, borderBottomColor: Theme.colors.border },
  settingsText:{ flex:1, fontSize:16 },
});

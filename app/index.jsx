import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import LoginScreen from './LoginScreen.jsx';
import ProfileScreen from './ProfileScreen.jsx';
import BooksListScreen from './BooksListScreen.jsx';
export default function App(){
  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#FFFFFF'}}>
      <StatusBar barStyle="dark-content" />
      <BooksListScreen/>
    </SafeAreaView>
  );
}

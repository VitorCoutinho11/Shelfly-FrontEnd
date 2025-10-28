import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import LoginScreen from './LoginScreen.jsx';
import ProfileScreen from './ProfileScreen.jsx';
import BooksListScreen from './BooksListScreen.jsx';
import RegisterScreen from './RegisterScreen.jsx'
import BookDetailScreen from './BookDetailScreen.jsx';
import HomeScreen from './HomeScreen.jsx';
export default function App(){
  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#FFFFFF'}}>
      <StatusBar barStyle="dark-content" />
      <ProfileScreen/>
    </SafeAreaView>
  );
}

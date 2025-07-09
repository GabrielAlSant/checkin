import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import 'react-native-gesture-handler';
import { RouterApp } from './lib/router';

export default function App() {
  return (
    <RouterApp />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

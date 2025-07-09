
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default function RelogioAtual() {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setHora(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
  <View>
  <Text style={styles.relogio}>{hora.toLocaleTimeString()}</Text>
  </View>
  )
  
}

const styles = StyleSheet.create({
  title:{
    fontSize:16,
    textAlign: 'center',
    color:"white"
  },
  relogio: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color:"white"
  },
});

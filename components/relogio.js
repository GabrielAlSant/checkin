
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';

export default function RelogioAtual() {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setHora(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <Text style={styles.relogio}>{hora.toLocaleTimeString()}</Text>;
}

const styles = StyleSheet.create({
  relogio: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});

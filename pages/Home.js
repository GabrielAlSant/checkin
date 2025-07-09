import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createTables, getAtividadesPorDia } from '../lib/database';


export default function Home(){
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
    const hoje = new Date();
    let dia = dias[hoje.getDay()]


    
 useEffect(() => {
        createTables();
    }, []);


    return(
        <View>
            <Text>Hoje é {dia}</Text>
        </View>
    )
}
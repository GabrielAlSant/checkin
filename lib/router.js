import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../pages/Home';
import DiaSemana from '../pages/DiaSemana';
import CriarAtividade from '../pages/CriarAtividade';
import EfetuarCheckin from '../pages/EfetuarCheckin';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerRoutes() {
  return (
    <Drawer.Navigator initialRouteName="Check-ins para hoje">
      <Drawer.Screen name="Check-ins para hoje" component={Home} />
      <Drawer.Screen name="Gerenciar Segunda-feira" component={DiaSemana} initialParams={{ dia: 'Segunda' }} />
      <Drawer.Screen name="Gerenciar Terça-feira" component={DiaSemana} initialParams={{ dia: 'Terça' }} />
      <Drawer.Screen name="Gerenciar Quarta-feira" component={DiaSemana} initialParams={{ dia: 'Quarta' }} />
      <Drawer.Screen name="Gerenciar Quinta-feira" component={DiaSemana} initialParams={{ dia: 'Quinta' }} />
      <Drawer.Screen name="Gerenciar Sexta-feira" component={DiaSemana} initialParams={{ dia: 'Sexta' }} />
      <Drawer.Screen name="Gerenciar Sábado" component={DiaSemana} initialParams={{ dia: 'Sábado' }} />
      <Drawer.Screen name="Gerenciar Domingo" component={DiaSemana} initialParams={{ dia: 'Domingo' }} />
    </Drawer.Navigator>
  );
}

export function RouterApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={DrawerRoutes} />
        <Stack.Screen name="CriarAtividade" component={CriarAtividade} />
        <Stack.Screen name="EfetuarCheckin" component={EfetuarCheckin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
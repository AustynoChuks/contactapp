/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ContactList from './screens/ContactList';
import ContactDetails from './screens/ContactDetails'

const Stack = createNativeStackNavigator();
const screens = [
  {
    name:"contactlist",
    Component:ContactList,
    options:{ title: 'Contacts' }
  },
  {
    name:"contactdetails",
    Component:ContactDetails,
    options:{ title: 'Contacts Details' }
  }
];

const App = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='contactlist'>
        {
          screens.map((Screen, i)=>{
            return <Stack.Screen 
                      key={i} 
                      name={Screen.name}
                      options={Screen.options}>
                        {(props) => <Screen.Component {...props} />}
                    </Stack.Screen>
          })
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

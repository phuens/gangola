import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import AccountScreen from './src/screens/AccountScreen';
import HistoryScreen from './src/screens/HistoryScreen'

const Tab = createBottomTabNavigator();

const App = ()=>{
  return (
    <NavigationContainer > 
      <Tab.Navigator tabBarOptions={{
        style:{
          backgroundColor:'#49c1a4',
          activeTintColor: 'black',
          inactiveTintColor: 'white',
        }
      }}>
        <Tab.Screen name="Home" component={HomeScreen}/>
        <Tab.Screen name="Account" component={AccountScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


export default App
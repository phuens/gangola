import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DiseaseScreen from './src/screens/DiseaseScreen';
import RegisterScreen from './src/screens/RegisterScreen';
// import AccountScreen from './src/screens/AccountScreen';
// import HistoryScreen from './src/screens/HistoryScreen';
import { createStackNavigator } from '@react-navigation/stack';
import ResultScreen from './src/screens/ResultScreen';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={DiseaseScreen} options={{ title: 'Disease' }} />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ title: 'Register' }}
                />
                <Stack.Screen
                    name="Result"
                    component={ResultScreen}
                    options={{ title: 'Result' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

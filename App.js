import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProductScreen from './src/screens/ProductScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ title: 'Register' }}
                />
                <Stack.Screen
                    name="Product"
                    component={ProductScreen}
                    options={{ title: 'Product' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

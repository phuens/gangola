import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import DiseaseScreen from './src/screens/DiseaseScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LogInScreen from './src/screens/LogInScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import IndividualProductScreen from './src/screens/IndividualProductScreen';
import ProductScreen from './src/screens/ProductScreen';
import { createStackNavigator } from '@react-navigation/stack';
import ResultScreen from './src/screens/ResultScreen';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
                <Stack.Screen
                    name="Disease"
                    component={DiseaseScreen}
                    options={{ title: 'Disease' }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ title: 'Register' }}
                />
                <Stack.Screen name="LogIn" component={LogInScreen} options={{ title: 'Log In' }} />
                <Stack.Screen
                    name="Product"
                    component={ProductScreen}
                    options={{ title: 'Product' }}
                />
                <Stack.Screen
                    name="Result"
                    component={ResultScreen}
                    options={{ title: 'Result' }}
                />
                <Stack.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{ title: 'Dashboard' }}
                />
                <Stack.Screen
                    name="Weather"
                    component={WeatherScreen}
                    options={{ title: 'Weather' }}
                />
                <Stack.Screen
                    name="Crop"
                    component={IndividualProductScreen}
                    options={{ title: 'Crop' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

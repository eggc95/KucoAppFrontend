import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './LoginPage';
import OrderBookPage from './OrderBookPage';

const Stack = createStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginPage} options={{ title: 'Login' }} />
                <Stack.Screen name="OrderBook" component={OrderBookPage} options={{ title: 'Order Book' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;

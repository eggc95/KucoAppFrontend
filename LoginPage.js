import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { BASE_URL } from './config';

const LoginPage = ({ navigation }) => {
    // State variables
    const [symbols, setSymbols] = useState([]);
    const [selectedSymbol, setSelectedSymbol] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    // Fetch symbols
    useEffect(() => {
        axios.get(`${BASE_URL}/symbols`)
            .then(response => {
                // Sort symbols alphabetically
                const sortedSymbols = response.data.sort((a, b) => a.symbol.localeCompare(b.symbol));
                setSymbols(sortedSymbols);
                // Default to the first symbol if user didn't select any
                if (sortedSymbols.length > 0) {
                    setSelectedSymbol(sortedSymbols[0].symbol);
                }
            })
            .catch(error => console.error(error));
    }, []);

    // Login
    const handleLogin = () => {
        axios.post(`${BASE_URL}/login`, { symbol: selectedSymbol, pin })
            .then(response => {
                setError('');
                // Navigate to next page
                navigation.navigate('OrderBook', { token: response.data.token});
            })
            .catch(error => {
                setError('Authentication failed. Please check your pin.');
                console.error('Authentication failed', error);
            });
    };

    return (
        <View>
            <Text>Select Symbol</Text>
            {/* Select Symbol */}
            <Picker selectedValue={selectedSymbol} onValueChange={value => setSelectedSymbol(value)}>
                {symbols.map(symbol => <Picker.Item key={symbol.symbol} label={symbol.symbol} value={symbol.symbol} />)}
            </Picker>
            {/* PIN input */}
            <TextInput
                value={pin}
                onChangeText={setPin}
                secureTextEntry
                placeholder="Enter Pin"
            />
            {/* Login Button */}
            <Button title="Login" onPress={handleLogin} />
            {/* Display why login failed */}
            {error ? <Text>{error}</Text> : null}
        </View>
    );
};

export default LoginPage;

import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import WebSocket from 'react-native-websocket';
import { useRoute } from '@react-navigation/native';
import { BASE_URL } from './config';

const OrderBookPage = () => {
    //Auth token
    const route = useRoute();
    const { token } = route.params;

    // State variables
    const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
    const [websocketConnected, setWebsocketConnected] = useState(false);

    // Websocket Handling
    const handleMessage = (message) => {
        const data = JSON.parse(message.data);
        console.log('Received WebSocket data:', data);
        setOrderBook(data);
    };
    const handleOpen = () => {
        setWebsocketConnected(true);
    };

    const handleClose = () => {
        setWebsocketConnected(false);
    };

    //Grouping by dollar
    const groupByDollar = (orders) => {
        const groupedOrders = {};
        orders.forEach(([price, size]) => {
            const dollar = Math.floor(parseFloat(price));
            if (groupedOrders[dollar]) {
                groupedOrders[dollar] += parseFloat(size);
            } else {
                groupedOrders[dollar] = parseFloat(size);
            }
        });
        return groupedOrders;
    };

    //Average Price
    const calculateAveragePrice = (orders) => {
        let totalPrice = 0;
        let totalSize = 0;
        for (const [price, size] of Object.entries(orders)) {
            totalPrice += parseFloat(price) * parseFloat(size);
            totalSize += parseFloat(size);
        }
        return totalSize === 0 ? 0 : totalPrice / totalSize;
    };

    //Total trade size
    const calculateTotalTradeSize = (orders) => {
        let totalSize = 0;
        for (const size of Object.values(orders)) {
            totalSize += parseFloat(size);
        }
        return totalSize;
    };

    return (
        <View style={styles.container}>
            {/* WebSocket connection status */}
            <View style={styles.status}>
                <Text>WebSocket Status: {websocketConnected ? 'Connected' : 'Disconnected'}</Text>
            </View>
            {/* Main View */}
            <ScrollView style={styles.scrollView}>
                {/* Bids */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bids</Text>
                    {Object.entries(groupByDollar(orderBook.bids)).map(([dollar, size], index) => (
                        <Text key={index}>Price: ${dollar}, Size: {size}</Text>
                    ))}
                    <Text>Average Price (Bids): ${calculateAveragePrice(groupByDollar(orderBook.bids)).toFixed(3)}</Text>
                    <Text>Total Trade Size (Bids): {calculateTotalTradeSize(groupByDollar(orderBook.bids)).toFixed(8)}</Text>
                </View>
                {/* Asks */}
                <View style={[styles.section, styles.sectionMarginTop]}>
                    <Text style={styles.sectionTitle}>Asks</Text>
                    {Object.entries(groupByDollar(orderBook.asks)).map(([dollar, size], index) => (
                        <Text key={index}>Price: ${dollar}, Size: {size}</Text>
                    ))}
                    <Text>Average Price (Asks): ${calculateAveragePrice(groupByDollar(orderBook.asks)).toFixed(3)}</Text>
                    <Text>Total Trade Size (Asks): {calculateTotalTradeSize(groupByDollar(orderBook.asks)).toFixed(8)}</Text>
                </View>
            </ScrollView>
            <WebSocket
                url={`${BASE_URL}/websocket`}
                onMessage={handleMessage}
                onOpen={handleOpen}
                onClose={handleClose}
                onError={(error) => console.error('WebSocket error:', error)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    status: {
        marginBottom: 10,
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    sectionMarginTop: {
        marginTop: 20,
    },
});

export default OrderBookPage;

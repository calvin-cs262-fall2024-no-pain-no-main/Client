import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Activities = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rest Time Activities</Text>
            <Button
                title="Quiz"
            />
            <Button
                title="Game"
                onPress={() => navigation.navigate('Meditation')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default Activities;
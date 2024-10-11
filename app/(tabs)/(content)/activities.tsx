import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const Activities = () => {
    const router = useRouter();

    async function gotoGame() {
        router.push("/game");
    }

    async function gotoQuiz() {
        router.push("/quiz");
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Title Section */}
            <Text style={styles.title}>Detox from Social Media and Lock in Your Break Time!</Text>
            
            {/* Content Section */}
            <View style={styles.contentSection}>
                <Text style={styles.sectionTitle}>Why Take a Break?</Text>
                <Text style={styles.description}>
                    Disconnecting from social media gives your mind time to rest and focus on your physical and mental well-being. Lock in your break time and engage in activities that recharge your body and mind.
                </Text>
            </View>

            {/* Activities Section */}
            <View style={styles.activitiesSection}>
                <Text style={styles.sectionTitle}>Choose an Activity</Text>

                {/* Quiz Activity Button */}
                <TouchableOpacity style={styles.button} onPress={gotoQuiz}>
                    <Text style={styles.buttonText}>Mental Fitness Quiz</Text>
                </TouchableOpacity>

                {/* Game Activity Button */}
                <TouchableOpacity style={styles.button} onPress={gotoGame}>
                    <Text style={styles.buttonText}>Fitness Challenge Game</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#2c3e50',
    },
    contentSection: {
        width: '100%',
        marginBottom: 30,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#34495e',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#7f8c8d',
        lineHeight: 24,
    },
    activitiesSection: {
        width: '100%',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default Activities;

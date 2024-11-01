import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

// Import the local image
const backgroundImage = require('../../../assets/images/gym-buddy.png'); // Update the path according to your folder structure

const Workouts = () => {
    const router = useRouter();

    async function yourWorkouts() {
        router.push(`../workouts/your-workouts`);
    }

    async function startEmptyWorkout() {
        router.push('../workouts/empty-workout');
    }

    return (
        <ImageBackground 
            source={backgroundImage} // Use the imported image
            style={styles.background}
            imageStyle={{ opacity: 0.1 }} // Adjust opacity to make it half-transparent
        >
            <ScrollView contentContainerStyle={styles.container}>
                {/* Intro Section */}
                <Text style={styles.title}>Welcome to REVIVE+</Text>
                <Text style={styles.subtitle}>Choose an existing workout or create your own custom set!</Text>

                {/* Empty Workout Button */}
                <TouchableOpacity style={[styles.button, styles.emptyButton]} onPress={startEmptyWorkout}>
                    <FontAwesome name="plus-circle" size={24} color="#3498db" style={styles.icon} />
                    <Text style={styles.buttonText}>Start Empty Workout</Text>
                </TouchableOpacity>

                {/* Your Workouts Button */}
                <TouchableOpacity style={[styles.button, styles.existingButton]} onPress={yourWorkouts}>
                    <MaterialIcons name="fitness-center" size={24} color="#ffffff" style={styles.icon} />
                    <Text style={styles.buttonText}>Your Workouts</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover', // Ensures the image covers the background
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Additional overlay for readability
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#e0e0e0',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 15,
        marginVertical: 10,
        width: '90%',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 3,
    },
    emptyButton: {
        backgroundColor: '#eaf6fc',
    },
    existingButton: {
        backgroundColor: '#3498db',
    },
    icon: {
        marginRight: 10,
    },
    buttonText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default Workouts;

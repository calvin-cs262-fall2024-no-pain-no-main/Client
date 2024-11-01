import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const workoutsData = {
    Push: [
        "Bench Press",
        "Incline Dumbbell Press",
        "Overhead Press",
        "Tricep Dips",
        "Push-Ups",
    ],
    Pull: [
        "Pull-Ups",
        "Barbell Rows",
        "Bicep Curls",
        "Face Pulls",
        "Lat Pulldowns",
    ],
    Legs: [
        "Squats",
        "Deadlifts",
        "Lunges",
        "Leg Press",
        "Calf Raises",
    ],
};

const EmptyWorkout = () => {
    const addToWorkoutSet = (workout) => {
        // Logic to add the workout to the user's workout set
        console.log(`Added ${workout} to workout set`);
    };

    return (
        <ImageBackground
            source={require('../../../assets/images/gym-buddy.png')} // Replace with your image path
            style={styles.background}
            imageStyle={{ opacity: 0.3 }} // Adjust opacity for background image
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Empty Workout Planner</Text>

                {/* Push Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Push Day</Text>
                    {workoutsData.Push.map((workout, index) => (
                        <View key={index} style={styles.workoutBox}>
                            <Text style={styles.workoutText}>{workout}</Text>
                            <TouchableOpacity onPress={() => addToWorkoutSet(workout)}>
                                <FontAwesome name="plus-circle" size={24} color="#3498db" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Pull Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pull Day</Text>
                    {workoutsData.Pull.map((workout, index) => (
                        <View key={index} style={styles.workoutBox}>
                            <Text style={styles.workoutText}>{workout}</Text>
                            <TouchableOpacity onPress={() => addToWorkoutSet(workout)}>
                                <FontAwesome name="plus-circle" size={24} color="#3498db" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Leg Day Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Leg Day</Text>
                    {workoutsData.Legs.map((workout, index) => (
                        <View key={index} style={styles.workoutBox}>
                            <Text style={styles.workoutText}>{workout}</Text>
                            <TouchableOpacity onPress={() => addToWorkoutSet(workout)}>
                                <FontAwesome name="plus-circle" size={24} color="#3498db" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
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
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent white for readability
        borderRadius: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#34495e',
        marginBottom: 10,
    },
    workoutBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    workoutText: {
        fontSize: 18,
        color: '#34495e',
    },
});

export default EmptyWorkout;

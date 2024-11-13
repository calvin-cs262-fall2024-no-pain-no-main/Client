import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView, View, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const headerImage = require('../../../assets/images/VigilWeight.png');

const Workouts = () => {
    const router = useRouter();

    const [workouts, setWorkouts] = React.useState([
        { id: 1, name: 'Workout 1' },
        { id: 2, name: 'Workout 2' },
    ]);

    async function startEmptyWorkout() {
        router.push('../workouts/empty-workout');
    }

    async function deleteWorkout(workoutId) {
        const updatedWorkouts = workouts.filter(workout => workout.id !== workoutId);
        setWorkouts(updatedWorkouts);
        console.log(`Deleted workout: ${workoutId}`);
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Image source={headerImage} style={styles.headerImage} />

                <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
                    Recent Workouts
                </Text>
                <View style={styles.gridContainer}>
                    {workouts.map(workout => (
                        <TouchableOpacity key={workout.id} style={styles.card}>
                            <Text style={styles.cardText}>{workout.name}</Text>
                            <TouchableOpacity
                                style={styles.trashButton}
                                onPress={() => deleteWorkout(workout.id)}
                            >
                                <MaterialIcons name="delete" size={24} color="#fff" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
                    Workouts Templates
                </Text>
                <View style={styles.gridContainer}>
                    <TouchableOpacity style={styles.card} onPress={() => router.push('../workouts/push-workout')}>
                        <Text style={styles.cardTitle}>Push</Text>
                        <Text style={styles.cardDescription}>A workout focused on pushing movements, targeting chest, shoulders, and triceps.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={() => router.push('../workouts/pull-workout')}>
                        <Text style={styles.cardTitle}>Pull</Text>
                        <Text style={styles.cardDescription}>A workout that emphasizes pulling movements, focusing on back and biceps.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={() => router.push('../workouts/legs-workout')}>
                        <Text style={styles.cardTitle}>Legs</Text>
                        <Text style={styles.cardDescription}>Leg-focused exercises targeting quads, hamstrings, and calves.</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.button, styles.emptyButton]} onPress={startEmptyWorkout}>
                    <Text style={styles.emptyButtonText}>Create Empty Workout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0D1B2A',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 21,
        backgroundColor: '#0D1B2A',
    },
    headerImage: {
        width: '50%',
        height: 75,
        resizeMode: 'contain',
        marginBottom: 20,
        alignSelf: 'center',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        textAlign: 'left',
        width: '100%',
        maxWidth: '100%',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 30,
    },
    card: {
        width: '48%',
        backgroundColor: '#2C3E50',
        padding: 30,
        marginBottom: 20,
        borderRadius: 10,
        alignItems: 'flex-start',
        justifyContent: 'center',
        position: 'relative',
    },
    cardText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'left',
    },
    cardTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 5,
    },
    cardDescription: {
        color: '#e0e0e0',
        fontSize: 12,
        textAlign: 'left',
    },
    trashButton: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 15,
        padding: 4,
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
        backgroundColor: '#A5D6A7',
    },
    emptyButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Workouts;

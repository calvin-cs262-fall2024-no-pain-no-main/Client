import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native'

const WorkoutPage = () => {
    const router = useRouter();
    const handleCreateWorkout = () => {
        router.push('/workouts/empty-workout');
    }

// Modify the state when deleting a workout (e.g., removing it from an array)
const [workouts, setWorkouts] = React.useState([
    { id: 1, name: 'Workout 1' },
    { id: 2, name: 'Workout 2' },
]);

async function deleteWorkout(workoutId) {
    const updatedWorkouts = workouts.filter(workout => workout.id !== workoutId);
    setWorkouts(updatedWorkouts);
    console.log(`Deleted workout: ${workoutId}`);
}


    return (
        <ScrollView style={styles.container}>
            {/* Top Icon Placeholder */}
            <View style={styles.topIconContainer}>
                <Icon name="dumbbell" size={80} color="#A5D6A7" />
            </View>

            {/* Recent Workouts Section */}
            <Text style={styles.sectionTitle}>Recent Workouts</Text>
            <View style={styles.recentWorkoutsContainer}>
                <View style={styles.recentWorkoutBox}>
                    <Text style={styles.recentWorkoutText}>
                        You haven’t worked out yet. You suck, lazy bum!
                    </Text>
                </View>
                <View style={styles.recentWorkoutBox}></View>
            </View>

            {/* Workout Templates Section */}
            <Text style={styles.sectionTitle}>Workout Templates</Text>
            <View style={styles.templatesContainer}>
                {[...Array(4)].map((_, index) => (
                    <TouchableOpacity key={index} style={styles.templateBox}>
                        <Text style={styles.templateTitle}>Push</Text>
                        <Text style={styles.templateDescription}>
                            Bench Press (Barbell), Chest Flys, Shoulder Press (Machine),
                            Lateral Raise (Cable), Skull Crusher (Barbell)
                        </Text>
                        <View style={styles.iconContainer}>
                            <Icon name="edit" size={16} color="#A5D6A7" style={styles.icon} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Create New Workout Button */}
            <TouchableOpacity style={styles.createWorkoutButton} onPress={handleCreateWorkout}>
                <Text style={styles.createWorkoutButtonText}>Create New Workout</Text>
            </TouchableOpacity>

            {/* Bottom Icon Placeholder */}
            <View style={styles.bottomIconContainer}>
                <Icon name="user-circle" size={60} color="#898989" />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#0D1B2A',
    },
    topIconContainer: {
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    recentWorkoutsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    recentWorkoutBox: {
        flex: 1,
        backgroundColor: '#1B263B',
        borderRadius: 8,
        padding: 20,
        marginRight: 10,
    },
    recentWorkoutText: {
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'center',
    },
    templatesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    templateBox: {
        width: '48%',
        backgroundColor: '#1B263B',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        position: 'relative',
    },
    templateTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    templateDescription: {
        color: '#FFFFFF',
        fontSize: 12,
    },
    iconContainer: {
        flexDirection: 'row',
        position: 'absolute',
        top: 10,
        right: 10,
    },
    icon: {
        marginLeft: 10,
    },
    createWorkoutButton: {
        backgroundColor: '#2E8B57',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    createWorkoutButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    bottomIconContainer: {
        alignItems: 'center',
        paddingBottom: 20,
        opacity: 0.5,
    },
});

export default WorkoutPage;



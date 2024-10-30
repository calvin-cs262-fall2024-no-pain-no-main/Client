import { Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const Workouts = () => {
    const router = useRouter();

    async function yourWorkouts() {
        // Navigate to the workout page with selected workout and timer duration
        router.push(`../workouts/your-workouts`);
    }

    async function startEmptyWorkout() {
        // Navigate to the empty workout page
        router.push('../workouts/empty-workout');
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Title Section */}
            <Text style={styles.title}>Choose Your Workout</Text>

            {/* Empty Workout Button */}
            <TouchableOpacity style={styles.button} onPress={startEmptyWorkout}>
                <Text style={styles.buttonText}>Start Empty Workout</Text>
            </TouchableOpacity>

            {/* Start Workout Button */}
            <TouchableOpacity style={styles.button} onPress={yourWorkouts}>
                <Text style={styles.buttonText}>Your Workouts</Text>
            </TouchableOpacity>
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
    picker: {
        height: 50,
        width: '100%',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    timerText: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        marginTop: 10,
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

export default Workouts;

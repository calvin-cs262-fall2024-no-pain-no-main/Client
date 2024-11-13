import React, { useState } from 'react';
import { View, SafeAreaView, Text, TextInput, Modal, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
const headerImage = require('../../../assets/images/VigilWeight.png');

interface Exercise {
    id: string;
    name: string;
    muscle: string;
    sets: Set[];
}

interface Set {
    set: number;
    lbs: number;
    reps: number;
    completed: boolean;
    restTime: number;
    timer: number;
    timerActive: boolean;
}

interface ExerciseAppProps {
    initialExercises?: Exercise[];
}

const ExerciseApp: React.FC<ExerciseAppProps> = ({ initialExercises = [] }) => {
    const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
    const [isExerciseModalVisible, setExerciseModalVisible] = useState(false);
    const [isMuscleGroupModalVisible, setMuscleGroupModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);

    const toggleTimer = (exerciseIndex: number, setIndex: number) => {
        const newExercises = [...exercises];
        const currentSet = newExercises[exerciseIndex].sets[setIndex];

        if (currentSet.timerActive) {
            clearInterval(currentSet.timerInterval);  // Stop the timer
            currentSet.timerActive = false;
        } else {
            currentSet.timerActive = true;
            currentSet.timerInterval = setInterval(() => {
                const newTime = currentSet.timer - 1;
                if (newTime <= 0) {
                    clearInterval(currentSet.timerInterval);
                    currentSet.timerActive = false;
                    currentSet.timer = 0;
                } else {
                    currentSet.timer = newTime;
                }
                setExercises([...newExercises]);
            }, 1000);  // Update every second
        }
    };

    // Default exercise options
    const exerciseOptions = [
        { id: '1', name: 'Bench Press', muscle: 'Chest' },
        { id: '2', name: 'Squats', muscle: 'Legs' },
        { id: '3', name: 'Deadlift', muscle: 'Back' },
        { id: '4', name: 'Incline Bench Press', muscle: 'Chest' },
        { id: '5', name: 'Dumbbell Fly', muscle: 'Chest' },
        { id: '6', name: 'Leg Press', muscle: 'Legs' },
        { id: '7', name: 'Lunges', muscle: 'Legs' },
        { id: '8', name: 'Leg Curl', muscle: 'Legs' },
        { id: '9', name: 'Leg Extension', muscle: 'Legs' },
        { id: '10', name: 'Pull-Up', muscle: 'Back' },
        { id: '11', name: 'Lat Pulldown', muscle: 'Back' },
        { id: '12', name: 'Seated Row', muscle: 'Back' },
        { id: '13', name: 'Barbell Row', muscle: 'Back' },
        { id: '14', name: 'T-Bar Row', muscle: 'Back' },
        { id: '15', name: 'Overhead Press', muscle: 'Shoulders' },
        { id: '16', name: 'Dumbbell Shoulder Press', muscle: 'Shoulders' },
        { id: '17', name: 'Lateral Raise', muscle: 'Shoulders' },
        { id: '18', name: 'Front Raise', muscle: 'Shoulders' },
        { id: '19', name: 'Face Pull', muscle: 'Shoulders' },
        { id: '20', name: 'Bicep Curl', muscle: 'Biceps' },
        { id: '21', name: 'Hammer Curl', muscle: 'Biceps' },
        { id: '22', name: 'Preacher Curl', muscle: 'Biceps' },
        { id: '23', name: 'Concentration Curl', muscle: 'Biceps' },
        { id: '24', name: 'Tricep Pushdown', muscle: 'Triceps' },
        { id: '25', name: 'Tricep Extension', muscle: 'Triceps' },
        { id: '26', name: 'Skull Crusher', muscle: 'Triceps' },
        { id: '27', name: 'Dips', muscle: 'Triceps' },
        { id: '28', name: 'Chest Dip', muscle: 'Chest' },
        { id: '29', name: 'Calf Raise', muscle: 'Calves' },
        { id: '30', name: 'Seated Calf Raise', muscle: 'Calves' },
        { id: '31', name: 'Crunch', muscle: 'Abs' },
        { id: '32', name: 'Plank', muscle: 'Abs' },
        { id: '33', name: 'Russian Twist', muscle: 'Abs' },
        { id: '34', name: 'Bicycle Crunch', muscle: 'Abs' },
        { id: '35', name: 'Leg Raise', muscle: 'Abs' },
        { id: '36', name: 'Hanging Leg Raise', muscle: 'Abs' },
        { id: '37', name: 'Hip Thrust', muscle: 'Glutes' },
        { id: '38', name: 'Glute Bridge', muscle: 'Glutes' },
        { id: '39', name: 'Step-Up', muscle: 'Legs' },
        { id: '40', name: 'Bulgarian Split Squat', muscle: 'Legs' },
        { id: '41', name: 'Good Morning', muscle: 'Back' },
        { id: '42', name: 'Cable Row', muscle: 'Back' },
        { id: '43', name: 'Chest Fly', muscle: 'Chest' },
        { id: '44', name: 'Pec Deck', muscle: 'Chest' },
        { id: '45', name: 'High Row', muscle: 'Back' },
        { id: '46', name: 'Farmers Walk', muscle: 'Full Body' },
        { id: '47', name: 'Push-Up', muscle: 'Chest' },
        { id: '48', name: 'Reverse Fly', muscle: 'Shoulders' },
        { id: '49', name: 'Cable Lateral Raise', muscle: 'Shoulders' },
        { id: '50', name: 'Rear Delt Row', muscle: 'Shoulders' },
        { id: '51', name: 'The Zach', muscle: 'Forearms' },
    ];

    const muscleGroups = Array.from(new Set(exerciseOptions.map(ex => ex.muscle)));

    const filteredExercises = exerciseOptions.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMuscleGroup = selectedMuscleGroup ? exercise.muscle === selectedMuscleGroup : true;
        return matchesSearch && matchesMuscleGroup;
    });

    const handleMuscleGroupSelect = (muscle: string) => {
        setSelectedMuscleGroup(muscle);
        setMuscleGroupModalVisible(false);
    };

    const addExercise = (exercise: Omit<Exercise, 'sets'>) => {
        if (exercises.some(e => e.id === exercise.id)) {
            alert('Exercise already added');
            return;
        }
        setExercises([...exercises, {
            ...exercise,
            sets: [{ set: 1, lbs: 0, reps: 0, completed: false, restTime: 120, timer: 120, timerActive: false }]
        }]);
        setExerciseModalVisible(false);
    };

    const addSet = (exerciseIndex: number) => {
        const newExercises = [...exercises];
        const currentSets = newExercises[exerciseIndex].sets;
        const newSet = { set: currentSets.length + 1, lbs: 0, reps: 0, completed: false, restTime: 120, timer: 120, timerActive: false };
        currentSets.push(newSet);
        setExercises(newExercises);
    };

    const updateSet = (exerciseIndex: number, setIndex: number, field: keyof Set, value: string | number | boolean) => {
        const updatedExercises = [...exercises];
        updatedExercises[exerciseIndex].sets[setIndex][field] = value;
        setExercises(updatedExercises);
    };

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <ScrollView style={styles.container}>
                {/* Top Icon Placeholder */}
                <View style={styles.topIconContainer}>
                    <Image source={headerImage} style={styles.headerImage} />
                </View>

                {/* Divider Line */}
                <View style={styles.divider} />

                {exercises.map((exercise, exerciseIndex) => (
                    <View key={exercise.id} style={styles.exerciseContainer}>
                        <Text style={styles.exerciseTitle}>{exercise.name.toUpperCase()}</Text>
                        <Text style={styles.exerciseSubtitle}>{exercise.muscle.toUpperCase()}</Text>
                        <View style={styles.headerRow}>
                            <Text style={[styles.columnHeader, { flex: 1 }]}>Set</Text>
                            <Text style={[styles.columnHeader, { flex: 2 }]}>Lbs</Text>
                            <Text style={[styles.columnHeader, { flex: 2 }]}>Reps</Text>
                            <Text style={[styles.columnHeader, { flex: 1 }]}>✓</Text>
                        </View>
                        {exercise.sets.map((set, setIndex) => (
                            <View key={setIndex} style={styles.row}>
                            <Text style={[styles.setNumber, { flex: 1 }]}>{set.set}</Text>
                            <TextInput
                                style={[styles.input, { flex: 2 }]}
                                keyboardType="numeric"
                                value={String(set.lbs)}
                                onChangeText={(value) => updateSet(exerciseIndex, setIndex, 'lbs', Number(value))}
                            />
                            <TextInput
                                style={[styles.input, { flex: 2 }]}
                                keyboardType="numeric"
                                value={String(set.reps)}
                                onChangeText={(value) => updateSet(exerciseIndex, setIndex, 'reps', Number(value))}
                            />
                            <CheckBox
                                checked={set.completed}
                                onPress={() => updateSet(exerciseIndex, setIndex, 'completed', !set.completed)}
                                containerStyle={[styles.checkbox, { flex: 1 }]}
                                checkedColor="#A5D6A7"
                                uncheckedColor="#666"
                            />
                        </View>
                        
                        ))}
                    </View>
                ))}

                <TouchableOpacity onPress={() => setExerciseModalVisible(true)} style={styles.addExerciseButton}>
                    <Text style={styles.addExerciseText}>Add Exercise</Text>
                </TouchableOpacity>

                {/* Divider Line */}
                <View style={styles.divider} />

                {/* Exercise Selection Modal */}
                <Modal visible={isExerciseModalVisible} animationType="slide">
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Exercise</Text>
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Search Exercise"
                            placeholderTextColor="#888"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <TouchableOpacity
                            style={styles.filterButton}
                            onPress={() => setMuscleGroupModalVisible(true)}
                        >
                            <Text style={styles.filterButtonText}>
                                Muscle Group: {selectedMuscleGroup || 'All'}
                            </Text>
                        </TouchableOpacity>
                        <FlatList
                            data={filteredExercises}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => addExercise(item)} style={styles.modalItem}>
                                    <Text style={styles.modalItemText}>{item.name} ({item.muscle})</Text>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity onPress={() => setExerciseModalVisible(false)} style={styles.modalCloseButton}>
                            <Text style={styles.modalCloseButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                {/* Muscle Group Modal */}
                <Modal visible={isMuscleGroupModalVisible} animationType="slide">
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Muscle Group</Text>
                        <FlatList
                            data={muscleGroups}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleMuscleGroupSelect(item)} style={styles.modalItem}>
                                    <Text style={styles.modalItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={() => setMuscleGroupModalVisible(false)} style={styles.modalCloseButton}>
                            <Text style={styles.modalCloseButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: '#0D1B2A',  // This ensures that the content doesn't overlap with device's notch or bottom area
    },
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
    headerImage: {
        width: '50%',
        height: 75,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#A5D6A7',
        opacity: 0.1,
    },
    exerciseContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#1B263B',
        borderRadius: 8,
    },
    exerciseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#A5D6A7',
    },
    exerciseSubtitle: {
        fontSize: 16,
        color: '#A5D6A7',
        marginBottom: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5,
        borderBottomColor: '#A5D6A7',
        borderBottomWidth: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    columnHeader: {
        color: '#A5D6A7',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    setNumber: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#1F2A38',
        color: '#FFFFFF',
        borderRadius: 8,
        paddingVertical: 5,
        fontSize: 14,
        fontWeight: 'bold',
        borderColor: '#324A5F',
        borderWidth: 1,
        textAlign: 'center',
    },
    checkbox: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },    
    addExerciseButton: {
        backgroundColor: '#A5D6A7',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 20,
        width: '80%',
        alignSelf: 'center',
    },
    addExerciseText: {
        color: 'white',
        fontWeight: 'bold',
    },
    bottomIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 20,
        opacity: 0.5,
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#0D1B2A',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#A5D6A7',
        marginBottom: 10,
    },
    modalItem: {
        padding: 10,
        borderBottomColor: '#444',
        borderBottomWidth: 1,
    },
    modalItemText: {
        color: '#FFF',
    },
    modalCloseButton: {
        backgroundColor: '#A5D6A7',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    modalCloseButtonText: {
        color: '#0D1B2A',
        fontWeight: 'bold',
    },
    searchBar: {
        backgroundColor: '#1F2A38',
        borderRadius: 8,
        padding: 10,
        color: '#FFF',
        marginBottom: 15,
        fontSize: 16,
    },
    filterButton: {
        backgroundColor: '#324A5F',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    filterButtonText: {
        color: '#A5D6A7',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ExerciseApp;

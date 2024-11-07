import React, { useState } from 'react';
import { View, Text, TextInput, Modal, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

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
}

const ExerciseApp = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [isExerciseModalVisible, setExerciseModalVisible] = useState(false);
    const [isMuscleGroupModalVisible, setMuscleGroupModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);

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
        { id : '51', name: 'The Zach', muscle: 'Forearms' },
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
            sets: [{ set: 1, lbs: 0, reps: 0, completed: false, restTime: 120 }]
        }]);
        setExerciseModalVisible(false);
    };

    const addSet = (exerciseIndex: number) => {
        const newExercises = [...exercises];
        const currentSets = newExercises[exerciseIndex].sets;
        const newSet = { set: currentSets.length + 1, lbs: 0, reps: 0, completed: false, restTime: 120 };
        currentSets.push(newSet);
        setExercises(newExercises);
    };

    const updateSet = (exerciseIndex: number, setIndex: number, field: keyof Set, value: string | number | boolean) => {
        const updatedExercises = [...exercises];
        updatedExercises[exerciseIndex].sets[setIndex][field] = value;
        setExercises(updatedExercises);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Top Icon Placeholder */}
            <View style={styles.topIconContainer}>
                <Icon name="dumbbell" size={80} color="#A5D6A7" />
            </View>

            {/* Divider Line */}
            <View style={styles.divider} />

            {exercises.map((exercise, exerciseIndex) => (
                <View key={exercise.id} style={styles.exerciseContainer}>
                    <Text style={styles.exerciseTitle}>{exercise.name.toUpperCase()}</Text>
                    <Text style={styles.exerciseSubtitle}>{exercise.muscle.toUpperCase()}</Text>
                    <View style={styles.headerRow}>
                        <Text style={styles.columnHeader}>Set</Text>
                        <Text style={styles.columnHeader}>Lbs</Text>
                        <Text style={styles.columnHeader}>Reps</Text>
                        <Text style={styles.columnHeader}>✓</Text>
                        <Text style={styles.columnHeader}>Time</Text>
                    </View>
                    {exercise.sets.map((set, setIndex) => (
                        <View key={setIndex} style={styles.row}>
                            <Text style={styles.setNumber}>{set.set}</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={String(set.lbs)}
                                onChangeText={(value) => updateSet(exerciseIndex, setIndex, 'lbs', Number(value))}
                            />
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={String(set.reps)}
                                onChangeText={(value) => updateSet(exerciseIndex, setIndex, 'reps', Number(value))}
                            />
                            <CheckBox
                                checked={set.completed}
                                onPress={() => updateSet(exerciseIndex, setIndex, 'completed', !set.completed)}
                                containerStyle={styles.checkbox}
                                checkedColor="#A5D6A7"
                                uncheckedColor="#666"
                            />
                            <Text style={styles.time}>{set.restTime}s</Text>
                        </View>
                    ))}
                    <TouchableOpacity onPress={() => addSet(exerciseIndex)} style={styles.addSetButton}>
                        <Icon name="plus-circle" size={20} color="#A5D6A7" />
                    </TouchableOpacity>
                </View>
            ))}

            <TouchableOpacity onPress={() => setExerciseModalVisible(true)} style={styles.addExerciseButton}>
                <Text style={styles.addExerciseText}>Add Exercise</Text>
            </TouchableOpacity>

            {/* Divider Line */}
            <View style={styles.divider} />

            {/* Bottom Icon and Name */}
            <View style={styles.bottomIconContainer}>
                <Icon name="user-circle" size={60} color="#898989" />
            </View>

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
    divider: {
        height: 1,
        backgroundColor: '#A5D6A7',
        marginVertical: 10,
        opacity: 0.5,
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
        borderBottomColor: '#A5D6A7',
        borderBottomWidth: 1,
        paddingBottom: 5,
    },
    columnHeader: {
        color: '#A5D6A7',
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    setNumber: {
        color: '#FFF',
        textAlign: 'center',
        flex: 1,
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
        flex: 1,
    },
    checkbox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    time: {
        color: '#FFF',
        textAlign: 'center',
        flex: 1,
    },
    addSetButton: {
        marginTop: 10,
        alignItems: 'center',
    },
    addExerciseButton: {
        backgroundColor: '#A5D6A7',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
    },
    addExerciseText: {
        color: '#0D1B2A',
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

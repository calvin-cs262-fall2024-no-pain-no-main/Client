import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Text, TextInput, Modal, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';

const headerImage = require('../../../assets/images/VigilWeight.png');

interface Exercise {
    id: number;
    description: string;
    name: string;
    musclegroup: string;
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
    const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
    const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const { data } = await axios.get('https://no-pain-no-main.azurewebsites.net/exercises');
                const exercisesWithSets = data.map((exercise: any) => ({
                    ...exercise,
                    sets: [{ set: 1, lbs: 0, reps: 0, completed: false, restTime: 120, timer: 120, timerActive: false }],
                }));
                setAvailableExercises(exercisesWithSets);

                // Derive unique muscle groups
                const uniqueMuscleGroups = Array.from(new Set(exercisesWithSets.map((ex) => ex.musclegroup)));
                setMuscleGroups(uniqueMuscleGroups);
            } catch (error) {
                console.error('Error fetching exercises:', error);
            }
        };
        fetchExercises();
    }, []);

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
    const handleMuscleGroupSelect = (muscle: string) => {
        setSelectedMuscleGroup(muscle);
    };

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <ScrollView style={styles.container}>
                <View style={styles.topIconContainer}>
                    <Image source={headerImage} style={styles.headerImage} />
                </View>
                <View style={styles.divider} />
                {exercises.map((exercise, exerciseIndex) => (
                    <View key={exercise.id} style={styles.exerciseContainer}>
                        <Text style={styles.exerciseTitle}>{exercise.name.toUpperCase()}</Text>
                        <Text style={styles.exerciseSubtitle}>{exercise.musclegroup.toUpperCase()}</Text>
                        <View style={styles.headerRow}>
                            <Text style={styles.columnHeader}>Set</Text>
                            <Text style={styles.columnHeader}>Lbs</Text>
                            <Text style={styles.columnHeader}>Reps</Text>
                            <Text style={styles.columnHeader}>✓</Text>
                        </View>
                        {exercise.sets.map((set, setIndex) => (
                            <View key={setIndex} style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={styles.cellText}>{set.set}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        value={String(set.lbs)}
                                        onChangeText={(value) => updateSet(exerciseIndex, setIndex, 'lbs', Number(value))}
                                    />
                                </View>
                                <View style={styles.cell}>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        value={String(set.reps)}
                                        onChangeText={(value) => updateSet(exerciseIndex, setIndex, 'reps', Number(value))}
                                    />
                                </View>
                                <View style={styles.cell}>
                                    <CheckBox
                                        checked={set.completed}
                                        onPress={() => updateSet(exerciseIndex, setIndex, 'completed', !set.completed)}
                                        containerStyle={styles.checkbox}
                                        checkedColor="#A5D6A7"
                                        uncheckedColor="#666"
                                    />
                                </View>
                            </View>
                        ))}
                        <TouchableOpacity onPress={() => addSet(exerciseIndex)} style={styles.addSetButton}>
                            <Text style={styles.addSetButtonText}>Add Set</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity onPress={() => setExerciseModalVisible(true)} style={styles.addExerciseButton}>
                    <Text style={styles.addExerciseText}>Add Exercise</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <ExerciseModal
                    isVisible={isExerciseModalVisible}
                    onClose={() => setExerciseModalVisible(false)}
                    availableExercises={availableExercises}
                    addExercise={addExercise}
                    muscleGroups={muscleGroups}
                    handleMuscleGroupSelect={handleMuscleGroupSelect}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const ExerciseModal = ({
    isVisible,
    onClose,
    availableExercises,
    addExercise,
    muscleGroups,
    handleMuscleGroupSelect,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);

    // Filter exercises based on the search query and selected muscle group
    const filteredExercises = availableExercises.filter((exercise) => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMuscleGroup = selectedMuscleGroup
            ? exercise.musclegroup === selectedMuscleGroup
            : true;
        return matchesSearch && matchesMuscleGroup;
    });

    // Handle muscle group selection and close the filter modal
    const onMuscleGroupSelect = (muscleGroup: string) => {
        setSelectedMuscleGroup(muscleGroup);
        setFilterModalVisible(false);
    };

    // Reset the filter when the modal is closed
    useEffect(() => {
        if (!isVisible) {
            setSelectedMuscleGroup(null);
        }
    }, [isVisible]);

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Select Exercise</Text>

                    {/* Search Bar */}
                    <View style={styles.searchBarContainer}>
                        <Icon name="search" size={16} color="#A5D6A7" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Search"
                            placeholderTextColor="#A5D6A7"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Filter Button */}
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setFilterModalVisible(true)}
                    >
                        <Text style={styles.filterButtonText}>
                            {selectedMuscleGroup ? `Filter: ${selectedMuscleGroup}` : 'Filter by Muscle Group'}
                        </Text>
                    </TouchableOpacity>

                    {/* Exercise List */}
                    <FlatList
                        data={filteredExercises}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => addExercise(item)} style={styles.modalItem}>
                                <Text style={styles.modalItemText}>
                                    {item.name} ({item.musclegroup})
                                </Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={<Text style={styles.noResultsText}>No exercises found</Text>}
                    />

                    <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                        <Text style={styles.modalCloseButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Muscle Group Filter Modal */}
            <Modal visible={isFilterModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Muscle Group</Text>
                        <FlatList
                            data={muscleGroups}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => onMuscleGroupSelect(item)}
                                    style={styles.modalItem}
                                >
                                    <Text style={styles.modalItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            onPress={() => setFilterModalVisible(false)}
                            style={styles.modalCloseButton}
                        >
                            <Text style={styles.modalCloseButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </Modal>
    );
};

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: '#0D1B2A',
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
    noResultsText: {
        color: '#A5D6A7',
        textAlign : 'center',
    },
    exerciseSubtitle: {
        fontSize: 16,
        color: '#A5D6A7',
        marginBottom: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 5,
        borderBottomColor: '#A5D6A7',
        borderBottomWidth: 1,
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F2A38',
        borderColor: '#A5D6A7',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        width: '100%',
        height: 35,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchBar: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
        padding: 0,
    },
    cellText: {
        color: '#FFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 5,
        marginVertical: 5,
        borderBottomColor: '#444',
        borderBottomWidth: 1,
    },
    columnHeader: {
        flex: 1,
        textAlign: 'center',
        color: '#A5D6A7',
        fontWeight: 'bold',
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
        paddingHorizontal: 10,
        fontSize: 14,
        fontWeight: 'bold',
        borderColor: '#324A5F',
        borderWidth: 1,
        textAlign: 'center',
        width: '80%',
    },
    checkbox: {
        backgroundColor: 'transparent',
        padding: 0,
        margin: 0,
        alignItems: 'center',
        justifyContent: 'center',
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
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        height: '80%',
        backgroundColor: '#0D1B2A',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
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
        color: 'white',
        fontWeight: 'bold',
    },
    addSetButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#A5D6A7',
        borderRadius: 8,
    },
    addSetButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    filterButton: {
        backgroundColor: '#324A5F',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
        width: '80%',
        alignSelf: 'center',
    },
    filterButtonText: {
        color: '#A5D6A7',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ExerciseApp;

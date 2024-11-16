import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Text, TextInput, Modal, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { CheckBox } from 'react-native-elements';
import axios from 'axios';
const headerImage = require('../../../assets/images/VigilWeight.png');

interface Exercise {
    id: number;
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

const ExerciseApp: React.FC = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
    const [isExerciseModalVisible, setExerciseModalVisible] = useState(false);
    const [isMuscleGroupModalVisible, setMuscleGroupModalVisible] = useState(false);

    // Fetch exercises from API
    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const { data } = await axios.get('https://no-pain-no-main.azurewebsites.net/exercises');
                setExercises(data);
            } catch (error) {
                console.error('Error fetching exercises:', error);
                // Fallback to default exercises in case of API error
                setExercises(defaultExercises);
            }
        };
        fetchExercises();
    }, []);

    // Default exercise options for fallback
    const defaultExercises: Exercise[] = [
        { id: '1', name: 'Bench Press', muscle: 'Chest', sets: [] },
        { id: '2', name: 'Squats', muscle: 'Legs', sets: [] },
        // Add other default exercises here
    ];

    const filteredExercises = exercises.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMuscleGroup = selectedMuscleGroup ? exercise.muscle === selectedMuscleGroup : true;
        return matchesSearch && matchesMuscleGroup;
    });

    const muscleGroups = Array.from(new Set(exercises.map(ex => ex.muscle))).filter(Boolean);

    const addExercise = (exercise: Exercise) => {
        if (exercises.some(e => e.id === exercise.id)) {
            alert('Exercise already added');
            return;
        }
        setExercises([...exercises, { ...exercise, sets: [{ set: 1, lbs: 0, reps: 0, completed: false, restTime: 120, timer: 120, timerActive: false }] }]);
        setExerciseModalVisible(false);
    };

    const handleMuscleGroupSelect = (item) => {
        setSelectedMuscleGroup(item);
        setMuscleGroupModalVisible(false); 
    };

    return (

    <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView style={styles.container}>
            <View style={styles.topIconContainer}>
                <Image source={headerImage} style={styles.headerImage} />
            </View> 

    <View style={styles.divider}/>

    <TouchableOpacity onPress={() => setExerciseModalVisible(true)} style={styles.addExerciseButton}>
        <Text style={styles.addExerciseText}>Add Exercise</Text>
    </TouchableOpacity>

    {/* Add Exercise Modal */}
    <Modal visible={isExerciseModalVisible} onRequestClose={() => setExerciseModalVisible(false)} animationType="slide">
        <View style={styles.modalContainer}>
            {/* Filter options */}
            <View>
                <View style={styles.searchBar}>
                    <TextInput 
                        style={styles.searchBar}
                        placeholder="Search"
                        placeholderTextColor="#FFF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity style={styles.filterButton} onPress={() => setMuscleGroupModalVisible(true)}>
                    <Text style={styles.filterButtonText}>Select Muscle Group: {selectedMuscleGroup || 'All'}</Text>
                </TouchableOpacity>
            </View>
            {/* Exercise List */}
            {filteredExercises.map((exercise, index) => (
                <View key={index} style={styles.headerRow}>
                    <Text style={styles.row}>{exercise.name}</Text>
                    <Text style={styles.exerciseSubtitle}>{exercise.muscle}</Text>
                </View>
            ))}
            <FlatList
                data={filteredExercises}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => addExercise(item)} style={styles.modalItem}>
                        <Text style={styles.modalItemText}>{item.name} - {item.muscle}</Text>
                    </TouchableOpacity>
                )}
            />
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

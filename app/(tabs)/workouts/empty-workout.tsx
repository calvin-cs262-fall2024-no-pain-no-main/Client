import React, { useState, useEffect } from "react";
import { View, SafeAreaView, Text, TextInput, Modal, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { Menu, Provider } from "react-native-paper"; // Add this import for the dropdown menu
import { CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import { useRouter } from "expo-router";
import { globalStyles } from "../../../assets/styles/globalStyles";
import { theme } from "../../../assets/styles/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import PageWrapper from "../../../components/pageWrapper";

const headerImage = require("../../../assets/images/VigilWeight.png");

interface Exercise {
	id: number;
	description: string;
	name: string;
	muscle_group: string;
	sets: Set[];
}

interface Set {
	set: number;
	lbs: number;
	reps: number;
	completed: boolean;
	restTime: number;
}

interface ExerciseAppProps {
	initialExercises?: Exercise[];
}

const ExerciseApp: React.FC<ExerciseAppProps> = ({ initialExercises = [] }) => {
	const router = useRouter();
	const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
	const [isExerciseModalVisible, setExerciseModalVisible] = useState(false);
	const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
	const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
	const [newSets, setNewSets] = useState<any[]>([]); // Track new sets added
	const [completedSets, setCompletedSets] = useState<any[]>([]); // Track completed sets
	const [isEmptyWorkout, setIsEmptyWorkout] = useState(false); // Track if workout is empty
	const [menuVisible, setMenuVisible] = useState<number | null>(null);
	const [isSaveModalVisible, setSaveModalVisible] = useState(false);
	const [workoutName, setWorkoutName] = useState("");
	const [workoutDescription, setWorkoutDescription] = useState("");
	

	useEffect(() => {
		const fetchData = async () => {
			try {
				const workoutType = await AsyncStorage.getItem("workoutType");
				const savedExercises = await AsyncStorage.getItem("exercises");

				setIsEmptyWorkout(workoutType === "empty");

				// Fetch all available exercises
				const { data: allExercises } = await axios.get("https://no-pain-no-main.azurewebsites.net/exercises");

				// Ensure saved exercises have proper names and IDs
				const updatedExercises = (savedExercises ? JSON.parse(savedExercises) : []).map((exercise: Exercise) => {
					const matchedExercise = allExercises.find((ex: any) => ex.id === exercise.id);
					return matchedExercise ? { ...exercise, name: matchedExercise.name, muscle_group: matchedExercise.muscle_group } : exercise;
				});

				setExercises(updatedExercises);

				// Map exercise data for UI
				const exercisesWithSets = allExercises.map((exercise: any) => ({
					...exercise,
					sets: [{ set: 1, lbs: 0, reps: 0, completed: false, restTime: 120 }],
				}));

				setAvailableExercises(exercisesWithSets);

				// Derive unique muscle groups
				const uniqueMuscleGroups = Array.from(new Set(allExercises.map((ex: any) => ex.muscle_group)));
				setMuscleGroups(uniqueMuscleGroups);
			} catch (error) {
				console.error("Error fetching exercises:", error);
				Alert.alert("Error", "Failed to load exercises. Please try again.");
			}
		};

		fetchData();
	}, []);

	const addExercise = async (exercise: Exercise) => {
		if (exercises.some((e) => e.id === exercise.id)) {
			Alert.alert("Duplicate Exercise", "This exercise is already added.");
			return;
		}

		try {
			if (isEmptyWorkout) {
				const newExercise = { ...exercise, sets: [] };
				setExercises((prevExercises) => [...prevExercises, newExercise]);
				return;
			}
			// Fetch necessary IDs
			const userId = await AsyncStorage.getItem("userId");
			const workoutId = await AsyncStorage.getItem("currentWorkoutId");

			if (!userId || !workoutId) {
				Alert.alert("Error", "Workout ID or User ID not found. Please log in again.");
				return;
			}

			// Prepare payload for API call
			const payload = {
				user_id: parseInt(userId, 10),
				workout_id: parseInt(workoutId, 10),
				exercise_id: exercise.id,
				performance_data: {
					sets: [],
				},
			};

			// Call the API to add the exercise to the workout
			const response = await axios.post("https://no-pain-no-main.azurewebsites.net/addexercisetoworkout", payload);

			if (response.status === 200) {
				// Add new exercise locally
				const newExercise = { ...exercise, sets: [] };
				setExercises((prevExercises) => [...prevExercises, newExercise]);

				// If this was an empty workout, mark it as non-empty
				if (isEmptyWorkout) setIsEmptyWorkout(false);
			} else {
				throw new Error(response.data.error || "Failed to add exercise to workout.");
			}
		} catch (error) {
			console.error("Error adding exercise to workout:", error);
			Alert.alert("Error", "An error occurred while adding the exercise.");
		}
	};

	const addSet = (exerciseIndex: number) => {
		const updatedExercises = [...exercises];
		const currentExercise = updatedExercises[exerciseIndex];

		const newSet = {
			set: currentExercise.sets.length + 1,
			lbs: 0,
			reps: 0,
			completed: false,
			restTime: 120,
		};

		currentExercise.sets.push(newSet);
		setNewSets((prev) => [...prev, { ...newSet, exercise_id: currentExercise.id, exerciseIndex }]);
		setExercises(updatedExercises);
	};

	const updateSet = (exerciseIndex: number, setIndex: number, field: keyof Set, value: string | number | boolean) => {
		const updatedExercises = [...exercises];
		const currentExercise = updatedExercises[exerciseIndex];
		const setToUpdate = currentExercise.sets[setIndex];

		setToUpdate[field] = value;

		if (field === "completed" && value === true) {
			setCompletedSets((prev) => [...prev, { ...setToUpdate, exercise_id: currentExercise.id }]);
		}

		setExercises(updatedExercises);
	};

	const updateWorkout = async () => {
		try {
			const userId = await AsyncStorage.getItem("userId");
			const workoutId = await AsyncStorage.getItem("currentWorkoutId"); // Retrieve workout ID from AsyncStorage

			if (!userId || !workoutId) {
				Alert.alert("Error", "Workout ID or User ID not found. Please log in again.");
				return;
			}

			if (isEmptyWorkout) {
				setSaveModalVisible(true); // Show modal for entering name and description
				return;
			} else {
				for (const set of newSets) {
					const { exercise_id, set: setNumber, reps, lbs } = set;

					const addSetData = {
						user_id: parseInt(userId, 10),
						exercise_id,
						workout_id: parseInt(workoutId, 10),
						reps,
						weight: lbs,
					};

					console.log("Adding set:", addSetData);

					try {
						await axios.put("https://no-pain-no-main.azurewebsites.net/addsettoexercise", addSetData);
					} catch (error) {
						console.error("Error adding set:", error);
					}
				}

				// Update completed sets
				for (const set of completedSets) {
					const { exercise_id, set: setNumber, reps, lbs } = set;

					const updateSetData = {
						user_id: parseInt(userId, 10),
						exercise_id,
						workout_id: parseInt(workoutId, 10),
						set_number: setNumber,
						reps,
						weight: lbs,
					};

					console.log("Updating set:", updateSetData);
					try {
						await axios.put("https://no-pain-no-main.azurewebsites.net/updateset", updateSetData);
					} catch (error) {
						console.error("Error updating set:", error);
					}
				}

				Alert.alert("Success", "Workout updated successfully!");
				await AsyncStorage.setItem("workoutsReload", "true");
				router.replace("/workouts");
			}
		} catch (error) {
			console.error("Error updating workout:", error);
			Alert.alert("Error", "Something went wrong while updating the workout.");
		}
	};
	// Function shells for delete actions
	const deleteExercise = async (exerciseId: number) => {
		try {
			// Check if this is an empty workout
			if (isEmptyWorkout) {
				// Remove the exercise locally without calling the API
				setExercises((prevExercises) => prevExercises.filter((exercise) => exercise.id !== exerciseId));
				return;
			}

			// Fetch necessary IDs
			const userId = await AsyncStorage.getItem("userId");
			const workoutId = await AsyncStorage.getItem("currentWorkoutId");

			if (!userId || !workoutId) {
				Alert.alert("Error", "Workout ID or User ID not found. Please log in again.");
				return;
			}

			// Call the API to delete the exercise from the workout
			const response = await axios.delete("https://no-pain-no-main.azurewebsites.net/deleteexercisefromworkout", {
				data: {
					user_id: parseInt(userId, 10),
					workout_id: parseInt(workoutId, 10),
					exercise_id: exerciseId,
				},
			});

			if (response.status === 200) {
				// Remove the exercise locally
				setExercises((prevExercises) => prevExercises.filter((exercise) => exercise.id !== exerciseId));
				Alert.alert("Success", "Exercise deleted successfully!");
			} else {
				throw new Error(response.data.error || "Failed to delete exercise from workout.");
			}
		} catch (error) {
			console.error("Error deleting exercise from workout:", error);
			Alert.alert("Error", "An error occurred while deleting the exercise.");
		}
	};

	const deleteSet = async (exerciseIndex: number) => {
		const updatedExercises = [...exercises];
		const currentExercise = updatedExercises[exerciseIndex];

		// Check if there are any sets to delete
		if (currentExercise.sets.length === 0) {
			Alert.alert("No Sets to Delete", "This exercise has no sets to delete.");
			return;
		}

		// Remove the last set
		currentExercise.sets.pop();

		try {
			// For saved exercises, make the API call
			const userId = await AsyncStorage.getItem("userId");
			const workoutId = await AsyncStorage.getItem("currentWorkoutId");

			if (userId && workoutId) {
				const lastSetNumber = currentExercise.sets.length + 1;

				const payload = {
					user_id: parseInt(userId, 10),
					exercise_id: currentExercise.id,
					workout_id: parseInt(workoutId, 10),
					set_number: lastSetNumber,
				};

				const response = await axios.put("https://no-pain-no-main.azurewebsites.net/deletesetfromexercise", payload);

				if (response.status !== 200) {
					Alert.alert("Error", response.data.error || "Failed to delete the set.");
				}
			}
		} catch (error) {
			console.error("Error deleting set:", error);
			Alert.alert("Error", "An error occurred while deleting the set.");
		}

		setExercises(updatedExercises);
	};
	const handleSetCompletion = (set: Set, exercise: Exercise, exerciseIndex: number, setIndex: number) => {
		const newCompletedState = !set.completed;
		updateSet(exerciseIndex, setIndex, "completed", newCompletedState);

		if (newCompletedState) {
			const timerData = {
				exerciseId: exercise.id,
				exerciseName: exercise.name,
				setNumber: set.set,
				restTime: set.restTime,
			};

			AsyncStorage.setItem("timerData", JSON.stringify(timerData))
				.then(() => {
					router.push("/workouts/timer");
				})
				.catch((error) => {
					console.error("Error saving timer data:", error);
					Alert.alert("Error", "Failed to start the timer. Please try again.");
				});
		}
	};
	const handleSaveWorkout = async (name: string, description: string) => {
		try {
			const userId = await AsyncStorage.getItem("userId");
			const workoutData = {
				name,
				description,
				userId: parseInt(userId!, 10),
				isPublic: false,
				exercises: exercises.map((exercise) => ({
					exercise_id: exercise.id,
					performanceData: {
						sets: exercise.sets.map((set) => ({
							set: set.set,
							reps: set.reps,
							time: set.restTime,
							weight: set.lbs,
						})),
					},
				})),
			};

			const response = await axios.post("https://no-pain-no-main.azurewebsites.net/saveworkout", workoutData);

			if (response.status === 201) {
				Alert.alert("Success", "Workout saved successfully!");
				await AsyncStorage.setItem("workoutsReload", "true");
				router.replace("/workouts");
			} else {
				throw new Error(response.data.error || "Failed to save the workout.");
			}
		} catch (error) {
			console.error("Error saving workout:", error);
			Alert.alert("Error", "An error occurred while saving the workout.");
		}
	};

	const toggleMenu = (exerciseIndex: number | null) => {
		setMenuVisible(menuVisible === exerciseIndex ? null : exerciseIndex);
	};

	const renderExercise = (exercise: Exercise, exerciseIndex: number) => {
		return (
			<View key={exercise.id} style={styles.exerciseContainer}>
				<View style={styles.exerciseHeader}>
					<Text style={styles.exerciseTitle}>{exercise.name.toUpperCase()}</Text>
					<Menu
						visible={menuVisible === exerciseIndex}
						onDismiss={() => toggleMenu(null)}
						anchor={
							<TouchableOpacity onPress={() => toggleMenu(exerciseIndex)}>
								<Icon name="ellipsis-v" size={20} color={theme.colors.textPrimary} />
							</TouchableOpacity>
						}>
						<Menu.Item
							onPress={() => {
								toggleMenu(null);
								deleteExercise(exercise.id);
							}}
							title="Delete Exercise"
						/>
						<Menu.Item
							onPress={() => {
								toggleMenu(null);
								deleteSet(exerciseIndex); // Pass appropriate set index here
							}}
							title="Delete Set"
						/>
					</Menu>
				</View>
				<Text style={styles.exerciseSubtitle}>{exercise.muscle_group.toUpperCase()}</Text>
				<View style={styles.headerRow}>
					<Text style={styles.columnHeader}>Set</Text>
					<Text style={styles.columnHeader}>Lbs</Text>
					<Text style={styles.columnHeader}>Reps</Text>
					<Text style={styles.columnHeader}>✓</Text>
				</View>

				{exercise.sets.map((set, setIndex) => renderSet(set, setIndex, exercise, exerciseIndex))}

				<TouchableOpacity onPress={() => addSet(exerciseIndex)} style={styles.addSetButton}>
					<Text style={styles.addSetButtonText}>Add Set</Text>
				</TouchableOpacity>
			</View>
		);
	};
	const renderSet = (set: Set, setIndex: number, exercise: Exercise, exerciseIndex: number) => {
		return (
			<View key={setIndex} style={styles.row}>
				<View style={styles.cell}>
					<Text style={styles.cellText}>{set.set}</Text>
				</View>
				<View style={styles.cell}>
					<TextInput
						style={styles.input}
						keyboardType="numeric"
						placeholder={String(set.lbs)}
						onChangeText={(value) => updateSet(exerciseIndex, setIndex, "lbs", Number(value))}
					/>
				</View>
				<View style={styles.cell}>
					<TextInput
						style={styles.input}
						keyboardType="numeric"
						placeholder={String(set.reps)}
						onChangeText={(value) => updateSet(exerciseIndex, setIndex, "reps", Number(value))}
					/>
				</View>
				<View style={styles.cell}>
					<CheckBox
						checked={set.completed}
						onPress={() => handleSetCompletion(set, exercise, exerciseIndex, setIndex)}
						containerStyle={styles.checkbox}
						checkedColor={theme.colors.primary}
						uncheckedColor="#666"
					/>
				</View>
			</View>
		);
	};

	const SaveWorkoutModal = ({ isVisible, onClose, onSave }) => {
		const [localWorkoutName, setLocalWorkoutName] = useState(workoutName); // Use local state for the input
		const [localWorkoutDescription, setLocalWorkoutDescription] = useState(workoutDescription);

		useEffect(() => {
			if (isVisible) {
				setLocalWorkoutName(workoutName); // Sync with parent state when modal opens
				setLocalWorkoutDescription(workoutDescription);
			}
		}, [isVisible]);

		return (
			<Modal visible={isVisible} animationType="slide" transparent={true}>
				<View style={styles.saveWorkoutModalWrapper}>
					<View style={styles.saveWorkoutModalBox}>
						<Text style={styles.saveWorkoutModalTitle}>Save Workout</Text>
						<ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={false}>
							<TextInput style={styles.workoutNameInput} placeholder="Workout Name" value={localWorkoutName} onChangeText={setLocalWorkoutName} />
							<TextInput
								style={styles.workoutDescriptionInput}
								placeholder="Workout Description"
								value={localWorkoutDescription}
								onChangeText={setLocalWorkoutDescription}
								multiline
							/>
						</ScrollView>
						<TouchableOpacity
							onPress={() => {
								onSave(localWorkoutName, localWorkoutDescription); // Save local state to parent
								onClose();
							}}
							style={styles.saveWorkoutButton}>
							<Text style={styles.saveWorkoutButtonText}>Save</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={onClose} style={styles.closeWorkoutButton}>
							<Text style={styles.closeWorkoutButtonText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		);
	};

	return (
		<Provider>
			<PageWrapper>
				<SafeAreaView style={styles.safeAreaContainer}>
					<ScrollView style={styles.container} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
						<View style={styles.topIconContainer}>
							<Image source={headerImage} style={styles.headerImage} />
						</View>
						<View style={styles.divider} />

						{/* Render Exercise List */}
						{exercises.map((exercise, exerciseIndex) => renderExercise(exercise, exerciseIndex))}

						{/* Add Exercise Button */}
						<TouchableOpacity onPress={() => setExerciseModalVisible(true)} style={styles.addExerciseButton}>
							<Text style={styles.addExerciseText}>Add Exercise</Text>
						</TouchableOpacity>

						{/* Complete Workout Button */}
						<TouchableOpacity onPress={updateWorkout} style={styles.completeWorkoutButton}>
							<Text style={styles.completeWorkoutText}>Complete Workout</Text>
						</TouchableOpacity>

						<View style={styles.divider} />

						{/* Exercise Modal */}
						<ExerciseModal
							isVisible={isExerciseModalVisible}
							onClose={() => setExerciseModalVisible(false)}
							availableExercises={availableExercises}
							addExercise={addExercise}
							muscleGroups={muscleGroups}
						/>
					</ScrollView>
				</SafeAreaView>
			</PageWrapper>
			{/* Save Workout Modal */}
			<SaveWorkoutModal isVisible={isSaveModalVisible} onClose={() => setSaveModalVisible(false)} onSave={handleSaveWorkout} />
		</Provider>
	);
};

const ExerciseModal = ({ isVisible, onClose, availableExercises, addExercise, muscleGroups }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [isFilterModalVisible, setFilterModalVisible] = useState(false);
	const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);

	// Filter exercises based on the search query and selected muscle group
	const filteredExercises = availableExercises.filter((exercise) => {
		const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesMuscleGroup = selectedMuscleGroup ? exercise.muscle_group === selectedMuscleGroup : true;
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
						<Icon name="search" size={16} color={theme.colors.primary} style={styles.searchIcon} />
						<TextInput
							style={styles.searchBar}
							placeholder="Search"
							placeholderTextColor={theme.colors.textPrimary}
							value={searchQuery}
							onChangeText={setSearchQuery}
						/>
					</View>

					{/* Filter Button */}
					<TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
						<Text style={styles.filterButtonText}>{selectedMuscleGroup ? `Filter: ${selectedMuscleGroup}` : "Filter by Muscle Group"}</Text>
					</TouchableOpacity>

					{/* Exercise List */}
					<FlatList
						data={filteredExercises}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
							<TouchableOpacity
								onPress={() => {
									addExercise(item);
									onClose(); // Close the modal after selecting the exercise
								}}
								style={styles.modalItem}>
								<Text style={styles.modalItemText}>
									{item.name} ({item.muscle_group})
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
								<TouchableOpacity onPress={() => onMuscleGroupSelect(item)} style={styles.modalItem}>
									<Text style={styles.modalItemText}>{item}</Text>
								</TouchableOpacity>
							)}
						/>
						<TouchableOpacity onPress={() => setFilterModalVisible(false)} style={styles.modalCloseButton}>
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
		...globalStyles.safeAreaContainer,
	},
	container: {
		flex: 1,
		padding: theme.spacing.small,
	},
	topIconContainer: {
		alignItems: "center",
		marginBottom: theme.spacing.medium,
		paddingTop: theme.spacing.medium,
	},
	headerImage: {
		...globalStyles.headerImage,
	},
	divider: {
		height: 1,
		backgroundColor: theme.colors.primary,
		opacity: 0,
	},
	exerciseContainer: {
		marginBottom: theme.spacing.medium,
		padding: theme.spacing.medium,
		backgroundColor: theme.colors.cardBackground,
		borderRadius: 8,
	},
	exerciseTitle: {
		fontSize: theme.fonts.large,
		fontWeight: "bold",
		color: theme.colors.textPrimary,
	},
	noResultsText: {
		color: theme.colors.textPrimary,
		textAlign: "center",
	},
	exerciseSubtitle: {
		fontSize: theme.fonts.regular,
		color: theme.colors.textSecondary,
		marginBottom: 10,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		paddingVertical: 5,
		borderBottomColor: theme.colors.primary,
		borderBottomWidth: 1,
	},
	cell: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	searchBarContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: theme.colors.inputBackground,
		borderColor: theme.colors.primary,
		borderWidth: 1,
		borderRadius: theme.borderRadius.medium,
		paddingHorizontal: theme.spacing.medium,
		marginBottom: theme.spacing.medium - 5,
		width: "100%",
		height: 35,
	},
	searchIcon: {
		marginRight: 8,
	},
	searchBar: {
		flex: 1,
		color: theme.colors.textPrimary,
		fontSize: theme.fonts.regular,
		padding: 0,
	},
	cellText: {
		color: theme.colors.textPrimary,
		fontWeight: "bold",
		textAlign: "center",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		paddingVertical: 5,
		marginVertical: 5,
		borderBottomColor: theme.colors.border,
		borderBottomWidth: 1,
	},
	columnHeader: {
		flex: 1,
		textAlign: "center",
		color: theme.colors.textSecondary,
		fontWeight: "bold",
	},
	setNumber: {
		color: theme.colors.textPrimary,
		textAlign: "center",
		fontWeight: "bold",
	},
	input: {
		backgroundColor: theme.colors.inputBackground,
		color: theme.colors.textPrimary,
		borderRadius: 8,
		paddingVertical: 5,
		paddingHorizontal: theme.spacing.medium,
		fontSize: theme.fonts.regular - 2,
		fontWeight: "bold",
		borderColor: theme.colors.border,
		borderWidth: 1,
		textAlign: "center",
		width: "90%",
	},
	checkbox: {
		backgroundColor: "transparent",
		padding: 0,
		margin: 0,
		alignItems: "center",
		justifyContent: "center",
	},
	addExerciseButton: {
		backgroundColor: theme.colors.primary,
		padding: theme.spacing.small,
		borderRadius: theme.borderRadius.medium,
		marginVertical: theme.spacing.medium,
		width: "80%",
		alignSelf: "center",
	},
	addExerciseText: {
		color: theme.colors.textPrimary,
		fontWeight: "bold",
		textAlign: "center",
	},
	bottomIconContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
		paddingBottom: theme.spacing.medium,
		opacity: 0.5,
	},
	modalBackground: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		...globalStyles.modalContainer,
	},
	modalTitle: {
		...globalStyles.modalTitle,
	},
	modalItem: {
		padding: theme.spacing.medium,
		borderBottomColor: theme.colors.border,
		borderBottomWidth: 1,
	},
	modalItemText: {
		color: theme.colors.textPrimary,
	},
	modalCloseButton: {
		backgroundColor: theme.colors.primary,
		padding: theme.spacing.small,
		borderRadius: 8,
		marginTop: theme.spacing.medium,
	},
	modalCloseButtonText: {
		color: theme.colors.textPrimary,
		fontWeight: "bold",
		textAlign: "center",
	},
	addSetButton: {
		marginTop: theme.spacing.small,
		padding: theme.spacing.small,
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.medium,
		
	},
	addSetButtonText: {
		color: theme.colors.textPrimary,
		fontWeight: "bold",
		textAlign: "center",
	},
	filterButton: {
		backgroundColor: theme.colors.inputBackground,
		padding: theme.spacing.small,
		borderRadius: theme.borderRadius.medium,
		marginBottom: theme.spacing.small,
		width: "80%",
		alignSelf: "center",
	},
	filterButtonText: {
		color: theme.colors.textSecondary,
		fontWeight: "bold",
		fontSize: theme.fonts.regular,
		textAlign: "center"
	},
	completeWorkoutButton: {
		backgroundColor: theme.colors.buttonBackground, // Use a green or success-themed color
		padding: theme.spacing.small,
		borderRadius: theme.borderRadius.medium,
		marginVertical: theme.spacing.medium,
		width: "80%",
		alignSelf: "center",
	},
	completeWorkoutText: {
		color: theme.colors.textPrimary,
		fontWeight: "bold",
		fontSize: theme.fonts.regular,
		textAlign: "center",
	},
	exerciseHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	// Save Workout Modal Specific Styles
	saveWorkoutModalWrapper: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.7)", // Transparent background effect
	},
	saveWorkoutModalBox: {
		width: "90%",
		height: "70%",
		backgroundColor: theme.colors.cardBackground,
		borderRadius: theme.borderRadius.large,
		padding: theme.spacing.medium,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
		alignSelf: "center",
		justifyContent: "center",
	},
	saveWorkoutModalTitle: {
		fontSize: theme.fonts.large,
		fontWeight: "bold",
		color: theme.colors.textPrimary,
		textAlign: "center",
		marginBottom: theme.spacing.large,
	},
	workoutNameInput: {
		backgroundColor: theme.colors.inputBackground,
		color: theme.colors.textPrimary,
		borderRadius: theme.borderRadius.medium,
		paddingVertical: theme.spacing.small,
		paddingHorizontal: theme.spacing.medium,
		fontSize: theme.fonts.large,
		borderColor: theme.colors.border,
		borderWidth: 1,
		textAlign: "center",
		width: "100%", // Full width for workout name
		marginBottom: theme.spacing.medium,
	},
	workoutDescriptionInput: {
		backgroundColor: theme.colors.inputBackground,
		color: theme.colors.textPrimary,
		borderRadius: theme.borderRadius.medium,
		paddingVertical: theme.spacing.small,
		paddingHorizontal: theme.spacing.medium,
		fontSize: theme.fonts.regular,
		borderColor: theme.colors.border,
		borderWidth: 1,
		textAlign: "center",
		width: "90%", // Slightly narrower than workout name
		height: 200, // Longer height for description
		marginBottom: theme.spacing.medium,
		alignSelf: "center",
	},
	saveWorkoutButton: {
		backgroundColor: theme.colors.primary,
		paddingVertical: theme.spacing.small,
		borderRadius: theme.borderRadius.medium,
		marginVertical: theme.spacing.medium,
		width: "60%",
		alignSelf: "center",
	},
	saveWorkoutButtonText: {
		color: theme.colors.textPrimary,
		fontWeight: "bold",
		fontSize: theme.fonts.regular,
		textAlign: "center",
	},
	closeWorkoutButton: {
		backgroundColor: theme.colors.error,
		paddingVertical: theme.spacing.small,
		borderRadius: theme.borderRadius.medium,
		width: "60%",
		alignSelf: "center",
	},
	closeWorkoutButtonText: {
		color: theme.colors.textPrimary,
		fontWeight: "bold",
		fontSize: theme.fonts.regular,
		textAlign: "center",
	},
});

export default ExerciseApp;

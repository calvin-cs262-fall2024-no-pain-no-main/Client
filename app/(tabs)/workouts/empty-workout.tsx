import React, { useState, useEffect } from "react";
import { View, SafeAreaView, Text, TextInput, Modal, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
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
	const [workoutName, setWorkoutName] = useState("");
	const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch exercises saved in AsyncStorage for the current workout
				const savedExercises = await AsyncStorage.getItem("exercises");
				let parsedExercises = savedExercises ? JSON.parse(savedExercises) : [];

				// Fetch all available exercises from the API
				const { data: allExercises } = await axios.get("https://no-pain-no-main.azurewebsites.net/exercises");

				// Create a map for quick lookup of exercise details
				const exerciseMap = allExercises.reduce((map: Record<number, any>, exercise: any) => {
					map[exercise.id] = {
						name: exercise.name,
						description: exercise.description,
						muscle_group: exercise.muscle_group,
					};
					return map;
				}, {});

				// Enrich saved exercises with full details from the exerciseMap
				parsedExercises = parsedExercises.map((exercise: any) => ({
					...exercise,
					name: exerciseMap[exercise.id]?.name || `Exercise ${exercise.id}`,
					description: exerciseMap[exercise.id]?.description || "No description available",
					muscle_group: exerciseMap[exercise.id]?.muscle_group || "Unknown",
				}));

				setExercises(parsedExercises);

				// Populate available exercises for adding to the workout
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

	const addExercise = (exercise: Exercise) => {
		if (exercises.some((e) => e.id === exercise.id)) {
			alert("Duplicate Exercise. This exercise is already added.");
			return;
		}

		// Add exercise with its predefined sets
		setExercises((prevExercises) => [...prevExercises, { ...exercise, sets: exercise.sets }]);
		setExerciseModalVisible(false);
	};

	const addSet = (exerciseIndex: number) => {
		const newExercises = [...exercises];
		const currentSets = newExercises[exerciseIndex].sets;
		const newSet = {
			set: currentSets.length + 1,
			lbs: 0,
			reps: 0,
			completed: false,
			restTime: 120,
		};
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

	const saveWorkout = async () => {
		if (!workoutName || exercises.length === 0) {
			Alert.alert("Error", "Please provide a workout name and add at least one exercise.");
			return;
		}

		const workoutDescription = "A workout created in the app"; // You can make this dynamic or static

		try {
			const userId = await AsyncStorage.getItem("userId");
			if (!userId) {
				Alert.alert("Error", "User ID not found. Please log in again.");
				return;
			}

			// Prepare the data for the API
			const workoutData = {
				name: workoutName,
				description: workoutDescription,
				userId: parseInt(userId, 10), // Ensure userId is sent as a number
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

			// Send POST request to the saveWorkout endpoint
			const response = await axios.post("https://no-pain-no-main.azurewebsites.net/saveworkout", workoutData);

			if (response.status === 201) {
				Alert.alert("Success", "Workout saved successfully!");

				// Set the reload flag for workout fetching
				await AsyncStorage.setItem("workoutsReload", "true");

				// Navigate back to the Workouts page
				router.replace("/workouts");
			} else {
				Alert.alert("Error", response.data.error || "Failed to save the workout.");
			}
		} catch (error) {
			console.error("Error saving workout:", error);
			Alert.alert("Error", "Something went wrong while saving the workout.");
		}
	};

	return (
		<PageWrapper>
			<SafeAreaView style={styles.safeAreaContainer}>
				<ScrollView style={styles.container} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
					<View style={styles.topIconContainer}>
						<Image source={headerImage} style={styles.headerImage} />
					</View>
					<View style={styles.inputWithButton}>
						<TextInput
							style={styles.saveExerciseText}
							placeholder="Enter Workout Name"
							placeholderTextColor={theme.colors.textSecondary}
							value={workoutName}
							onChangeText={setWorkoutName}
						/>

						<TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
							<Text style={styles.saveButtonText}>Save</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.divider} />
					{exercises.map((exercise, exerciseIndex) => (
						<View key={exercise.id} style={styles.exerciseContainer}>
							<Text style={styles.exerciseTitle}>{exercise.name.toUpperCase()}</Text>
							<Text style={styles.exerciseSubtitle}>{exercise.muscle_group.toUpperCase()}</Text>
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
											onChangeText={(value) => updateSet(exerciseIndex, setIndex, "lbs", Number(value))}
										/>
									</View>
									<View style={styles.cell}>
										<TextInput
											style={styles.input}
											keyboardType="numeric"
											value={String(set.reps)}
											onChangeText={(value) => updateSet(exerciseIndex, setIndex, "reps", Number(value))}
										/>
									</View>
									<View style={styles.cell}>
										<CheckBox
											checked={set.completed}
											onPress={() => {
												const newCompletedState = !set.completed;
												updateSet(exerciseIndex, setIndex, "completed", newCompletedState);

												if (newCompletedState) {
													// Store exercise details in AsyncStorage
													const timerData = {
														exerciseId: exercise.id,
														exerciseName: exercise.name,
														setNumber: set.set,
														restTime: set.restTime,
													};

													AsyncStorage.setItem("timerData", JSON.stringify(timerData))
														.then(() => {
															// Navigate to the timer page
															router.push("/workouts/timer");
														})
														.catch((error) => {
															console.error("Error saving timer data:", error);
															Alert.alert("Error", "Failed to start the timer. Please try again.");
														});
												}
											}}
											containerStyle={styles.checkbox}
											checkedColor={theme.colors.primary}
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
		</PageWrapper>
	);
};

const ExerciseModal = ({ isVisible, onClose, availableExercises, addExercise, muscleGroups, handleMuscleGroupSelect }) => {
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
							<TouchableOpacity onPress={() => addExercise(item)} style={styles.modalItem}>
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
		alignItems: "center",
		marginVertical: theme.spacing.medium,
		width: "80%",
		alignSelf: "center",
	},
	addExerciseText: {
		color: theme.colors.textPrimary,
		fontWeight: "bold",
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
		alignItems: "center",
		marginTop: theme.spacing.medium,
	},
	modalCloseButtonText: {
		color: theme.colors.textPrimary,
		fontWeight: "bold",
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
		alignItems: "center",
		marginBottom: theme.spacing.small,
		width: "80%",
		alignSelf: "center",
	},
	filterButtonText: {
		color: theme.colors.textSecondary,
		fontWeight: "bold",
		fontSize: theme.fonts.regular,
	},
	inputWithButton: {
		flexDirection: "row", // Aligns input and button horizontally
		alignItems: "center", // Ensures vertical alignment
		justifyContent: "space-between", // Distributes space between input and button
		marginBottom: theme.spacing.medium, // Adjust as needed
		position: "relative", // Ensures button is within the container but can stay fixed
		width: "100%", // Ensures it takes full width
	},
	saveButton: {
		marginLeft: 0, // Space between input and button
		paddingVertical: theme.spacing.small,
		paddingHorizontal: theme.spacing.medium,
		backgroundColor: theme.colors.primary, // Adjust based on your theme
		borderRadius: 5,
	},
	saveExerciseText: {
		flex: 1, // Ensures input takes up the available space
		borderBottomWidth: 1,
		borderColor: theme.colors.border,
		paddingVertical: theme.spacing.small,
		paddingLeft: theme.spacing.small,
		fontSize: 20,
		color: theme.colors.textPrimary,
		height: 50, // Fixed height for input to prevent resizing on text change
	},
	saveButtonText: {
		color: theme.colors.textPrimary, // Adjust text color
		fontSize: theme.fonts.regular,
		fontWeight: "bold",
	},
});

export default ExerciseApp;

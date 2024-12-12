import React, { useState, useEffect } from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView, View, SafeAreaView, Image, Alert, Modal } from "react-native"; 
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../../../assets/styles/globalStyles";
import { theme } from "../../../assets/styles/theme";
import PageWrapper from "../../../components/pageWrapper";
// Fixed
const headerImage = require("../../../assets/images/VigilWeight.png");

const Workouts = () => {
	const router = useRouter();
	const [exerciseMap, setExerciseMap] = useState({});
	const [defaultWorkouts, setDefaultWorkouts] = useState([]);
	const [customWorkouts, setCustomWorkouts] = useState([]);
	const [selectedWorkout, setSelectedWorkout] = useState(null); // New state to track selected workout
	const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

	// Fetch all workout data on component load
	useEffect(() => {
		const fetchWorkoutsAndExercises = async () => {
			try {
				const userId = await AsyncStorage.getItem("userId");
				if (!userId) throw new Error("User ID not found");

				// Fetch all exercises
				const exercisesResponse = await axios.get("https://no-pain-no-main.azurewebsites.net/exercises");
				const exercises = exercisesResponse.data;
				const exerciseMap = exercises.reduce((acc, exercise) => {
					acc[exercise.id] = {
						name: exercise.name,
						description: exercise.description,
						muscle_group: exercise.muscle_group,
					};
					return acc;
				}, {});
				setExerciseMap(exerciseMap);

				// Fetch workouts
				const workoutsResponse = await axios.get(`https://no-pain-no-main.azurewebsites.net/customworkout${userId}`);
				const allWorkouts = workoutsResponse.data;

				const defaultWorkouts = allWorkouts.filter((workout) => workout.is_public);
				const customWorkouts = allWorkouts.filter((workout) => !workout.is_public);

				setDefaultWorkouts(defaultWorkouts);
				setCustomWorkouts(customWorkouts);
			} catch (error) {
				console.error("Error fetching data:", error);
				Alert.alert("Error", "Failed to load workouts and exercises. Please try again.");
			}
		};

		fetchWorkoutsAndExercises();
	}, []);

	// Start a workout using prefetched data
	const startWorkout = async (workoutId) => {
		try {
			const allWorkouts = [...defaultWorkouts, ...customWorkouts];
			const selectedWorkout = allWorkouts.find((workout) => workout.id === workoutId);

			if (!selectedWorkout) throw new Error("Workout not found.");

			// Map exercise IDs to their full details
			const mappedExercises = selectedWorkout.exercises.map((exercise) => {
				const exerciseDetails = exerciseMap[exercise.exercise_id] || {};
				return {
					id: exercise.exercise_id,
					name: exerciseDetails.name || `Exercise ${exercise.exercise_id}`,
					description: exerciseDetails.description || `Description for ${exercise.exercise_id}`,
					muscle_group: exerciseDetails.muscle_group || "Unknown Muscle Group",
					sets: exercise.performance_data.sets.map((set) => ({
						set: set.set,
						reps: set.reps,
						lbs: set.weight,
						restTime: set.time,
						completed: false,
					})),
				};
			});

			// Store workout details in AsyncStorage
			await AsyncStorage.setItem("workoutType", "non-empty");
			await AsyncStorage.setItem("exercises", JSON.stringify(mappedExercises));
			await AsyncStorage.setItem("currentWorkoutId", workoutId.toString());

			router.push("../workouts/empty-workout");
		} catch (error) {
			console.error("Error starting workout:", error);
			Alert.alert("Error", error.message || "Failed to start workout. Please try again.");
		}
	};

	// Start an empty workout
	const startEmptyWorkout = async () => {
		try {
			// Clear any stored exercises in AsyncStorage
			await AsyncStorage.removeItem("exercises");
			await AsyncStorage.setItem("workoutType", "empty");
			// Navigate to the `empty-workout` page
			router.push("../workouts/empty-workout");
		} catch (error) {
			console.error("Error starting empty workout:", error);
			Alert.alert("Error", "Failed to start an empty workout. Please try again.");
		}
	};

	// Delete a custom workout
	const deleteWorkout = async (workoutId) => {
		try {
			// Retrieve the user ID from AsyncStorage
			const userId = await AsyncStorage.getItem("userId");
			if (!userId) {
				throw new Error("User ID not found");
			}

			Alert.alert(
				"Delete Workout",
				"Are you sure you want to delete this workout?",
				[
					{ text: "Cancel", style: "cancel" },
					{
						text: "Delete",
						style: "destructive",
						onPress: async () => {
							await axios.delete("https://no-pain-no-main.azurewebsites.net/deleteworkout", {
								data: { workoutId, userId }, // Include userId in the request body
							});
							// Update state to remove the deleted workout
							setCustomWorkouts((prev) => prev.filter((workout) => workout.id !== workoutId));
							Alert.alert("Success", "Workout deleted successfully.");
						},
					},
				],
				{ cancelable: true }
			);
		} catch (error) {
			console.error("Error deleting workout:", error);
			Alert.alert("Error", "Failed to delete workout. Please try again.");
		}
	};

	return (
		<PageWrapper>
			<SafeAreaView style={styles.safeArea}>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.contentContainer}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}>
					<Image source={headerImage} style={styles.headerImage} />
					{/* Default Workouts */}
					<Text style={styles.sectionTitle}>Workout Templates</Text>
					<View style={styles.gridContainer}>
						{defaultWorkouts.map((workout) => (
							<TouchableOpacity
								key={workout.id}
								style={styles.card}
								onPress={() => {
									setSelectedWorkout(workout); // Set selected workout
									setIsModalVisible(true); // Show modal
								}}>
								<Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
									{workout.name.toUpperCase()}
								</Text>
								<Text style={styles.cardDescription} numberOfLines={5} ellipsizeMode="tail">
									{workout.description}
								</Text>
							</TouchableOpacity>
						))}
					</View>
					{/* Custom Workouts */}
					{customWorkouts.length > 0 && (
						<>
							<Text style={styles.sectionTitle}>Custom Workouts</Text>
							<View style={styles.gridContainer}>
								{customWorkouts.map((workout) => (
									<TouchableOpacity
										key={workout.id}
										style={styles.card}
										onPress={() => {
											setSelectedWorkout(workout); // Set selected workout
											setIsModalVisible(true); // Show modal
										}}>
										<Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
											{workout.name.toUpperCase()}
										</Text>
										<Text style={styles.cardDescription} numberOfLines={5} ellipsizeMode="tail">
											{workout.description}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</>
					)}
					{/* Start Empty Workout */}
					<TouchableOpacity style={[styles.button, styles.emptyButton]} onPress={() => startEmptyWorkout()}>
						<Text style={styles.emptyButtonText}>Start Empty Workout</Text>
					</TouchableOpacity>
					<Modal
						visible={isModalVisible}
						transparent={true}
						animationType="slide"
						onRequestClose={() => setIsModalVisible(false)} // Close modal on back button
					>
						<View style={styles.modalOverlay}>
							<View style={styles.modalContainer}>
								<Text style={styles.modalTitle}>{selectedWorkout?.name}</Text>
								<Text style={styles.modalDescription}>{selectedWorkout?.description}</Text>

								{/* List of Exercises */}
								<ScrollView style={styles.exerciseList}>
									{selectedWorkout?.exercises.map((exercise, index) => {
										const exerciseDetails = exerciseMap[exercise.exercise_id] || {};
										const numSets = exercise.performance_data.sets.length;

										return (
											<View key={index} style={styles.exerciseItem}>
												<Text style={styles.exerciseText}>
													{numSets} x {exerciseDetails.name || `Exercise ${exercise.exercise_id}`}
												</Text>
												<Text style={styles.muscleGroupText}>{exerciseDetails.muscle_group || "Unknown Muscle Group"}</Text>
											</View>
										);
									})}
								</ScrollView>

								{/* Buttons at the bottom */}
								<View style={styles.modalButtonContainer}>
									<TouchableOpacity
										style={styles.modalButton}
										onPress={() => {
											setIsModalVisible(false); // Close modal
											startWorkout(selectedWorkout.id); // Start workout
										}}>
										<Text style={styles.modalButtonText}>Start Workout</Text>
									</TouchableOpacity>

									<TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsModalVisible(false)}>
										<Text style={styles.modalCloseButtonText}>Close</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
					;
				</ScrollView>
			</SafeAreaView>
		</PageWrapper>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		...globalStyles.safeAreaContainer,
		padding: theme.spacing.medium,
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		paddingBottom: theme.spacing.large,
		justifyContent: "flex-start",
		alignItems: "center",
	},
	headerImage: {
		...globalStyles.headerImage,
		marginBottom: theme.spacing.large,
		marginTop: theme.spacing.medium,
	},
	sectionTitle: {
		fontSize: theme.fonts.title + 2,
		fontWeight: "bold",
		color: theme.colors.textPrimary,
		marginBottom: theme.spacing.medium,
		textAlign: "center",
		width: "100%",
	},
	gridContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		width: "100%",
		marginBottom: theme.spacing.large,
	},
	card: {
		width: "48%",
		backgroundColor: theme.colors.cardBackground,
		padding: theme.spacing.small,
		marginBottom: theme.spacing.medium,
		borderRadius: theme.borderRadius.medium,
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	cardTitle: {
		color: theme.colors.textSecondary,
		fontSize: theme.fonts.large,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: theme.spacing.small,
	},
	cardDescription: {
		color: theme.colors.textPrimary,
		fontSize: theme.fonts.regular,
		textAlign: "center",
	},
	button: {
		...globalStyles.button,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyButton: {
		backgroundColor: theme.colors.primary,
		height: 50,
	},
	emptyButtonText: {
		color: theme.colors.textPrimary,
		fontSize: theme.fonts.regular + 2,
		fontWeight: "bold",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		...globalStyles.modalContainer,
	},
	modalTitle: {
		...globalStyles.modalTitle,
	},
	modalDescription: {
		color: theme.colors.textPrimary,
		fontSize: theme.fonts.regular,
		marginBottom: theme.spacing.medium,
	},
	modalButton: {
		...globalStyles.button,
		marginBottom: theme.spacing.medium, // Add spacing between buttons
	},
	modalButtonText: {
		...globalStyles.buttonText,
		color: theme.colors.textPrimary,
	},
	modalCloseButton: {
		backgroundColor: theme.colors.error,
		paddingVertical: theme.spacing.small,
		paddingHorizontal: theme.spacing.medium,
		borderRadius: theme.borderRadius.large,
		alignItems: "center",
		width: "80%",
		alignSelf: "center",
	},
	modalCloseButtonText: {
		color: theme.colors.textPrimary,
		fontSize: theme.fonts.regular,
		fontWeight: "bold",
	},
	modalButtonContainer: {
		marginTop: "auto", // Push content to the top, keeping buttons at the bottom
		width: "100%",
		alignItems: "center",
		paddingTop: theme.spacing.medium,
	},
	exerciseList: {
		flex: 1,
		marginTop: theme.spacing.medium,
		marginBottom: theme.spacing.medium,
		width: "100%",
	},
	exerciseItem: {
		marginLeft: theme.spacing.small,
		marginBottom: theme.spacing.small,
		paddingBottom: theme.spacing.small,
	},
	exerciseText: {
		color: theme.colors.textPrimary,
		fontSize: theme.fonts.regular,
		fontWeight: "bold",
	},
	muscleGroupText: {
		color: theme.colors.textSecondary,
		fontSize: theme.fonts.regular - 2,
		marginTop: 2,
	},
	
});

export default Workouts;

import React, { useState, useEffect } from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView, View, SafeAreaView, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../../assets/styles/globalStyles";
import { theme } from "../../../assets/styles/theme";
import PageWrapper from "../../../components/pageWrapper";
// Fixed
const headerImage = require("../../../assets/images/VigilWeight.png");

const Workouts = () => {
	const router = useRouter();
	const [defaultWorkouts, setDefaultWorkouts] = useState([]);
	const [customWorkouts, setCustomWorkouts] = useState([]);

	// Fetch workouts for the logged-in user
	useEffect(() => {
		const fetchUserWorkouts = async () => {
			try {
				const userId = await AsyncStorage.getItem("userId");
				if (!userId) throw new Error("User ID not found");

				const response = await axios.get(`https://no-pain-no-main.azurewebsites.net/customworkout${userId}`);
				const allWorkouts = response.data;

				setDefaultWorkouts(allWorkouts.slice(0, 4));
				setCustomWorkouts(allWorkouts.slice(4));
			} catch (error) {
				console.error("Error fetching workouts:", error);
				Alert.alert("Error", "Failed to load workouts. Please try again.");
			}
		};

		const checkForReload = async () => {
			const reloadFlag = await AsyncStorage.getItem("workoutsReload");
			if (reloadFlag === "true") {
				await fetchUserWorkouts(); // Re-fetch workouts if flag is set
				await AsyncStorage.removeItem("workoutsReload"); // Clear the flag after refreshing
			}
		};

		checkForReload();
		fetchUserWorkouts();
	}, []);

	// Start a preloaded workout
	// Start a preloaded workout
	const startWorkout = async (exercises, workoutId) => {
		try {
			// Validate exercises is defined and an array
			if (!exercises || !Array.isArray(exercises)) {
				throw new Error("Invalid or undefined exercises data.");
			}

			// Map exercises for AsyncStorage
			const mappedExercises = exercises.map((exercise) => {
				const { performance_data } = exercise;

				// Ensure performance_data and its sets are valid
				if (!performance_data || !Array.isArray(performance_data.sets)) {
					throw new Error(`Invalid performance_data for exercise_id ${exercise.exercise_id}`);
				}

				return {
					id: exercise.exercise_id,
					name: `Exercise ${exercise.exercise_id}`, // Placeholder for exercise name
					description: `Description for ${exercise.exercise_id}`, // Placeholder for description
					muscle_group: "Muscle Group", // Placeholder for muscle group
					sets: performance_data.sets.map((set) => ({
						set: set.set,
						reps: set.reps,
						lbs: set.weight,
						restTime: set.time,
						completed: false,
					})),
				};
			});

			// Store workout details and workoutId in AsyncStorage
			await AsyncStorage.setItem("exercises", JSON.stringify(mappedExercises));
			await AsyncStorage.setItem("currentWorkoutId", workoutId.toString());

			// Navigate to the `empty-workout` page
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

					{/* Default Templates */}
					<Text style={styles.sectionTitle}>Workout Templates</Text>
					<View style={styles.gridContainer}>
						{defaultWorkouts.map((workout) => (
							<TouchableOpacity key={workout.id} style={styles.card} onPress={() => startWorkout(workout.exercises, workout.id)}>
								<Text style={styles.cardTitle}>{workout.name}</Text>
								<Text style={styles.cardDescription}>{workout.description}</Text>
							</TouchableOpacity>
						))}
					</View>

					{/* Custom Workouts */}
					{customWorkouts.length > 0 && (
						<>
							<Text style={styles.sectionTitle}>Custom Workouts</Text>
							<View style={styles.gridContainer}>
								{customWorkouts.map((workout) => (
									<View key={workout.id} style={styles.card}>
										<TouchableOpacity key={workout.id} style={styles.card} onPress={() => startWorkout(workout.exercises, workout.id)}>
											<Text style={styles.cardTitle}>{workout.name}</Text>
											<Text style={styles.cardDescription}>{workout.description}</Text>
										</TouchableOpacity>
										<TouchableOpacity onPress={() => deleteWorkout(workout.id)} style={styles.deleteIconContainer}>
											<Ionicons name="trash-outline" size={20} color="green" />
										</TouchableOpacity>
									</View>
								))}
							</View>
						</>
					)}

					{/* Start Empty Workout */}
					<TouchableOpacity style={[styles.button, styles.emptyButton]} onPress={startEmptyWorkout}>
						<Text style={styles.emptyButtonText}>Start Empty Workout</Text>
					</TouchableOpacity>
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
		fontSize: theme.fonts.title,
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
		padding: theme.spacing.medium,
		marginBottom: theme.spacing.medium,
		borderRadius: theme.borderRadius.medium,
		alignItems: "flex-start",
		justifyContent: "center",
		position: "relative",
	},
	cardTitle: {
		color: theme.colors.textSecondary,
		fontSize: theme.fonts.large,
		fontWeight: "bold",
		textAlign: "left",
		marginBottom: theme.spacing.small,
	},
	cardDescription: {
		color: theme.colors.textPrimary,
		fontSize: theme.fonts.regular - 4,
		textAlign: "left",
	},
	deleteIconContainer: {
		position: "absolute",
		top: theme.spacing.small,
		right: theme.spacing.small,
		backgroundColor: "white",
		padding: 2,
		borderRadius: 20,
		elevation: 2,
	},
	button: {
		...globalStyles.button,
	},
	emptyButton: {
		backgroundColor: theme.colors.primary,
	},
	emptyButtonText: {
		color: theme.colors.textPrimary,
		fontWeight: "bold",
	},
});

export default Workouts;
